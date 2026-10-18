import { Result as R, type Result } from "better-result"
import { ApiError, type NetworkError } from "@/lib/errors"
import { fetchJson, fetchJsonWithSession } from "@/lib/result"
import type {
  ApplicationSourceChannel,
  ApplicationSourceMethod,
} from "@/lib/types/application-source"
import type {
  CustomStageApplicationPage,
  OrganizationMetrics,
  OrganizationMetricsFilters,
  ResponseTimeBucket,
  ResponseTimeVisitPage,
  SourceApplicationPage,
  StageDurationVisitPage,
} from "@/lib/types/organization-metrics"

const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
    : (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")

export async function getResponseTimeVisits(
  organizationId: string,
  bucket: ResponseTimeBucket,
  filters: OrganizationMetricsFilters & { page: number; pageSize: number }
): Promise<Result<ResponseTimeVisitPage, ApiError | NetworkError>> {
  const searchParams = new URLSearchParams({
    bucket,
    period: filters.period ?? "month",
    page: String(filters.page),
    pageSize: String(filters.pageSize),
  })
  if (filters.startDate) searchParams.set("startDate", filters.startDate)
  if (filters.endDate) searchParams.set("endDate", filters.endDate)
  const result = await fetchJson<{ data?: ResponseTimeVisitPage }>(
    `${API_BASE}/api/v1/organizations/${organizationId}/metrics/response-visits?${searchParams}`
  )
  if (result.isErr()) return R.err(result.error)
  if (!result.value.data) {
    return R.err(
      new ApiError({
        status: 0,
        statusText: "Invalid Response",
        body: result.value,
        message: "Formato de respuesta inválido",
      })
    )
  }
  return R.ok(result.value.data)
}

type OrganizationMetricsResponse = {
  data?: { data?: OrganizationMetrics; dashboard?: never }
  dashboard?: never
}

export async function getStageDurationVisits(
  organizationId: string,
  jobId: string,
  stageId: string,
  filters: Pick<OrganizationMetricsFilters, "startDate" | "endDate"> & {
    page: number
    pageSize: number
  }
): Promise<Result<StageDurationVisitPage, ApiError | NetworkError>> {
  const searchParams = new URLSearchParams({
    jobId,
    stageId,
    page: String(filters.page),
    pageSize: String(filters.pageSize),
  })
  if (filters.startDate) searchParams.set("startDate", filters.startDate)
  if (filters.endDate) searchParams.set("endDate", filters.endDate)
  const result = await fetchJson<{ data?: StageDurationVisitPage }>(
    `${API_BASE}/api/v1/organizations/${organizationId}/metrics/stage-visits?${searchParams}`
  )
  if (result.isErr()) return R.err(result.error)
  if (!result.value.data) {
    return R.err(
      new ApiError({
        status: 0,
        statusText: "Invalid Response",
        body: result.value,
        message: "Formato de respuesta inválido",
      })
    )
  }
  return R.ok(result.value.data)
}

export async function getCustomStageApplications(
  organizationId: string,
  jobId: string,
  stageId: string,
  filters: OrganizationMetricsFilters & { page: number; pageSize: number }
): Promise<Result<CustomStageApplicationPage, ApiError | NetworkError>> {
  const searchParams = new URLSearchParams({
    jobId,
    stageId,
    period: filters.period ?? "month",
    page: String(filters.page),
    pageSize: String(filters.pageSize),
  })
  if (filters.startDate) searchParams.set("startDate", filters.startDate)
  if (filters.endDate) searchParams.set("endDate", filters.endDate)
  const result = await fetchJson<{ data?: CustomStageApplicationPage }>(
    `${API_BASE}/api/v1/organizations/${organizationId}/metrics/custom-stage-applications?${searchParams}`
  )
  if (result.isErr()) return R.err(result.error)
  if (!result.value.data) {
    return R.err(
      new ApiError({
        status: 0,
        statusText: "Invalid Response",
        body: result.value,
        message: "Formato de respuesta inválido",
      })
    )
  }
  return R.ok(result.value.data)
}

export async function getSourceApplications(
  organizationId: string,
  sourceChannel: ApplicationSourceChannel,
  sourceMethod: ApplicationSourceMethod,
  filters: OrganizationMetricsFilters & { page: number; pageSize: number }
): Promise<Result<SourceApplicationPage, ApiError | NetworkError>> {
  const searchParams = new URLSearchParams({
    sourceChannel,
    sourceMethod,
    period: filters.period ?? "month",
    page: String(filters.page),
    pageSize: String(filters.pageSize),
  })
  if (filters.startDate) searchParams.set("startDate", filters.startDate)
  if (filters.endDate) searchParams.set("endDate", filters.endDate)
  const result = await fetchJson<{ data?: SourceApplicationPage }>(
    `${API_BASE}/api/v1/organizations/${organizationId}/metrics/source-applications?${searchParams}`
  )
  if (result.isErr()) return R.err(result.error)
  if (!result.value.data) {
    return R.err(
      new ApiError({
        status: 0,
        statusText: "Invalid Response",
        body: result.value,
        message: "Formato de respuesta inválido",
      })
    )
  }
  return R.ok(result.value.data)
}

export async function getOrganizationMetrics(
  organizationId: string,
  filters?: OrganizationMetricsFilters,
  requestHeaders?: Headers
): Promise<Result<OrganizationMetrics, ApiError | NetworkError>> {
  const searchParams = new URLSearchParams()
  if (filters?.period) searchParams.set("period", filters.period)
  if (filters?.startDate) searchParams.set("startDate", filters.startDate)
  if (filters?.endDate) searchParams.set("endDate", filters.endDate)

  const query = searchParams.toString()
  const url = `${API_BASE}/api/v1/organizations/${organizationId}/metrics${query ? `?${query}` : ""}`

  const result = requestHeaders
    ? await fetchJsonWithSession<OrganizationMetricsResponse>(url, requestHeaders)
    : await fetchJson<OrganizationMetricsResponse>(url)

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
  const result = await fetchJson<{ data: { views: number } }>(
    `${API_BASE}/api/v1/jobs/${jobId}/views`,
    {
      method: "POST",
    }
  )

  if (result.isErr()) return R.err(result.error)

  return R.ok({ views: result.value.data.views })
}
