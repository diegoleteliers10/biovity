import { Result as R, type Result } from "better-result"
import { ApiError, type NetworkError } from "@/lib/errors"
import { fetchJson, fetchNoContent, fetchWithFallback } from "@/lib/result"

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
  category?: string
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
  category?: string
}

export type JobsResponse = {
  data: Job[]
  total: number
  page: number
  limit: number
  totalPages: number
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
    benefits: (level2Obj.benefits as Job["benefits"]) ?? (level2 as Job).benefits,
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
): Promise<Result<JobsResponse, ApiError | NetworkError>> {
  const searchParams = new URLSearchParams()
  if (params?.organizationId) searchParams.set("organizationId", params.organizationId)
  if (params?.status) searchParams.set("status", params.status)
  if (params?.page != null) searchParams.set("page", String(params.page))
  if (params?.limit != null) searchParams.set("limit", String(params.limit))
  if (params?.search?.trim()) searchParams.set("search", params.search.trim())
  if (params?.category) searchParams.set("category", params.category)
  const query = searchParams.toString()
  const url = `${API_BASE}/api/v1/jobs${query ? `?${query}` : ""}`

  const result = await fetchJson<unknown>(url)

  if (result.isErr()) return R.err(result.error)

  const data = result.value as Record<string, unknown>
  const rawJobs = Array.isArray(data.data) ? (data.data as Job[]) : []
  return R.ok({
    data: rawJobs,
    total: typeof data.total === "number" ? data.total : rawJobs.length,
    page: typeof data.page === "number" ? data.page : 1,
    limit: typeof data.limit === "number" ? data.limit : (params?.limit ?? 10),
    totalPages: typeof data.totalPages === "number" ? data.totalPages : 1,
  })
}

export async function getJob(id: string): Promise<Result<Job, ApiError | NetworkError>> {
  const primaryUrl = `${API_BASE}/api/v1/jobs/${id}/with-applications`
  const fallbackUrl = `${API_BASE}/api/v1/jobs/${id}`

  const primaryResult = await fetchJson<unknown>(primaryUrl)

  if (primaryResult.isOk()) {
    const job = normalizeJobResponse(primaryResult.value)
    if (job && job.benefits && job.benefits.length > 0) {
      return R.ok(job)
    }
  }

  if (primaryResult.isErr()) {
    const fallbackResult = await fetchJson<unknown>(fallbackUrl)
    if (fallbackResult.isErr()) return R.err(fallbackResult.error)
    const job = normalizeJobResponse(fallbackResult.value)
    if (!job) return R.err(new ApiError({ status: 200, message: "Formato de respuesta inválido" }))
    return R.ok(job)
  }

  const job = normalizeJobResponse(primaryResult.value)
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

export type QuestionType =
  | "TEXT"
  | "TEXTAREA"
  | "NUMBER"
  | "SELECT"
  | "MULTISELECT"
  | "BOOLEAN"
  | "DATE"
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "multiselect"
  | "boolean"
  | "date"

export type QuestionStatus = "DRAFT" | "PUBLISHED" | "draft" | "published"

export type JobQuestion = {
  id: string
  jobId: string
  organizationId: string
  label: string
  placeholder?: string
  helperText?: string
  type: QuestionType
  options?: string[]
  required: boolean
  orderIndex: number
  status: QuestionStatus
  createdAt: string
  updatedAt: string
}

export async function getJobQuestions(
  jobId: string
): Promise<Result<JobQuestion[], ApiError | NetworkError>> {
  const result = await fetchJson<Record<string, unknown>>(
    `${API_BASE}/api/v1/jobs/${jobId}/questions`
  )
  if (result.isErr()) return R.err(result.error)

  const raw = result.value as {
    data?: unknown[] | { data?: unknown[] }
  }

  const rawQuestions = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.data)
      ? raw.data
      : Array.isArray((raw?.data as { data?: unknown[] } | undefined)?.data)
        ? ((raw.data as { data: unknown[] }).data ?? [])
        : []

  const normalizedQuestions = rawQuestions
    .filter((q): q is Record<string, unknown> => Boolean(q && typeof q === "object"))
    .map((q) => ({
      id: String(q.id ?? ""),
      jobId: String(q.jobId ?? ""),
      organizationId: String(q.organizationId ?? ""),
      label: String(q.label ?? ""),
      placeholder: typeof q.placeholder === "string" ? q.placeholder : undefined,
      helperText: typeof q.helperText === "string" ? q.helperText : undefined,
      type: String(q.type ?? "TEXT").toUpperCase() as JobQuestion["type"],
      options: Array.isArray(q.options)
        ? q.options.filter((o: unknown): o is string => typeof o === "string")
        : undefined,
      required: Boolean(q.required),
      orderIndex: Number.isFinite(Number(q.orderIndex)) ? Number(q.orderIndex) : 0,
      status: String(q.status ?? "DRAFT").toUpperCase() as JobQuestion["status"],
      createdAt: String(q.createdAt ?? ""),
      updatedAt: String(q.updatedAt ?? ""),
    }))
    .filter((q) => Boolean(q.id) && Boolean(q.label))

  return R.ok(normalizedQuestions)
}

export function formatJobLocation(loc: JobLocation | null | undefined): string {
  if (!loc) return ""
  if (loc.isRemote) return "Remoto"
  if (loc.isHybrid) return "Híbrido"
  const parts = [loc.city, loc.state, loc.country].filter(Boolean)
  return parts.join(", ")
}
