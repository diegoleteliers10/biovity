const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
    : (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")

import type {
  OrganizationMetrics,
  OrganizationMetricsFilters,
  TopJobMetrics,
} from "@/lib/types/organization-metrics"

function getErrorMessage(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") return fallback
  const d = data as Record<string, unknown>
  const msg = d.message
  if (Array.isArray(msg)) return msg.join(". ") || fallback
  if (typeof msg === "string") return msg
  if (typeof d.error === "string") return d.error
  return fallback
}

export async function getOrganizationMetrics(
  organizationId: string,
  filters?: OrganizationMetricsFilters
): Promise<OrganizationMetrics | { error: string }> {
  const searchParams = new URLSearchParams()
  if (filters?.period) searchParams.set("period", filters.period)

  const query = searchParams.toString()
  const url = `${API_BASE}/api/v1/organizations/${organizationId}/metrics${query ? `?${query}` : ""}`

  let res: Response
  try {
    res = await fetch(url)
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error de red" }
  }

  const json = await res.json().catch(() => null)
  if (!res.ok) {
    return { error: getErrorMessage(json, "Error al obtener métricas") }
  }

  // Handle nested response: { data: { data: { dashboard, pipeline, ... }, timestamp, path } }
  const wrapper = json as { data?: { data?: OrganizationMetrics; dashboard?: never }; dashboard?: never }
  if (wrapper.data?.data) {
    return wrapper.data.data
  }
  // Handle semi-nested: { data: { dashboard, pipeline, ... } }
  if (wrapper.data?.dashboard) {
    return wrapper.data as unknown as OrganizationMetrics
  }
  // Handle direct response: { dashboard, pipeline, ... }
  const direct = json as OrganizationMetrics
  if (direct.dashboard) {
    return direct
  }
  return { error: "Formato de respuesta inválido" }
}

export async function incrementJobViews(
  jobId: string
): Promise<{ data: { views: number } } | { error: string }> {
  let res: Response
  try {
    res = await fetch(`${API_BASE}/api/v1/jobs/${jobId}/views`, {
      method: "PUT",
    })
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error de red" }
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    return { error: getErrorMessage(data, "Error al incrementar vistas") }
  }

  return { data: { views: (data as { views: number }).views } }
}
