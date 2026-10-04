import { timingSafeEqual } from "node:crypto"
import { pool } from "@/lib/db"

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

  const result = await pool.query<{ dispatched: number }>(
    "SELECT private.dispatch_biovity_realtime_outbox($1) AS dispatched",
    [100]
  )

  return Response.json(
    { dispatched: result.rows[0]?.dispatched ?? 0 },
    { headers: { "Cache-Control": "private, no-store, max-age=0" } }
  )
}
