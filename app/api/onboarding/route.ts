import { NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth"
import { pool } from "@/lib/db"
import { updateOnboardingSchema } from "@/lib/validations/onboarding"

const API_BASE =
  process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

export async function GET() {
  const session = await getServerSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const organizationId = (session.user as { organizationId?: string }).organizationId
  if (!organizationId) {
    return NextResponse.json({ steps: [], dismissed: true })
  }

  // 1. Query stored onboarding state
  const onboardingRes = await pool.query(
    `SELECT steps_completed, dismissed FROM organization_onboarding WHERE organization_id = $1`,
    [organizationId]
  )

  const storedRow = onboardingRes.rows[0]
  const stepsSet = new Set<string>(storedRow?.steps_completed ?? [])
  const dismissed = storedRow?.dismissed ?? false

  // 2. Check jobs from NestJS backend if offer steps are missing
  if (!stepsSet.has("create_offer") || !stepsSet.has("publish_offer")) {
    try {
      const res = await fetch(
        `${API_BASE}/api/v1/jobs/organization/${organizationId}?limit=5`,
        {
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(1500),
        }
      )
      if (res.ok) {
        const json = await res.json()
        const jobs = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : []
        if (jobs.length > 0) {
          stepsSet.add("create_offer")
          if (
            jobs.some(
              (j: { status?: string }) => j.status === "active" || j.status === "published"
            )
          ) {
            stepsSet.add("publish_offer")
          }
        }
      }
    } catch {
      // Soft fallback if backend API is unreachable or times out
    }
  }

  // 3. Check profile completion if not yet marked
  if (!stepsSet.has("complete_profile")) {
    try {
      const orgRes = await pool.query(
        `SELECT name, description FROM organization WHERE id = $1`,
        [organizationId]
      )
      const org = orgRes.rows[0]
      if (org?.name && org?.description) {
        stepsSet.add("complete_profile")
      }
    } catch {
      // Soft fallback
    }
  }

  const autoDetectedSteps = Array.from(stepsSet)

  // Non-blocking sync to PostgreSQL
  if (autoDetectedSteps.length > (storedRow?.steps_completed?.length ?? 0)) {
    pool
      .query(
        `INSERT INTO organization_onboarding (organization_id, steps_completed, updated_at)
         VALUES ($1, $2, now())
         ON CONFLICT (organization_id) DO UPDATE SET
           steps_completed = $2,
           updated_at = now()`,
        [organizationId, autoDetectedSteps]
      )
      .catch(() => {})
  }

  return NextResponse.json({
    steps: autoDetectedSteps,
    dismissed,
  })
}

export async function PATCH(request: Request) {
  const session = await getServerSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const organizationId = (session.user as { organizationId?: string }).organizationId
  if (!organizationId) {
    return NextResponse.json({ error: "Sin organizacion" }, { status: 400 })
  }

  const body = await request.json()
  const parsed = updateOnboardingSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Datos invalidos" },
      { status: 400 }
    )
  }

  const { step, dismiss } = parsed.data

  if (dismiss) {
    await pool.query(
      `INSERT INTO organization_onboarding (organization_id, dismissed, updated_at)
       VALUES ($1, true, now())
       ON CONFLICT (organization_id) DO UPDATE SET dismissed = true, updated_at = now()`,
      [organizationId]
    )
    return NextResponse.json({ success: true })
  }

  if (step) {
    await pool.query(
      `INSERT INTO organization_onboarding (organization_id, steps_completed, updated_at)
       VALUES ($1, ARRAY[$2], now())
       ON CONFLICT (organization_id) DO UPDATE SET
         steps_completed = CASE
           WHEN $2 = ANY(organization_onboarding.steps_completed)
           THEN organization_onboarding.steps_completed
           ELSE array_append(organization_onboarding.steps_completed, $2)
         END,
         updated_at = now()`,
      [organizationId, step]
    )
  }

  const result = await pool.query(
    `SELECT steps_completed, dismissed FROM organization_onboarding WHERE organization_id = $1`,
    [organizationId]
  )

  const row = result.rows[0]
  return NextResponse.json({
    steps: row?.steps_completed ?? [],
    dismissed: row?.dismissed ?? false,
  })
}
