import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { getSupabaseAdmin } from "@/lib/supabase"

const schema = z.object({
  eventIds: z.array(z.string().uuid()).min(1).max(50),
})

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Parametros invalidos" }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()
  const userId = session.user.id
  const eventIds = parsed.data.eventIds

  const { data: existing, error: existingErr } = await supabase
    .from("event_participant")
    .select("event_id, status")
    .eq("user_id", userId)
    .in("event_id", eventIds)

  if (existingErr) {
    return NextResponse.json({ error: "No se pudieron consultar los estados" }, { status: 500 })
  }

  const statuses: Record<string, string> = {}
  for (const row of existing ?? []) {
    statuses[row.event_id] = row.status
  }

  return NextResponse.json({ statuses })
}
