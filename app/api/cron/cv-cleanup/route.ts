import { timingSafeEqual } from "node:crypto"
import { processCvCleanup } from "@/lib/cv-cleanup-worker"

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

  const result = await processCvCleanup()
  if (result.status !== "ok") {
    return Response.json({ error: "No se pudo ejecutar la limpieza de CV" }, { status: 503 })
  }

  return Response.json(result, {
    headers: { "Cache-Control": "private, no-store, max-age=0" },
  })
}
