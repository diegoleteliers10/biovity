import { Result as R, type Result } from "better-result"
import type { ApiError, NetworkError } from "@/lib/errors"
import { fetchJson } from "@/lib/result"

const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
    : (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")

export type OrganizationMemberRole = "admin" | "recruiter" | "viewer"

export type OrganizationMember = {
  id: string
  organizationId: string
  userId: string
  role: OrganizationMemberRole
  createdAt: string
  updatedAt: string
  user?: {
    id: string
    name: string
    email: string
    avatar?: string | null
  }
}

export type AddMemberInput = {
  userId: string
  role: OrganizationMemberRole
}

function base(organizationId: string) {
  return `${API_BASE}/api/v1/organizations/${organizationId}/members`
}

export async function getOrganizationMembers(
  organizationId: string
): Promise<Result<OrganizationMember[], ApiError | NetworkError>> {
  const result = await fetchJson<{ data: OrganizationMember[] }>(base(organizationId))
  if (result.isErr()) return result
  return R.ok(result.value.data)
}

export async function addOrganizationMember(
  organizationId: string,
  input: AddMemberInput
): Promise<Result<OrganizationMember, ApiError | NetworkError>> {
  const result = await fetchJson<{ data: OrganizationMember }>(base(organizationId), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  if (result.isErr()) return result
  return R.ok(result.value.data)
}

export async function updateMemberRole(
  organizationId: string,
  memberId: string,
  role: OrganizationMemberRole
): Promise<Result<OrganizationMember, ApiError | NetworkError>> {
  const result = await fetchJson<{ data: OrganizationMember }>(
    `${base(organizationId)}/${memberId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    }
  )
  if (result.isErr()) return result
  return R.ok(result.value.data)
}

export async function removeMember(
  organizationId: string,
  memberId: string
): Promise<Result<void, ApiError | NetworkError>> {
  return fetchJson<void>(`${base(organizationId)}/${memberId}`, {
    method: "DELETE",
  })
}

export async function transferOrganizationOwnership(
  organizationId: string,
  newOwnerUserId: string
): Promise<Result<unknown, ApiError | NetworkError>> {
  const result = await fetchJson<{ data: unknown }>(
    `${API_BASE}/api/v1/organizations/${organizationId}/transfer`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newOwnerUserId }),
    }
  )
  if (result.isErr()) return result
  return R.ok(result.value.data)
}
