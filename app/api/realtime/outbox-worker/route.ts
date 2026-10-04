import { timingSafeEqual } from "node:crypto"
import { Result } from "better-result"
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
    [500]
  )

  const dispatched = result.rows[0]?.dispatched ?? 0

  // A dead-lettered event never reached the browser and no trigger will retry
  // it. Surface it so the cron output is the alert. A read failure here must
  // not turn a successful dispatch into a failed cron run.
  const backlog = await readBacklog()

  if (backlog.deadLettered > 0 || backlog.oldestPendingSeconds > 60) {
    console.error("[realtime-outbox] delivery backlog", backlog)
  }

  return Response.json(
    { dispatched, ...backlog },
    { headers: { "Cache-Control": "private, no-store, max-age=0" } }
  )
}

type Backlog = { deadLettered: number; oldestPendingSeconds: number }

const NO_BACKLOG: Backlog = { deadLettered: 0, oldestPendingSeconds: 0 }

async function readBacklog(): Promise<Backlog> {
  const result = await Result.tryPromise({
    try: () =>
      pool.query<{ dead_lettered: string; oldest_pending_seconds: string }>(
        `SELECT
           count(*) FILTER (WHERE dead_lettered_at IS NOT NULL) AS dead_lettered,
           COALESCE(
             EXTRACT(EPOCH FROM now() - min(created_at) FILTER (
               WHERE delivered_at IS NULL AND dead_lettered_at IS NULL
             )),
             0
           ) AS oldest_pending_seconds
         FROM private.realtime_outbox`
      ),
    catch: (cause) => cause,
  })
  if (result.isErr()) {
    console.error("[realtime-outbox] backlog read failed", result.error)
    return NO_BACKLOG
  }
  const row = result.value.rows[0]
  return {
    deadLettered: Number(row?.dead_lettered ?? 0),
    oldestPendingSeconds: Math.round(Number(row?.oldest_pending_seconds ?? 0)),
  }
}
