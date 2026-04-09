import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getSupabaseAdmin } from "@/lib/supabase"
import { createMessageSchema } from "@/lib/validations/messages"

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const body = await request.json().catch(() => null)

  const result = createMessageSchema.safeParse(body)

  if (!result.success) {
    const error = result.error.issues[0]
    return NextResponse.json({ error: error?.message || "Datos inválidos" }, { status: 400 })
  }

  const { chatId, content } = result.data
  const senderId = session.user.id

  const supabase = getSupabaseAdmin()
  const { data: chat, error: chatError } = await supabase
    .from("chat")
    .select("recruiterId, professionalId")
    .eq("id", chatId)
    .single()

  if (chatError || !chat) {
    return NextResponse.json({ error: "Chat no encontrado" }, { status: 404 })
  }

  if (chat.recruiterId !== senderId && chat.professionalId !== senderId) {
    return NextResponse.json({ error: "No tienes acceso a este chat" }, { status: 403 })
  }

  try {
    const { data, error } = await supabase
      .from("message")
      .insert({ chatId, senderId, content })
      .select('"id", "chatId", "senderId", "content", "isRead", "createdAt"')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const apiBase =
      process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"
    fetch(`${apiBase}/api/v1/chats/${chatId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lastMessage: content }),
    }).catch(() => {})

    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error al enviar mensaje" },
      { status: 500 }
    )
  }
}
