import { Result as R } from "better-result"
import { type NextRequest, NextResponse } from "next/server"
import { auth, isAdminSession } from "@/lib/auth"
import { pool } from "@/lib/db"
import { DbError } from "@/lib/errors"
import { sendWaitlistInviteEmail } from "@/lib/mail"

type WaitlistRow = {
  id: number
  email: string
  role: string
  invited_at: Date | null
}

type InviteResult = {
  id: number
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

  const body = await request.json().catch(() => null)
  const ids = Array.isArray(body?.ids)
    ? body.ids.map(Number).filter((id: number) => Number.isInteger(id) && id > 0)
    : []
  const sendAll = body?.all === true

  if (!sendAll && ids.length === 0) {
    return NextResponse.json({ error: "No hay destinatarios" }, { status: 400 })
  }

  const entries = sendAll
    ? await R.tryPromise({
        try: () =>
          pool.query<WaitlistRow>(
            "SELECT id, email, role, invited_at FROM waitlist ORDER BY created_at ASC"
          ),
        catch: (cause) => new DbError({ operation: "list_waitlist_invite_all", cause }),
      })
    : await R.tryPromise({
        try: () =>
          pool.query<WaitlistRow>(
            "SELECT id, email, role, invited_at FROM waitlist WHERE id = ANY($1)",
            [ids]
          ),
        catch: (cause) => new DbError({ operation: "list_waitlist_invite_ids", cause }),
      })

  if (entries.isErr()) {
    console.error("[admin/waitlist/invite] Error:", entries.error)
    return NextResponse.json({ error: "Error al obtener lista de espera" }, { status: 500 })
  }

  const results = await mapWithConcurrency(entries.value.rows, CONCURRENCY_LIMIT, sendInvite)

  return NextResponse.json({ results })
}
