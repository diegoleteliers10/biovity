import { NextResponse } from "next/server"
import { z } from "zod"
import { getServerSession } from "@/lib/auth"
import { pool } from "@/lib/db"

const evaluationSchema = z.object({
  applicationId: z.string().uuid(),
  rating: z.enum(["positive", "neutral", "negative"]),
  notes: z.string().optional(),
  skillsAssessment: z.record(z.string(), z.string()).optional(),
})

export async function GET(request: Request) {
  const session = await getServerSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const applicationId = searchParams.get("applicationId")

  if (!applicationId) {
    return NextResponse.json({ error: "applicationId required" }, { status: 400 })
  }

  const result = await pool.query(
    `SELECT ae.*, u.name as evaluator_name
     FROM application_evaluation ae
     JOIN "user" u ON u.id = ae.evaluator_id
     WHERE ae.application_id = $1
     ORDER BY ae.created_at DESC`,
    [applicationId]
  )

  return NextResponse.json(result.rows)
}

export async function PATCH(request: Request) {
  const session = await getServerSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const body = await request.json()
  const parsed = evaluationSchema.partial().safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Datos invalidos" },
      { status: 400 }
    )
  }

  const { applicationId, rating, notes, skillsAssessment } = parsed.data
  if (!applicationId || !rating) {
    return NextResponse.json({ error: "applicationId and rating required" }, { status: 400 })
  }

  const result = await pool.query(
    `INSERT INTO application_evaluation (application_id, evaluator_id, rating, notes, skills_assessment)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (application_id, evaluator_id) DO UPDATE SET
       rating = EXCLUDED.rating,
       notes = EXCLUDED.notes,
       skills_assessment = EXCLUDED.skills_assessment,
       updated_at = now()
     RETURNING *`,
    [
      applicationId,
      session.user.id,
      rating,
      notes ?? null,
      skillsAssessment ? JSON.stringify(skillsAssessment) : "{}",
    ]
  )

  return NextResponse.json(result.rows[0])
}
