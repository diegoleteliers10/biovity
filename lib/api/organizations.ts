import { Result as R, type Result } from "better-result"
import { ApiError, NetworkError } from "@/lib/errors"
import { fetchJson } from "@/lib/result"

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

export type UpdateOrganizationInput = {
  name?: string
  website?: string
  phone?: string
  address?: OrganizationAddress
}

export type Organization = {
  id: string
  name: string
  website: string | null
  phone: string | null
  address: OrganizationAddress | null
  createdAt: string
  updatedAt: string
  subscriptionId: string | null
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
  id: string
): Promise<Result<Organization, ApiError | NetworkError>> {
  const result = await fetchJson<unknown>(`${API_BASE}/api/v1/organizations/${id}`)

  if (result.isErr()) return R.err(result.error)

  const organization = normalizeOrganization(result.value)
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
