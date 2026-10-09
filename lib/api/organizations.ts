import { Result as R, type Result } from "better-result"
import { ApiError, type NetworkError } from "@/lib/errors"
import { fetchJson, fetchJsonWithSession } from "@/lib/result"

const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
    : (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")

export type OrganizationAddress = {
  street?: string
  city?: string
  state?: string
  country?: string
  zipCode?: string
}

export type CreateOrganizationInput = {
  name: string
  website?: string
  phone?: string
  address?: OrganizationAddress
}

export type OrganizationIntegrations = {
  slackWebhookUrl?: string
  discordWebhookUrl?: string
  enabled?: boolean
}

export type UpdateOrganizationInput = {
  name?: string
  website?: string
  phone?: string
  address?: OrganizationAddress
  integrations?: OrganizationIntegrations
  logo?: string
  description?: string
  industry?: string
  size?: string
  foundedYear?: number
  linkedinUrl?: string
  twitterUrl?: string
}

export type Organization = {
  id: string
  name: string
  website: string | null
  phone: string | null
  address: OrganizationAddress | null
  integrations: OrganizationIntegrations | null
  logo: string | null
  description: string | null
  industry: string | null
  size: string | null
  slug?: string | null
  foundedYear?: number | null
  linkedinUrl?: string | null
  twitterUrl?: string | null
  subscriptionId: string | null
  createdAt: string
  updatedAt: string
}

/** Public company profile served by GET /organizations/public endpoints. */
export type PublicOrganization = {
  id: string
  name: string
  slug?: string
  website: string
  logo?: string
  description?: string
  industry?: string
  size?: string
  foundedYear?: number
  linkedinUrl?: string
  twitterUrl?: string
  location?: {
    city?: string
    state?: string
    country?: string
  }
  activeJobsCount: number
  createdAt: string
}

export type GetPublicOrganizationsParams = {
  page?: number
  limit?: number
}

export type PublicOrganizationsResponse = {
  data: PublicOrganization[]
  total: number
  page: number
  limit: number
  totalPages: number
}

function normalizeOrganization(raw: unknown): Organization | null {
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

  return level2 as Organization
}

export async function getOrganization(
  id: string,
  requestHeaders?: Headers
): Promise<Result<Organization, ApiError | NetworkError>> {
  const url = `${API_BASE}/api/v1/organizations/${id}`
  const result = requestHeaders
    ? await fetchJsonWithSession<unknown>(url, requestHeaders)
    : await fetchJson<unknown>(url)

  if (result.isErr()) return R.err(result.error)

  const organization = normalizeOrganization(result.value)
  if (!organization) {
    return R.err(new ApiError({ status: 200, message: "Formato de respuesta inválido" }))
  }
  return R.ok(organization)
}

function normalizePublicOrganization(raw: unknown): PublicOrganization | null {
  if (!raw || typeof raw !== "object") return null
  const obj = raw as Record<string, unknown>
  const level1: unknown = obj.data ?? obj
  if (!level1 || typeof level1 !== "object") return null
  const org = level1 as Record<string, unknown>
  const id = String(org.id ?? "")
  if (!id) return null
  return {
    id,
    name: String(org.name ?? ""),
    slug: typeof org.slug === "string" ? org.slug : undefined,
    website: String(org.website ?? ""),
    logo: typeof org.logo === "string" ? org.logo : undefined,
    description: typeof org.description === "string" ? org.description : undefined,
    industry: typeof org.industry === "string" ? org.industry : undefined,
    size: typeof org.size === "string" ? org.size : undefined,
    foundedYear: typeof org.foundedYear === "number" ? org.foundedYear : undefined,
    linkedinUrl: typeof org.linkedinUrl === "string" ? org.linkedinUrl : undefined,
    twitterUrl: typeof org.twitterUrl === "string" ? org.twitterUrl : undefined,
    location:
      org.location && typeof org.location === "object"
        ? (org.location as PublicOrganization["location"])
        : undefined,
    activeJobsCount: typeof org.activeJobsCount === "number" ? org.activeJobsCount : 0,
    createdAt: String(org.createdAt ?? ""),
  }
}

export async function getPublicOrganization(
  slugOrId: string
): Promise<Result<PublicOrganization, ApiError | NetworkError>> {
  const url = `${API_BASE}/api/v1/organizations/public/${encodeURIComponent(slugOrId)}`
  const result = await fetchJson<unknown>(url)
  if (result.isErr()) return R.err(result.error)
  const organization = normalizePublicOrganization(result.value)
  if (!organization) {
    return R.err(new ApiError({ status: 200, message: "Formato de respuesta inválido" }))
  }
  return R.ok(organization)
}

export async function createOrganization(
  input: CreateOrganizationInput
): Promise<Result<Organization, ApiError | NetworkError>> {
  return fetchJson<Organization>(`${API_BASE}/api/v1/organizations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
}

export async function getPublicOrganizations(
  params?: GetPublicOrganizationsParams
): Promise<Result<PublicOrganizationsResponse, ApiError | NetworkError>> {
  const searchParams = new URLSearchParams()
  if (params?.page != null) searchParams.set("page", String(params.page))
  if (params?.limit != null) searchParams.set("limit", String(params.limit))
  const query = searchParams.toString()
  const url = `${API_BASE}/api/v1/organizations/public${query ? `?${query}` : ""}`
  const result = await fetchJson<unknown>(url)
  if (result.isErr()) return R.err(result.error)

  const data = result.value as Record<string, unknown>
  const rawOrganizations = Array.isArray(data.data) ? data.data : []
  const organizations = rawOrganizations
    .map(normalizePublicOrganization)
    .filter((org): org is PublicOrganization => Boolean(org))
  return R.ok({
    data: organizations,
    total: typeof data.total === "number" ? data.total : organizations.length,
    page: typeof data.page === "number" ? data.page : 1,
    limit: typeof data.limit === "number" ? data.limit : (params?.limit ?? 20),
    totalPages: typeof data.totalPages === "number" ? data.totalPages : 1,
  })
}

export async function updateOrganization(
  id: string,
  input: UpdateOrganizationInput
): Promise<Result<Organization, ApiError | NetworkError>> {
  return fetchJson<Organization>(`${API_BASE}/api/v1/organizations/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
}

export async function uploadOrganizationLogo(
  file: File
): Promise<Result<string, ApiError | NetworkError>> {
  const formData = new FormData()
  formData.append("file", file)

  const result = await fetchJson<{ url?: string; error?: string }>(
    "/api/upload/organization-logo",
    {
      method: "POST",
      body: formData,
    }
  )

  if (result.isErr()) return R.err(result.error)

  const data = result.value
  if (data.error) return R.err(new ApiError({ status: 400, message: data.error }))
  if (!data.url) return R.err(new ApiError({ status: 400, message: "Error al subir la imagen" }))
  return R.ok(data.url)
}

export async function linkUserToOrganization(
  userId: string,
  organizationId: string
): Promise<Result<unknown, ApiError | NetworkError>> {
  return fetchJson<unknown>(`${API_BASE}/api/v1/users/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ organizationId }),
  })
}
