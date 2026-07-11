import { Result as R } from "better-result"
import { type NextRequest, NextResponse } from "next/server"
import { auth, isAdminSession } from "@/lib/auth"
import { pool } from "@/lib/db"
import { DbError } from "@/lib/errors"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const { id } = await params
  const numericId = Number.parseInt(id, 10)
  if (Number.isNaN(numericId)) {
    return NextResponse.json({ error: "ID invalido" }, { status: 400 })
  }

  const body = await request.json()
  const isRead = typeof body.isRead === "boolean" ? body.isRead : undefined

  if (isRead === undefined) {
    return NextResponse.json({ error: "isRead debe ser un booleano" }, { status: 400 })
  }

  const result = await R.tryPromise({
    try: () =>
      pool.query("UPDATE contact_messages SET is_read = $1 WHERE id = $2", [isRead, numericId]),
    catch: (cause) => new DbError({ operation: "update_contact_read", cause }),
  })

  if (result.isErr()) {
    console.error("[admin/contact/read] Error:", result.error)
    return NextResponse.json({ error: "Error al actualizar mensaje" }, { status: 500 })
  }

  if (result.value.rowCount === 0) {
    return NextResponse.json({ error: "Mensaje no encontrado" }, { status: 404 })
  }

  return NextResponse.json({ success: true, isRead })
}
