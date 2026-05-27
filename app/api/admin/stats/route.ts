import { type NextRequest, NextResponse } from "next/server"
import { auth, isAdminSession } from "@/lib/auth"
import { fetchJson } from "@/lib/result"

const API_BASE =
  process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

export type AdminStats = {
  users: {
    total: number
    professionals: number
    organizations: number
    active: number
    inactive: number
    recentCount: number
    recentTrend: number
  }
  waitlist: {
    total: number
    professionals: number
    organizations: number
  }
  platform: {
    activeJobs: number
    totalApplications: number
    totalOrganizations: number
  }
}

interface AdminStatsResponse {
  users: {
    total: number
    professionals: number
    organizations: number
    active: number
    inactive: number
    recentCount: number
    recentTrend: number
  }
  waitlist: {
    total: number
    professionals: number
    organizations: number
  }
  platform: {
    activeJobs: number
    totalApplications: number
    totalOrganizations: number
  }
}

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const result = await fetchJson<AdminStatsResponse>(
    `${API_BASE}/api/v1/admin/stats`,
    { next: { revalidate: 60 } },
  )

  if (result.isErr()) {
    console.error("[admin/stats] Error:", result.error)
    return NextResponse.json(
      { error: "Error al obtener estadísticas" },
      { status: 500 },
    )
  }

  // NestJS envuelve en: { data: { data: { users, waitlist, platform }, timestamp, path }, timestamp, path }
  // necesitamos extraer stats = data.data.data
  const wrapped = result.value as unknown as {
    data?: {
      data?: {
        users?: unknown
        waitlist?: unknown
        platform?: unknown
        [key: string]: unknown
      }
      [key: string]: unknown
    }
    [key: string]: unknown
  }
  const middle = wrapped.data
  const stats = middle?.data as
    | { users?: unknown; waitlist?: unknown; platform?: unknown; [key: string]: unknown }
    | undefined

  if (!stats || !stats.users || !stats.waitlist || !stats.platform) {
    console.error("[admin/stats] Formato inesperado:", result.value)
    return NextResponse.json(
      { error: "Formato de respuesta inesperado" },
      { status: 502 },
    )
  }

  return NextResponse.json(stats)
}