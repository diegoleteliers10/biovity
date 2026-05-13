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

    // Server-side sign up via better-auth, get raw response to forward cookies
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

    if (response instanceof Response) {
      const data = await response.json()
      if (data.error) {
        return NextResponse.json(data, { status: 400 })
      }
    }

    // Extract set-cookie header to forward to client
    const setCookie = response.headers.get("set-cookie")

    // Get session to return userId
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    const responseHeaders = new Headers()
    if (setCookie) {
      responseHeaders.set("Set-Cookie", setCookie)
    }
    responseHeaders.set("Content-Type", "application/json")

    return new NextResponse(JSON.stringify({ user: session?.user, session: session?.session }), {
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
    console.error("[register/professional]", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
