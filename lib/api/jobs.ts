import { Result as R, type Result } from "better-result"
import { ApiError, NetworkError } from "@/lib/errors"
import { fetchJson, fetchNoContent, fetchWithFallback, getErrorMessage } from "@/lib/result"

const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
    : (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")

export type JobSalary = {
  min?: number
  max?: number
  currency?: string
  period?: string
  isNegotiable?: boolean
}

export type JobLocation = {
  city?: string
  state?: string
  country?: string
  isRemote?: boolean
  isHybrid?: boolean
}

export type JobBenefit = {
  tipo?: string
  title: string
  description?: string
}

/** Benefit format for create/update payload (tipo + label) */
export type JobBenefitInput = {
  tipo: string
  label: string
}

export type JobOrganization = {
  id: string
  name: string
}

export type Job = {
  id: string
  organizationId: string
  organization?: JobOrganization
  title: string
  description: string
  employmentType: string
  experienceLevel: string
  salary?: JobSalary
  location?: JobLocation
  benefits?: JobBenefit[]
  status: string
  applicationsCount?: number
  views?: number
  expiresAt?: string
  createdAt: string
  updatedAt: string
}

export type CreateJobInput = {
  organizationId: string
  title: string
  description: string
  employmentType: string
  experienceLevel: string
  salary?: JobSalary
  location?: JobLocation
  benefits?: JobBenefitInput[]
  status?: string
  expiresAt?: string
}

export type GetJobsParams = {
  organizationId?: string
  status?: string
  page?: number
  limit?: number
  search?: string
}

export type GetJobsByOrganizationParams = {
  page?: number
  limit?: number
  status?: string
  search?: string
}

export type JobsByOrganizationResponse = {
  data: Job[]
  total: number
  page: number
  limit: number
  totalPages: number
}

/** Extracts job from API response. API returns { data: job } or direct job. */
function normalizeJobResponse(raw: unknown): Job | null {
  if (!raw || typeof raw !== "object") return null
  const obj = raw as Record<string, unknown>

  const level1: unknown = obj.data ?? obj
  if (!level1 || typeof level1 !== "object") return null

  const level1Obj = level1 as Record<string, unknown>
  const level2: unknown = level1Obj.data ?? level1Obj
  if (!level2 || typeof level2 !== "object") return null

  const level2Obj = level2 as Record<string, unknown>
  const id = String(level2Obj.id ?? "")
  if (!id) return null

  const numberCandidates: unknown[] = [
    level2Obj.applicationsCount,
    level2Obj.applications_count,
    level2Obj.postulationsCount,
    level2Obj.postulacionesCount,
    level2Obj.totalApplications,
    level2Obj.totalPostulaciones,
  ]

  let normalizedApplicationsCount: number | undefined
  for (const candidate of numberCandidates) {
    if (typeof candidate === "number" && Number.isFinite(candidate)) {
      normalizedApplicationsCount = candidate
      break
    }
    if (typeof candidate === "string") {
      const parsed = Number(candidate)
      if (Number.isFinite(parsed)) {
        normalizedApplicationsCount = parsed
        break
      }
    }
  }

  if (normalizedApplicationsCount == null && Array.isArray(level2Obj.applications)) {
    normalizedApplicationsCount = level2Obj.applications.length
  }
  if (normalizedApplicationsCount == null && Array.isArray(level2Obj.postulaciones)) {
    normalizedApplicationsCount = level2Obj.postulaciones.length
  }

  return {
    ...(level2 as Job),
    applicationsCount: normalizedApplicationsCount ?? (level2 as Job).applicationsCount,
  }
}

export async function getJobsByOrganization(
  organizationId: string,
  params?: GetJobsByOrganizationParams
): Promise<Result<JobsByOrganizationResponse, ApiError | NetworkError>> {
  const searchParams = new URLSearchParams()
  if (params?.page != null) searchParams.set("page", String(params.page))
  if (params?.limit != null) searchParams.set("limit", String(params.limit))
  if (params?.status) searchParams.set("status", params.status)
  if (params?.search?.trim()) searchParams.set("search", params.search.trim())

  const query = searchParams.toString()
  const url = `${API_BASE}/api/v1/jobs/organization/${organizationId}${query ? `?${query}` : ""}`

  return fetchJson<JobsByOrganizationResponse>(url)
}

export async function getJobs(
  params?: GetJobsParams
): Promise<Result<Job[], ApiError | NetworkError>> {
  const searchParams = new URLSearchParams()
  if (params?.organizationId) searchParams.set("organizationId", params.organizationId)
  if (params?.status) searchParams.set("status", params.status)
  if (params?.page != null) searchParams.set("page", String(params.page))
  if (params?.limit != null) searchParams.set("limit", String(params.limit))
  if (params?.search?.trim()) searchParams.set("search", params.search.trim())
  const query = searchParams.toString()
  const url = `${API_BASE}/api/v1/jobs${query ? `?${query}` : ""}`

  const result = await fetchJson<unknown>(url)

  if (result.isErr()) return R.err(result.error)

  const data = result.value
  const jobs = Array.isArray(data) ? (data as Job[]) : ((data as { data?: Job[] })?.data ?? [])
  return R.ok(jobs)
}

export async function getJob(id: string): Promise<Result<Job, ApiError | NetworkError>> {
  const withApplicationsUrl = `${API_BASE}/api/v1/jobs/${id}/with-applications`
  const fallbackUrl = `${API_BASE}/api/v1/jobs/${id}`

  const result = await fetchWithFallback<unknown>(withApplicationsUrl, fallbackUrl)

  if (result.isErr()) return R.err(result.error)

  const job = normalizeJobResponse(result.value)
  if (!job) return R.err(new ApiError({ status: 200, message: "Formato de respuesta inválido" }))
  return R.ok(job)
}

export async function createJob(
  input: CreateJobInput
): Promise<Result<Job, ApiError | NetworkError>> {
  const { benefits, ...rest } = input
  const body = {
    ...rest,
    benefits: benefits?.length
      ? benefits.map((b) => ({ tipo: b.tipo, title: b.label }))
      : undefined,
    salary: input.salary
      ? {
          ...input.salary,
          isNegotiable: input.salary.isNegotiable ? 1 : 0,
        }
      : undefined,
    location: input.location
      ? {
          ...input.location,
          isRemote: input.location.isRemote ? 1 : 0,
          isHybrid: input.location.isHybrid ? 1 : 0,
        }
      : undefined,
  }

  return fetchJson<Job>(`${API_BASE}/api/v1/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

export type UpdateJobInput = Partial<
  Omit<CreateJobInput, "organizationId"> & { organizationId?: string }
>

export async function updateJob(
  id: string,
  input: UpdateJobInput
): Promise<Result<Job, ApiError | NetworkError>> {
  const { benefits, ...rest } = input
  const body = {
    ...rest,
    benefits: benefits?.length
      ? benefits.map((b) => ({ tipo: b.tipo, title: b.label }))
      : undefined,
    salary: input.salary
      ? {
          ...input.salary,
          isNegotiable: input.salary.isNegotiable ? 1 : 0,
        }
      : undefined,
    location: input.location
      ? {
          ...input.location,
          isRemote: input.location.isRemote ? 1 : 0,
          isHybrid: input.location.isHybrid ? 1 : 0,
        }
      : undefined,
  }

  return fetchJson<Job>(`${API_BASE}/api/v1/jobs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

export async function deleteJob(id: string): Promise<Result<void, ApiError | NetworkError>> {
  return fetchNoContent(`${API_BASE}/api/v1/jobs/${id}`, {
    method: "DELETE",
  })
}

export function formatJobLocation(loc: JobLocation | null | undefined): string {
  if (!loc) return ""
  if (loc.isRemote) return "Remoto"
  if (loc.isHybrid) return "Híbrido"
  const parts = [loc.city, loc.state, loc.country].filter(Boolean)
  return parts.join(", ")
}
