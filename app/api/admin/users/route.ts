import { Result as R } from "better-result"
import { type NextRequest, NextResponse } from "next/server"
import { auth, isAdminSession } from "@/lib/auth"
import { NetworkError } from "@/lib/errors"
import { getErrorMessage } from "@/lib/result"

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

  const resResult = await R.tryPromise({
    try: () =>
      fetch(`${API_BASE}/api/v1/users?${query.toString()}`, {
        headers: { cookie: request.headers.get("cookie") ?? "" },
      }),
    catch: (cause) =>
      new NetworkError({
        message: cause instanceof Error ? cause.message : "Network error",
        cause,
      }),
  })

  if (resResult.isErr()) {
    console.error("[admin/users] Error:", resResult.error)
    return NextResponse.json({ error: "Error al obtener los usuarios" }, { status: 500 })
  }

  const res = resResult.value
  let data: unknown = null
  try {
    data = await res.json()
  } catch {
    data = null
  }

  if (!res.ok) {
    const status = res.status === 401 ? 403 : res.status
    return NextResponse.json(
      { error: getErrorMessage(data, "Error al obtener los usuarios") },
      { status }
    )
  }

  const body = data as {
    data?: BackendUser[]
    total?: number
    page?: number
    limit?: number
    totalPages?: number
  }

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
