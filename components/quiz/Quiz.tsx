"use client"

import { CancelCircleIcon, CheckmarkCircle02Icon, LockIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"
import type { QuizQuestion } from "@/lib/types/capsulas"

type QuizResult = {
  correct: number
  total: number
  score: number
  quizPassed: boolean
}

type Props = {
  questions: QuizQuestion[]
  category: string
  slug: string
  locked?: boolean
  completedModules?: number
  totalModules?: number
}

export function Quiz({
  questions,
  category,
  slug,
  locked = false,
  completedModules = 0,
  totalModules = 4,
}: Props) {
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null))
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const allAnswered = answers.every((a) => a !== null)

  const handleSelect = (questionIndex: number, optionIndex: number) => {
    if (submitted) return
    setAnswers((prev) => {
      const next = [...prev]
      next[questionIndex] = optionIndex
      return next
    })
  }

  const handleSubmit = async () => {
    if (!allAnswered || loading) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/capsules/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, slug, answers }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Error al enviar quiz")
        return
      }

      const data = await res.json()
      setResult(data)
      setSubmitted(true)
    } catch {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  if (locked) {
    return (
      <div className="rounded-xl bg-surface-container-low border border-border/40 p-6 shadow-none opacity-75">
        <div className="flex items-center gap-3 mb-3">
          <div className="size-10 rounded-full bg-muted flex items-center justify-center">
            <HugeiconsIcon icon={LockIcon} size={18} className="text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Quiz bloqueado</h3>
            <p className="text-sm text-muted-foreground">
              Completa todos los módulos para desbloquear el quiz.
            </p>
          </div>
        </div>
        <div className="mt-4 h-2 rounded-full bg-border/40 overflow-hidden">
          <div
            className="h-full bg-secondary rounded-full transition-all"
            style={{ width: `${(completedModules / totalModules) * 100}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {completedModules} de {totalModules} módulos completados
        </p>
      </div>
    )
  }

  if (result) {
    return (
      <div className="rounded-xl bg-surface-container-low border border-border/40 p-6 shadow-none">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`size-10 rounded-full flex items-center justify-center ${
              result.quizPassed ? "bg-secondary/10" : "bg-destructive/10"
            }`}
          >
            <HugeiconsIcon
              icon={result.quizPassed ? CheckmarkCircle02Icon : CancelCircleIcon}
              size={20}
              className={result.quizPassed ? "text-secondary" : "text-destructive"}
            />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              {result.quizPassed ? "¡Aprobaste!" : "No aprobaste"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {result.correct} de {result.total} correctas ({result.score}%)
            </p>
          </div>
        </div>
        {result.quizPassed ? (
          <a
            href={`/certificados/${slug}`}
            className="inline-flex items-center h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-medium transition-colors"
          >
            Ver certificado
          </a>
        ) : (
          <p className="text-sm text-muted-foreground">
            Necesitas al menos 70% para obtener el certificado. Intenta de nuevo.
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-surface-container-low border border-border/40 p-6 shadow-none">
      <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-2 block">
        EVALÚA TU APRENDIZAJE
      </span>
      <h3 className="text-lg font-semibold text-foreground">Quiz de la cápsula</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Necesitas 70% o más para obtener el certificado.
      </p>

      <div className="mt-8 space-y-6">
        {questions.map((q, qi) => (
          <div key={q.q}>
            <p className="font-medium text-foreground">
              {qi + 1}. {q.q}
            </p>
            <div className="mt-3 space-y-2">
              {q.options.map((opt, oi) => {
                const isSelected = answers[qi] === oi
                const isCorrect = submitted && oi === q.correct
                const isWrong = submitted && isSelected && oi !== q.correct

                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelect(qi, oi)}
                    disabled={submitted}
                    className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-colors ${
                      isCorrect
                        ? "border-secondary bg-secondary/10 text-secondary font-medium"
                        : isWrong
                          ? "border-destructive bg-destructive/10 text-destructive"
                          : isSelected
                            ? "border-secondary bg-secondary/5"
                            : "border-border/40 hover:border-secondary/40 hover:bg-surface-container-low/50"
                    }`}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!allAnswered || loading}
        className="mt-8 h-11 w-full px-6 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
      >
        {loading ? "Enviando..." : "Enviar respuestas"}
      </button>
    </div>
  )
}
