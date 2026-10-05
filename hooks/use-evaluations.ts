"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Result } from "better-result"
import { z } from "zod"
import { ApiError } from "@/lib/errors"
import { type Evaluation, type EvaluationInput, evaluationSchema } from "@/lib/evaluations"

import type { EvaluationQueryData } from "@/lib/evaluations/types"

export type { Evaluation } from "@/lib/evaluations"

async function fetchEvaluationData<T>(
  url: string,
  schema: z.ZodType<T>,
  init?: RequestInit
): Promise<Result<T, Error>> {
  return Result.gen(async function* () {
    const response = yield* Result.await(
      Result.tryPromise({
        try: () => fetch(url, init),
        catch: () => new ApiError({ status: 0, message: "No se pudo conectar. Intenta de nuevo" }),
      })
    )
    const body = yield* Result.await(
      Result.tryPromise({
        try: () => response.json(),
        catch: () =>
          new ApiError({
            status: response.status,
            message: "Respuesta inválida. Intenta de nuevo",
          }),
      })
    )
    if (!response.ok) {
      const parsedError = z.object({ error: z.string() }).safeParse(body)
      return Result.err(
        new ApiError({
          status: response.status,
          message: parsedError.success
            ? parsedError.data.error
            : "No se pudo completar la solicitud",
        })
      )
    }
    const parsed = schema.safeParse(body)
    return parsed.success
      ? Result.ok(parsed.data)
      : Result.err(
          new ApiError({
            status: response.status,
            message: "Datos de evaluación inválidos. Intenta de nuevo",
          })
        )
  })
}

function useEvaluationQuery(applicationIds: readonly string[], batch: boolean) {
  const ids = [...new Set(applicationIds)].sort()
  const queryClient = useQueryClient()
  const queryKey = ["evaluations", batch ? "batch" : "single", ids]
  const query = useQuery({
    queryKey,
    queryFn: async (): Promise<EvaluationQueryData> => {
      const evaluations: Evaluation[] = []
      for (let offset = 0; offset < ids.length; offset += 100) {
        const chunk = ids.slice(offset, offset + 100)
        const params = new URLSearchParams(
          batch ? { applicationIds: chunk.join(",") } : { applicationId: chunk[0] ?? "" }
        )
        const result = await fetchEvaluationData(
          `/api/evaluations?${params}`,
          z.array(evaluationSchema)
        )
        if (result.isErr()) {
          const previous = queryClient.getQueryData<EvaluationQueryData>(queryKey)
          return { kind: "failed", evaluations: previous?.evaluations, error: result.error }
        }
        evaluations.push(...result.value)
      }
      return { kind: "ready", evaluations }
    },
    enabled: ids.length > 0,
    staleTime: 30 * 1000,
    refetchOnMount: "always",
  })
  const error = query.data?.kind === "failed" ? query.data.error : query.error
  return {
    ...query,
    data: query.data?.evaluations,
    error,
    isError: error !== null,
  }
}

export function useEvaluations(applicationId: string | undefined) {
  return useEvaluationQuery(applicationId ? [applicationId] : [], false)
}

export function useEvaluationBatch(applicationIds: readonly string[]) {
  return useEvaluationQuery(applicationIds, true)
}

export function useUpsertEvaluationMutation(applicationId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: EvaluationInput): Promise<Result<Evaluation, Error>> => {
      if (!applicationId)
        return Result.err(new ApiError({ status: 400, message: "Selecciona una postulación" }))
      return fetchEvaluationData("/api/evaluations", evaluationSchema, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, ...input }),
      })
    },
    onSuccess: (result) => {
      if (result.isOk()) return queryClient.invalidateQueries({ queryKey: ["evaluations"] })
    },
  })
}
