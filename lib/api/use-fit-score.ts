"use client"

import { useQuery } from "@tanstack/react-query"
import type { CandidateContext, FitScoreResult, JobOfferContext } from "@/lib/ai/types"

export const fitScoreKeys = {
  score: (candidateId: string, jobOfferId: string) =>
    ["fit-score", candidateId, jobOfferId] as const,
}

async function getFitScore(
  candidate: CandidateContext,
  jobOffer: JobOfferContext
): Promise<FitScoreResult> {
  const res = await fetch("/api/ai/score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ candidate, jobOffer }),
  })
  if (!res.ok) throw new Error("Failed to fetch fit score")
  return res.json() as Promise<FitScoreResult>
}

export function useFitScoreQuery(candidate: CandidateContext, jobOffer: JobOfferContext) {
  return useQuery({
    queryKey: fitScoreKeys.score(candidate.name, jobOffer.title),
    queryFn: () => getFitScore(candidate, jobOffer),
    enabled: Boolean(candidate.name) && Boolean(jobOffer.title),
  })
}
