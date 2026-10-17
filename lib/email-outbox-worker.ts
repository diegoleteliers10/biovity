import { Result as R } from "better-result"
import { Resend } from "resend"
import { pool } from "@/lib/db"

const BATCH_SIZE = 20
const MAX_ATTEMPTS = 8
const STALE_LEASE_MINUTES = 5

type OutboxEmail = {
  id: string
  to: string
  from: string
  subject: string
  html: string
  attachments: { filename: string; content: string }[]
  attempts: number
  sourceType: string | null
  sourceId: string | null
  type: string
  recipientUserId: string | null
}

type PreferenceDecision = "enabled" | "disabled" | "user_missing"

async function getApplicationEmailPreferences(userIds: string[]) {
  if (userIds.length === 0) return { kind: "ok" as const, decisions: {} }
  const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL
  const apiKey = process.env.INTERNAL_API_KEY
  if (!apiUrl || !apiKey) return { kind: "error" as const }

  const result = await R.tryPromise({
    try: () =>
      fetch(`${apiUrl.replace(/\/$/, "")}/api/v1/internal/email-preferences/application`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-internal-key": apiKey },
        body: JSON.stringify({ userIds }),
        signal: AbortSignal.timeout(10_000),
      }),
    catch: (cause) => cause,
  })
  if (result.isErr() || !result.value.ok) return { kind: "error" as const }

  const body = await R.tryPromise({
    try: () => result.value.json() as Promise<{ decisions?: Record<string, PreferenceDecision> }>,
    catch: (cause) => cause,
  })
  if (body.isErr() || !body.value.decisions) return { kind: "error" as const }
  if (
    userIds.some(
      (id) => !["enabled", "disabled", "user_missing"].includes(body.value.decisions?.[id] ?? "")
    )
  ) {
    return { kind: "error" as const }
  }
  return { kind: "ok" as const, decisions: body.value.decisions }
}

async function getWeeklyDigestEmailPreferences(userIds: string[]) {
  const result = await R.tryPromise({
    try: () =>
      pool.query<{ id: string; notification_preferences: unknown }>(
        `SELECT id, notification_preferences FROM "user" WHERE id = ANY($1::uuid[])`,
        [userIds]
      ),
    catch: (cause) => cause,
  })
  if (result.isErr()) return { kind: "error" as const }

  const rows = new Map(result.value.rows.map((row) => [row.id, row.notification_preferences]))
  const decisions = Object.fromEntries(
    userIds.map((id) => {
      const preferences = rows.get(id)
      if (preferences === undefined) return [id, "user_missing"]
      if (!preferences || typeof preferences !== "object" || Array.isArray(preferences)) {
        return [id, "disabled"]
      }
      const value = preferences as Record<string, unknown>
      const channels = value.channels
      const emailEnabled =
        channels !== null &&
        typeof channels === "object" &&
        !Array.isArray(channels) &&
        (channels as Record<string, unknown>).email === true
      return [id, value.digest === "weekly" && emailEnabled ? "enabled" : "disabled"]
    })
  ) as Record<string, PreferenceDecision>
  return { kind: "ok" as const, decisions }
}

export async function processEmailOutbox() {
  await pool.query(
    `UPDATE email_outbox SET status = 'dead', html = NULL, attachments = '[]'::jsonb, locked_at = NULL,
       last_error = 'El correo expiró antes de entregarse'
     WHERE status IN ('pending', 'processing') AND expires_at <= now()`
  )
  await pool.query(
    `WITH expired AS (
       DELETE FROM email_outbox
       WHERE status IN ('sent', 'dead', 'suppressed') AND expires_at <= now()
       RETURNING id
     ), retry_audit AS (
       DELETE FROM email_outbox_admin_retry retry
       USING expired
       WHERE retry.email_outbox_id = expired.id
       RETURNING retry.id
     )
     SELECT (SELECT count(*) FROM expired) AS emails,
       (SELECT count(*) FROM retry_audit) AS retry_audits`
  )

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) return { status: "unavailable" as const, processed: 0 }

  const resend = new Resend(resendKey)
  await pool.query(
    `UPDATE email_outbox SET status = 'dead', locked_at = NULL,
       last_error = COALESCE(last_error, 'Se agotaron los reintentos automáticos')
     WHERE attempts >= $1 AND (
       status = 'pending' OR
       (status = 'processing' AND locked_at < now() - ($2 * interval '1 minute'))
     )`,
    [MAX_ATTEMPTS, STALE_LEASE_MINUTES]
  )

  const claimed = await pool.query<OutboxEmail>(
    `WITH ready AS (
       SELECT id FROM email_outbox
         WHERE expires_at > now() AND html IS NOT NULL AND attempts < $3
           AND (status = 'pending' AND available_at <= now()
             OR status = 'processing' AND locked_at < now() - ($2 * interval '1 minute'))
       ORDER BY available_at, created_at
       LIMIT $1
       FOR UPDATE SKIP LOCKED
     )
     UPDATE email_outbox AS email SET status = 'processing',
       attempts = email.attempts + 1, locked_at = now()
     FROM ready WHERE email.id = ready.id
       RETURNING email.id, email.email_type AS "type", email.recipient_user_id AS "recipientUserId",
       email.recipient_email AS "to", email.from_email AS "from",
       email.subject, email.html, email.attachments, email.attempts,
       email.source_type AS "sourceType", email.source_id AS "sourceId"`,
    [BATCH_SIZE, STALE_LEASE_MINUTES, MAX_ATTEMPTS]
  )

  const preferenceEmails = claimed.rows.filter(isApplicationEmail)
  const recipientIds = preferenceEmails.flatMap((email) =>
    email.recipientUserId === null ? [] : [email.recipientUserId]
  )
  const preferences = await getApplicationEmailPreferences([...new Set(recipientIds)])

  const weeklyDigestEmails = claimed.rows.filter(isWeeklyDigestEmail)
  const weeklyDigestRecipientIds = weeklyDigestEmails.flatMap((email) =>
    email.recipientUserId === null ? [] : [email.recipientUserId]
  )
  const weeklyDigestPreferences = await getWeeklyDigestEmailPreferences([
    ...new Set(weeklyDigestRecipientIds),
  ])

  const deliveries = await Promise.all(
    claimed.rows.map(async (email) => {
      if (isApplicationEmail(email)) {
        if (email.recipientUserId === null) {
          await suppressEmail(email.id, "Destinatario sin usuario asociado")
          return { id: email.id, status: "suppressed" }
        }
        if (preferences.kind === "error") {
          const delayMinutes = Math.min(60, 2 ** Math.min(email.attempts, 6))
          await pool.query(
            `UPDATE email_outbox SET status = CASE WHEN attempts >= $2 THEN 'dead' ELSE 'pending' END,
               available_at = now() + ($3 * interval '1 minute'), locked_at = NULL,
               last_error = 'No se pudieron consultar las preferencias del destinatario'
             WHERE id = $1 AND status = 'processing'`,
            [email.id, MAX_ATTEMPTS, delayMinutes]
          )
          return { id: email.id, status: email.attempts >= MAX_ATTEMPTS ? "dead" : "retry" }
        }
        const decision = preferences.decisions[email.recipientUserId]
        if (decision !== "enabled") {
          await suppressEmail(
            email.id,
            decision === "user_missing"
              ? "Destinatario inexistente"
              : "Preferencias de correo desactivadas"
          )
          return { id: email.id, status: "suppressed" }
        }
      }
      if (isWeeklyDigestEmail(email)) {
        if (email.recipientUserId === null) {
          await suppressEmail(email.id, "Destinatario sin usuario asociado")
          return { id: email.id, status: "suppressed" }
        }
        if (weeklyDigestPreferences.kind === "error") {
          return retryPreferenceEmail(email.id, email.attempts)
        }
        if (weeklyDigestPreferences.decisions[email.recipientUserId] !== "enabled") {
          await suppressEmail(email.id, "Preferencia de resumen semanal desactivada")
          return { id: email.id, status: "suppressed" }
        }
      }
      const sent = await R.tryPromise({
        try: () =>
          resend.emails.send(
            {
              from: email.from,
              to: email.to,
              subject: email.subject,
              html: email.html,
              attachments: email.attachments,
            },
            { idempotencyKey: `biovity-email-${email.id}` }
          ),
        catch: (cause) => cause,
      })
      const resolvedError = sent.isOk() ? sent.value.error : null
      const providerFailed = sent.isErr() || resolvedError !== null
      const providerError = sent.isErr()
        ? sent.error instanceof Error
          ? sent.error.message
          : String(sent.error)
        : (resolvedError?.message ?? "Resend returned an error")

      if (providerFailed) {
        const delayMinutes = Math.min(60, 2 ** Math.min(email.attempts, 6))
        await pool.query(
          `UPDATE email_outbox SET
             status = CASE WHEN attempts >= $2 THEN 'dead' ELSE 'pending' END,
             available_at = now() + ($3 * interval '1 minute'),
             locked_at = NULL, last_error = $4
           WHERE id = $1 AND status = 'processing'`,
          [email.id, MAX_ATTEMPTS, delayMinutes, providerError.slice(0, 2000)]
        )
        return { id: email.id, status: email.attempts >= MAX_ATTEMPTS ? "dead" : "retry" }
      }

      await pool.query(
        `WITH delivered AS (
           UPDATE email_outbox SET status = 'sent', sent_at = now(), locked_at = NULL,
             provider_id = $2, last_error = NULL, html = NULL, attachments = '[]'::jsonb
           WHERE id = $1 AND status = 'processing'
           RETURNING source_type, source_id
         )
         UPDATE waitlist SET invited_at = now()
         WHERE id = (SELECT source_id FROM delivered WHERE source_type = 'waitlist')
           AND invited_at IS NULL`,
        [email.id, sent.isOk() ? (sent.value.data?.id ?? null) : null]
      )
      return { id: email.id, status: "sent" }
    })
  )

  return { status: "ok" as const, processed: deliveries.length, deliveries }
}

function isApplicationEmail(email: Pick<OutboxEmail, "type">): boolean {
  return email.type === "offer_letter" || email.type === "offer_response"
}

function isWeeklyDigestEmail(email: Pick<OutboxEmail, "type">): boolean {
  return email.type === "organization_weekly_digest"
}

async function retryPreferenceEmail(id: string, attempts: number) {
  const delayMinutes = Math.min(60, 2 ** Math.min(attempts, 6))
  await pool.query(
    `UPDATE email_outbox SET status = CASE WHEN attempts >= $2 THEN 'dead' ELSE 'pending' END,
       available_at = now() + ($3 * interval '1 minute'), locked_at = NULL,
       last_error = 'No se pudieron consultar las preferencias del destinatario'
     WHERE id = $1 AND status = 'processing'`,
    [id, MAX_ATTEMPTS, delayMinutes]
  )
  return { id, status: attempts >= MAX_ATTEMPTS ? "dead" : "retry" }
}

async function suppressEmail(id: string, reason: string): Promise<void> {
  await pool.query(
    `UPDATE email_outbox SET status = 'suppressed', html = NULL, attachments = '[]'::jsonb,
       locked_at = NULL, last_error = $2, recipient_user_id = NULL
     WHERE id = $1 AND status = 'processing'`,
    [id, reason]
  )
}
