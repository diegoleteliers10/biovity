import { Result as R } from "better-result"
import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth, isAdminSession } from "@/lib/auth"
import { pool } from "@/lib/db"
import { DbError } from "@/lib/errors"

const pageSchema = z.coerce.number().int().min(1).max(1_000_000).default(1)
const pageSize = 50

type DeadEmailRow = {
  id: string
  email_type: string
  recipient_email: string
  subject: string
  attempts: number
  last_error: string | null
  created_at: Date
  expires_at: Date
}

function maskEmail(email: string) {
  const [local, domain] = email.split("@")
  if (!domain) return "correo inválido"
  return `${local.slice(0, 1)}***@${domain}`
}

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }
  const pageResult = pageSchema.safeParse(request.nextUrl.searchParams.get("page") ?? undefined)
  if (!pageResult.success) {
    return NextResponse.json({ error: "Página inválida" }, { status: 400 })
  }
  const requestedPage = pageResult.data

  const result = await R.tryPromise({
    try: async () => {
      const counts = await pool.query<{
        pending: string
        processing: string
        dead: string
        suppressed: string
        legacy_offer_response: string
      }>(
        `SELECT
             count(*) FILTER (WHERE status = 'pending')::text AS pending,
             count(*) FILTER (WHERE status = 'processing')::text AS processing,
             count(*) FILTER (WHERE status = 'dead')::text AS dead,
             count(*) FILTER (WHERE status = 'suppressed')::text AS suppressed,
             count(*) FILTER (WHERE email_type = 'offer_response' AND recipient_user_id IS NULL
               AND status IN ('pending', 'processing'))::text AS legacy_offer_response
           FROM email_outbox`
      )
      const totalItems = Number(counts.rows[0].dead)
      const totalPages = Math.ceil(totalItems / pageSize)
      const page = Math.min(requestedPage, Math.max(totalPages, 1))
      const dead = await pool.query<DeadEmailRow>(
        `SELECT id, email_type, recipient_email, subject, attempts,
           last_error, created_at, expires_at
         FROM email_outbox WHERE status = 'dead'
         ORDER BY created_at DESC, id DESC LIMIT $1 OFFSET $2`,
        [pageSize, (page - 1) * pageSize]
      )
      return { dead: dead.rows, counts: counts.rows[0], page, totalItems, totalPages }
    },
    catch: (cause) => new DbError({ operation: "list_dead_email_outbox", cause }),
  })
  if (result.isErr()) {
    console.error("[admin/email-outbox] list failed", result.error)
    return NextResponse.json(
      { error: "No se pudieron cargar los correos fallidos" },
      { status: 500 }
    )
  }

  return NextResponse.json({
    counts: {
      pending: Number(result.value.counts.pending),
      processing: Number(result.value.counts.processing),
      dead: Number(result.value.counts.dead),
      suppressed: Number(result.value.counts.suppressed),
      legacyOfferResponse: Number(result.value.counts.legacy_offer_response),
    },
    pagination: {
      page: result.value.page,
      pageSize,
      totalItems: result.value.totalItems,
      totalPages: result.value.totalPages,
    },
    data: result.value.dead.map((row) => ({
      id: row.id,
      type: row.email_type,
      recipient: maskEmail(row.recipient_email),
      subject: row.subject,
      attempts: row.attempts,
      lastError: row.last_error,
      createdAt: row.created_at,
      expiresAt: row.expires_at,
    })),
  })
}
