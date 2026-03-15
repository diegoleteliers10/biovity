const API_BASE =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"
    : process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

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

function getErrorMessage(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") return fallback
  const d = data as Record<string, unknown>
  const msg = d.message
  if (Array.isArray(msg)) return msg.join(". ") || fallback
  if (typeof msg === "string") return msg
  if (typeof d.error === "string") return d.error
  return fallback
}

export async function createOrganization(
  input: CreateOrganizationInput
): Promise<{ data: Organization } | { error: string }> {
  let res: Response
  try {
    res = await fetch(`${API_BASE}/api/v1/organizations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error de red" }
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    return { error: getErrorMessage(data, "Error al crear la organización") }
  }
  return { data: data as Organization }
}

export async function linkUserToOrganization(
  userId: string,
  organizationId: string
): Promise<{ data: unknown } | { error: string }> {
  let res: Response
  try {
    res = await fetch(`${API_BASE}/api/v1/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ organizationId }),
    })
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error de red" }
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    return { error: getErrorMessage(data, "Error al vincular usuario a la organización") }
  }
  return { data }
}
