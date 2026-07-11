import { NextResponse } from "next/server"
import { z } from "zod"
import { getServerSession } from "@/lib/auth"
import { pool } from "@/lib/db"

const noteSchema = z.object({
  applicationId: z.string().uuid(),
  content: z.string().min(1),
  tags: z.array(z.string()).optional(),
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
    `SELECT an.*, u.name as author_name
     FROM application_note an
     JOIN "user" u ON u.id = an.author_id
     WHERE an.application_id = $1
     ORDER BY an.created_at DESC`,
    [applicationId]
  )

  return NextResponse.json(result.rows)
}

export async function POST(request: Request) {
  const session = await getServerSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const body = await request.json()
  const parsed = noteSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Datos invalidos" },
      { status: 400 }
    )
  }

  const { applicationId, content, tags } = parsed.data

  const result = await pool.query(
    `INSERT INTO application_note (application_id, author_id, content, tags)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [applicationId, session.user.id, content, tags ?? []]
  )

  return NextResponse.json(result.rows[0])
}

export async function DELETE(request: Request) {
  const session = await getServerSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const noteId = searchParams.get("id")

  if (!noteId) {
    return NextResponse.json({ error: "note id required" }, { status: 400 })
  }

  await pool.query(`DELETE FROM application_note WHERE id = $1 AND author_id = $2`, [
    noteId,
    session.user.id,
  ])

  return NextResponse.json({ success: true })
}
