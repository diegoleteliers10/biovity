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
  typeof window !== "undefined" ? "" : process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

export async function getMessagesByChatId(
  chatId: string
): Promise<{ data: Message[] } | { error: string }> {
  try {
    const base = getBaseUrl()
    const res = await fetch(`${base}/api/messages/${chatId}`, {
      credentials: "include",
    })
    const data = await res.json().catch(() => null)

    if (!res.ok) {
      return { error: data?.error ?? "Error al obtener mensajes" }
    }

    if (!Array.isArray(data)) {
      return { error: "Respuesta inválida" }
    }

    return { data: data as Message[] }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error al obtener mensajes" }
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
