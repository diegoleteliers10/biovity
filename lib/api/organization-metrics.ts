const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
    : (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")

import { Result, Result as R } from "better-result"
import { ApiError, NetworkError } from "@/lib/errors"
import type {
  OrganizationMetrics,
  OrganizationMetricsFilters,
} from "@/lib/types/organization-metrics"
import { getErrorMessage } from "@/lib/result"

export async function getOrganizationMetrics(
  organizationId: string,
  filters?: OrganizationMetricsFilters
): Promise<Result<OrganizationMetrics, ApiError | NetworkError>> {
  const searchParams = new URLSearchParams()
  if (filters?.period) searchParams.set("period", filters.period)

  const query = searchParams.toString()
  const url = `${API_BASE}/api/v1/organizations/${organizationId}/metrics${query ? `?${query}` : ""}`

  let res: Response
  try {
    res = await fetch(url)
  } catch (err) {
    return R.err(new NetworkError({ message: err instanceof Error ? err.message : "Error de red", cause: err }))
  }

  const json = await res.json().catch(() => null)
  if (!res.ok) {
    return R.err(
      new ApiError({
        status: res.status,
        statusText: res.statusText,
        body: json,
        message: getErrorMessage(json, "Error al obtener métricas"),
      })
    )
  }

  // Handle nested response: { data: { data: { dashboard, pipeline, ... }, timestamp, path } }
  const wrapper = json as { data?: { data?: OrganizationMetrics; dashboard?: never }; dashboard?: never }
  if (wrapper.data?.data) {
    return R.ok(wrapper.data.data)
  }
  // Handle semi-nested: { data: { dashboard, pipeline, ... } }
  if (wrapper.data?.dashboard) {
    return R.ok(wrapper.data as unknown as OrganizationMetrics)
  }
  // Handle direct response: { dashboard, pipeline, ... }
  const direct = json as OrganizationMetrics
  if (direct.dashboard) {
    return R.ok(direct)
  }
  return R.err(
    new ApiError({ status: 0, statusText: "Invalid Response", body: json, message: "Formato de respuesta inválido" })
  )
}

export async function incrementJobViews(
  jobId: string
): Promise<Result<{ views: number }, ApiError | NetworkError>> {
  let res: Response
  try {
    res = await fetch(`${API_BASE}/api/v1/jobs/${jobId}/views`, {
      method: "PUT",
    })
  } catch (err) {
    return R.err(new NetworkError({ message: err instanceof Error ? err.message : "Error de red", cause: err }))
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    return R.err(
      new ApiError({
        status: res.status,
        statusText: res.statusText,
        body: data,
        message: getErrorMessage(data, "Error al incrementar vistas"),
      })
    )
  }

  return R.ok({ views: (data as { views: number }).views })
}
