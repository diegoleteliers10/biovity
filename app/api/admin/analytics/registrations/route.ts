import { type NextRequest, NextResponse } from "next/server"
import { auth, isAdminSession } from "@/lib/auth"
import { fetchJson } from "@/lib/result"

const API_BASE =
  process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const period = searchParams.get("period") === "90" ? 90 : 30

  const result = await fetchJson<RegistrationsTrendResponse>(
    `${API_BASE}/api/v1/admin/analytics/registrations?period=${period}`,
    { next: { revalidate: 120 } },
  )

  if (result.isErr()) {
    console.error("[admin/analytics/registrations] Error:", result.error)
    return NextResponse.json(
      { error: "Error al obtener trend de registros" },
      { status: 500 },
    )
  }

  const wrapped = result.value as unknown as {
    data?: { data?: unknown; [key: string]: unknown }
    [key: string]: unknown
  }
  const inner = wrapped.data
  const payload = inner?.data as
    | { data?: unknown; totals?: unknown; [key: string]: unknown }
    | undefined

  if (!payload) {
    return NextResponse.json({ error: "Formato inesperado" }, { status: 502 })
  }

  return NextResponse.json(payload)
}

interface RegistrationsTrendResponse {
  data: Array<{ date: string; professionals: number; organizations: number }>
  totals: { professionals: number; organizations: number }
}