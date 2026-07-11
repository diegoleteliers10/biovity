import { Result as R } from "better-result"
import { type NextRequest, NextResponse } from "next/server"
import { auth, isAdminSession } from "@/lib/auth"
import { pool } from "@/lib/db"
import { DbError } from "@/lib/errors"

export type WaitlistEntry = {
  id: number
  email: string
  role: string
  createdAt: string
}

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10))
  const limit = Math.min(50, Math.max(1, Number.parseInt(searchParams.get("limit") ?? "20", 10)))
  const search = searchParams.get("search")?.trim()
  const roleFilter = searchParams.get("role")?.trim()
  const offset = (page - 1) * limit

  const conditions: string[] = []
  const params: unknown[] = []
  let paramIndex = 1

  if (roleFilter === "professional" || roleFilter === "organization") {
    conditions.push(`role = $${paramIndex}`)
    params.push(roleFilter)
    paramIndex++
  }

  if (search) {
    conditions.push(`email ILIKE $${paramIndex}`)
    params.push(`%${search}%`)
    paramIndex++
  }

  const whereClause = conditions.length > 0 ? conditions.join(" AND ") : "TRUE"

  const countResult = await R.tryPromise({
    try: () =>
      pool.query<{ count: string }>(
        `SELECT COUNT(*)::text AS count FROM waitlist WHERE ${whereClause}`,
        params
      ),
    catch: (cause) => new DbError({ operation: "count_waitlist", cause }),
  })

  if (countResult.isErr()) {
    console.error("[admin/waitlist] Error:", countResult.error)
    return NextResponse.json({ error: "Error al obtener lista de espera" }, { status: 500 })
  }

  const total = Number.parseInt(countResult.value.rows[0]?.count ?? "0", 10)

  const result = await R.tryPromise({
    try: () =>
      pool.query<{
        id: number
        email: string
        role: string
        created_at: Date
      }>(
        `SELECT id, email, role, created_at
         FROM waitlist WHERE ${whereClause}
         ORDER BY created_at DESC
         LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
        [...params, limit, offset]
      ),
    catch: (cause) => new DbError({ operation: "list_waitlist", cause }),
  })

  if (result.isErr()) {
    console.error("[admin/waitlist] Error:", result.error)
    return NextResponse.json({ error: "Error al obtener lista de espera" }, { status: 500 })
  }

  const entries: WaitlistEntry[] = result.value.rows.map((row) => ({
    id: row.id,
    email: row.email,
    role: row.role,
    createdAt: row.created_at?.toISOString() ?? new Date().toISOString(),
  }))

  return NextResponse.json({
    data: entries,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  })
}
