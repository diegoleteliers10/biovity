import { Result } from "better-result"
import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getAllModuleProgress, upsertModuleProgress } from "@/lib/db/capsules"

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const slug = searchParams.get("slug")

  if (!slug) {
    return NextResponse.json({ error: "Falta parámetro slug" }, { status: 400 })
  }

  const result = await getAllModuleProgress(session.user.id, slug)
  if (Result.isError(result)) {
    return NextResponse.json({ error: "Error al obtener progreso" }, { status: 500 })
  }

  return NextResponse.json({ modules: result.value })
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const body = await request.json()
  const { slug, moduleIndex, completed } = body as {
    slug: string
    moduleIndex: number
    completed: boolean
  }

  if (!slug || moduleIndex == null || typeof completed !== "boolean") {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
  }

  const result = await upsertModuleProgress(session.user.id, slug, moduleIndex, completed)
  if (Result.isError(result)) {
    return NextResponse.json({ error: "Error al guardar progreso" }, { status: 500 })
  }

  return NextResponse.json({ module: result.value })
}
