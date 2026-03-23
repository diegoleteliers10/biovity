import { type NextRequest, NextResponse } from "next/server"
import { auth, isAdminSession } from "@/lib/auth"
import { pool } from "@/lib/db"

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

export type AdminStats = {
  users: {
    total: number
    professionals: number
    organizations: number
    active: number
    inactive: number
    recentCount: number
  }
  waitlist: {
    total: number
    professionals: number
    organizations: number
  }
  platform: {
    jobs: number | null
    organizations: number | null
    applications: number | null
    apiHealthy: boolean
  }
}

async function fetchExternalCount(
  path: string,
  limit = 1000
): Promise<{ count: number; ok: boolean }> {
  try {
    const url = `${API_BASE}${path}${path.includes("?") ? "&" : "?"}limit=${limit}`
    const res = await fetch(url, { next: { revalidate: 60 } })
    if (!res.ok) return { count: 0, ok: false }
    const data = (await res.json().catch(() => null)) as unknown[] | { data?: unknown[] } | null
    const arr = Array.isArray(data) ? data : (data?.data ?? [])
    return { count: arr.length, ok: true }
  } catch {
    return { count: 0, ok: false }
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })
    if (!isAdminSession(session)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const [userStats, waitlistStats, jobsRes, orgsRes, appsRes, healthRes] = await Promise.all([
      pool.query<{
        total: string
        professionals: string
        organizations: string
        active: string
        inactive: string
        recent: string
      }>(`
          SELECT
            COUNT(*)::text AS total,
            COUNT(*) FILTER (WHERE type = 'professional')::text AS professionals,
            COUNT(*) FILTER (WHERE type = 'organization')::text AS organizations,
            COUNT(*) FILTER (WHERE "isActive" = true)::text AS active,
            COUNT(*) FILTER (WHERE "isActive" = false)::text AS inactive,
            COUNT(*) FILTER (WHERE "createdAt" >= NOW() - INTERVAL '7 days')::text AS recent
          FROM "user"
          WHERE type != 'admin'
        `),
      pool.query<{
        total: string
        professionals: string
        organizations: string
      }>(`
          SELECT
            COUNT(*)::text AS total,
            COUNT(*) FILTER (WHERE role = 'professional')::text AS professionals,
            COUNT(*) FILTER (WHERE role = 'organization')::text AS organizations
          FROM waitlist
        `),
      fetchExternalCount("/api/v1/jobs"),
      fetchExternalCount("/api/v1/organizations"),
      fetchExternalCount("/api/v1/applications"),
      fetch(`${API_BASE}/api/v1/health`, { next: { revalidate: 60 } }).then((r) => r.ok),
    ])

    const ur = userStats.rows[0]
    const wr = waitlistStats.rows[0]

    const stats: AdminStats = {
      users: {
        total: Number.parseInt(ur?.total ?? "0", 10),
        professionals: Number.parseInt(ur?.professionals ?? "0", 10),
        organizations: Number.parseInt(ur?.organizations ?? "0", 10),
        active: Number.parseInt(ur?.active ?? "0", 10),
        inactive: Number.parseInt(ur?.inactive ?? "0", 10),
        recentCount: Number.parseInt(ur?.recent ?? "0", 10),
      },
      waitlist: {
        total: Number.parseInt(wr?.total ?? "0", 10),
        professionals: Number.parseInt(wr?.professionals ?? "0", 10),
        organizations: Number.parseInt(wr?.organizations ?? "0", 10),
      },
      platform: {
        jobs: jobsRes.ok ? jobsRes.count : null,
        organizations: orgsRes.ok ? orgsRes.count : null,
        applications: appsRes.ok ? appsRes.count : null,
        apiHealthy: healthRes,
      },
    }

    return NextResponse.json(stats)
  } catch (err) {
    console.error("[admin/stats] Error:", err)
    return NextResponse.json({ error: "Error al obtener estadísticas" }, { status: 500 })
  }
}
