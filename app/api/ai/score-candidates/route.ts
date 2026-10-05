import { Result as R } from "better-result"
import { headers } from "next/headers"
import type { NextRequest } from "next/server"
import { after } from "next/server"
import { z } from "zod"
import { JEV_MAX_APPLICATIONS_PER_REQUEST } from "@/lib/ai/decision/constants"
import { CandidateCvError, loadCandidateCvText } from "@/lib/ai/decision/cv"
import { prepareCandidateAssessment } from "@/lib/ai/decision/profile"
import type { CandidateAssessmentInput, ScoreDetails } from "@/lib/ai/decision/types"
import { processJevQueue } from "@/lib/ai/decision/worker"
import { type Application, getApplicationsByJob } from "@/lib/api/applications"
import type { Job } from "@/lib/api/jobs"
import { getManagedJob } from "@/lib/api/jobs"
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
  | { kind: "failed"; application: Application; message: string }
  | { kind: "loaded"; application: Application; resume: Resume | null; cvText: string }
  | { kind: "profile-only"; application: Application; resume: Resume; cvText: ""; message: string }

const RequestSchema = z.object({
  jobId: z.string().uuid(),
  applicationIds: z.array(z.string().uuid()).max(JEV_MAX_APPLICATIONS_PER_REQUEST).optional(),
})

async function loadApplicationResume(
  application: Application,
  requestHeaders: Headers
): Promise<ResumeLoad> {
  const resumeResult = await getResumeByUserId(application.candidateId, requestHeaders)
  if (resumeResult.isErr())
    return {
      kind: "failed",
      application,
      message: "No se pudo cargar el perfil de una postulación. Vuelve a intentar.",
    }
  if (resumeResult.value && resumeResult.value.userId !== application.candidateId) {
    return {
      kind: "failed",
      application,
      message: "No se pudo cargar el perfil de una postulación. Vuelve a intentar.",
    }
  }
  const resume = resumeResult.value
  const hasProfile = Boolean(
    resume &&
      (resume.summary?.trim() ||
        resume.skills.length ||
        resume.experiences.length ||
        resume.education.length)
  )
  if (!resume?.cvFile && application.resumeUrl) {
    const message =
      "El CV de la postulación no está registrado en el perfil. Actualiza el CV y vuelve a analizar."
    return resume && hasProfile
      ? { kind: "profile-only", application, resume, cvText: "", message }
      : { kind: "failed", application, message }
  }
  const cvResult = await loadCandidateCvText(resume)
  if (cvResult.isErr()) {
    const readableIssue =
      cvResult.error instanceof CandidateCvError &&
      (cvResult.error.reason === "no_text" || cvResult.error.reason === "invalid_pdf")
    const message = readableIssue
      ? "No se pudo extraer texto del CV. Actualiza el PDF con texto seleccionable y vuelve a analizar."
      : "No se pudo cargar el CV. Revisa el archivo del perfil y vuelve a intentar."
    return readableIssue && resume && hasProfile
      ? { kind: "profile-only", application, resume, cvText: "", message }
      : { kind: "failed", application, message }
  }
  return { kind: "loaded", application, resume, cvText: cvResult.value }
}

async function getAuthorizedJob(jobId: string, requestHeaders: Headers): Promise<JobAccess> {
  const session = await auth.api.getSession({ headers: requestHeaders })
  if (!session?.user?.id) {
    return { kind: "denied", response: Response.json({ error: "No autenticado" }, { status: 401 }) }
  }

  const jobResult = await getManagedJob(jobId, requestHeaders)
  if (jobResult.isErr()) {
    return {
      kind: "denied",
      response: Response.json({ error: "No se pudo validar la oferta" }, { status: 502 }),
    }
  }
  return {
    kind: "authorized",
    userId: session.user.id,
    organizationId: jobResult.value.organizationId,
    job: jobResult.value,
  }
}

export async function GET(request: NextRequest) {
  const jobId = z.string().uuid().safeParse(request.nextUrl.searchParams.get("jobId"))
  if (!jobId.success) return Response.json({ error: "Oferta inválida" }, { status: 400 })

  const access = await getAuthorizedJob(jobId.data, await headers())
  if (access.kind === "denied") return access.response

  const scoresResult = await listLatestCandidateAssessments(access.job.id)
  if (scoresResult.isErr()) {
    console.error("[Jev] Database operation failed", { operation: scoresResult.error.operation })
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

  const requestHeaders = await headers()
  const access = await getAuthorizedJob(parsed.data.jobId, requestHeaders)
  if (access.kind === "denied") return access.response

  const applicationsResult = await getApplicationsByJob(
    access.job.id,
    { page: 1, limit: JEV_MAX_APPLICATIONS_PER_REQUEST },
    requestHeaders
  )
  if (applicationsResult.isErr()) {
    console.error("[Jev] Could not load applications", {
      error: applicationsResult.error._tag,
      status:
        applicationsResult.error._tag === "ApiError" ? applicationsResult.error.status : undefined,
    })
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
  const warnings: string[] = []
  for (let offset = 0; offset < selectedApplications.length; offset += 10) {
    const batch = selectedApplications.slice(offset, offset + 10)
    const batchResults = await Promise.all(
      batch.map((application) => loadApplicationResume(application, requestHeaders))
    )

    for (const result of batchResults) {
      if (result.kind === "failed") {
        warnings.push(result.message)
        continue
      }
      if (result.kind === "profile-only") warnings.push(result.message)
      const assessment = prepareCandidateAssessment({
        application: result.application,
        job: access.job,
        resume: result.resume,
        cvText: result.cvText,
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

  if (assessments.length === 0) {
    return Response.json(
      { error: warnings[0] ?? "No se pudieron cargar los perfiles" },
      { status: 502 }
    )
  }

  const reservation = await enqueueCandidateAssessments(access.organizationId, assessments)
  if (reservation.isErr()) {
    console.error("[Jev] Database operation failed", { operation: reservation.error.operation })
    return Response.json({ error: "No se pudieron guardar los análisis" }, { status: 500 })
  }
  if (!reservation.value.accepted) {
    return Response.json(
      { error: "La empresa alcanzó el límite diario de análisis" },
      { status: 429 }
    )
  }

  after(async () => processJevQueue())
  return Response.json(
    {
      queued: reservation.value.queued,
      warning: warnings.length
        ? `${warnings.length} postulaciones requieren revisión. ${warnings[0]} Los perfiles disponibles continúan con el análisis.`
        : null,
    },
    { status: 202 }
  )
}
