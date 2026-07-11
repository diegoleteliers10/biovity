import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { createNotification } from "@/lib/notifications"
import { getSupabaseAdmin } from "@/lib/supabase"
import { createMessageSchema } from "@/lib/validations/messages"

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const body = await request.json().catch(() => null)

  const parsed = createMessageSchema.safeParse(body)

  if (!parsed.success) {
    const error = parsed.error.issues[0]
    return NextResponse.json({ error: error?.message || "Datos inválidos" }, { status: 400 })
  }

  const { chatId, content, type, contentType } = parsed.data
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

  const { data, error } = await supabase
    .from("message")
    .insert({ chatId, senderId, content, type, content_type: contentType ?? null })
    .select('"id", "chatId", "senderId", "content", "type", "content_type", "isRead", "createdAt"')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { content_type, ...rest } = data
  const message = { ...rest, contentType: content_type ?? null }

  const apiBase = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"
  fetch(`${apiBase}/api/v1/chats/${chatId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lastMessage: content }),
  }).catch(() => {})

  const recipientId = chat.recruiterId === senderId ? chat.professionalId : chat.recruiterId
  const notifBody =
    type === "text"
      ? content.length > 120
        ? `${content.slice(0, 117)}...`
        : content
      : type === "image"
        ? "Imagen"
        : type === "file"
          ? "Archivo"
          : type === "audio"
            ? "Audio"
            : "Mensaje"

  const hashContent = (s: string) => s.slice(0, 50)
  const dedupKey = `message:${chatId}:${hashContent(content)}`

  const { data: existingNotif } = await supabase
    .from("notification")
    .select("id")
    .eq("type", "message")
    .eq("user_id", recipientId)
    .gte("created_at", new Date(Date.now() - 60 * 60 * 1000).toISOString())
    .filter("data->>dedupKey", "eq", dedupKey)
    .maybeSingle()

  if (!existingNotif) {
    createNotification({
      userId: recipientId,
      type: "message",
      title: "Nuevo mensaje",
      body: notifBody,
      link: `/dashboard/messages?chat=${chatId}`,
      data: { chatId, senderId, messageType: type, dedupKey },
    }).catch(() => {})
  }

  return NextResponse.json(message)
}
