import { generateObject } from "ai"
import { Result as R } from "better-result"
import { headers } from "next/headers"
import type { NextRequest } from "next/server"
import { z } from "zod"
import {
  JEV_EXPLANATION_PROMPT_VERSION,
  JEV_EXPLANATION_TIMEOUT_MS,
} from "@/lib/ai/decision/constants"
import type { ScoreExplanation } from "@/lib/ai/decision/types"
import { resolveModel } from "@/lib/ai/provider"
import { getJob } from "@/lib/api/jobs"
import { auth } from "@/lib/auth"
import {
  claimCandidateExplanation,
  failCandidateExplanation,
  finishCandidateExplanation,
  getCandidateAssessmentForExplanation,
  getStoredCandidateExplanation,
} from "@/lib/db/application-ai-score"

const RequestSchema = z.object({
  jobId: z.string().uuid(),
  revisionId: z.string().uuid(),
  retry: z.boolean().optional(),
})

const ExplanationSchema = z.object({
  reason: z.string().trim().min(1).max(400),
  strengths: z
    .array(
      z.object({
        text: z.string().trim().min(1).max(240),
        evidence: z.string().trim().min(1).max(240),
      })
    )
    .max(5),
  gaps: z
    .array(
      z.object({
        text: z.string().trim().min(1).max(240),
        evidence: z.string().trim().min(1).max(240),
      })
    )
    .max(5),
  recommendation: z.enum(["Avanzar", "Evaluar", "Descartar"]),
})

function normalizeEvidence(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase()
    .replace(/\s+/g, " ")
    .trim()
}

function sourceEvidence(value: unknown): string[] {
  if (typeof value === "string") return [value]
  if (Array.isArray(value)) return value.flatMap(sourceEvidence)
  if (value && typeof value === "object") return Object.values(value).flatMap(sourceEvidence)
  return []
}

function hasSupportedEvidence(explanation: ScoreExplanation, sources: string[]): boolean {
  const normalizedSources = sources.map(normalizeEvidence)
  return [...explanation.strengths, ...explanation.gaps].every((item) => {
    const evidence = normalizeEvidence(item.evidence)
    return normalizedSources.some((source) => source.includes(evidence))
  })
}

function errorResponse(message: string, status = 500): Response {
  return Response.json({ error: message }, { status })
}

export const maxDuration = 60

export async function POST(request: NextRequest) {
  const requestResult = await R.tryPromise({
    try: () => request.json(),
    catch: () => new Error("Invalid JSON"),
  })
  if (requestResult.isErr()) return errorResponse("Solicitud inválida", 400)

  const parsed = RequestSchema.safeParse(requestResult.value)
  if (!parsed.success) return errorResponse("Solicitud inválida", 400)

  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) return errorResponse("No autenticado", 401)
  const organizationId = session.user.organizationId
  if (!organizationId) return errorResponse("Se requiere una cuenta de empresa", 403)

  const jobResult = await getJob(parsed.data.jobId)
  if (jobResult.isErr()) return errorResponse("No se pudo validar la oferta", 502)
  if (jobResult.value.organizationId !== organizationId) {
    return errorResponse("No tienes acceso a esta oferta", 403)
  }

  const storedResult = await getStoredCandidateExplanation(
    parsed.data.revisionId,
    parsed.data.jobId
  )
  if (storedResult.isErr()) return errorResponse("No se pudo cargar la explicación")
  if (!storedResult.value) return errorResponse("El análisis no existe", 404)
  if (storedResult.value.status === "ready") {
    return Response.json({ status: "ready", explanation: storedResult.value.explanation })
  }
  if (storedResult.value.status === "expired") {
    return Response.json({ status: "expired" })
  }
  if (storedResult.value.status === "processing") {
    return Response.json({ status: "processing" }, { status: 202 })
  }
  if (storedResult.value.status === "failed" && !parsed.data.retry) {
    return Response.json({ status: "failed" }, { status: 200 })
  }

  const assessmentResult = await getCandidateAssessmentForExplanation(
    parsed.data.revisionId,
    parsed.data.jobId
  )
  if (assessmentResult.isErr()) return errorResponse("No se pudo cargar el análisis")
  if (!assessmentResult.value) {
    return Response.json({ status: "expired" })
  }

  const leaseResult = await claimCandidateExplanation(
    parsed.data.revisionId,
    parsed.data.jobId,
    parsed.data.retry === true
  )
  if (leaseResult.isErr()) return errorResponse("No se pudo iniciar la explicación")
  if (!leaseResult.value) return Response.json({ status: "processing" }, { status: 202 })

  const assessment = assessmentResult.value
  const resolved = await resolveModel(organizationId)
  const generated = await R.tryPromise({
    try: () =>
      generateObject({
        model: resolved.model,
        schema: ExplanationSchema,
        abortSignal: AbortSignal.timeout(JEV_EXPLANATION_TIMEOUT_MS),
        system: [
          "Explica una evaluación de compatibilidad entre una trayectoria profesional y una oferta laboral.",
          "Jev calculó el score. No cambies, repitas, ni traduzcas ese número como probabilidad de éxito.",
          "No inventes fortalezas, brechas, años, habilidades ni formación.",
          "Cada fortaleza y brecha debe incluir evidence copiada literalmente del perfil o de los requisitos.",
          "La recomendación es solo una sugerencia para revisión humana. Nunca instruyas un descarte automático.",
          `El score, su distribución y confianza son datos inmutables. La versión de prompt es ${JEV_EXPLANATION_PROMPT_VERSION}.`,
        ].join(" "),
        prompt: JSON.stringify({
          score: assessment.score,
          confidence: assessment.confidence,
          sufficiency: assessment.sufficiency,
          distribution: assessment.distribution,
          answers: assessment.perQuestion,
          job: assessment.jobSnapshot,
          candidate: assessment.candidateSnapshot,
        }),
      }),
    catch: (cause) => (cause instanceof Error ? cause : new Error("Explanation request failed")),
  })

  if (generated.isErr()) {
    await failCandidateExplanation(parsed.data.revisionId, leaseResult.value)
    return Response.json({ status: "failed" }, { status: 200 })
  }

  const explanation = ExplanationSchema.safeParse(generated.value.object)
  const sources = [
    ...sourceEvidence(assessment.jobSnapshot),
    ...sourceEvidence(assessment.candidateSnapshot),
  ]
  if (!explanation.success || !hasSupportedEvidence(explanation.data, sources)) {
    await failCandidateExplanation(parsed.data.revisionId, leaseResult.value)
    return Response.json({ status: "failed" }, { status: 200 })
  }

  const savedResult = await finishCandidateExplanation(
    parsed.data.revisionId,
    leaseResult.value,
    explanation.data,
    resolved.modelId
  )
  if (savedResult.isErr() || !savedResult.value)
    return errorResponse("No se pudo guardar la explicación")

  return Response.json({ status: "ready", explanation: explanation.data })
}
