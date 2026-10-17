import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { parseChatResponse } from "@/lib/api/chats"
import { auth } from "@/lib/auth"
import { fetchJsonWithSession } from "@/lib/result"
import { getSupabaseAdmin } from "@/lib/supabase"

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "biovity_bucket"
const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

async function authorizeChatParticipant(chatId: string, userId: string, requestHeaders: Headers) {
  const result = await fetchJsonWithSession<unknown>(
    `${API_BASE}/api/v1/chats/${encodeURIComponent(chatId)}`,
    requestHeaders,
    { cache: "no-store" }
  )
  if (result.isErr()) {
    return {
      kind: "denied" as const,
      status: result.error._tag === "ApiError" && result.error.status === 404 ? 404 : 502,
    }
  }

  const chat = parseChatResponse(result.value)
  if (!chat || chat.id !== chatId) return { kind: "denied" as const, status: 502 }
  if (chat.recruiterId !== userId && chat.professionalId !== userId) {
    return { kind: "denied" as const, status: 403 }
  }
  return { kind: "allowed" as const }
}

export async function GET(request: Request) {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const path = searchParams.get("path")
  if (!path) {
    return NextResponse.json({ error: "path requerido" }, { status: 400 })
  }
  const match = /^messages\/([a-zA-Z0-9_-]+)\/([^/\\]+)$/.exec(path)
  if (!match || match[2] === "." || match[2] === "..") {
    return NextResponse.json({ error: "Path no permitido" }, { status: 400 })
  }

  const chatId = match[1]
  const access = await authorizeChatParticipant(chatId, session.user.id, requestHeaders)
  if (access.kind === "denied") {
    if (access.status === 403) return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    if (access.status === 404)
      return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 })
    return NextResponse.json({ error: "No se pudo validar el chat" }, { status: 502 })
  }

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.storage.from(BUCKET).download(path)

  if (error || !data) {
    return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 })
  }

  return new NextResponse(data, {
    headers: {
      "Content-Type": data.type || "application/octet-stream",
      "Cache-Control": "private, no-store",
    },
  })
}
