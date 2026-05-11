"use client"

import type { CandidateContext, JobOfferContext } from "@/lib/ai/types"
import { useFitScoreQuery } from "@/lib/api/use-fit-score"

type Props = {
  candidate: CandidateContext
  jobOffer: JobOfferContext
}

export function FitScoreBadge({ candidate, jobOffer }: Props) {
  const { data: score, isLoading } = useFitScoreQuery(candidate, jobOffer)

  if (isLoading) return <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
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
