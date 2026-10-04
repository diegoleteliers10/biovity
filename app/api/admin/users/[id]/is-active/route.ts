import { Result as R } from "better-result"
import { type NextRequest, NextResponse } from "next/server"
import { auth, isAdminSession } from "@/lib/auth"
import { pool } from "@/lib/db"
import { DbError } from "@/lib/errors"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const { id: userId } = await params
  const parsed = await R.tryPromise(() => request.json())
  if (parsed.isErr()) {
    return NextResponse.json({ error: "El cuerpo debe ser JSON válido" }, { status: 400 })
  }
  const body: unknown = parsed.value
  const isActive =
    body && typeof body === "object" && "isActive" in body && typeof body.isActive === "boolean"
      ? body.isActive
      : undefined

  if (isActive === undefined) {
    return NextResponse.json({ error: "isActive debe ser un booleano" }, { status: 400 })
  }

  const result = await R.tryPromise({
    try: () =>
      pool.query<{ id: string }>(
        `WITH updated_user AS (
           UPDATE "user" SET "isActive" = $1, "updatedAt" = now()
           WHERE id = $2 RETURNING id
         ), revoked_sessions AS (
           DELETE FROM "session" USING updated_user
           WHERE "session".user_id = updated_user.id AND $1 = false
           RETURNING "session".id
         )
         SELECT id FROM updated_user`,
        [isActive, userId]
      ),
    catch: (cause) => new DbError({ operation: "update_user_active", cause }),
  })

  if (result.isErr()) {
    console.error("[admin/users/is-active] Error:", result.error)
    return NextResponse.json(
      { error: "Error al actualizar el estado del usuario" },
      { status: 500 }
    )
  }

  if (result.value.rowCount === 0) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
  }

  return NextResponse.json({ success: true, isActive })
}
