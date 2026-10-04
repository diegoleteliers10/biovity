import { NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth"
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

  await pool.query(`
    DELETE FROM private.realtime_user_channel
    WHERE expires_at <= now()
  `)

  const result = await pool.query<{ topic: string }>(
    `INSERT INTO private.realtime_user_channel (session_id, user_id, topic_id, expires_at)
     SELECT $1::uuid, app_user.id, gen_random_uuid(), now() + interval '5 minutes'
     FROM public."user" AS app_user
     JOIN public.session AS active_session
       ON active_session.user_id = app_user.id
      AND active_session.id = $1::uuid
      AND active_session.expires_at > now()
     WHERE app_user.id = $2::uuid
       AND app_user."isActive" IS TRUE
     RETURNING 'biovity:user:' || topic_id::text AS topic`,
    [session.session.id, session.user.id]
  )

  const topic = result.rows[0]?.topic
  if (!topic) {
    return NextResponse.json({ error: "No se pudo crear el canal" }, { status: 503 })
  }

  return NextResponse.json(
    { topic },
    { headers: { "Cache-Control": "private, no-store, max-age=0" } }
  )
}
