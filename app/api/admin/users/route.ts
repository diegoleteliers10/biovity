import { type NextRequest, NextResponse } from "next/server"
import { auth, isAdminSession } from "@/lib/auth"
import { fetchJson } from "@/lib/result"

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

export type AdminUser = {
  id: string
  email: string
  name: string
  type: string
  isActive: boolean
  createdAt: string
}

type BackendUser = {
  id: string
  email: string
  name?: string | null
  type?: string
  isActive?: boolean
  createdAt?: string
}

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10))
  const limit = Math.min(50, Math.max(1, Number.parseInt(searchParams.get("limit") ?? "20", 10)))
  const typeFilter = searchParams.get("type")
  const isActiveFilter = searchParams.get("isActive")
  const search = searchParams.get("search")?.trim()

  const query = new URLSearchParams()
  query.set("page", String(page))
  query.set("limit", String(limit))
  if (typeFilter === "professional" || typeFilter === "organization") {
    query.set("type", typeFilter)
  }
  if (isActiveFilter === "true" || isActiveFilter === "false") {
    query.set("isActive", isActiveFilter)
  }
  if (search) query.set("search", search)

  const result = await fetchJson<{
    data?: BackendUser[]
    total?: number
    page?: number
    limit?: number
    totalPages?: number
  }>(`${API_BASE}/api/v1/users?${query.toString()}`)

  if (result.isErr()) {
    const err = result.error
    const status =
      err._tag === "ApiError" && err.status === 401
        ? 403
        : err._tag === "ApiError"
          ? err.status
          : 500
    console.error("[admin/users] Error:", err)
    return NextResponse.json({ error: err.message }, { status })
  }

  const body = result.value
  const users: AdminUser[] = (body.data ?? [])
    .filter((u) => u.type !== "admin")
    .map((u) => ({
      id: u.id,
      email: u.email ?? "",
      name: u.name ?? "",
      type: u.type ?? "professional",
      isActive: u.isActive ?? true,
      createdAt: u.createdAt ?? new Date().toISOString(),
    }))

  return NextResponse.json({
    data: users,
    total: body.total ?? 0,
    page: body.page ?? page,
    limit: body.limit ?? limit,
    totalPages: body.totalPages ?? Math.ceil((body.total ?? 0) / limit),
  })
}
