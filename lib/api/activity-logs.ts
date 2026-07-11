import { Result as R, type Result } from "better-result"
import type { ApiError, NetworkError } from "@/lib/errors"
import { fetchJson } from "@/lib/result"

const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
    : (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")

export type ActivityLog = {
  id: string
  organizationId: string
  userId: string
  action: string
  description: string
  metadata?: Record<string, any> | null
  createdAt: string
  user?: {
    id: string
    name: string
    avatar?: string | null
    email: string
  } | null
}

export type CreateActivityLogInput = {
  userId: string
  action: string
  description: string
  metadata?: Record<string, any>
}

const base = (orgId: string) => `${API_BASE}/api/v1/organizations/${orgId}/activity-logs`

export async function getActivityLogs(
  organizationId: string
): Promise<Result<ActivityLog[], ApiError | NetworkError>> {
  const result = await fetchJson<unknown>(base(organizationId))
  if (result.isErr()) return R.err(result.error)
  const raw = result.value
  const arr = Array.isArray(raw) ? raw : []
  return R.ok(arr as ActivityLog[])
}

export async function logActivity(
  organizationId: string,
  input: CreateActivityLogInput
): Promise<Result<ActivityLog, ApiError | NetworkError>> {
  return fetchJson<ActivityLog>(base(organizationId), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
}
