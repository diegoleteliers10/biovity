import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getSupabaseAdmin } from "@/lib/supabase"

export async function PATCH(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const url = new URL(request.url)
  const id = url.searchParams.get("id")
  const all = url.searchParams.get("all") === "true"

  if (!id && !all) {
    return NextResponse.json({ error: "Se requiere id o all=true" }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()
  let query = supabase
    .from("notification")
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq("user_id", session.user.id)

  if (all) {
    query = query.eq("is_read", false)
  } else {
    query = query.eq("id", id)
  }

  const { error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
