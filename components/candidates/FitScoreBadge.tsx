"use client"

import { useEffect, useState } from "react"
import type { CandidateContext, FitScoreResult, JobOfferContext } from "@/lib/ai/types"

interface Props {
  candidate: CandidateContext
  jobOffer: JobOfferContext
}

export function FitScoreBadge({ candidate, jobOffer }: Props) {
  const [score, setScore] = useState<FitScoreResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/ai/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidate, jobOffer }),
    })
      .then((r) => r.json())
      .then((data: FitScoreResult) => setScore(data))
      .finally(() => setLoading(false))
  }, [candidate, jobOffer])

  if (loading) return <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
  if (!score) return null

  const color =
    score.score >= 75
      ? "bg-emerald-100 text-emerald-700"
      : score.score >= 50
        ? "bg-amber-100 text-amber-700"
        : "bg-red-100 text-red-700"

  return (
    <span
      title={score.reason}
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}
    >
      {score.score}/100 · {score.label}
    </span>
  )
}
