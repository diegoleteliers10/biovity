import { Result } from "better-result"
import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { createCertificate, getCapsuleProgress, upsertCapsuleProgress } from "@/lib/db/capsules"
import { getCapsuleBySlug } from "@/lib/posts"

const PASS_THRESHOLD = 0.7

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const body = await request.json()
  const { category, slug, answers } = body as {
    category: string
    slug: string
    answers: number[]
  }

  if (!category || !slug || !Array.isArray(answers)) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
  }

  const capsuleResult = await getCapsuleBySlug(category, slug)
  if (Result.isError(capsuleResult)) {
    return NextResponse.json({ error: "Cápsula no encontrada" }, { status: 404 })
  }

  const capsule = capsuleResult.value
  const quiz = capsule.frontmatter.quiz

  if (answers.length !== quiz.length) {
    return NextResponse.json({ error: "Número de respuestas inválido" }, { status: 400 })
  }

  let correct = 0
  for (let i = 0; i < quiz.length; i++) {
    if (answers[i] === quiz[i].correct) correct++
  }

  const score = correct / quiz.length
  const quizPassed = score >= PASS_THRESHOLD

  const progressResult = await upsertCapsuleProgress(session.user.id, slug, {
    completed: true,
    quiz_passed: quizPassed,
    quiz_score: correct,
  })

  if (Result.isError(progressResult)) {
    return NextResponse.json({ error: "Error al guardar progreso" }, { status: 500 })
  }

  if (quizPassed) {
    const certResult = await createCertificate(session.user.id, slug, capsule.frontmatter.title)
    if (Result.isError(certResult)) {
      console.error("Failed to create certificate:", certResult.error)
    }
  }

  return NextResponse.json({
    correct,
    total: quiz.length,
    score: Math.round(score * 100),
    quizPassed,
  })
}

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

  const result = await getCapsuleProgress(session.user.id, slug)
  if (Result.isError(result)) {
    return NextResponse.json({ error: "Error al obtener progreso" }, { status: 500 })
  }

  return NextResponse.json({ progress: result.value })
}
