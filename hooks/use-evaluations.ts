"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Result } from "better-result"
import { getApplicationEvaluations, saveApplicationEvaluation } from "@/lib/api/evaluations"
import { ApiError } from "@/lib/errors"
import { type Evaluation, type EvaluationInput } from "@/lib/evaluations"

import type { EvaluationQueryData } from "@/lib/evaluations/types"

export type { Evaluation } from "@/lib/evaluations"

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
        const result = await getApplicationEvaluations(chunk)
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
      return saveApplicationEvaluation(applicationId, input)
    },
    onSuccess: (result) => {
      if (result.isOk()) return queryClient.invalidateQueries({ queryKey: ["evaluations"] })
    },
  })
}
