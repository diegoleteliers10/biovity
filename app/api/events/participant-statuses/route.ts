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
  console.log("[API/participant-statuses] Session user:", session?.user?.id)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const body = await request.json()
  console.log("[API/participant-statuses] Request body:", body)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    console.log("[API/participant-statuses] Validation failed:", parsed.error)
    return NextResponse.json({ error: "Parametros invalidos" }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()
  const userId = session.user.id
  const eventIds = parsed.data.eventIds

  const { data: existing, error: existingErr } = await supabase
    .from("event_participant")
    .select("event_id")
    .eq("user_id", userId)
    .in("event_id", eventIds)

  if (existingErr) {
    console.error("[API/participant-statuses] Supabase select error:", existingErr)
  }

  const existingIds = new Set((existing ?? []).map((r) => r.event_id))
  const missingIds = eventIds.filter((id) => !existingIds.has(id))
  console.log("[API/participant-statuses] Existing IDs:", Array.from(existingIds))
  console.log("[API/participant-statuses] Missing IDs:", missingIds)

  if (missingIds.length > 0) {
    const rows = missingIds.map((eventId) => ({
      event_id: eventId,
      user_id: userId,
      role: "attendee" as const,
      status: "pending" as const,
    }))
    const { error: insertErr } = await supabase.from("event_participant").insert(rows)
    if (insertErr) {
      console.error("[API/participant-statuses] Supabase insert error:", insertErr)
    } else {
      console.log("[API/participant-statuses] Inserted missing statuses as pending")
    }
  }

  const { data, error } = await supabase
    .from("event_participant")
    .select("event_id, status")
    .eq("user_id", userId)
    .in("event_id", eventIds)

  if (error) {
    console.error("[API/participant-statuses] Supabase fetch error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const statuses: Record<string, string> = {}
  for (const row of data ?? []) {
    statuses[row.event_id] = row.status
  }

  console.log("[API/participant-statuses] Returning statuses:", statuses)
  return NextResponse.json({ statuses })
}
