import { Result } from "better-result"
import { z } from "zod"
import { evaluationInputSchema, evaluationSchema, type EvaluationInput } from "@/lib/evaluations"
import type { Evaluation } from "@/lib/evaluations/types"
import { ApiError, type NetworkError } from "@/lib/errors"
import { fetchApiData } from "@/lib/api/response"

function parseEvaluations(value: unknown): Result<Evaluation[], ApiError> {
  const parsed = z.array(evaluationSchema).safeParse(value)
  return parsed.success
    ? Result.ok(parsed.data)
    : Result.err(new ApiError({ status: 502, message: "Datos de evaluación inválidos" }))
}

export async function getApplicationEvaluations(
  applicationIds: readonly string[]
): Promise<Result<Evaluation[], ApiError | NetworkError>> {
  const uniqueIds = [...new Set(applicationIds)]
  const searchParams = new URLSearchParams({ applicationIds: uniqueIds.join(",") })
  const result = await fetchApiData<unknown>(`/api/v1/evaluations?${searchParams}`)
  if (result.isErr()) return Result.err(result.error)
  return parseEvaluations(result.value)
}

export async function saveApplicationEvaluation(
  applicationId: string,
  input: EvaluationInput
): Promise<Result<Evaluation, ApiError | NetworkError>> {
  const validated = evaluationInputSchema.safeParse({ applicationId, ...input })
  if (!validated.success) {
    return Result.err(
      new ApiError({
        status: 400,
        message: validated.error.issues[0]?.message ?? "Datos de evaluación inválidos",
      })
    )
  }
  const result = await fetchApiData<unknown>("/api/v1/evaluations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(validated.data),
  })
  if (result.isErr()) return Result.err(result.error)
  const parsed = evaluationSchema.safeParse(result.value)
  return parsed.success
    ? Result.ok(parsed.data)
    : Result.err(new ApiError({ status: 502, message: "Datos de evaluación inválidos" }))
}
