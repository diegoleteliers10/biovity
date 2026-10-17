import { Result as R } from "better-result"
import { type NextRequest, NextResponse } from "next/server"
import { auth, isAdminSession } from "@/lib/auth"
import { pool } from "@/lib/db"
import { DbError } from "@/lib/errors"
import { z } from "zod"

const uuidSchema = z.string().uuid()

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: request.headers })
  const actorUserId = session?.user?.id
  if (!isAdminSession(session) || !actorUserId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }
  const { id } = await params
  if (!uuidSchema.safeParse(id).success) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 })
  }

  const result = await R.tryPromise({
    try: () =>
      pool.query(
        `WITH eligible AS (
           SELECT id, attempts, last_error
           FROM email_outbox
           WHERE id = $1::uuid AND status = 'dead'
             AND html IS NOT NULL AND expires_at > now()
           FOR UPDATE
         ), retried AS (
           UPDATE email_outbox AS email
           SET status = 'pending', attempts = 0,
               available_at = now(), locked_at = NULL, last_error = NULL
           FROM eligible
           WHERE email.id = eligible.id
           RETURNING email.id, eligible.attempts, eligible.last_error
         ), audited AS (
           INSERT INTO email_outbox_admin_retry
             (email_outbox_id, actor_user_id, previous_attempts, previous_error)
           SELECT id, $2::uuid, attempts, last_error FROM retried
           RETURNING email_outbox_id
         )
         SELECT count(*)::integer AS retried_count FROM audited`,
        [id, actorUserId]
      ),
    catch: (cause) => new DbError({ operation: "retry_dead_email", cause }),
  })
  if (result.isErr()) {
    console.error("[admin/email-outbox] retry failed", result.error)
    return NextResponse.json({ error: "No se pudo reintentar el correo" }, { status: 500 })
  }
  if (result.value.rows[0]?.retried_count !== 1) {
    return NextResponse.json(
      { error: "El correo expiró o ya no se puede reintentar" },
      { status: 409 }
    )
  }
  return NextResponse.json({ success: true })
}
