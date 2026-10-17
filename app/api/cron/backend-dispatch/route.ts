import { timingSafeEqual } from "node:crypto"
import { Result as R } from "better-result"
import { NextResponse } from "next/server"

export const maxDuration = 60

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "")
  if (!secret || !token) return false
  const expected = Buffer.from(secret)
  const actual = Buffer.from(token)
  return expected.length === actual.length && timingSafeEqual(expected, actual)
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL
  const internalApiKey = process.env.INTERNAL_API_KEY
  if (!apiUrl || !internalApiKey) {
    return NextResponse.json({ error: "Dispatcher backend no configurado" }, { status: 503 })
  }

  const result = await R.tryPromise({
    try: () =>
      fetch(`${apiUrl.replace(/\/$/, "")}/api/v1/internal/cron/dispatch`, {
        method: "POST",
        headers: { "x-internal-key": internalApiKey },
        signal: AbortSignal.timeout(50_000),
        cache: "no-store",
      }),
    catch: (cause) => cause,
  })
  if (result.isErr()) {
    console.error("[backend-dispatch] request failed", result.error)
    return NextResponse.json({ error: "No se pudo llamar al dispatcher" }, { status: 502 })
  }

  const response = result.value
  const body = await R.tryPromise({
    try: () => response.json() as Promise<unknown>,
    catch: () => null,
  })
  const payload = body.isErr() ? null : body.value
  const jobsFailed =
    typeof payload === "object" && payload !== null && "ok" in payload && payload.ok === false
  return NextResponse.json(
    { status: response.status, ok: response.ok, data: payload },
    {
      status: response.ok && !jobsFailed ? 200 : 502,
      headers: { "Cache-Control": "private, no-store, max-age=0" },
    }
  )
}
