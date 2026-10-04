import { timingSafeEqual } from "node:crypto"
import { processJevQueue } from "@/lib/ai/decision/worker"

export const maxDuration = 300

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
  await processJevQueue()
  return Response.json({ ok: true })
}
