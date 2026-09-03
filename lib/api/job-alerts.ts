import { Result as R, type Result } from "better-result"
import type { ApiError, NetworkError } from "@/lib/errors"
import { fetchJson, fetchNoContent } from "@/lib/result"
import type { JobAlert, JobAlertFrequency } from "@/lib/types/job-alert"

const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
    : (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")

export type CreateJobAlertPayload = {
  userId: string
  keywords?: string
  location?: string
  category?: string
  frequency: JobAlertFrequency
}

export async function getJobAlerts(
  userId: string
): Promise<Result<JobAlert[], ApiError | NetworkError>> {
  const result = await fetchJson<{ data: JobAlert[] }>(
    `${API_BASE}/api/v1/job-alerts?userId=${userId}`
  )
  if (result.isErr()) return R.err(result.error)
  return R.ok(result.value.data)
}

export async function createJobAlert(
  payload: CreateJobAlertPayload
): Promise<Result<JobAlert, ApiError | NetworkError>> {
  const result = await fetchJson<{ data: JobAlert }>(`${API_BASE}/api/v1/job-alerts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (result.isErr()) return R.err(result.error)
  return R.ok(result.value.data)
}

export async function deleteJobAlert(
  id: string,
  userId: string
): Promise<Result<void, ApiError | NetworkError>> {
  return fetchNoContent(`${API_BASE}/api/v1/job-alerts/${id}?userId=${userId}`, {
    method: "DELETE",
  })
}

export function formatJobAlertCriteria(alert: JobAlert): string {
  const parts = [alert.keywords, alert.location, alert.category]
  return parts.filter((part): part is string => Boolean(part?.trim())).join(" · ")
}
