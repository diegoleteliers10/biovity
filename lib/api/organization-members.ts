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
  const members: OrganizationMember[] = []
  let page = 1
  let totalPages = 1
  while (page <= totalPages) {
    const result = await fetchJson<unknown>(`${base(organizationId)}?page=${page}&limit=100`)
    if (result.isErr()) return R.err(result.error)
    const root = result.value
    if (!root || typeof root !== "object") break
    const envelope = root as Record<string, unknown>
    const payload = envelope.data
    const response =
      payload && typeof payload === "object" && !Array.isArray(payload)
        ? (payload as Record<string, unknown>)
        : envelope
    if (!Array.isArray(response.data)) break
    members.push(...(response.data as OrganizationMember[]))
    totalPages = typeof response.totalPages === "number" ? response.totalPages : page
    page += 1
  }
  const ownerResult = await fetchJson<unknown>(`${base(organizationId)}/owner`)
  if (ownerResult.isErr()) return R.err(ownerResult.error)
  const ownerEnvelope = ownerResult.value
  const ownerPayload =
    ownerEnvelope && typeof ownerEnvelope === "object"
      ? (ownerEnvelope as Record<string, unknown>).data
      : null
  const owner =
    ownerPayload && typeof ownerPayload === "object"
      ? (ownerPayload as { id?: string; name?: string; email?: string })
      : undefined
  if (owner?.id && !members.some((member) => member.userId === owner?.id)) {
    members.push({
      id: `owner-${owner.id}`,
      organizationId,
      userId: owner.id,
      role: "admin",
      createdAt: "",
      updatedAt: "",
      user: {
        id: owner.id,
        name: owner.name ?? owner.email ?? "Dueño",
        email: owner.email ?? "",
      },
    })
  }
  return R.ok([...new Map(members.map((member) => [member.userId, member])).values()])
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
  if (result.isErr()) return R.err(result.error)
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
  if (result.isErr()) return R.err(result.error)
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
  if (result.isErr()) return R.err(result.error)
  return R.ok(result.value.data)
}
