import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getSupabaseAdmin } from "@/lib/supabase"

const DEFAULT_LIMIT = 30
const MAX_LIMIT = 50

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { chatId } = await params
  if (!chatId) {
    return NextResponse.json({ error: "chatId requerido" }, { status: 400 })
  }

  const { searchParams } = new URL(request.url)
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, Number.parseInt(searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10))
  )
  const cursor = searchParams.get("cursor")?.trim()

  try {
    const supabase = getSupabaseAdmin()

    if (cursor) {
      const { data, error } = await supabase
        .from("message")
        .select('"id", "chatId", "senderId", "content", "isRead", "createdAt"')
        .eq("chatId", chatId)
        .lt("createdAt", cursor)
        .order("createdAt", { ascending: true })
        .limit(limit)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      const messages = data ?? []
      const nextCursor =
        messages.length >= limit ? messages[messages.length - 1]?.createdAt ?? null : null

      return NextResponse.json({ data: messages, nextCursor })
    }

    const { data, error } = await supabase
      .from("message")
      .select('"id", "chatId", "senderId", "content", "isRead", "createdAt"')
      .eq("chatId", chatId)
      .order("createdAt", { ascending: false })
      .limit(limit)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const messages = (data ?? []).reverse()
    const nextCursor =
      messages.length >= limit ? messages[0]?.createdAt : null

    return NextResponse.json({ data: messages, nextCursor })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error al obtener mensajes" },
      { status: 500 }
    )
  }
}
