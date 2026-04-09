import { Result, Result as R } from "better-result"
import { ApiError, NetworkError } from "@/lib/errors"

const getBaseUrl = () =>
  typeof window !== "undefined" ? "" : (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000")

export type MessageType = "text" | "event" | "audio" | "image" | "file"

export type Message = {
  id: string
  chatId: string
  senderId: string
  content: string
  type: MessageType
  contentType: Record<string, unknown> | null
  isRead: boolean
  createdAt: string
}

export type GetMessagesParams = {
  limit?: number
  cursor?: string
}

export type GetMessagesResponse = {
  data: Message[]
  nextCursor: string | null
}

export async function getMessagesByChatId(
  chatId: string,
  params?: GetMessagesParams
): Promise<Result<GetMessagesResponse, ApiError | NetworkError>> {
  try {
    const base = getBaseUrl()
    const searchParams = new URLSearchParams()
    if (params?.limit != null) searchParams.set("limit", String(params.limit))
    if (params?.cursor) searchParams.set("cursor", params.cursor)
    const query = searchParams.toString()
    const url = `${base}/api/messages/${chatId}${query ? `?${query}` : ""}`

    const res = await fetch(url, { credentials: "include" })
    const json = await res.json().catch(() => null)

    if (!res.ok) {
      return R.err(
        new ApiError({
          status: res.status,
          statusText: res.statusText,
          body: json,
          message: (json as { error?: string })?.error ?? "Error al obtener mensajes",
        })
      )
    }

    if (!json || typeof json !== "object" || !Array.isArray((json as GetMessagesResponse).data)) {
      return R.err(new ApiError({ status: 200, message: "Respuesta inválida" }))
    }

    return R.ok({
      data: (json as GetMessagesResponse).data,
      nextCursor:
        typeof (json as GetMessagesResponse).nextCursor === "string"
          ? (json as GetMessagesResponse).nextCursor
          : null,
    })
  } catch (err) {
    return R.err(
      new NetworkError({
        message: err instanceof Error ? err.message : "Error al obtener mensajes",
        cause: err,
      })
    )
  }
}

export type SendMessageInput = {
  chatId: string
  senderId: string
  content: string
  type?: MessageType
  contentType?: Record<string, unknown> | null
}

export async function sendMessage(
  input: SendMessageInput
): Promise<Result<Message, ApiError | NetworkError>> {
  try {
    const base = getBaseUrl()
    const payload = {
      chatId: input.chatId,
      senderId: input.senderId,
      content: input.content.trim(),
      type: input.type ?? "text",
      contentType: input.contentType ?? null,
    }
    const res = await fetch(`${base}/api/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    })
    const data = await res.json().catch(() => null)

    if (!res.ok) {
      return R.err(
        new ApiError({
          status: res.status,
          statusText: res.statusText,
          body: data,
          message: (data as { error?: string })?.error ?? "Error al enviar mensaje",
        })
      )
    }

    if (!data?.id) {
      return R.err(new ApiError({ status: 200, message: "Respuesta inválida" }))
    }

    return R.ok(data as Message)
  } catch (err) {
    return R.err(
      new NetworkError({
        message: err instanceof Error ? err.message : "Error al enviar mensaje",
        cause: err,
      })
    )
  }
}

export async function getLastMessageFromSender(
  chatId: string,
  senderId: string
): Promise<Message | null> {
  const result = await getMessagesByChatId(chatId, { limit: 100 })
  if (!Result.isOk(result)) {
    return null
  }

  const { data } = result.value
  if (!data.length) return null

  const messagesFromSender = data.filter((m) => m.senderId === senderId)
  if (!messagesFromSender.length) return null

  const sorted = messagesFromSender.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  return sorted[0] ?? null
}
