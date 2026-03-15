import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getSupabaseAdmin } from "@/lib/supabase"

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const chatId = body?.chatId as string | undefined
  const content = body?.content as string | undefined

  if (!chatId || typeof content !== "string" || !content.trim()) {
    return NextResponse.json(
      { error: "chatId y content son requeridos" },
      { status: 400 }
    )
  }

  const senderId = session.user.id

  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from("message")
      .insert({ chatId, senderId, content: content.trim() })
      .select('"id", "chatId", "senderId", "content", "isRead", "createdAt"')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const apiBase = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"
    fetch(`${apiBase}/api/v1/chats/${chatId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lastMessage: content.trim() }),
    }).catch(() => {})

    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error al enviar mensaje" },
      { status: 500 }
    )
  }
}
