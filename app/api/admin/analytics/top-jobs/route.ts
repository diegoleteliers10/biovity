import { type NextRequest, NextResponse } from "next/server"
import { auth, isAdminSession } from "@/lib/auth"
import { fetchJson } from "@/lib/result"

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const limit = Math.min(50, Math.max(1, Number.parseInt(searchParams.get("limit") ?? "10", 10)))

  const result = await fetchJson<unknown>(
    `${API_BASE}/api/v1/admin/analytics/top-jobs?limit=${limit}`,
    { next: { revalidate: 120 } }
  )

  if (result.isErr()) {
    console.error("[admin/analytics/top-jobs] Error:", result.error)
    return NextResponse.json({ error: "Error al obtener top jobs" }, { status: 500 })
  }

  // Dev: { data: { data: { data: [...] } }, ts, path }
  // Prod: { data: { data: [...] }, ts, path }
  const raw = result.value as Record<string, unknown>
  const candidates = [
    (
      ((raw.data as Record<string, unknown>)?.data as Record<string, unknown>)?.data as Record<
        string,
        unknown
      >
    )?.data,
    ((raw.data as Record<string, unknown>)?.data as Record<string, unknown>)?.data,
    (raw.data as Record<string, unknown>)?.data,
  ]

  let payload: Record<string, unknown> | undefined
  for (const c of candidates) {
    if (Array.isArray(c)) {
      payload = { data: c }
      break
    }
    if (c && typeof c === "object" && !Array.isArray(c) && (c as Record<string, unknown>).data) {
      const inner = (c as Record<string, unknown>).data
      if (Array.isArray(inner)) {
        payload = { data: inner }
        break
      }
    }
  }

  if (!payload) {
    console.error("[admin/analytics/top-jobs] Formato inesperado:", result.value)
    return NextResponse.json({ error: "Formato inesperado" }, { status: 502 })
  }

  return NextResponse.json(payload)
}
