import { Result as R } from "better-result"
import { type NextRequest, NextResponse } from "next/server"
import { auth, isAdminSession } from "@/lib/auth"
import { pool } from "@/lib/db"
import { DbError } from "@/lib/errors"

const ALLOWED_TYPES = ["professional", "organization", "admin"]

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const { id: userId } = await params
  const body = await request.json()

  const updates: string[] = []
  const values: unknown[] = []
  let paramIndex = 1

  if (body.name !== undefined) {
    updates.push(`"name" = $${paramIndex}`)
    values.push(String(body.name))
    paramIndex++
  }

  if (body.type !== undefined) {
    if (!ALLOWED_TYPES.includes(body.type)) {
      return NextResponse.json(
        { error: `Tipo invalido. Debe ser: ${ALLOWED_TYPES.join(", ")}` },
        { status: 400 }
      )
    }
    updates.push(`"type" = $${paramIndex}`)
    values.push(body.type)
    paramIndex++
  }

  if (updates.length === 0) {
    return NextResponse.json({ error: "No hay campos para actualizar" }, { status: 400 })
  }

  updates.push(`"updatedAt" = now()`)
  values.push(userId)

  const result = await R.tryPromise({
    try: () =>
      pool.query(`UPDATE "user" SET ${updates.join(", ")} WHERE id = $${paramIndex}`, values),
    catch: (cause) => new DbError({ operation: "update_user", cause }),
  })

  if (result.isErr()) {
    console.error("[admin/users/id] Error:", result.error)
    return NextResponse.json({ error: "Error al actualizar usuario" }, { status: 500 })
  }

  if (result.value.rowCount === 0) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
