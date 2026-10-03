import { Result as R, type Result } from "better-result"
import { type NextRequest, NextResponse } from "next/server"
import { auth, isAdminSession } from "@/lib/auth"
import { pool } from "@/lib/db"
import { DbError, ParseError } from "@/lib/errors"
import { sendWaitlistInviteEmail } from "@/lib/mail"
import { adminWaitlistInviteSchema, MAX_INVITE_RECIPIENTS } from "@/lib/validations/admin-waitlist"

/**
 * Every recipient is an awaited Resend call, so the batch must fit the function
 * time budget. `CONCURRENCY_LIMIT` and this value are what keep an `all`
 * request from being cut off mid-flight.
 */
export const maxDuration = 60

type WaitlistRow = {
  id: string
  email: string
  role: string
  invited_at: Date | null
}

/** Row of an `all` batch. `pending` counts every row still waiting, not the batch. */
type PendingWaitlistRow = WaitlistRow & { pending: string }

/** What one invite request will email, and how many entries were still waiting. */
type InviteBatch = Result<{ rows: WaitlistRow[]; pendingBefore: number }, DbError>

type InviteResult = {
  id: string
  status: "sent" | "skipped" | "failed"
}

const CONCURRENCY_LIMIT = 5

async function sendInvite(entry: WaitlistRow): Promise<InviteResult> {
  if (entry.invited_at) {
    return { id: entry.id, status: "skipped" }
  }

  try {
    await sendWaitlistInviteEmail(entry.email, entry.role)
    await pool.query(
      `UPDATE waitlist SET invited_at = NOW() WHERE id = $1 AND invited_at IS NULL`,
      [entry.id]
    )
    return { id: entry.id, status: "sent" }
  } catch (err) {
    console.error(`[admin/waitlist/invite] Error al enviar a ${entry.email}:`, err)
    return { id: entry.id, status: "failed" }
  }
}

async function mapWithConcurrency<T>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<InviteResult>
): Promise<InviteResult[]> {
  const results = new Array<InviteResult>(items.length)
  let index = 0
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (index < items.length) {
      const current = index
      index++
      results[current] = await fn(items[current])
    }
  })
  await Promise.all(workers)
  return results
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const rawBody = await R.tryPromise({
    try: () => request.json() as Promise<unknown>,
    catch: (cause) =>
      new ParseError({ message: "El cuerpo de la peticion no es JSON valido", cause }),
  })

  if (rawBody.isErr()) {
    return NextResponse.json({ error: rawBody.error.message }, { status: 400 })
  }

  const command = adminWaitlistInviteSchema.safeParse(rawBody.value)

  if (!command.success) {
    const reasons = command.error.issues.map((issue) => issue.message).join(". ")
    return NextResponse.json({ error: `Peticion invalida: ${reasons}` }, { status: 400 })
  }

  const sendAll = command.data.scope === "all"
  const ids = command.data.scope === "selected" ? command.data.ids : []

  // Both scopes resolve to the same shape: the rows to email now, and how many
  // entries were still waiting before this batch.
  const batch: InviteBatch = sendAll
    ? await R.tryPromise({
        try: async () => {
          const { rows } = await pool.query<PendingWaitlistRow>(
            `SELECT id, email, role, invited_at, count(*) OVER ()::text AS pending
             FROM waitlist
             WHERE invited_at IS NULL
             ORDER BY created_at ASC
             LIMIT $1`,
            [MAX_INVITE_RECIPIENTS]
          )
          return {
            rows,
            pendingBefore: Number.parseInt(rows[0]?.pending ?? "0", 10),
          }
        },
        catch: (cause) => new DbError({ operation: "list_waitlist_invite_all", cause }),
      })
    : await R.tryPromise({
        try: async () => {
          const { rows } = await pool.query<WaitlistRow>(
            "SELECT id, email, role, invited_at FROM waitlist WHERE id = ANY($1::uuid[])",
            [ids]
          )
          return { rows, pendingBefore: rows.length }
        },
        catch: (cause) => new DbError({ operation: "list_waitlist_invite_ids", cause }),
      })

  if (batch.isErr()) {
    console.error("[admin/waitlist/invite] Error:", batch.error)
    return NextResponse.json({ error: "Error al obtener lista de espera" }, { status: 500 })
  }

  const results = await mapWithConcurrency(batch.value.rows, CONCURRENCY_LIMIT, sendInvite)

  return NextResponse.json({
    results,
    scope: command.data.scope,
    pendingBefore: batch.value.pendingBefore,
    remaining: Math.max(0, batch.value.pendingBefore - results.length),
  })
}
