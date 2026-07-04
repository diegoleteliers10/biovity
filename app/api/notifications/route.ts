import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { mapNotification } from "@/lib/notifications"
import { getSupabaseAdmin } from "@/lib/supabase"

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const url = new URL(request.url)
  const unreadOnly = url.searchParams.get("unreadOnly") === "true"

  const supabase = getSupabaseAdmin()
  let query = supabase
    .from("notification")
    .select("id, user_id, type, title, body, link, data, is_read, read_at, created_at")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(50)

  if (unreadOnly) query = query.eq("is_read", false)

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const rows = data ?? []
  const unreadCount = rows.filter((row) => !row.is_read).length

  return NextResponse.json({ data: rows.map(mapNotification), unreadCount })
}
