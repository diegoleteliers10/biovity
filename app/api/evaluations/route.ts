import { Result } from "better-result"
import { NextResponse } from "next/server"
import { z } from "zod"
import { getServerSession } from "@/lib/auth"
import { authorizeResource } from "@/lib/auth/resource-access"
import { pool } from "@/lib/db"
import { ApiError } from "@/lib/errors"
import { evaluationInputSchema } from "@/lib/evaluations"

export async function GET(request: Request) {
  const session = await getServerSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const singleId = searchParams.get("applicationId")
  const batchIds = searchParams.get("applicationIds")
  const requestedIds = batchIds?.split(",") ?? (singleId ? [singleId] : [])
  if (
    (singleId && batchIds !== null) ||
    requestedIds.length === 0 ||
    requestedIds.length > 100 ||
    requestedIds.some((id) => !z.string().uuid().safeParse(id).success)
  )
    return NextResponse.json(
      { error: "Indica entre 1 y 100 postulaciones válidas" },
      { status: 400 }
    )
  const applicationIds = [...new Set(requestedIds)]
  for (const applicationId of applicationIds) {
    const access = await authorizeResource({ kind: "application", id: applicationId }, "recruit")
    if (access.isErr())
      return NextResponse.json({ error: access.error.message }, { status: access.error.status })
  }
  const query = await Result.tryPromise({
    try: () =>
      pool.query(
        `SELECT ae.*, u.name as evaluator_name
       FROM application_evaluation ae
       JOIN "user" u ON u.id = ae.evaluator_id
       WHERE ae.application_id = ANY($1::uuid[])
       ORDER BY ae.updated_at DESC, ae.id DESC`,
        [applicationIds]
      ),
    catch: () => new ApiError({ status: 503, message: "No se pudieron cargar las evaluaciones" }),
  })
  if (query.isErr()) return NextResponse.json({ error: query.error.message }, { status: 503 })
  const result = query.value

  return NextResponse.json(result.rows)
}

export async function PATCH(request: Request) {
  const session = await getServerSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const bodyResult = await Result.tryPromise({
    try: () => request.json(),
    catch: () => new ApiError({ status: 400, message: "Solicitud inválida" }),
  })
  if (bodyResult.isErr()) return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 })
  const body = bodyResult.value
  const parsed = evaluationInputSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Datos invalidos" },
      { status: 400 }
    )
  }

  const { applicationId, rating, notes, skillsAssessment } = parsed.data

  const access = await authorizeResource({ kind: "application", id: applicationId }, "recruit")
  if (access.isErr())
    return NextResponse.json({ error: access.error.message }, { status: access.error.status })

  const query = await Result.tryPromise({
    try: () =>
      pool.query(
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
      ),
    catch: () => new ApiError({ status: 503, message: "No se pudo guardar la evaluación" }),
  })
  if (query.isErr()) return NextResponse.json({ error: query.error.message }, { status: 503 })
  return NextResponse.json(query.value.rows[0])
}
