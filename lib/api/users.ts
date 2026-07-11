import { Result as R, type Result } from "better-result"
import { ApiError, type NetworkError } from "@/lib/errors"
import { fetchJson } from "@/lib/result"

const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
    : (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")

export type UserLocation = {
  country?: string
  city?: string
}

export type UserOrganization = {
  id: string
  name: string
}

export type UserNotificationPreferences = {
  digest?: "immediate" | "daily" | "never"
  newApplications?: boolean
  interviews?: boolean
  messages?: boolean
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
  notificationPreferences: UserNotificationPreferences | null
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
  notificationPreferences?: UserNotificationPreferences
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
    (obj.data as Record<string, unknown>) ?? (obj.user as Record<string, unknown>) ?? obj

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
    const city =
      typeof l.city === "string" ? l.city : typeof l.ciudad === "string" ? l.ciudad : undefined
    const country =
      typeof l.country === "string" ? l.country : typeof l.pais === "string" ? l.pais : undefined
    location = { city, country }
    if (!location.city && !location.country) location = null
  } else if (typeof loc === "string" && loc.trim()) {
    const [city, country] = loc.split(",").map((s) => s.trim())
    location = { city: city || undefined, country: country || undefined }
  }

  const prefs = u.notificationPreferences ?? u.notification_preferences
  let notificationPreferences: UserNotificationPreferences | null = null
  if (prefs && typeof prefs === "object") {
    const p = prefs as Record<string, unknown>
    notificationPreferences = {
      digest:
        typeof p.digest === "string" ? (p.digest as "immediate" | "daily" | "never") : undefined,
      newApplications:
        p.newApplications !== undefined
          ? Boolean(p.newApplications)
          : p.new_applications !== undefined
            ? Boolean(p.new_applications)
            : undefined,
      interviews: p.interviews !== undefined ? Boolean(p.interviews) : undefined,
      messages: p.messages !== undefined ? Boolean(p.messages) : undefined,
    }
  }

  return {
    id,
    email: String(u.email ?? ""),
    name: String(u.name ?? ""),
    type: String(u.type ?? "professional"),
    isEmailVerified: Boolean(u.isEmailVerified ?? u.is_email_verified ?? false),
    isActive: Boolean(u.isActive ?? u.is_active ?? true),
    organizationId:
      (u.organizationId ?? u.organization_id)
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
      (u.birthday ?? u.date_of_birth) != null ? String(u.birthday ?? u.date_of_birth) : null,
    phone: (u.phone ?? u.phone_number) != null ? String(u.phone ?? u.phone_number) : null,
    location,
    notificationPreferences,
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
  // F8.1 — Filtros faceted
  profession?: string
  experienceLevel?: string
  city?: string
  country?: string
  availability?: string
  skills?: string
  minExperience?: number
  maxExperience?: number
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
): Promise<Result<UsersPaginatedResponse, ApiError | NetworkError>> {
  const searchParams = new URLSearchParams()
  if (params?.page != null) searchParams.set("page", String(params.page))
  if (params?.limit != null) searchParams.set("limit", String(params.limit))
  if (params?.type) searchParams.set("type", params.type)
  if (params?.isActive != null) searchParams.set("isActive", String(params.isActive))
  if (params?.search?.trim()) searchParams.set("search", params.search.trim())
  // F8.1 — Filtros faceted
  if (params?.profession?.trim()) searchParams.set("profession", params.profession.trim())
  if (params?.experienceLevel?.trim())
    searchParams.set("experienceLevel", params.experienceLevel.trim())
  if (params?.city?.trim()) searchParams.set("city", params.city.trim())
  if (params?.country?.trim()) searchParams.set("country", params.country.trim())
  if (params?.availability?.trim()) searchParams.set("availability", params.availability.trim())
  if (params?.skills?.trim()) searchParams.set("skills", params.skills.trim())
  if (params?.minExperience != null && params.minExperience > 0)
    searchParams.set("minExperience", String(params.minExperience))
  if (params?.maxExperience != null && params.maxExperience > 0)
    searchParams.set("maxExperience", String(params.maxExperience))

  const query = searchParams.toString()
  const url = `${API_BASE}/api/v1/users${query ? `?${query}` : ""}`

  const result = await fetchJson<{
    data?: User[]
    total?: number
    page?: number
    limit?: number
    totalPages?: number
  }>(url)

  if (result.isErr()) return R.err(result.error)

  const parsed = result.value
  const users = Array.isArray(parsed?.data) ? parsed.data : []
  return R.ok({
    data: users,
    total: typeof parsed?.total === "number" ? parsed.total : users.length,
    page: typeof parsed?.page === "number" ? parsed.page : 1,
    limit: typeof parsed?.limit === "number" ? parsed.limit : 10,
    totalPages: typeof parsed?.totalPages === "number" ? parsed.totalPages : 1,
  })
}

export async function getUser(id: string): Promise<Result<User, ApiError | NetworkError>> {
  const result = await fetchJson<unknown>(`${API_BASE}/api/v1/users/${id}`)

  if (result.isErr()) return R.err(result.error)

  const normalized = normalizeUser(result.value)
  if (!normalized) {
    return R.err(new ApiError({ status: 200, message: "Formato de respuesta inválido" }))
  }
  return R.ok(normalized)
}

export async function uploadAvatar(file: File): Promise<Result<string, ApiError | NetworkError>> {
  const formData = new FormData()
  formData.append("file", file)

  const result = await fetchJson<{ url?: string; error?: string }>("/api/upload/avatar", {
    method: "POST",
    body: formData,
  })

  if (result.isErr()) return R.err(result.error)

  const data = result.value
  if (data.error) return R.err(new ApiError({ status: 400, message: data.error }))
  if (!data.url) return R.err(new ApiError({ status: 400, message: "Error al subir la imagen" }))
  return R.ok(data.url)
}

export async function setUserActive(
  userId: string,
  isActive: boolean
): Promise<Result<{ success: true; isActive: boolean }, ApiError | NetworkError>> {
  const result = await fetchJson<{ error?: string }>(`/api/admin/users/${userId}/is-active`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isActive }),
  })

  if (result.isErr()) return R.err(result.error)

  const data = result.value
  if (data.error) return R.err(new ApiError({ status: 400, message: data.error }))
  return R.ok({ success: true, isActive })
}

export async function updateUser(
  id: string,
  input: UpdateUserInput
): Promise<Result<User, ApiError | NetworkError>> {
  return fetchJson<User>(`${API_BASE}/api/v1/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
}
