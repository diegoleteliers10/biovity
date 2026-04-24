"use client"

import { useCallback, useState } from "react"
import type { CandidateScore } from "@/app/api/ai/score-candidates/route"
import type { CandidateContext, JobOfferContext } from "@/lib/ai/types"
import type { Resume } from "@/lib/api/resumes"

type ScoreEntry = {
  score: CandidateScore
  analyzedAt: Date
}

export type { ScoreEntry }

export function useKanbanAIScoring() {
  const [scores, setScores] = useState<Map<string, ScoreEntry>>(new Map())
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzedAt, setAnalyzedAt] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  const analyze = useCallback(
    async (
      candidates: { id: string; data: CandidateContext }[],
      jobOffer: JobOfferContext,
      resumes?: Record<string, Resume>
    ) => {
      if (!candidates.length) return

      setIsAnalyzing(true)
      setError(null)

      try {
        const candidatesWithResume = candidates.map((c) => {
          const resume = resumes?.[c.id]
          return {
            ...c,
            data: {
              ...c.data,
              resumeUrl: resume?.cvFile?.url,
              experiences:
                resume?.experiences
                  ?.map((e) => [e.title, e.company, e.description].filter(Boolean).join(" - "))
                  .filter(Boolean) ?? [],
              certifications:
                resume?.certifications?.map((cert) => cert.name || cert.title).filter(Boolean) ??
                [],
              languages:
                resume?.languages?.map((lang) => lang.name || lang.language).filter(Boolean) ?? [],
            },
          }
        })

        const res = await fetch("/api/ai/score-candidates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ candidates: candidatesWithResume, jobOffer }),
        })

        if (!res.ok) throw new Error("API error")

        const data = (await res.json()) as { scores: CandidateScore[] }
        const now = new Date()

        setScores((prev) => {
          const next = new Map(prev)
          for (const s of data.scores) {
            next.set(s.candidateId, { score: s, analyzedAt: now })
          }
          return next
        })
        setAnalyzedAt(now)
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al analizar")
      } finally {
        setIsAnalyzing(false)
      }
    },
    []
  )

  const clearScores = useCallback(() => {
    setScores(new Map())
    setAnalyzedAt(null)
    setError(null)
  }, [])

  const getScore = useCallback(
    (candidateId: string): ScoreEntry | undefined => scores.get(candidateId),
    [scores]
  )

  return { analyze, clearScores, getScore, scores, isAnalyzing, analyzedAt, error }
}
