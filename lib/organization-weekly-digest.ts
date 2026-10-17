import { Result as R } from "better-result"
import { pool } from "@/lib/db"
import { enqueueEmail } from "@/lib/email-outbox"
import { DbError } from "@/lib/errors"

type DigestRecipient = {
  userId: string
  email: string
  name: string
  organizationId: string
  organizationName: string
  newApplications: number
  activeJobs: number
}

type DigestWindow = {
  startsAt: Date
  endsAt: Date
  key: string
}

export function getWeeklyDigestWindow(now: Date): DigestWindow {
  const endsAt = new Date(now)
  const startsAt = new Date(endsAt)
  startsAt.setUTCDate(startsAt.getUTCDate() - 7)
  const key = startsAt.toISOString().slice(0, 10)
  return { startsAt, endsAt, key }
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }
    return entities[character]
  })
}

export function renderOrganizationWeeklyDigest(recipient: DigestRecipient): string {
  const name = escapeHtml(recipient.name || "equipo")
  const organizationName = escapeHtml(recipient.organizationName)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://biovity.cl"

  return `<!doctype html>
    <html lang="es"><body style="margin:0;background:#f5f6f7;color:#1c252a;font-family:Arial,sans-serif">
      <main style="max-width:600px;margin:32px auto;padding:28px;background:#fff">
        <p>Hola ${name},</p>
        <h1 style="font-size:22px">Resumen semanal de ${organizationName}</h1>
        <p>En los últimos siete días:</p>
        <ul>
          <li>${recipient.newApplications} postulaciones nuevas</li>
          <li>${recipient.activeJobs} ofertas publicadas</li>
        </ul>
        <p><a href="${escapeHtml(appUrl)}/dashboard/metrics">Ver métricas en Biovity</a></p>
      </main>
    </body></html>`
}

export async function enqueueOrganizationWeeklyDigests(now = new Date()) {
  const window = getWeeklyDigestWindow(now)
  const rows = await R.tryPromise({
    try: () =>
      pool.query<DigestRecipient>(
        `SELECT member.id AS "userId", member.email, member.name,
                organization.id AS "organizationId", organization.name AS "organizationName",
                COUNT(DISTINCT application.id)::int AS "newApplications",
                COUNT(DISTINCT job.id) FILTER (WHERE job.status = 'active')::int AS "activeJobs"
         FROM "user" AS member
         INNER JOIN organization ON organization.id = member.organization_id
         LEFT JOIN job ON job."organizationId" = organization.id
         LEFT JOIN application ON application."jobId" = job.id
           AND application."createdAt" >= $1 AND application."createdAt" < $2
         WHERE member.type = 'organization'
           AND member.notification_preferences->>'digest' = 'weekly'
           AND member.notification_preferences->'channels'->>'email' = 'true'
         GROUP BY member.id, member.email, member.name, organization.id, organization.name
         ORDER BY organization.id, member.id`,
        [window.startsAt, window.endsAt]
      ),
    catch: (cause) => new DbError({ operation: "list_weekly_digest_recipients", cause }),
  })

  if (rows.isErr()) return { kind: "error" as const, error: rows.error }

  const queued = await R.tryPromise({
    try: () =>
      Promise.all(
        rows.value.rows.map((recipient) =>
          enqueueEmail({
            type: "organization_weekly_digest",
            to: recipient.email,
            recipientUserId: recipient.userId,
            idempotencyKey: `organization-weekly-digest:${recipient.userId}:${window.key}`,
            subject: `Resumen semanal de ${recipient.organizationName}`,
            html: renderOrganizationWeeklyDigest(recipient),
            expiresAt: new Date(window.endsAt.getTime() + 7 * 24 * 60 * 60 * 1000),
          })
        )
      ),
    catch: (cause) => new DbError({ operation: "enqueue_organization_weekly_digests", cause }),
  })

  if (queued.isErr()) return { kind: "error" as const, error: queued.error }
  return {
    kind: "ok" as const,
    eligible: rows.value.rows.length,
    queued: queued.value.filter(Boolean).length,
    alreadyQueued: queued.value.filter((inserted) => !inserted).length,
    window: { startsAt: window.startsAt, endsAt: window.endsAt },
  }
}
