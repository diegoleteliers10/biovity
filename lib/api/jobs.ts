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

function getErrorMessage(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") return fallback
  const d = data as Record<string, unknown>
  const msg = d.message
  if (Array.isArray(msg)) return msg.join(". ") || fallback
  if (typeof msg === "string") return msg
  if (typeof d.error === "string") return d.error
  return fallback
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

export async function getJobsByOrganization(
  organizationId: string,
  params?: GetJobsByOrganizationParams
): Promise<{ data: JobsByOrganizationResponse } | { error: string }> {
  const searchParams = new URLSearchParams()
  if (params?.page != null) searchParams.set("page", String(params.page))
  if (params?.limit != null) searchParams.set("limit", String(params.limit))
  if (params?.status) searchParams.set("status", params.status)
  if (params?.search?.trim()) searchParams.set("search", params.search.trim())

  const query = searchParams.toString()
  const url = `${API_BASE}/api/v1/jobs/organization/${organizationId}${query ? `?${query}` : ""}`

  let res: Response
  try {
    res = await fetch(url)
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error de red" }
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    return { error: getErrorMessage(data, "Error al obtener los trabajos") }
  }

  const payload = data as JobsByOrganizationResponse
  return { data: payload }
}

export async function getJobs(
  params?: GetJobsParams
): Promise<{ data: Job[] } | { error: string }> {
  const searchParams = new URLSearchParams()
  if (params?.organizationId) searchParams.set("organizationId", params.organizationId)
  if (params?.status) searchParams.set("status", params.status)
  if (params?.page != null) searchParams.set("page", String(params.page))
  if (params?.limit != null) searchParams.set("limit", String(params.limit))
  if (params?.search?.trim()) searchParams.set("search", params.search.trim())
  const query = searchParams.toString()
  const url = `${API_BASE}/api/v1/jobs${query ? `?${query}` : ""}`

  let res: Response
  try {
    res = await fetch(url)
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error de red" }
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    return { error: getErrorMessage(data, "Error al obtener los trabajos") }
  }
  const jobs = Array.isArray(data) ? data : ((data as { data?: Job[] })?.data ?? [])
  return { data: jobs }
}

/** Extracts job from API response. API returns { data: job } or direct job. */
function normalizeJobResponse(raw: unknown): Job | null {
  if (!raw || typeof raw !== "object") return null
  const obj = raw as Record<string, unknown>
  const job = (obj.data as Job) ?? (obj as Job)
  if (!job || typeof job !== "object" || !job.id) return null
  return job
}

export async function getJob(id: string): Promise<{ data: Job } | { error: string }> {
  const url = `${API_BASE}/api/v1/jobs/${id}`

  let res: Response
  try {
    res = await fetch(url)
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error de red" }
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    return { error: getErrorMessage(data, "Error al obtener el trabajo") }
  }

  const job = normalizeJobResponse(data)
  if (!job) return { error: "Formato de respuesta inválido" }
  return { data: job }
}

export async function createJob(input: CreateJobInput): Promise<{ data: Job } | { error: string }> {
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

  let res: Response
  try {
    res = await fetch(`${API_BASE}/api/v1/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error de red" }
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    return { error: getErrorMessage(data, "Error al crear el trabajo") }
  }
  return { data: data as Job }
}

export type UpdateJobInput = Partial<
  Omit<CreateJobInput, "organizationId"> & { organizationId?: string }
>

export async function updateJob(
  id: string,
  input: UpdateJobInput
): Promise<{ data: Job } | { error: string }> {
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

  let res: Response
  try {
    res = await fetch(`${API_BASE}/api/v1/jobs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error de red" }
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    return { error: getErrorMessage(data, "Error al actualizar el trabajo") }
  }
  return { data: data as Job }
}

export async function deleteJob(id: string): Promise<{ data?: void } | { error: string }> {
  let res: Response
  try {
    res = await fetch(`${API_BASE}/api/v1/jobs/${id}`, {
      method: "DELETE",
    })
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error de red" }
  }

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    return { error: getErrorMessage(data, "Error al eliminar el trabajo") }
  }
  return { data: undefined }
}

export function formatJobLocation(loc: JobLocation | null | undefined): string {
  if (!loc) return ""
  if (loc.isRemote) return "Remoto"
  if (loc.isHybrid) return "Híbrido"
  const parts = [loc.city, loc.state, loc.country].filter(Boolean)
  return parts.join(", ")
}
