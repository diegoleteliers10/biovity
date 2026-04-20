import { Result as R, type Result } from "better-result"
import { ApiError, type NetworkError } from "@/lib/errors"
import { fetchJson } from "@/lib/result"
import type {
  OrganizationMetrics,
  OrganizationMetricsFilters,
} from "@/lib/types/organization-metrics"

const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
    : (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")

export async function getOrganizationMetrics(
  organizationId: string,
  filters?: OrganizationMetricsFilters
): Promise<Result<OrganizationMetrics, ApiError | NetworkError>> {
  const searchParams = new URLSearchParams()
  if (filters?.period) searchParams.set("period", filters.period)

  const query = searchParams.toString()
  const url = `${API_BASE}/api/v1/organizations/${organizationId}/metrics${query ? `?${query}` : ""}`

  const result = await fetchJson<{
    data?: { data?: OrganizationMetrics; dashboard?: never }
    dashboard?: never
  }>(url)

  if (result.isErr()) return R.err(result.error)

  const json = result.value

  if (json.data?.data) {
    return R.ok(json.data.data)
  }
  if (json.data?.dashboard) {
    return R.ok(json.data as unknown as OrganizationMetrics)
  }
  const direct = json as unknown as OrganizationMetrics
  if (direct.dashboard) {
    return R.ok(direct)
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

export async function incrementJobViews(
  jobId: string
): Promise<Result<{ views: number }, ApiError | NetworkError>> {
  const result = await fetchJson<{ views: number }>(`${API_BASE}/api/v1/jobs/${jobId}/views`, {
    method: "PUT",
  })

  if (result.isErr()) return R.err(result.error)

  return R.ok({ views: result.value.views })
}
