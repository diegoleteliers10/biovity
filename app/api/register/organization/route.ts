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

    // Server-side sign up via better-auth, get raw response to forward cookies
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

    if (response instanceof Response) {
      const data = await response.json()
      if (data.error) {
        return NextResponse.json(data, { status: 400 })
      }
    }

    // Extract set-cookie header to forward to client
    const setCookie = response.headers.get("set-cookie")

    // Get session to get userId
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    const userId = session?.user?.id
    if (!userId) {
      return NextResponse.json({ error: "Error al obtener el usuario" }, { status: 500 })
    }

    // Create organization
    const orgResult = await pool.query<{ id: string }>(
      `INSERT INTO organization (name, website, created_at, updated_at)
       VALUES ($1, $2, NOW(), NOW())
       RETURNING id`,
      [parsed.organizationName, parsed.organizationWebsite || null]
    )

    const organizationId = orgResult.rows[0]?.id
    if (!organizationId) {
      return NextResponse.json({ error: "Error al crear la organización" }, { status: 500 })
    }

    // Link user to organization
    await pool.query(`UPDATE "user" SET organization_id = $1 WHERE id = $2`, [
      organizationId,
      userId,
    ])

    const responseHeaders = new Headers()
    if (setCookie) {
      responseHeaders.set("Set-Cookie", setCookie)
    }
    responseHeaders.set("Content-Type", "application/json")

    return new NextResponse(JSON.stringify({ user: session?.user, organizationId }), {
      status: 200,
      headers: responseHeaders,
    })
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
