import { type NextRequest, NextResponse } from "next/server"
import { ZodError, z } from "zod"
import { auth } from "@/lib/auth"
import { pool } from "@/lib/db"

const registerProfessionalSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  profession: z.string().min(1, "La profesión es requerida"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = registerProfessionalSchema.parse(body)

    // Check if email already exists
    const existingUser = await pool.query(`SELECT id FROM "user" WHERE LOWER(email) = LOWER($1)`, [
      parsed.email,
    ])
    if (existingUser.rows.length > 0) {
      return NextResponse.json({ error: "Ya existe una cuenta con este email" }, { status: 409 })
    }

    // Server-side sign up via better-auth. Email verification is required,
    // so no session is created here; the user must verify before signing in.
    const response = await auth.api.signUpEmail({
      body: {
        email: parsed.email,
        password: parsed.password,
        name: parsed.name,
        type: "professional",
        profession: parsed.profession,
        avatar: "",
      },
      asResponse: true,
    })

    if (!(response instanceof Response)) {
      return NextResponse.json({ error: "Error al crear la cuenta" }, { status: 500 })
    }

    const data = await response.json()
    if (data.error) {
      return NextResponse.json(data, { status: 400 })
    }

    const userId = (data.user as { id?: string } | undefined)?.id
    if (!userId) {
      return NextResponse.json({ error: "Error al obtener el usuario" }, { status: 500 })
    }

    return NextResponse.json({ user: data.user })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Datos inválidos" },
        { status: 400 }
      )
    }
    console.error("[register/professional]", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
