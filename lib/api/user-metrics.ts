import { Result as R, type Result } from "better-result"
import { ApiError, type NetworkError } from "@/lib/errors"
import { fetchJson } from "@/lib/result"
import type { UserMetrics, UserMetricsFilters } from "@/lib/types/user-metrics"

const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
    : (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")

export async function getUserMetrics(
  userId: string,
  filters?: UserMetricsFilters
): Promise<Result<UserMetrics, ApiError | NetworkError>> {
  const searchParams = new URLSearchParams()
  if (filters?.period) searchParams.set("period", filters.period)

  const query = searchParams.toString()
  const url = `${API_BASE}/api/v1/users/${userId}/metrics${query ? `?${query}` : ""}`

  const result = await fetchJson<{
    data?: { data?: UserMetrics } | UserMetrics
  }>(url)

  if (result.isErr()) return R.err(result.error)

  const json = result.value

  if (json.data && typeof json.data === "object") {
    const data = json.data as Record<string, unknown>
    if ("data" in data && data.data && typeof data.data === "object") {
      return R.ok(data.data as UserMetrics)
    }
    if ("quickMetrics" in data) {
      return R.ok(data as unknown as UserMetrics)
    }
  }

  return R.err(
    new ApiError({
      status: 0,
      statusText: "Invalid Response",
      body: json,
      message: "Formato de respuesta inválido",
    })
  )
}

export async function incrementProfileViews(
  userId: string
): Promise<Result<{ views: number }, ApiError | NetworkError>> {
  const result = await fetchJson<{ views: number }>(`${API_BASE}/api/v1/users/${userId}/views`, {
    method: "POST",
  })

  if (result.isErr()) return R.err(result.error)
  return R.ok({ views: result.value.views })
}
