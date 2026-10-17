import { Result } from "better-result"
import type { ApiError, NetworkError } from "@/lib/errors"
import { fetchJson, fetchJsonWithSession } from "@/lib/result"
import type { ApplicationStatus } from "./applications"

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
  statusProjection: ApplicationStatus
  systemKey: ApplicationStatus | null
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

export type RejectionReason = {
  id: string
  organizationId: string
  label: string
  sortOrder: number
  active: boolean
  createdAt: string
  updatedAt: string
}

export type PipelineStageRubricCriterion = {
  id: string
  label: string
  description: string | null
  roleIds: string[]
}

export type PipelineStageRubricRole = {
  id: string
  label: string
}

export type PipelineStageRubric = {
  stage_id: string
  current_version_id: string | null
  version: number | null
  roles: PipelineStageRubricRole[]
  criteria: PipelineStageRubricCriterion[]
}

function extractStages(payload: unknown): PipelineStage[] {
  if (Array.isArray(payload)) return payload as PipelineStage[]
  if (!payload || typeof payload !== "object") return []
  const data = (payload as Record<string, unknown>).data
  if (Array.isArray(data)) return data as PipelineStage[]
  if (data && typeof data === "object") {
    const nested = (data as Record<string, unknown>).data
    if (Array.isArray(nested)) return nested as PipelineStage[]
  }
  return []
}

export async function getPipelineStages(
  jobId: string,
  requestHeaders?: Headers
): Promise<import("better-result").Result<PipelineStage[], ApiError | NetworkError>> {
  const url = `${API_BASE}/api/v1/pipeline-stages/job/${encodeURIComponent(jobId)}`
  const result = requestHeaders
    ? await fetchJsonWithSession<unknown>(url, requestHeaders)
    : await fetchJson<unknown>(url)
  if (result.isErr()) return Result.err(result.error)
  return Result.ok(extractStages(result.value))
}

export async function getPipelineStageRubric(
  stageId: string
): Promise<import("better-result").Result<PipelineStageRubric, ApiError | NetworkError>> {
  const result = await fetchJson<PipelineStageRubric | { data: PipelineStageRubric }>(
    `${API_BASE}/api/v1/pipeline-stages/${encodeURIComponent(stageId)}/rubric`
  )
  if (result.isErr()) return Result.err(result.error)
  const payload = result.value
  return Result.ok("data" in payload ? payload.data : payload)
}

export async function savePipelineStageRubric(
  stageId: string,
  input: {
    roles: Array<{ id?: string; label: string }>
    criteria: Array<{ id?: string; label: string; description?: string; roleIds: string[] }>
  }
): Promise<import("better-result").Result<PipelineStageRubric, ApiError | NetworkError>> {
  const result = await fetchJson<PipelineStageRubric | { data: PipelineStageRubric }>(
    `${API_BASE}/api/v1/pipeline-stages/${encodeURIComponent(stageId)}/rubric`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }
  )
  if (result.isErr()) return Result.err(result.error)
  const payload = result.value
  return Result.ok("data" in payload ? payload.data : payload)
}

export async function getRejectionReasons(
  organizationId: string,
  requestHeaders?: Headers
): Promise<import("better-result").Result<RejectionReason[], ApiError | NetworkError>> {
  const url = `${API_BASE}/api/v1/organizations/${encodeURIComponent(organizationId)}/rejection-reasons`
  const result = requestHeaders
    ? await fetchJsonWithSession<unknown>(url, requestHeaders)
    : await fetchJson<unknown>(url)
  if (result.isErr()) return Result.err(result.error)
  const payload = result.value
  const firstLevel =
    payload && typeof payload === "object" && "data" in payload ? payload.data : payload
  const reasons = Array.isArray(firstLevel)
    ? firstLevel
    : firstLevel &&
        typeof firstLevel === "object" &&
        "data" in firstLevel &&
        Array.isArray(firstLevel.data)
      ? firstLevel.data
      : []
  return Result.ok(reasons as RejectionReason[])
}

export async function createRejectionReason(
  organizationId: string,
  label: string
): Promise<import("better-result").Result<RejectionReason, ApiError | NetworkError>> {
  return fetchJson<RejectionReason>(
    `${API_BASE}/api/v1/organizations/${encodeURIComponent(organizationId)}/rejection-reasons`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label }),
    }
  )
}

export async function updateRejectionReason(
  organizationId: string,
  id: string,
  input: { label?: string; active?: boolean }
): Promise<import("better-result").Result<RejectionReason, ApiError | NetworkError>> {
  return fetchJson<RejectionReason>(
    `${API_BASE}/api/v1/organizations/${encodeURIComponent(organizationId)}/rejection-reasons/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }
  )
}
