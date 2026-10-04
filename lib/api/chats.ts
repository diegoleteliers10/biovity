import { Result as R, type Result } from "better-result"
import { z } from "zod"
import { ApiError, type NetworkError } from "@/lib/errors"
import { fetchJson, fetchJsonWithSession } from "@/lib/result"

const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
    : (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")

export type Chat = {
  id: string
  recruiterId: string
  professionalId: string
  lastMessage: string | null
  unreadCountRecruiter: number
  unreadCountProfessional: number
  createdAt: string
  updatedAt: string
  isPinned?: boolean
  isArchived?: boolean
}

const ChatResponseSchema = z.object({
  id: z.string(),
  recruiterId: z.string(),
  professionalId: z.string(),
  lastMessage: z.string().nullable().default(null),
  unreadCountRecruiter: z.number().default(0),
  unreadCountProfessional: z.number().default(0),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  isPinned: z.boolean().optional(),
  isArchived: z.boolean().optional(),
})

export function parseChatResponse(payload: unknown): Chat | null {
  let value = payload
  for (let depth = 0; depth < 2; depth++) {
    if (value && typeof value === "object" && "data" in value) value = value.data
  }
  const parsed = ChatResponseSchema.safeParse(value)
  return parsed.success
    ? { ...parsed.data, updatedAt: parsed.data.updatedAt ?? parsed.data.createdAt }
    : null
}

function extractChats(payload: unknown): Chat[] {
  if (Array.isArray(payload)) return payload as Chat[]
  if (!payload || typeof payload !== "object") return []

  const p = payload as Record<string, unknown>
  const directData = p.data
  if (Array.isArray(directData)) return directData as Chat[]

  if (!directData || typeof directData !== "object") return []
  const nested = directData as Record<string, unknown>
  const nestedData = nested.data
  if (Array.isArray(nestedData)) return nestedData as Chat[]

  return []
}

export async function getChatsByRecruiter(
  recruiterId: string,
  requestHeaders?: Headers
): Promise<Result<Chat[], ApiError | NetworkError>> {
  const url = `${API_BASE}/api/v1/chats/recruiter/${recruiterId}`

  const result = requestHeaders
    ? await fetchJsonWithSession<unknown>(url, requestHeaders)
    : await fetchJson<unknown>(url)

  if (result.isErr()) return R.err(result.error)

  const chats = extractChats(result.value)
  return R.ok(chats)
}

export async function getChatsByProfessional(
  professionalId: string
): Promise<Result<Chat[], ApiError | NetworkError>> {
  const url = `${API_BASE}/api/v1/chats/professional/${professionalId}`

  const result = await fetchJson<unknown>(url)

  if (result.isErr()) return R.err(result.error)

  const chats = extractChats(result.value)
  return R.ok(chats)
}

export async function createOrFindChat(
  professionalId: string,
  requestHeaders?: Headers
): Promise<Result<Chat, ApiError | NetworkError>> {
  const base =
    typeof window !== "undefined"
      ? ""
      : (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000")

  const url = `${base}/api/chats/create`
  const init = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ professionalId }),
  } satisfies RequestInit
  const result = requestHeaders
    ? await fetchJsonWithSession<{ data?: Chat; error?: string; message?: string }>(
        url,
        requestHeaders,
        init
      )
    : await fetchJson<{ data?: Chat; error?: string; message?: string }>(url, init)

  if (result.isErr()) return R.err(result.error)

  const data = result.value
  if (data.error || data.message) {
    const errorMsg = data.error ?? data.message
    return R.err(
      new ApiError({
        status: 400,
        message: typeof errorMsg === "string" ? errorMsg : "Error al crear el chat",
      })
    )
  }

  const chat = data.data ?? (data as unknown as Chat)
  if (!chat?.id) {
    return R.err(new ApiError({ status: 200, message: "Respuesta inválida" }))
  }

  return R.ok(chat as Chat)
}

export async function getChatById(chatId: string): Promise<Result<Chat, ApiError | NetworkError>> {
  const url = `${API_BASE}/api/v1/chats/${chatId}`

  const result = await fetchJson<unknown>(url)
  if (result.isErr()) return R.err(result.error)
  const chat = parseChatResponse(result.value)
  return chat
    ? R.ok(chat)
    : R.err(new ApiError({ status: 502, message: "Respuesta de chat inválida" }))
}
