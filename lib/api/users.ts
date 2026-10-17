import { Result as R, type Result } from "better-result"
import { ApiError, type NetworkError } from "@/lib/errors"
import { fetchJson, fetchJsonWithSession } from "@/lib/result"
import {
  type CandidateAvailability,
  type CandidateSeniority,
  candidateAvailabilityValues,
  candidateSeniorityValues,
} from "./talent-search"

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
  digest?: "none" | "immediate" | "daily" | "weekly"
  channels?: {
    email?: boolean
    in_app?: boolean
  }
  events?: {
    application?: boolean
    interview?: boolean
    message?: boolean
    job_alert?: boolean
    system?: boolean
  }
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
  experienceLevel?: CandidateSeniority | null
  availability?: CandidateAvailability | null
  birthday: string | null
  phone: string | null
  location: UserLocation | null
  notificationPreferences: UserNotificationPreferences | null
  createdAt: string
  updatedAt: string
  skills?: string[]
}

export type UpdateUserInput = {
  name?: string
  type?: "professional" | "organization" | "admin"
  isActive?: boolean
  avatar?: string
  profession?: string
  experienceLevel?: CandidateSeniority | null
  availability?: CandidateAvailability | null
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
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
    const channels = isRecord(p.channels) ? p.channels : undefined
    const events = isRecord(p.events) ? p.events : undefined
    notificationPreferences = {
      digest:
        p.digest === "none" ||
        p.digest === "immediate" ||
        p.digest === "daily" ||
        p.digest === "weekly"
          ? p.digest
          : undefined,
      channels: channels
        ? {
            email: typeof channels.email === "boolean" ? channels.email : undefined,
            in_app: typeof channels.in_app === "boolean" ? channels.in_app : undefined,
          }
        : undefined,
      events: events
        ? {
            application: typeof events.application === "boolean" ? events.application : undefined,
            interview: typeof events.interview === "boolean" ? events.interview : undefined,
            message: typeof events.message === "boolean" ? events.message : undefined,
            job_alert: typeof events.job_alert === "boolean" ? events.job_alert : undefined,
            system: typeof events.system === "boolean" ? events.system : undefined,
          }
        : undefined,
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
    experienceLevel: candidateSeniorityValues.find((value) => value === u.experienceLevel) ?? null,
    availability: candidateAvailabilityValues.find((value) => value === u.availability) ?? null,
    birthday:
      (u.birthday ?? u.date_of_birth) != null ? String(u.birthday ?? u.date_of_birth) : null,
    phone: (u.phone ?? u.phone_number) != null ? String(u.phone ?? u.phone_number) : null,
    location,
    notificationPreferences,
    createdAt: String(u.createdAt ?? u.created_at ?? ""),
    updatedAt: String(u.updatedAt ?? u.updated_at ?? ""),
    skills: Array.isArray(u.skills) ? (u.skills as string[]) : undefined,
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
  experienceLevel?: CandidateSeniority
  city?: string
  country?: string
  availability?: CandidateAvailability
  skills?: string
  minExperience?: number
  maxExperience?: number
  sort?: "recientes" | "antiguos" | "nombre-az" | "nombre-za"
}

const USER_SORT_TO_API: Record<NonNullable<GetUsersParams["sort"]>, string> = {
  recientes: "createdAt:desc",
  antiguos: "createdAt:asc",
  "nombre-az": "name:asc",
  "nombre-za": "name:desc",
}

export type UsersPaginatedResponse = {
  data: User[]
  total: number
  page: number
  limit: number
  totalPages: number
}

type UsersApiResponse = {
  data?: User[]
  total?: number
  page?: number
  limit?: number
  totalPages?: number
}

export async function getUsers(
  params?: GetUsersParams,
  requestHeaders?: Headers
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
  if (params?.sort) searchParams.set("sort", USER_SORT_TO_API[params.sort])

  const query = searchParams.toString()
  const url = `${API_BASE}/api/v1/users${query ? `?${query}` : ""}`

  const result = requestHeaders
    ? await fetchJsonWithSession<UsersApiResponse>(url, requestHeaders)
    : await fetchJson<UsersApiResponse>(url)

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

export async function getUser(
  id: string,
  requestHeaders?: Headers
): Promise<Result<User, ApiError | NetworkError>> {
  const url = `${API_BASE}/api/v1/users/${id}`
  const result = requestHeaders
    ? await fetchJsonWithSession<unknown>(url, requestHeaders)
    : await fetchJson<unknown>(url)

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
): Promise<
  Result<
    { success: true; isActive: boolean; sessionRevocationPending?: boolean; message?: string },
    ApiError | NetworkError
  >
> {
  const result = await fetchJson<{
    error?: string
    sessionRevocationPending?: boolean
    message?: string
  }>(`/api/admin/users/${userId}/is-active`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isActive }),
  })

  if (result.isErr()) return R.err(result.error)

  const data = result.value
  if (data.error) return R.err(new ApiError({ status: 400, message: data.error }))
  return R.ok({
    success: true,
    isActive,
    sessionRevocationPending: result.value.sessionRevocationPending,
    message: result.value.message,
  })
}

export async function updateUser(
  id: string,
  input: UpdateUserInput,
  requestHeaders?: Headers
): Promise<Result<User, ApiError | NetworkError>> {
  const url = `${API_BASE}/api/v1/users/${id}`
  const options = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  }
  const result = requestHeaders
    ? await fetchJsonWithSession<unknown>(url, requestHeaders, options)
    : await fetchJson<unknown>(url, options)
  if (result.isErr()) return R.err(result.error)
  const user = normalizeUser(result.value)
  return user
    ? R.ok(user)
    : R.err(new ApiError({ status: 200, message: "Formato de usuario inválido" }))
}
