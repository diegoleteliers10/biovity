import { Result as R } from "better-result"
import { type NextRequest, NextResponse } from "next/server"
import { auth, isAdminSession } from "@/lib/auth"
import { pool } from "@/lib/db"
import { DbError } from "@/lib/errors"

export type ContactMessage = {
  id: number
  nombre: string
  apellido: string
  email: string
  telefono: string | null
  empresa: string
  mensaje: string
  isRead: boolean
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
  const offset = (page - 1) * limit

  let whereClause = "TRUE"
  const params: unknown[] = []
  let paramIndex = 1

  if (search) {
    whereClause = `(email ILIKE $${paramIndex} OR nombre ILIKE $${paramIndex} OR apellido ILIKE $${paramIndex} OR empresa ILIKE $${paramIndex})`
    params.push(`%${search}%`)
    paramIndex++
  }

  const countResult = await R.tryPromise({
    try: () =>
      pool.query<{ count: string }>(
        `SELECT COUNT(*)::text AS count FROM contact_messages WHERE ${whereClause}`,
        params
      ),
    catch: (cause) => new DbError({ operation: "count_contact_messages", cause }),
  })

  if (countResult.isErr()) {
    console.error("[admin/contact] Error:", countResult.error)
    return NextResponse.json({ error: "Error al obtener mensajes de contacto" }, { status: 500 })
  }

  const total = Number.parseInt(countResult.value.rows[0]?.count ?? "0", 10)

  const result = await R.tryPromise({
    try: () =>
      pool.query<{
        id: number
        nombre: string
        apellido: string
        email: string
        telefono: string | null
        empresa: string
        mensaje: string
        is_read: boolean
        created_at: Date
      }>(
        `SELECT id, nombre, apellido, email, telefono, empresa, mensaje, is_read, created_at
         FROM contact_messages WHERE ${whereClause}
         ORDER BY created_at DESC
         LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
        [...params, limit, offset]
      ),
    catch: (cause) => new DbError({ operation: "list_contact_messages", cause }),
  })

  if (result.isErr()) {
    console.error("[admin/contact] Error:", result.error)
    return NextResponse.json({ error: "Error al obtener mensajes de contacto" }, { status: 500 })
  }

  const messages: ContactMessage[] = result.value.rows.map((row) => ({
    id: row.id,
    nombre: row.nombre,
    apellido: row.apellido,
    email: row.email,
    telefono: row.telefono,
    empresa: row.empresa,
    mensaje: row.mensaje,
    isRead: row.is_read,
    createdAt: row.created_at?.toISOString() ?? new Date().toISOString(),
  }))

  return NextResponse.json({
    data: messages,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  })
}
