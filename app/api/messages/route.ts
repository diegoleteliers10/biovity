import { Result } from "better-result"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { parseRealtimeMessage } from "@/lib/api/messages"
import { auth } from "@/lib/auth"
import { fetchJsonWithSession } from "@/lib/result"
import { createMessageSchema } from "@/lib/validations/messages"

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

export async function POST(request: Request) {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }
  const body = await Result.tryPromise({
    try: () => request.json(),
    catch: () => new Error("Invalid message JSON"),
  })
  const parsed = createMessageSchema.safeParse(body.isOk() ? body.value : null)
  if (!parsed.success) {
    return NextResponse.json({ error: "Mensaje inválido" }, { status: 400 })
  }
  const result = await fetchJsonWithSession<unknown>(
    `${API_BASE}/api/v1/messages`,
    requestHeaders,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...parsed.data, senderId: session.user.id }),
      cache: "no-store",
    }
  )
  if (result.isErr()) {
    const status = result.error._tag === "ApiError" ? result.error.status : 502
    return NextResponse.json({ error: "No se pudo enviar el mensaje" }, { status })
  }
  const value = result.value
  const payload = value && typeof value === "object" && "data" in value ? value.data : value
  const message = parseRealtimeMessage(payload)
  if (!message)
    return NextResponse.json({ error: "Respuesta de mensaje inválida" }, { status: 502 })
  return NextResponse.json(message, { status: 201 })
}
