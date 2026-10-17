import { type NextRequest, NextResponse } from "next/server"
import type {
  AdminChatPage,
  AdminLegacyChatSummary,
  AdminVerifiedOrganization,
} from "@/lib/api/admin-chats"
import { auth, isAdminSession } from "@/lib/auth"
import { fetchJsonWithSession } from "@/lib/result"

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

type UnknownRecord = Record<string, unknown>

function isRecord(value: unknown): value is UnknownRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value)
}

function isParticipant(value: unknown): value is AdminLegacyChatSummary["recruiter"] {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.email === "string"
  )
}

function isLegacyChat(value: unknown): value is AdminLegacyChatSummary {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.createdAt === "string" &&
    (typeof value.updatedAt === "string" || value.updatedAt === null) &&
    isParticipant(value.recruiter) &&
    isParticipant(value.professional)
  )
}

function isVerifiedOrganization(value: unknown): value is AdminVerifiedOrganization {
  return isRecord(value) && typeof value.id === "string" && typeof value.name === "string"
}

function hasPageShape<T>(
  value: unknown,
  isItem: (item: unknown) => item is T
): value is AdminChatPage<T> {
  return (
    isRecord(value) &&
    Array.isArray(value.data) &&
    value.data.every(isItem) &&
    typeof value.total === "number" &&
    typeof value.page === "number" &&
    typeof value.limit === "number" &&
    typeof value.totalPages === "number"
  )
}

function findPayload<T>(raw: unknown, isPayload: (value: unknown) => value is T): T | null {
  let candidate = raw
  for (let depth = 0; depth < 4; depth += 1) {
    if (isPayload(candidate)) return candidate
    if (!isRecord(candidate) || !("data" in candidate)) return null
    candidate = candidate.data
  }
  return null
}

function pageParameters(
  request: NextRequest
): { page: number; limit: number; search: string | null } | null {
  const pageText = request.nextUrl.searchParams.get("page") ?? "1"
  const limitText = request.nextUrl.searchParams.get("limit") ?? "20"
  const page = Number(pageText)
  const limit = Number(limitText)
  const search = request.nextUrl.searchParams.get("search")
  if (
    !Number.isInteger(page) ||
    page < 1 ||
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > 50 ||
    (search !== null && search.length > 100)
  ) {
    return null
  }
  return { page, limit, search }
}

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const pagination = pageParameters(request)
  if (!pagination) {
    return NextResponse.json({ error: "Filtros inválidos" }, { status: 400 })
  }

  const resource = request.nextUrl.searchParams.get("resource")
  if (resource && resource !== "verified-organizations") {
    return NextResponse.json({ error: "Recurso inválido" }, { status: 400 })
  }

  const query = new URLSearchParams({
    page: String(pagination.page),
    limit: String(pagination.limit),
  })
  if (pagination.search) query.set("search", pagination.search)
  const endpoint =
    resource === "verified-organizations" ? `verified-organizations?${query}` : `?${query}`
  const result = await fetchJsonWithSession<unknown>(
    `${API_BASE}/api/v1/admin/legacy-chats${endpoint}`,
    request.headers
  )

  if (result.isErr()) {
    console.error("[admin/chats] Error:", result.error)
    return NextResponse.json({ error: "Error al obtener chats para revisión" }, { status: 500 })
  }

  const payload =
    resource === "verified-organizations"
      ? findPayload(result.value, (value): value is AdminChatPage<AdminVerifiedOrganization> =>
          hasPageShape(value, isVerifiedOrganization)
        )
      : findPayload(result.value, (value): value is AdminChatPage<AdminLegacyChatSummary> =>
          hasPageShape(value, isLegacyChat)
        )
  if (!payload) {
    return NextResponse.json({ error: "Formato de respuesta inválido" }, { status: 502 })
  }

  return NextResponse.json(payload)
}
