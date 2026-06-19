import { type NextRequest, NextResponse } from "next/server"
import { auth, isAdminSession } from "@/lib/auth"
import { fetchJson } from "@/lib/result"

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const result = await fetchJson<unknown>(`${API_BASE}/api/v1/admin/stats`, {
    next: { revalidate: 60 },
  })

  if (result.isErr()) {
    console.error("[admin/stats] Error:", result.error)
    return NextResponse.json({ error: "Error al obtener estadísticas" }, { status: 500 })
  }

  // Dev API: { data: { data: { users, waitlist, platform }, ... }, ... }
  // Prod API: { data: { users, waitlist, platform }, ... }
  const raw = result.value as Record<string, unknown>
  const candidates = [
    (raw.data as Record<string, unknown>)?.data as Record<string, unknown> | undefined,
    raw.data as Record<string, unknown> | undefined,
    raw as Record<string, unknown> | undefined,
  ]

  let stats: Record<string, unknown> | undefined
  for (const c of candidates) {
    if (c?.users && c?.waitlist && c?.platform) {
      stats = c
      break
    }
  }

  if (!stats) {
    console.error("[admin/stats] Formato inesperado:", result.value)
    return NextResponse.json({ error: "Formato de respuesta inesperado" }, { status: 502 })
  }

  return NextResponse.json(stats)
}
