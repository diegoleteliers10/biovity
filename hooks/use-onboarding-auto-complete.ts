"use client"

import { usePathname } from "next/navigation"
import { useRef } from "react"
import { useOnboarding } from "@/hooks/use-onboarding"
import type { OnboardingStep } from "@/lib/validations/onboarding"

const PATH_TO_STEP: Record<string, OnboardingStep> = {
  "/dashboard/talent": "view_talent",
  "/dashboard/profile": "complete_profile",
}

export function useOnboardingAutoComplete() {
  const { steps, completeStep } = useOnboarding()
  const pathname = usePathname()
  const requestedSteps = useRef<Set<OnboardingStep>>(new Set())

  if (pathname in PATH_TO_STEP) {
    const step = PATH_TO_STEP[pathname]
    if (!steps.includes(step) && !requestedSteps.current.has(step) && !completeStep.isPending) {
      requestedSteps.current.add(step)
      completeStep.mutate(step)
    }
  }
}
