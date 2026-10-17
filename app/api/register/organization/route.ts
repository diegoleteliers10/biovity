import { Result } from "better-result"
import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { registerOrganizationForUser } from "@/lib/api/organizations"
import { auth } from "@/lib/auth"
import { ApiError } from "@/lib/errors"
import { matchesOrganizationEmailDomain } from "@/lib/organization-domain"
import { organizationLoginEmailSchema } from "@/lib/validations/primitives"

const registerOrganizationSchema = z
  .object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: organizationLoginEmailSchema,
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    contactPosition: z.string().optional(),
    organizationName: z.string().min(2, "El nombre de la organización es requerido"),
    organizationWebsite: z.string().url("URL inválida"),
  })
  .refine((data) => matchesOrganizationEmailDomain(data.email, data.organizationWebsite), {
    message: "El correo corporativo debe usar el mismo dominio que el sitio web de la empresa",
    path: ["organizationWebsite"],
  })

const signUpResponseSchema = z
  .object({
    user: z.object({ id: z.string().min(1) }).optional(),
    token: z.string().nullable().optional(),
    error: z.union([z.string(), z.object({ message: z.string().optional() })]).optional(),
    message: z.string().optional(),
  })
  .passthrough()

export async function POST(request: NextRequest) {
  const bodyResult = await Result.tryPromise(() => request.json())
  if (bodyResult.isErr()) {
    return NextResponse.json({ error: "El cuerpo debe ser JSON válido" }, { status: 400 })
  }

  const parsed = registerOrganizationSchema.safeParse(bodyResult.value)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Datos inválidos" },
      { status: 400 }
    )
  }

  const signUpResult = await Result.tryPromise(() =>
    auth.api.signUpEmail({
      body: {
        email: parsed.data.email,
        password: parsed.data.password,
        name: parsed.data.name,
        type: "organization",
        profession: parsed.data.contactPosition || "Representante",
        avatar: "",
      },
      asResponse: true,
    })
  )
  if (signUpResult.isErr()) {
    console.error("[register/organization] Better Auth signup failed", signUpResult.error)
    return NextResponse.json({ error: "No pudimos crear la cuenta" }, { status: 500 })
  }

  if (!signUpResult.value.ok) {
    const status = signUpResult.value.status
    const signUpErrorResult = await Result.tryPromise(() => signUpResult.value.json())
    const signUpError = signUpErrorResult.isOk()
      ? signUpResponseSchema.safeParse(signUpErrorResult.value)
      : null
    const message = signUpError?.success
      ? (signUpError.data.message ??
        (typeof signUpError.data.error === "string"
          ? signUpError.data.error
          : signUpError.data.error?.message))
      : undefined
    return NextResponse.json(
      { error: message ?? "No pudimos crear la cuenta" },
      { status: status >= 400 && status < 500 ? 400 : 502 }
    )
  }

  const signUpBodyResult = await Result.tryPromise(() => signUpResult.value.json())
  if (signUpBodyResult.isErr()) {
    console.error(
      "[register/organization] Better Auth response was invalid",
      signUpBodyResult.error
    )
    return NextResponse.json({ error: "No pudimos completar el registro" }, { status: 502 })
  }

  const signUpBody = signUpResponseSchema.safeParse(signUpBodyResult.value)
  if (!signUpBody.success) {
    return NextResponse.json({ error: "No pudimos completar el registro" }, { status: 502 })
  }

  if (signUpBody.data.error) {
    const message =
      typeof signUpBody.data.error === "string"
        ? signUpBody.data.error
        : (signUpBody.data.error.message ?? "No pudimos crear la cuenta")
    return NextResponse.json({ error: message }, { status: 400 })
  }

  const userId = signUpBody.data.user?.id
  if (!userId) {
    return NextResponse.json({ error: "No pudimos obtener la cuenta creada" }, { status: 502 })
  }

  const organizationResult = await registerOrganizationForUser({
    ownerUserId: userId,
    name: parsed.data.organizationName,
    website: parsed.data.organizationWebsite,
  })
  if (organizationResult.isErr()) {
    if (organizationResult.error instanceof ApiError && organizationResult.error.status === 404) {
      return NextResponse.json({ success: true })
    }
    console.error(
      `[register/organization] organization creation failed for user ${userId}`,
      organizationResult.error
    )
    return NextResponse.json(
      {
        error:
          "La cuenta se creó, pero falta guardar los datos de la organización. Verifica tu correo e inicia sesión para completar el registro.",
      },
      { status: 502 }
    )
  }

  return NextResponse.json({
    user: signUpBody.data.user,
    organizationId: organizationResult.value.id,
  })
}
