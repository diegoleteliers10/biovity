"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export type Evaluation = {
  id: string
  application_id: string
  evaluator_id: string
  evaluator_name: string
  rating: "positive" | "neutral" | "negative"
  notes: string | null
  skills_assessment: Record<string, string>
  created_at: string
  updated_at: string
}

const evalKey = (applicationId: string) => ["evaluations", applicationId] as const

export function useEvaluations(applicationId: string | undefined) {
  return useQuery({
    queryKey: evalKey(applicationId ?? ""),
    queryFn: async () => {
      if (!applicationId) return [] as Evaluation[]
      const res = await fetch(`/api/evaluations?applicationId=${applicationId}`)
      if (!res.ok) return [] as Evaluation[]
      return res.json() as Promise<Evaluation[]>
    },
    enabled: Boolean(applicationId),
    staleTime: 30 * 1000,
  })
}

export function useUpsertEvaluationMutation(applicationId: string | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: {
      rating: "positive" | "neutral" | "negative"
      notes?: string
      skillsAssessment?: Record<string, string>
    }) => {
      const res = await fetch("/api/evaluations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, ...input }),
      })
      if (!res.ok) throw new Error("Failed to save evaluation")
      return res.json() as Promise<Evaluation>
    },
    onSuccess: () => {
      if (applicationId) {
        queryClient.invalidateQueries({ queryKey: evalKey(applicationId) })
      }
    },
  })
}
