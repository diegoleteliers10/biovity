import { Result as R } from "better-result"
import { type NextRequest, NextResponse } from "next/server"
import { auth, isAdminSession } from "@/lib/auth"
import { pool } from "@/lib/db"
import { DbError } from "@/lib/errors"
import { adminWaitlistEntryParamsSchema } from "@/lib/validations/admin-waitlist"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const entry = adminWaitlistEntryParamsSchema.safeParse(await params)

  if (!entry.success) {
    const reasons = entry.error.issues.map((issue) => issue.message).join(". ")
    return NextResponse.json({ error: reasons }, { status: 400 })
  }

  const result = await R.tryPromise({
    try: () => pool.query("DELETE FROM waitlist WHERE id = $1", [entry.data.id]),
    catch: (cause) => new DbError({ operation: "delete_waitlist_entry", cause }),
  })

  if (result.isErr()) {
    console.error("[admin/waitlist] Error:", result.error)
    return NextResponse.json({ error: "Error al eliminar entrada" }, { status: 500 })
  }

  if (result.value.rowCount === 0) {
    return NextResponse.json({ error: "Entrada no encontrada" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
