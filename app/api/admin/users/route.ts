import { type NextRequest, NextResponse } from "next/server"
import { auth, isAdminSession } from "@/lib/auth"
import { pool } from "@/lib/db"

export type AdminUser = {
  id: string
  email: string
  name: string
  type: string
  isActive: boolean
  createdAt: string
}

export async function GET(request: NextRequest) {
  try {
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
    const offset = (page - 1) * limit

    let whereClause = `type != $1`
    const params: unknown[] = ["admin"]
    let paramIndex = 2

    if (typeFilter === "professional" || typeFilter === "organization") {
      whereClause += ` AND type = $${paramIndex}`
      params.push(typeFilter)
      paramIndex++
    }
    if (isActiveFilter === "true" || isActiveFilter === "false") {
      whereClause += ` AND "isActive" = $${paramIndex}`
      params.push(isActiveFilter === "true")
      paramIndex++
    }
    if (search) {
      whereClause += ` AND (email ILIKE $${paramIndex} OR name ILIKE $${paramIndex})`
      params.push(`%${search}%`)
      paramIndex++
    }

    const countResult = await pool.query<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM "user" WHERE ${whereClause}`,
      params
    )
    const total = Number.parseInt(countResult.rows[0]?.count ?? "0", 10)

    params.push(limit, offset)
    const result = await pool.query<{
      id: string
      email: string
      name: string
      type: string
      isActive: boolean
      createdAt: Date
    }>(
      `SELECT id, email, name, type, "isActive", "createdAt"
       FROM "user" WHERE ${whereClause}
       ORDER BY "createdAt" DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      params
    )

    const users: AdminUser[] = result.rows.map((row) => ({
      id: row.id,
      email: row.email,
      name: row.name ?? "",
      type: row.type ?? "professional",
      isActive: row.isActive ?? true,
      createdAt: row.createdAt?.toISOString() ?? new Date().toISOString(),
    }))

    return NextResponse.json({
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (err) {
    console.error("[admin/users] Error:", err)
    return NextResponse.json({ error: "Error al obtener los usuarios" }, { status: 500 })
  }
}
