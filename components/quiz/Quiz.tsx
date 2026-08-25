"use client"

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
}

export function Quiz({ questions, category, slug }: Props) {
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

  if (result) {
    return (
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
          {result.quizPassed ? "¡Aprobaste!" : "No aprobaste"}
        </h3>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Obtuviste {result.correct} de {result.total} respuestas correctas ({result.score}%).
        </p>
        {result.quizPassed ? (
          <a
            href={`/certificados/${slug}`}
            className="mt-4 inline-flex items-center px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
          >
            Ver certificado
          </a>
        ) : (
          <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
            Necesitas al menos 70% para obtener el certificado. Intenta de nuevo.
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
        Evalúa tu aprendizaje
      </h3>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        Necesitas 70% o más para obtener el certificado.
      </p>

      <div className="mt-6 space-y-6">
        {questions.map((q, qi) => (
          <div key={qi}>
            <p className="font-medium text-neutral-900 dark:text-white">
              {qi + 1}. {q.q}
            </p>
            <div className="mt-2 space-y-2">
              {q.options.map((opt, oi) => {
                const isSelected = answers[qi] === oi
                const isCorrect = submitted && oi === q.correct
                const isWrong = submitted && isSelected && oi !== q.correct

                return (
                  <button
                    key={oi}
                    type="button"
                    onClick={() => handleSelect(qi, oi)}
                    disabled={submitted}
                    className={`w-full text-left px-4 py-2 rounded-lg border text-sm transition-colors ${
                      isCorrect
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                        : isWrong
                          ? "border-red-500 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300"
                          : isSelected
                            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950"
                            : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
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

      {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!allAnswered || loading}
        className="mt-6 w-full px-4 py-2.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Enviando..." : "Enviar respuestas"}
      </button>
    </div>
  )
}
