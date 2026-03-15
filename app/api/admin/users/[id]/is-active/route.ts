import { type NextRequest, NextResponse } from "next/server"
import { auth, isAdminSession } from "@/lib/auth"
import { pool } from "@/lib/db"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })
    if (!isAdminSession(session)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const { id: userId } = await params
    const body = await request.json()
    const isActive = typeof body.isActive === "boolean" ? body.isActive : undefined

    if (isActive === undefined) {
      return NextResponse.json(
        { error: "isActive debe ser un booleano" },
        { status: 400 }
      )
    }

    const result = await pool.query<{ id: string }>(
      `UPDATE "user" SET "isActive" = $1, "updatedAt" = now() WHERE id = $2 RETURNING id`,
      [isActive, userId]
    )

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true, isActive })
  } catch (err) {
    console.error("[admin/users/is-active] Error:", err)
    return NextResponse.json(
      { error: "Error al actualizar el estado del usuario" },
      { status: 500 }
    )
  }
}
