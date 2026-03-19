const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
    : (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")

export type UserLocation = {
  city?: string
  country?: string
}

export type UserOrganization = {
  id: string
  name: string
}

export type User = {
  id: string
  email: string
  name: string
  type: string
  isEmailVerified: boolean
  isActive: boolean
  organizationId: string | null
  organization?: UserOrganization
  avatar: string | null
  profession: string | null
  birthday: string | null
  phone: string | null
  location: UserLocation | null
  createdAt: string
  updatedAt: string
}

export type UpdateUserInput = {
  name?: string
  type?: string
  avatar?: string
  profession?: string
  phone?: string
  birthday?: string
  location?: UserLocation
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

export function formatUserLocation(loc: UserLocation | null): string {
  if (!loc) return ""
  const parts = [loc.city, loc.country].filter(Boolean)
  return parts.join(", ")
}

function normalizeUser(raw: unknown): User | null {
  if (!raw || typeof raw !== "object") return null
  const obj = raw as Record<string, unknown>

  let userObj: unknown =
    (obj.data as Record<string, unknown>) ??
    (obj.user as Record<string, unknown>) ??
    obj

  if (userObj && typeof userObj === "object") {
    const u = userObj as Record<string, unknown>
    if (u.data && typeof u.data === "object") userObj = u.data
  }

  if (!userObj || typeof userObj !== "object") return null

  const u = userObj as Record<string, unknown>
  const id = String(u.id ?? "")
  if (!id) return null

  const loc = u.location
  let location: UserLocation | null = null
  if (loc && typeof loc === "object") {
    const l = loc as Record<string, unknown>
    location = {
      city: typeof l.city === "string" ? l.city : undefined,
      country: typeof l.country === "string" ? l.country : undefined,
    }
    if (!location.city && !location.country) location = null
  } else if (typeof loc === "string" && loc.trim()) {
    const [city, country] = loc.split(",").map((s) => s.trim())
    location = { city: city || undefined, country: country || undefined }
  }

  return {
    id,
    email: String(u.email ?? ""),
    name: String(u.name ?? ""),
    type: String(u.type ?? "professional"),
    isEmailVerified: Boolean(u.isEmailVerified ?? u.is_email_verified ?? false),
    isActive: Boolean(u.isActive ?? u.is_active ?? true),
    organizationId:
      u.organizationId ?? u.organization_id
        ? String(u.organizationId ?? u.organization_id)
        : null,
    organization:
      u.organization && typeof u.organization === "object"
        ? {
            id: String((u.organization as Record<string, unknown>).id ?? ""),
            name: String((u.organization as Record<string, unknown>).name ?? ""),
          }
        : undefined,
    avatar: u.avatar != null ? String(u.avatar) : null,
    profession: u.profession != null ? String(u.profession) : null,
    birthday:
      (u.birthday ?? u.date_of_birth) != null
        ? String(u.birthday ?? u.date_of_birth)
        : null,
    phone:
      (u.phone ?? u.phone_number) != null
        ? String(u.phone ?? u.phone_number)
        : null,
    location,
    createdAt: String(u.createdAt ?? u.created_at ?? ""),
    updatedAt: String(u.updatedAt ?? u.updated_at ?? ""),
  }
}

export type GetUsersParams = {
  page?: number
  limit?: number
  type?: "professional" | "organization"
  isActive?: boolean
  search?: string
}

export type UsersPaginatedResponse = {
  data: User[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export async function getUsers(
  params?: GetUsersParams
): Promise<{ data: UsersPaginatedResponse } | { error: string }> {
  const searchParams = new URLSearchParams()
  if (params?.page != null) searchParams.set("page", String(params.page))
  if (params?.limit != null) searchParams.set("limit", String(params.limit))
  if (params?.type) searchParams.set("type", params.type)
  if (params?.isActive != null) searchParams.set("isActive", String(params.isActive))
  if (params?.search?.trim()) searchParams.set("search", params.search.trim())

  const query = searchParams.toString()
  const url = `${API_BASE}/api/v1/users${query ? `?${query}` : ""}`

  let res: Response
  try {
    res = await fetch(url)
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error de red" }
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    return { error: getErrorMessage(data, "Error al obtener los usuarios") }
  }

  const parsed = data as {
    data?: User[]
    total?: number
    page?: number
    limit?: number
    totalPages?: number
  }
  const users = Array.isArray(parsed?.data) ? parsed.data : []
  return {
    data: {
      data: users,
      total: typeof parsed?.total === "number" ? parsed.total : users.length,
      page: typeof parsed?.page === "number" ? parsed.page : 1,
      limit: typeof parsed?.limit === "number" ? parsed.limit : 10,
      totalPages: typeof parsed?.totalPages === "number" ? parsed.totalPages : 1,
    },
  }
}

export async function getUser(id: string): Promise<{ data: User } | { error: string }> {
  let res: Response
  try {
    res = await fetch(`${API_BASE}/api/v1/users/${id}`)
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error de red" }
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    return { error: getErrorMessage(data, "Error al obtener el usuario") }
  }

  const normalized = normalizeUser(data)
  if (!normalized) {
    return { error: "Formato de respuesta inválido" }
  }
  return { data: normalized }
}

export async function uploadAvatar(file: File): Promise<{ data: string } | { error: string }> {
  const formData = new FormData()
  formData.append("file", file)

  let res: Response
  try {
    res = await fetch("/api/upload/avatar", { method: "POST", body: formData })
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error de red" }
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    return { error: (data as { error?: string })?.error ?? "Error al subir la imagen" }
  }
  return { data: (data as { url: string }).url }
}

export async function setUserActive(
  userId: string,
  isActive: boolean
): Promise<{ success: true; isActive: boolean } | { error: string }> {
  try {
    const res = await fetch(`/api/admin/users/${userId}/is-active`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    })
    const data = await res.json().catch(() => null)
    if (!res.ok) {
      return { error: (data as { error?: string })?.error ?? "Error al actualizar el estado" }
    }
    return { success: true, isActive }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error de red" }
  }
}

export async function updateUser(
  id: string,
  input: UpdateUserInput
): Promise<{ data: User } | { error: string }> {
  let res: Response
  try {
    res = await fetch(`${API_BASE}/api/v1/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error de red" }
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    return { error: getErrorMessage(data, "Error al actualizar el usuario") }
  }
  return { data: data as User }
}
