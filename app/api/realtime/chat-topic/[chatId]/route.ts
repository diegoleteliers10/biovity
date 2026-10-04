import { NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth"
import { pool } from "@/lib/db"

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export async function POST(request: Request, { params }: { params: Promise<{ chatId: string }> }) {
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

  const { chatId } = await params
  if (!UUID_PATTERN.test(chatId)) {
    return NextResponse.json({ error: "Chat inválido" }, { status: 400 })
  }

  await pool.query(`
    DELETE FROM private.realtime_chat_channel_session
    WHERE expires_at <= now()
  `)
  await pool.query(`
    DELETE FROM private.realtime_chat_channel
    WHERE expires_at <= now()
  `)

  const result = await pool.query<{ topic: string }>(
    `WITH authorized_chat AS (
       SELECT id
       FROM public.chat
       WHERE id = $1::uuid
         AND ("recruiterId" = $2::uuid OR "professionalId" = $2::uuid)
     ), channel AS (
       INSERT INTO private.realtime_chat_channel (chat_id, topic_id, expires_at)
       SELECT id, gen_random_uuid(), now() + interval '5 minutes'
       FROM authorized_chat
       ON CONFLICT (chat_id) DO UPDATE
         SET expires_at = EXCLUDED.expires_at
       RETURNING chat_id, topic_id
     ), session_grant AS (
       INSERT INTO private.realtime_chat_channel_session
         (chat_id, session_id, user_id, expires_at)
       SELECT channel.chat_id, active_session.id, app_user.id, now() + interval '5 minutes'
       FROM channel
       JOIN public.session AS active_session
         ON active_session.id = $3::uuid
        AND active_session.user_id = $2::uuid
        AND active_session.expires_at > now()
       JOIN public."user" AS app_user
         ON app_user.id = active_session.user_id
        AND app_user."isActive" IS TRUE
       ON CONFLICT (chat_id, session_id) DO UPDATE
         SET user_id = EXCLUDED.user_id,
             expires_at = EXCLUDED.expires_at
       RETURNING chat_id
     )
     SELECT 'biovity:chat:' || channel.topic_id::text AS topic
     FROM channel
     JOIN session_grant USING (chat_id)`,
    [chatId, session.user.id, session.session.id]
  )

  const topic = result.rows[0]?.topic
  if (!topic) {
    return NextResponse.json({ error: "Chat no encontrado" }, { status: 404 })
  }

  return NextResponse.json(
    { topic },
    { headers: { "Cache-Control": "private, no-store, max-age=0" } }
  )
}
