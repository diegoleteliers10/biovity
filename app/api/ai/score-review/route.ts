import { Result as R } from "better-result"
import { headers } from "next/headers"
import type { NextRequest } from "next/server"
import { z } from "zod"
import { getManagedJob } from "@/lib/api/jobs"
import { auth } from "@/lib/auth"
import {
  listAIRecommendationReviews,
  writeAIRecommendationReview,
} from "@/lib/db/application-ai-recommendation-review"

const ScopeSchema = z.object({
  jobId: z.string().uuid(),
  revisionId: z.string().uuid(),
})

const WriteSchema = ScopeSchema.extend({
  actionId: z.string().uuid(),
  decision: z.enum(["Avanzar", "Evaluar", "Descartar"]),
  reason: z.string().trim().min(1).max(1000).nullable(),
}).strict()

function errorResponse(message: string, status = 500): Response {
  return Response.json({ error: message }, { status })
}

async function authorize(jobId: string) {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })
  if (!session?.user?.id) return { response: errorResponse("No autenticado", 401) }

  const jobResult = await getManagedJob(jobId, requestHeaders)
  if (jobResult.isErr()) return { response: errorResponse("No se pudo validar la oferta", 502) }

  return {
    reviewerId: session.user.id,
    reviewerName: session.user.name.trim().slice(0, 120) || "Reclutador",
    organizationId: jobResult.value.organizationId,
  }
}

export async function GET(request: NextRequest) {
  const parsed = ScopeSchema.safeParse(Object.fromEntries(request.nextUrl.searchParams))
  if (!parsed.success) return errorResponse("Solicitud inválida", 400)

  const access = await authorize(parsed.data.jobId)
  if ("response" in access) return access.response

  const reviews = await listAIRecommendationReviews({
    revisionId: parsed.data.revisionId,
    jobId: parsed.data.jobId,
    organizationId: access.organizationId,
  })
  if (reviews.isErr()) return errorResponse("No se pudo cargar la revisión")
  if (!reviews.value) return errorResponse("El análisis no existe", 404)
  return Response.json({ reviews: reviews.value })
}

export async function POST(request: NextRequest) {
  const bodyResult = await R.tryPromise({
    try: () => request.json(),
    catch: () => new Error("Invalid JSON"),
  })
  if (bodyResult.isErr()) return errorResponse("Solicitud inválida", 400)

  const parsed = WriteSchema.safeParse(bodyResult.value)
  if (!parsed.success) return errorResponse("Solicitud inválida", 400)

  const access = await authorize(parsed.data.jobId)
  if ("response" in access) return access.response

  const saved = await writeAIRecommendationReview({
    ...parsed.data,
    organizationId: access.organizationId,
    reviewerId: access.reviewerId,
    reviewerName: access.reviewerName,
    reason: parsed.data.reason,
  })
  if (saved.isErr()) return errorResponse("No se pudo guardar la revisión")
  if (saved.value.status === "conflict") return errorResponse("La acción ya se usó", 409)
  if (saved.value.status === "not_found") return errorResponse("El análisis no existe", 404)
  if (saved.value.status === "reason_required") {
    return errorResponse("Indica un motivo para cambiar la sugerencia", 400)
  }
  return Response.json(
    { review: saved.value.review },
    { status: saved.value.status === "created" ? 201 : 200 }
  )
}
