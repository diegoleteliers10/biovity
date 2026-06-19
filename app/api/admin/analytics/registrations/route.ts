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
  const period = searchParams.get("period") === "90" ? 90 : 30

  const result = await fetchJson<unknown>(
    `${API_BASE}/api/v1/admin/analytics/registrations?period=${period}`,
    { next: { revalidate: 120 } }
  )

  if (result.isErr()) {
    console.error("[admin/analytics/registrations] Error:", result.error)
    return NextResponse.json({ error: "Error al obtener trend de registros" }, { status: 500 })
  }

  // Dev triple: { data: { data: { data: [], totals: {} }, ts, path }, ts, path }
  // Prod double: { data: { data: [], totals: {} }, ts, path }
  const raw = result.value as Record<string, unknown>
  const candidates = [
    (raw.data as Record<string, unknown>)?.data as Record<string, unknown>,
    raw.data as Record<string, unknown>,
    raw,
  ]

  let payload: Record<string, unknown> | undefined
  for (const c of candidates) {
    if (c?.data && typeof c.data === "object" && !Array.isArray(c.data)) {
      const inner = (c.data as Record<string, unknown>)?.data
      const totals = (c.data as Record<string, unknown>)?.totals
      if (Array.isArray(inner) && totals) {
        payload = { data: inner, totals }
        break
      }
    }
    if (Array.isArray(c?.data)) {
      payload = c as Record<string, unknown>
      break
    }
  }

  if (!payload) {
    console.error("[admin/analytics/registrations] Formato inesperado:", result.value)
    return NextResponse.json({ error: "Formato inesperado" }, { status: 502 })
  }

  return NextResponse.json(payload)
}
