import { Result as R, type Result } from "better-result"
import { ApiError, NetworkError } from "@/lib/errors"
import { getErrorMessage } from "@/lib/result"

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

  let res: Response
  try {
    res = await fetch(url)
  } catch (err) {
    return R.err(
      new NetworkError({
        message: err instanceof Error ? err.message : "Error de red",
        cause: err,
      })
    )
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    return R.err(
      new ApiError({
        status: res.status,
        statusText: res.statusText,
        body: data,
        message: getErrorMessage(data, "Error al obtener las postulaciones"),
      })
    )
  }

  const parsed = data as { data?: Application[] } | Application[]
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

  let res: Response
  try {
    res = await fetch(url)
  } catch (err) {
    return R.err(
      new NetworkError({
        message: err instanceof Error ? err.message : "Error de red",
        cause: err,
      })
    )
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    return R.err(
      new ApiError({
        status: res.status,
        statusText: res.statusText,
        body: data,
        message: getErrorMessage(data, "Error al obtener las postulaciones"),
      })
    )
  }

  const parsed = data as { data?: Application[] } | Application[]
  const apps = Array.isArray(parsed) ? parsed : (parsed?.data ?? [])
  return R.ok(apps)
}

export async function createApplication(
  jobId: string,
  candidateId: string
): Promise<Result<Application, ApiError | NetworkError>> {
  let res: Response
  try {
    res = await fetch(`${API_BASE}/api/v1/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId, candidateId }),
    })
  } catch (err) {
    return R.err(
      new NetworkError({
        message: err instanceof Error ? err.message : "Error de red",
        cause: err,
      })
    )
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    return R.err(
      new ApiError({
        status: res.status,
        statusText: res.statusText,
        body: data,
        message: getErrorMessage(data, "Error al postular"),
      })
    )
  }
  return R.ok(data as Application)
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus
): Promise<Result<Application, ApiError | NetworkError>> {
  let res: Response
  try {
    res = await fetch(`${API_BASE}/api/v1/applications/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
  } catch (err) {
    return R.err(
      new NetworkError({
        message: err instanceof Error ? err.message : "Error de red",
        cause: err,
      })
    )
  }

  const json = await res.json().catch(() => null)
  if (!res.ok) {
    return R.err(
      new ApiError({
        status: res.status,
        statusText: res.statusText,
        body: json,
        message: getErrorMessage(json, "Error al actualizar el estado"),
      })
    )
  }
  const app = (json?.data ?? json) as Application
  return R.ok(app)
}

export async function getApplicationDetail(
  id: string
): Promise<Result<Application, ApiError | NetworkError>> {
  let res: Response
  try {
    res = await fetch(`${API_BASE}/api/v1/applications/${id}`)
  } catch (err) {
    return R.err(
      new NetworkError({
        message: err instanceof Error ? err.message : "Error de red",
        cause: err,
      })
    )
  }

  const json = await res.json().catch(() => null)
  if (!res.ok) {
    return R.err(
      new ApiError({
        status: res.status,
        statusText: res.statusText,
        body: json,
        message: getErrorMessage(json, "Error al obtener la postulación"),
      })
    )
  }
  const app = (json?.data ?? json) as Application
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
  let res: Response
  try {
    const searchParams = new URLSearchParams()
    if (params?.page != null) searchParams.set("page", String(params.page))
    if (params?.limit != null) searchParams.set("limit", String(params.limit))
    const query = searchParams.toString() ? `?${searchParams.toString()}` : ""
    res = await fetch(`${API_BASE}/api/v1/applications/organization/${organizationId}${query}`)
  } catch (err) {
    return R.err(
      new NetworkError({
        message: err instanceof Error ? err.message : "Error de red",
        cause: err,
      })
    )
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    return R.err(
      new ApiError({
        status: res.status,
        statusText: res.statusText,
        body: data,
        message: getErrorMessage(data, "Error al obtener las postulaciones"),
      })
    )
  }

  const parsed = data as {
    data?: Application[]
    total?: number
    page?: number
    limit?: number
    totalPages?: number
  }
  return R.ok({
    data: parsed?.data ?? [],
    total: parsed?.total ?? 0,
    page: parsed?.page ?? 1,
    limit: parsed?.limit ?? 10,
    totalPages: parsed?.totalPages ?? 0,
  })
}
