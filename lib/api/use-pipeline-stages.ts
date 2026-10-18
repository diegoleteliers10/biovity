"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Result } from "better-result"
import type { ApiError, NetworkError } from "@/lib/errors"
import { fetchJson, fetchNoContent, getResultErrorMessage } from "@/lib/result"
import {
  createRejectionReason,
  getPipelineStageRubric,
  getPipelineStages,
  getRejectionReasons,
  type PipelineStage,
  savePipelineStageRubric,
  updateRejectionReason,
} from "./pipeline-stages"

export type {
  PipelineStage,
  PipelineStageRubric,
  PipelineStageRubricCriterion,
  PipelineStageRubricRole,
} from "./pipeline-stages"
export { getPipelineStages } from "./pipeline-stages"

const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
    : (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")

export const pipelineStagesKeys = {
  byJob: (jobId: string) => ["pipelineStages", jobId] as const,
  rejectionReasons: (organizationId: string) => ["rejectionReasons", organizationId] as const,
  rubric: (stageId: string) => ["pipelineStageRubric", stageId] as const,
}

export function usePipelineStageRubric(stageId: string) {
  return useQuery({
    queryKey: pipelineStagesKeys.rubric(stageId),
    queryFn: async () => {
      const result = await getPipelineStageRubric(stageId)
      if (!Result.isOk(result))
        return Promise.reject(new Error(getResultErrorMessage(result.error)))
      return result.value
    },
    enabled: Boolean(stageId),
  })
}

export function useSavePipelineStageRubricMutation(stageId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: {
      roles: Array<{ id?: string; label: string }>
      criteria: Array<{ id?: string; label: string; description?: string; roleIds: string[] }>
    }) => {
      const result = await savePipelineStageRubric(stageId, input)
      if (!Result.isOk(result))
        return Promise.reject(new Error(getResultErrorMessage(result.error)))
      return result.value
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: pipelineStagesKeys.rubric(stageId) }),
  })
}

export function useRejectionReasons(organizationId: string | undefined) {
  return useQuery({
    queryKey: pipelineStagesKeys.rejectionReasons(organizationId ?? ""),
    queryFn: async () => {
      if (!organizationId) return Promise.reject(new Error("Organization ID required"))
      const result = await getRejectionReasons(organizationId)
      if (!Result.isOk(result))
        return Promise.reject(new Error(getResultErrorMessage(result.error)))
      return result.value
    },
    enabled: Boolean(organizationId),
  })
}

export function useCreateRejectionReasonMutation(organizationId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (label: string) => {
      const result = await createRejectionReason(organizationId, label)
      if (!Result.isOk(result))
        return Promise.reject(new Error(getResultErrorMessage(result.error)))
      return result.value
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: pipelineStagesKeys.rejectionReasons(organizationId),
      }),
  })
}

export function useUpdateRejectionReasonMutation(organizationId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...input }: { id: string; label?: string; active?: boolean }) => {
      const result = await updateRejectionReason(organizationId, id, input)
      if (!Result.isOk(result))
        return Promise.reject(new Error(getResultErrorMessage(result.error)))
      return result.value
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: pipelineStagesKeys.rejectionReasons(organizationId),
      }),
  })
}

export async function createPipelineStage(
  jobId: string,
  data: {
    name: string
    color: string
    order: number
    statusProjection: PipelineStage["statusProjection"]
  }
): Promise<Result<PipelineStage, ApiError | NetworkError>> {
  const result = await fetchJson<{ data: PipelineStage }>(`${API_BASE}/api/v1/pipeline-stages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jobId, ...data }),
  })
  if (result.isErr()) return Result.err(result.error)
  return Result.ok(result.value.data)
}

export async function updatePipelineStage(
  id: string,
  data: { name?: string; color?: string; order?: number }
): Promise<Result<PipelineStage, ApiError | NetworkError>> {
  const result = await fetchJson<{ data: PipelineStage }>(
    `${API_BASE}/api/v1/pipeline-stages/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  )
  if (result.isErr()) return Result.err(result.error)
  return Result.ok(result.value.data)
}

export async function deletePipelineStage(
  id: string
): Promise<Result<void, ApiError | NetworkError>> {
  return fetchNoContent(`${API_BASE}/api/v1/pipeline-stages/${id}`, {
    method: "DELETE",
  })
}

export function usePipelineStages(jobId: string | undefined) {
  return useQuery({
    queryKey: pipelineStagesKeys.byJob(jobId ?? ""),
    queryFn: async () => {
      if (!jobId) return Promise.reject(new Error("Job ID required"))
      const result = await getPipelineStages(jobId)
      if (!Result.isOk(result))
        return Promise.reject(new Error(getResultErrorMessage(result.error)))
      return result.value
    },
    enabled: Boolean(jobId),
  })
}

export function useCreatePipelineStageMutation(jobId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: {
      name: string
      color: string
      order: number
      statusProjection: PipelineStage["statusProjection"]
    }) => {
      const result = await createPipelineStage(jobId, data)
      if (!Result.isOk(result))
        return Promise.reject(new Error(getResultErrorMessage(result.error)))
      return result.value
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pipelineStagesKeys.byJob(jobId) })
    },
  })
}

export function useUpdatePipelineStageMutation(jobId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: { name?: string; color?: string; order?: number }
    }) => {
      const result = await updatePipelineStage(id, data)
      if (!Result.isOk(result))
        return Promise.reject(new Error(getResultErrorMessage(result.error)))
      return result.value
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pipelineStagesKeys.byJob(jobId) })
    },
  })
}

export function useDeletePipelineStageMutation(jobId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deletePipelineStage(id)
      if (!Result.isOk(result))
        return Promise.reject(new Error(getResultErrorMessage(result.error)))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pipelineStagesKeys.byJob(jobId) })
    },
  })
}

export function useReorderPipelineStagesMutation(jobId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (stageIds: string[]) => {
      const result = await fetchJson<{ data: PipelineStage[] }>(
        `${API_BASE}/api/v1/pipeline-stages/reorder/${encodeURIComponent(jobId)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stageIds }),
        }
      )
      return result.isOk() ? result.value.data : Promise.reject(result.error)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: pipelineStagesKeys.byJob(jobId) }),
  })
}
