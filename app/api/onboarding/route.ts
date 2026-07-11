import { NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth"
import { pool } from "@/lib/db"
import { updateOnboardingSchema } from "@/lib/validations/onboarding"

export async function GET() {
  const session = await getServerSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const organizationId = (session.user as { organizationId?: string }).organizationId
  if (!organizationId) {
    return NextResponse.json({ steps: [], dismissed: true })
  }

  const result = await pool.query(
    `SELECT steps_completed, dismissed FROM organization_onboarding WHERE organization_id = $1`,
    [organizationId]
  )

  if (result.rows.length === 0) {
    return NextResponse.json({ steps: [], dismissed: false })
  }

  const row = result.rows[0]
  return NextResponse.json({
    steps: row.steps_completed ?? [],
    dismissed: row.dismissed,
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
