import { Result as R, type Result } from "better-result"
import { ApiError, NetworkError } from "@/lib/errors"
import { fetchJson } from "@/lib/result"

const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
    : (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")

export type ApplicationStatus = "pendiente" | "oferta" | "entrevista" | "rechazado" | "contratado"

export type ApplicationJob = {
  id: string
  title: string
  organizationId: string
}

export type ApplicationCandidate = {
  id: string
  name: string
  email: string
  avatar?: string | null
  profession?: string | null
  education?: string | null
  skills?: string[]
  yearsOfExperience?: number
  bio?: string
}

export type Application = {
  id: string
  jobId: string
  job?: ApplicationJob
  candidateId: string
  candidate?: ApplicationCandidate
  status: ApplicationStatus
  createdAt: string
  updatedAt: string
}

export type GetApplicationsByJobParams = {
  page?: number
  limit?: number
  status?: ApplicationStatus
}

export async function getApplicationsByCandidate(
  candidateId: string,
  params?: GetApplicationsByJobParams
): Promise<Result<Application[], ApiError | NetworkError>> {
  const searchParams = new URLSearchParams()
  if (params?.page != null) searchParams.set("page", String(params.page))
  if (params?.limit != null) searchParams.set("limit", String(params.limit))
  if (params?.status) searchParams.set("status", params.status)

  const query = searchParams.toString()
  const url = `${API_BASE}/api/v1/applications/candidate/${candidateId}${query ? `?${query}` : ""}`

  const result = await fetchJson<{ data?: Application[] } | Application[]>(url)

  if (result.isErr()) return R.err(result.error)

  const parsed = result.value
  const apps = Array.isArray(parsed) ? parsed : (parsed?.data ?? [])
  return R.ok(apps)
}

export async function getApplicationsByJob(
  jobId: string,
  params?: GetApplicationsByJobParams
): Promise<Result<Application[], ApiError | NetworkError>> {
  const searchParams = new URLSearchParams()
  if (params?.page != null) searchParams.set("page", String(params.page))
  if (params?.limit != null) searchParams.set("limit", String(params.limit))
  if (params?.status) searchParams.set("status", params.status)

  const query = searchParams.toString()
  const url = `${API_BASE}/api/v1/applications/job/${jobId}${query ? `?${query}` : ""}`

  const result = await fetchJson<{ data?: Application[] } | Application[]>(url)

  if (result.isErr()) return R.err(result.error)

  const parsed = result.value
  const apps = Array.isArray(parsed) ? parsed : (parsed?.data ?? [])
  return R.ok(apps)
}

export async function createApplication(
  jobId: string,
  candidateId: string
): Promise<Result<Application, ApiError | NetworkError>> {
  return fetchJson<Application>(`${API_BASE}/api/v1/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jobId, candidateId }),
  })
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus
): Promise<Result<Application, ApiError | NetworkError>> {
  const result = await fetchJson<{ data?: Application } | Application>(
    `${API_BASE}/api/v1/applications/${id}/status`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }
  )

  if (result.isErr()) return R.err(result.error)

  const json = result.value
  const app = (
    json && typeof json === "object" && "data" in json ? (json as { data: Application }).data : json
  ) as Application
  return R.ok(app)
}

export async function getApplicationDetail(
  id: string
): Promise<Result<Application, ApiError | NetworkError>> {
  const result = await fetchJson<{ data?: Application } | Application>(
    `${API_BASE}/api/v1/applications/${id}`
  )

  if (result.isErr()) return R.err(result.error)

  const json = result.value
  const app = (
    json && typeof json === "object" && "data" in json ? (json as { data: Application }).data : json
  ) as Application
  return R.ok(app)
}

export type ApplicationsByOrganizationResponse = {
  data: Application[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export async function getApplicationsByOrganization(
  organizationId: string,
  params?: { page?: number; limit?: number }
): Promise<Result<ApplicationsByOrganizationResponse, ApiError | NetworkError>> {
  const searchParams = new URLSearchParams()
  if (params?.page != null) searchParams.set("page", String(params.page))
  if (params?.limit != null) searchParams.set("limit", String(params.limit))
  const query = searchParams.toString() ? `?${searchParams.toString()}` : ""

  const result = await fetchJson<{
    data?: Application[]
    total?: number
    page?: number
    limit?: number
    totalPages?: number
  }>(`${API_BASE}/api/v1/applications/organization/${organizationId}${query}`)

  if (result.isErr()) return R.err(result.error)

  const parsed = result.value
  return R.ok({
    data: parsed?.data ?? [],
    total: parsed?.total ?? 0,
    page: parsed?.page ?? 1,
    limit: parsed?.limit ?? 10,
    totalPages: parsed?.totalPages ?? 0,
  })
}
