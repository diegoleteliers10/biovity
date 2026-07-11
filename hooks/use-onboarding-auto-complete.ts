"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { useOnboarding } from "@/hooks/use-onboarding"
import type { OnboardingStep } from "@/lib/validations/onboarding"

const PATH_TO_STEP: Record<string, OnboardingStep> = {
  "/dashboard/talent": "view_talent",
  "/dashboard/profile": "complete_profile",
}

export function useOnboardingAutoComplete() {
  const { steps, completeStep } = useOnboarding()
  const pathname = usePathname()

  useEffect(() => {
    const step = PATH_TO_STEP[pathname]
    if (step && !steps.includes(step)) {
      completeStep.mutate(step)
    }
  }, [pathname, steps, completeStep])
}
