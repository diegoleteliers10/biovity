"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Result } from "better-result"
import type { ApiError, NetworkError } from "@/lib/errors"
import { fetchJson, fetchNoContent, getResultErrorMessage } from "@/lib/result"

const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
    : (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")

export type PipelineStage = {
  id: string
  jobId: string
  name: string
  color: string
  order: number
  createdAt: string
  updatedAt: string
}

export const pipelineStagesKeys = {
  byJob: (jobId: string) => ["pipelineStages", jobId] as const,
}

function extractStages(payload: unknown): PipelineStage[] {
  if (Array.isArray(payload)) return payload as PipelineStage[]
  if (!payload || typeof payload !== "object") return []
  const p = payload as Record<string, unknown>
  const data = p.data
  if (Array.isArray(data)) return data as PipelineStage[]
  if (data && typeof data === "object") {
    const nested = (data as Record<string, unknown>).data
    if (Array.isArray(nested)) return nested as PipelineStage[]
  }
  return []
}

export async function getPipelineStages(
  jobId: string
): Promise<Result<PipelineStage[], ApiError | NetworkError>> {
  const result = await fetchJson<unknown>(
    `${API_BASE}/api/v1/pipeline-stages?jobId=${encodeURIComponent(jobId)}`
  )
  if (result.isErr()) return Result.err(result.error)
  const stages = extractStages(result.value)
  return Result.ok(stages)
}

export async function createPipelineStage(
  jobId: string,
  data: { name: string; color: string; order: number }
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
      if (!jobId) throw new Error("Job ID required")
      const result = await getPipelineStages(jobId)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    enabled: Boolean(jobId),
  })
}

export function useCreatePipelineStageMutation(jobId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { name: string; color: string; order: number }) => {
      const result = await createPipelineStage(jobId, data)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
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
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
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
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pipelineStagesKeys.byJob(jobId) })
    },
  })
}
