import { type NextRequest, NextResponse } from "next/server"
import { ZodError, z } from "zod"
import { auth } from "@/lib/auth"
import { pool } from "@/lib/db"

const registerOrganizationSchema = z.object({
  contactName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  contactEmail: z.string().email("Email inválido"),
  contactPassword: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  contactPosition: z.string().optional(),
  organizationName: z.string().min(2, "El nombre de la organización es requerido"),
  organizationWebsite: z.string().url("URL inválida").or(z.literal("")),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = registerOrganizationSchema.parse(body)

    // Check if email already exists
    const existingUser = await pool.query(`SELECT id FROM "user" WHERE LOWER(email) = LOWER($1)`, [
      parsed.contactEmail,
    ])
    if (existingUser.rows.length > 0) {
      return NextResponse.json({ error: "Ya existe una cuenta con este email" }, { status: 409 })
    }

    // Server-side sign up via better-auth. Email verification is required,
    // so no session is created here; the user must verify before signing in.
    const response = await auth.api.signUpEmail({
      body: {
        email: parsed.contactEmail,
        password: parsed.contactPassword,
        name: parsed.contactName,
        type: "organization",
        profession: parsed.contactPosition || "Representante",
        avatar: "",
      },
      asResponse: true,
    })

    if (!(response instanceof Response)) {
      return NextResponse.json({ error: "Error al registrar la organización" }, { status: 500 })
    }

    const data = await response.json()
    if (data.error) {
      return NextResponse.json(data, { status: 400 })
    }

    const userId = (data.user as { id?: string } | undefined)?.id
    if (!userId) {
      return NextResponse.json({ error: "Error al obtener el usuario" }, { status: 500 })
    }

    // Create organization + link user atomically
    const client = await pool.connect()
    try {
      await client.query("BEGIN")
      const orgResult = await client.query<{ id: string }>(
        `INSERT INTO organization (name, website, "createdAt", "updatedAt")
         VALUES ($1, $2, NOW(), NOW())
         RETURNING id`,
        [parsed.organizationName, parsed.organizationWebsite || null]
      )
      const organizationId = orgResult.rows[0]?.id
      if (!organizationId) {
        await client.query("ROLLBACK")
        return NextResponse.json({ error: "Error al crear la organización" }, { status: 500 })
      }
      await client.query(`UPDATE "user" SET "organizationId" = $1 WHERE id = $2`, [
        organizationId,
        userId,
      ])
      await client.query("COMMIT")

      return NextResponse.json({ user: data.user, organizationId })
    } catch (err) {
      await client.query("ROLLBACK")
      console.error("[register/organization] tx", err)
      return NextResponse.json({ error: "Error al crear la organización" }, { status: 500 })
    } finally {
      client.release()
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Datos inválidos" },
        { status: 400 }
      )
    }
    console.error("[register/organization]", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
