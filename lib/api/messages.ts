export type Message = {
  id: string
  chatId: string
  senderId: string
  content: string
  isRead: boolean
  createdAt: string
}

/** Base URL for API calls. Empty string on client (relative URLs). */
const getBaseUrl = () =>
  typeof window !== "undefined" ? "" : (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000")

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
): Promise<{ data: Message[]; nextCursor: string | null } | { error: string }> {
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
      return { error: json?.error ?? "Error al obtener mensajes" }
    }

    if (!json || typeof json !== "object" || !Array.isArray(json.data)) {
      return { error: "Respuesta inválida" }
    }

    return {
      data: json.data as Message[],
      nextCursor: typeof json.nextCursor === "string" ? json.nextCursor : null,
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error al obtener mensajes" }
  }
}

export async function getLastMessageFromSender(
  chatId: string,
  senderId: string
): Promise<Message | null> {
  try {
    const result = await getMessagesByChatId(chatId, { limit: 100 })
    if ("error" in result || !result.data.length) return null

    const messagesFromSender = result.data.filter((m) => m.senderId === senderId)
    if (!messagesFromSender.length) return null

    const sorted = messagesFromSender.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    return sorted[0]
  } catch {
    return null
  }
}

export async function sendMessage(
  chatId: string,
  _senderId: string,
  content: string
): Promise<{ data: Message } | { error: string }> {
  try {
    const base = getBaseUrl()
    const res = await fetch(`${base}/api/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ chatId, content: content.trim() }),
    })
    const data = await res.json().catch(() => null)

    if (!res.ok) {
      return { error: data?.error ?? "Error al enviar mensaje" }
    }

    if (!data?.id) {
      return { error: "Respuesta inválida" }
    }

    return { data: data as Message }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error al enviar mensaje" }
  }
}
