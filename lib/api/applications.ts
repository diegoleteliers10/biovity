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

function getErrorMessage(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") return fallback
  const d = data as Record<string, unknown>
  const msg = d.message
  if (Array.isArray(msg)) return msg.join(". ") || fallback
  if (typeof msg === "string") return msg
  if (typeof d.error === "string") return d.error
  return fallback
}

export async function getApplicationsByCandidate(
  candidateId: string,
  params?: GetApplicationsByJobParams
): Promise<{ data: Application[] } | { error: string }> {
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
    return { error: err instanceof Error ? err.message : "Error de red" }
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    return { error: getErrorMessage(data, "Error al obtener las postulaciones") }
  }

  const parsed = data as { data?: Application[] } | Application[]
  const apps = Array.isArray(parsed) ? parsed : (parsed?.data ?? [])
  return { data: apps }
}

export async function getApplicationsByJob(
  jobId: string,
  params?: GetApplicationsByJobParams
): Promise<{ data: Application[] } | { error: string }> {
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
    return { error: err instanceof Error ? err.message : "Error de red" }
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    return { error: getErrorMessage(data, "Error al obtener las postulaciones") }
  }

  const parsed = data as { data?: Application[] } | Application[]
  const apps = Array.isArray(parsed) ? parsed : (parsed?.data ?? [])
  return { data: apps }
}

export async function createApplication(
  jobId: string,
  candidateId: string
): Promise<{ data: Application } | { error: string }> {
  let res: Response
  try {
    res = await fetch(`${API_BASE}/api/v1/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId, candidateId }),
    })
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error de red" }
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    return { error: getErrorMessage(data, "Error al postular") }
  }
  return { data: data as Application }
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus
): Promise<{ data: Application } | { error: string }> {
  let res: Response
  try {
    res = await fetch(`${API_BASE}/api/v1/applications/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error de red" }
  }

  const json = await res.json().catch(() => null)
  if (!res.ok) {
    return { error: getErrorMessage(json, "Error al actualizar el estado") }
  }
  const app = (json?.data ?? json) as Application
  return { data: app }
}

export async function getApplicationsByOrganization(
  organizationId: string,
  params?: { page?: number; limit?: number }
): Promise<
  | { data: Application[]; total: number; page: number; limit: number; totalPages: number }
  | { error: string }
> {
  let res: Response
  try {
    const searchParams = new URLSearchParams()
    if (params?.page != null) searchParams.set("page", String(params.page))
    if (params?.limit != null) searchParams.set("limit", String(params.limit))
    const query = searchParams.toString() ? `?${searchParams.toString()}` : ""
    res = await fetch(`${API_BASE}/api/v1/applications/organization/${organizationId}${query}`)
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error de red" }
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    return { error: getErrorMessage(data, "Error al obtener las postulaciones") }
  }

  const parsed = data as {
    data?: Application[]
    total?: number
    page?: number
    limit?: number
    totalPages?: number
  }
  return {
    data: parsed?.data ?? [],
    total: parsed?.total ?? 0,
    page: parsed?.page ?? 1,
    limit: parsed?.limit ?? 10,
    totalPages: parsed?.totalPages ?? 0,
  }
}
