import { Result } from "better-result"
import { NextResponse } from "next/server"
import { getServerSession, isAdminSession } from "@/lib/auth"
import { pool } from "@/lib/db"

export async function POST(request: Request) {
  if (request.headers.get("content-type") !== "application/json") {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 415 })
  }
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return NextResponse.json({ error: "Origen inválido" }, { status: 403 })
  }

  const session = await getServerSession()
  if (!session?.user?.id || !session.session.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const result = await Result.tryPromise({
    try: () =>
      pool.query<{ topic: string; expiresAt: Date }>(
        `WITH expired AS (
         SELECT id FROM private.realtime_user_channel WHERE expires_at <= now() LIMIT 500
       ), cleanup AS (
         DELETE FROM private.realtime_user_channel WHERE id IN (SELECT id FROM expired)
       ), active AS (
         SELECT active_session.id, active_session.user_id
         FROM public.session AS active_session
         JOIN public."user" AS app_user ON app_user.id = active_session.user_id
         WHERE active_session.id = $1::uuid AND app_user.id = $2::uuid
           AND active_session.expires_at > now() AND app_user."isActive" IS TRUE
       ), admin_grants AS (
         UPDATE private.realtime_user_channel AS channel SET is_admin = $3::boolean
         FROM active WHERE active.id = channel.session_id AND active.user_id = channel.user_id
         AND channel.expires_at > now()
       ), existing AS (
         SELECT channel.topic_id, channel.expires_at
         FROM private.realtime_user_channel AS channel
         JOIN active ON active.id = channel.session_id AND active.user_id = channel.user_id
         WHERE channel.expires_at > now() + interval '1 minute'
         ORDER BY channel.created_at DESC LIMIT 1
       ), issued AS (
         INSERT INTO private.realtime_user_channel (session_id, user_id, topic_id, expires_at, is_admin)
         SELECT active.id, active.user_id, gen_random_uuid(), now() + interval '5 minutes', $3::boolean
         FROM active WHERE NOT EXISTS (SELECT 1 FROM existing)
         RETURNING topic_id, expires_at
       )
       SELECT 'biovity:user:' || topic_id::text AS topic, expires_at AS "expiresAt" FROM existing
       UNION ALL
       SELECT 'biovity:user:' || topic_id::text AS topic, expires_at AS "expiresAt" FROM issued`,
        [session.session.id, session.user.id, isAdminSession(session)]
      ),
    catch: () => new Error("Realtime grant could not be loaded"),
  })
  const grant = result.isOk() ? result.value.rows[0] : undefined
  if (!grant) {
    return NextResponse.json({ error: "No se pudo crear el canal" }, { status: 503 })
  }

  return NextResponse.json(grant, { headers: { "Cache-Control": "private, no-store, max-age=0" } })
}
