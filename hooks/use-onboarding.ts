"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { OnboardingStep } from "@/lib/validations/onboarding"

const onboardingKey = ["onboarding"] as const

export function useOnboarding() {
  const queryClient = useQueryClient()

  const { data, isPending } = useQuery({
    queryKey: onboardingKey,
    queryFn: async () => {
      const res = await fetch("/api/onboarding")
      if (!res.ok) return { steps: [] as OnboardingStep[], dismissed: false }
      return res.json() as Promise<{ steps: OnboardingStep[]; dismissed: boolean }>
    },
    staleTime: 5 * 60 * 1000,
  })

  const completeStep = useMutation({
    mutationFn: async (step: OnboardingStep) => {
      const res = await fetch("/api/onboarding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step }),
      })
      if (!res.ok) throw new Error("Failed")
      return res.json() as Promise<{ steps: OnboardingStep[]; dismissed: boolean }>
    },
    onSuccess: (result) => {
      queryClient.setQueryData(onboardingKey, result)
    },
  })

  const dismiss = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/onboarding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dismiss: true }),
      })
      if (!res.ok) throw new Error("Failed")
      return res.json() as Promise<{ steps: OnboardingStep[]; dismissed: boolean }>
    },
    onSuccess: (result) => {
      queryClient.setQueryData(onboardingKey, result)
    },
  })

  const steps = data?.steps ?? []
  const dismissed = data?.dismissed ?? false
  const isComplete = steps.length >= 4

  return { steps, dismissed, isComplete, isPending, completeStep, dismiss }
}
