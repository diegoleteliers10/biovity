import { timingSafeEqual } from "node:crypto"

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
  if (!isAuthorized(request)) return Response.json({ error: "No autorizado" }, { status: 401 })

  const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL
  const internalKey = process.env.INTERNAL_API_KEY
  if (!apiUrl || !internalKey) {
    return Response.json({ error: "La sincronización no está configurada" }, { status: 503 })
  }

  const result = await fetch(new URL("/api/v1/google-calendar/internal/retry", apiUrl), {
    method: "POST",
    headers: { "x-internal-key": internalKey },
    signal: AbortSignal.timeout(50_000),
  }).then(
    (response) => ({ kind: "response" as const, response }),
    () => ({ kind: "network_error" as const })
  )

  if (result.kind === "network_error" || !result.response.ok) {
    return Response.json({ error: "No se pudo reintentar la sincronización" }, { status: 503 })
  }

  return Response.json(
    { success: true },
    {
      headers: { "Cache-Control": "private, no-store, max-age=0" },
    }
  )
}
