import { Result as R } from "better-result"
import { headers } from "next/headers"
import type { NextRequest } from "next/server"
import { after } from "next/server"
import { z } from "zod"
import { JEV_MAX_APPLICATIONS_PER_REQUEST } from "@/lib/ai/decision/constants"
import { prepareCandidateAssessment } from "@/lib/ai/decision/profile"
import type { CandidateAssessmentInput, ScoreDetails } from "@/lib/ai/decision/types"
import { processJevQueue } from "@/lib/ai/decision/worker"
import { type Application, getApplicationsByJob } from "@/lib/api/applications"
import type { Job } from "@/lib/api/jobs"
import { getJob } from "@/lib/api/jobs"
import type { Resume } from "@/lib/api/resumes"
import { getResumeByUserId } from "@/lib/api/resumes"
import { auth } from "@/lib/auth"
import {
  enqueueCandidateAssessments,
  listLatestCandidateAssessments,
} from "@/lib/db/application-ai-score"

export const maxDuration = 300

export type CandidateScore = ScoreDetails

type JobAccess =
  | { kind: "denied"; response: Response }
  | { kind: "authorized"; userId: string; organizationId: string; job: Job }

type ResumeLoad =
  | { kind: "failed"; application: Application }
  | { kind: "loaded"; application: Application; resume: Resume | null }

const RequestSchema = z.object({
  jobId: z.string().uuid(),
  applicationIds: z.array(z.string().uuid()).max(JEV_MAX_APPLICATIONS_PER_REQUEST).optional(),
})

async function loadApplicationResume(application: Application): Promise<ResumeLoad> {
  const resumeResult = await getResumeByUserId(application.candidateId)
  if (resumeResult.isErr()) return { kind: "failed", application }
  if (resumeResult.value && resumeResult.value.userId !== application.candidateId) {
    return { kind: "failed", application }
  }
  return { kind: "loaded", application, resume: resumeResult.value }
}

function isOrganizationJob(jobOrganizationId: string, organizationId: string): boolean {
  return jobOrganizationId === organizationId
}

async function getAuthorizedJob(jobId: string): Promise<JobAccess> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) {
    return { kind: "denied", response: Response.json({ error: "No autenticado" }, { status: 401 }) }
  }

  const organizationId = session.user.organizationId
  if (!organizationId) {
    return {
      kind: "denied",
      response: Response.json({ error: "Se requiere una cuenta de empresa" }, { status: 403 }),
    }
  }

  const jobResult = await getJob(jobId)
  if (jobResult.isErr()) {
    return {
      kind: "denied",
      response: Response.json({ error: "No se pudo validar la oferta" }, { status: 502 }),
    }
  }
  if (!isOrganizationJob(jobResult.value.organizationId, organizationId)) {
    return {
      kind: "denied",
      response: Response.json({ error: "No tienes acceso a esta oferta" }, { status: 403 }),
    }
  }

  return {
    kind: "authorized",
    userId: session.user.id,
    organizationId,
    job: jobResult.value,
  }
}

export async function GET(request: NextRequest) {
  const jobId = z.string().uuid().safeParse(request.nextUrl.searchParams.get("jobId"))
  if (!jobId.success) return Response.json({ error: "Oferta inválida" }, { status: 400 })

  const access = await getAuthorizedJob(jobId.data)
  if (access.kind === "denied") return access.response

  const scoresResult = await listLatestCandidateAssessments(access.job.id)
  if (scoresResult.isErr()) {
    return Response.json({ error: "No se pudieron cargar los análisis" }, { status: 500 })
  }

  return Response.json({ scores: scoresResult.value })
}

export async function POST(request: NextRequest) {
  if (!process.env.TYPESAFE_API_KEY?.trim()) {
    return Response.json(
      { error: "El análisis Jev no está configurado en el servidor" },
      { status: 503 }
    )
  }

  const bodyResult = await R.tryPromise({
    try: () => request.json(),
    catch: () => new Error("Invalid JSON"),
  })
  const parsed = bodyResult.isOk() ? RequestSchema.safeParse(bodyResult.value) : null
  if (!parsed?.success)
    return Response.json({ error: "Solicitud de análisis inválida" }, { status: 400 })

  const access = await getAuthorizedJob(parsed.data.jobId)
  if (access.kind === "denied") return access.response

  const applicationsResult = await getApplicationsByJob(access.job.id, {
    page: 1,
    limit: JEV_MAX_APPLICATIONS_PER_REQUEST,
  })
  if (applicationsResult.isErr()) {
    return Response.json({ error: "No se pudieron cargar las postulaciones" }, { status: 502 })
  }

  const applications = applicationsResult.value
  const requestedIds = parsed.data.applicationIds
  if (requestedIds && new Set(requestedIds).size !== requestedIds.length) {
    return Response.json(
      { error: "La solicitud contiene postulaciones repetidas" },
      { status: 400 }
    )
  }
  const selectedApplications = requestedIds
    ? applications.filter((application) => requestedIds.includes(application.id))
    : applications

  if (requestedIds && selectedApplications.length !== new Set(requestedIds).size) {
    return Response.json(
      { error: "Una o más postulaciones no pertenecen a esta oferta" },
      { status: 400 }
    )
  }
  if (selectedApplications.length === 0) {
    return Response.json({ error: "No hay postulaciones para analizar" }, { status: 400 })
  }

  const assessments: CandidateAssessmentInput[] = []
  for (let offset = 0; offset < selectedApplications.length; offset += 10) {
    const batch = selectedApplications.slice(offset, offset + 10)
    const batchResults = await Promise.all(batch.map(loadApplicationResume))

    if (batchResults.some((result) => result.kind === "failed")) {
      return Response.json(
        { error: "No se pudo cargar el perfil de una postulación" },
        { status: 502 }
      )
    }

    for (const result of batchResults) {
      const assessment = prepareCandidateAssessment({
        application: result.application,
        job: access.job,
        resume: result.kind === "loaded" ? result.resume : null,
        organizationId: access.organizationId,
        requestedBy: access.userId,
      })
      if (assessment.isErr()) {
        return Response.json(
          { error: "El perfil contiene texto que requiere revisión" },
          { status: 400 }
        )
      }
      assessments.push(assessment.value)
    }
  }

  const reservation = await enqueueCandidateAssessments(access.organizationId, assessments)
  if (reservation.isErr()) {
    return Response.json({ error: "No se pudieron guardar los análisis" }, { status: 500 })
  }
  if (!reservation.value.accepted) {
    return Response.json(
      { error: "La empresa alcanzó el límite diario de análisis" },
      { status: 429 }
    )
  }

  after(async () => processJevQueue())
  return Response.json({ queued: reservation.value.queued }, { status: 202 })
}
