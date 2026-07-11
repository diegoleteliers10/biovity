import { Result as R, type Result } from "better-result"
import { ApiError, type NetworkError } from "@/lib/errors"
import { fetchJson, fetchNoContent } from "@/lib/result"

const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
    : (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")

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
  const base = getBaseUrl()
  const searchParams = new URLSearchParams()
  if (params?.limit != null) searchParams.set("limit", String(params.limit))
  if (params?.cursor) searchParams.set("cursor", params.cursor)
  const query = searchParams.toString()
  const url = `${base}/api/messages/${chatId}${query ? `?${query}` : ""}`

  const result = await fetchJson<{ error?: string } & GetMessagesResponse>(url, {
    credentials: "include",
  })

  if (result.isErr()) return R.err(result.error)

  const json = result.value

  if (json.error) {
    return R.err(new ApiError({ status: 400, message: json.error }))
  }

  if (!json || typeof json !== "object" || !Array.isArray(json.data)) {
    return R.err(new ApiError({ status: 200, message: "Respuesta inválida" }))
  }

  return R.ok({
    data: json.data,
    nextCursor: typeof json.nextCursor === "string" ? json.nextCursor : null,
  })
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
  const base = getBaseUrl()
  const payload = {
    chatId: input.chatId,
    senderId: input.senderId,
    content: input.content.trim(),
    type: input.type ?? "text",
    contentType: input.contentType ?? null,
  }

  const result = await fetchJson<{ error?: string } & Message>(`${base}/api/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  })

  if (result.isErr()) return R.err(result.error)

  const data = result.value

  if (data.error) {
    return R.err(new ApiError({ status: 400, message: data.error }))
  }

  if (!data.id) {
    return R.err(new ApiError({ status: 200, message: "Respuesta inválida" }))
  }

  return R.ok(data as Message)
}

export type UploadedAttachment = {
  url: string
  path: string
  name: string
  size: number
  mimeType: string
}

export async function uploadMessageAttachment(
  file: File,
  chatId: string
): Promise<Result<UploadedAttachment, ApiError | NetworkError>> {
  const base = getBaseUrl()
  const formData = new FormData()
  formData.append("file", file)
  formData.append("chatId", chatId)

  const result = await fetchJson<{ error?: string } & UploadedAttachment>(
    `${base}/api/upload/message-attachment`,
    { method: "POST", body: formData, credentials: "include" }
  )

  if (result.isErr()) return R.err(result.error)

  const value = result.value
  if (value.error) {
    return R.err(new ApiError({ status: 400, message: value.error }))
  }
  if (!value.url) {
    return R.err(new ApiError({ status: 200, message: "Respuesta inválida" }))
  }

  return R.ok(value)
}

export async function getLastMessageFromSender(
  chatId: string,
  senderId: string
): Promise<Message | null> {
  const result = await getMessagesByChatId(chatId, { limit: 100 })
  if (result.isErr()) {
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

export async function markChatAsRead(
  chatId: string,
  userId: string
): Promise<Result<void, ApiError | NetworkError>> {
  const url = `${API_BASE}/api/v1/messages/chat/${chatId}/read`
  return fetchNoContent(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  })
}
