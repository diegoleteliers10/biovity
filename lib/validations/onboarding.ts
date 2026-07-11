import { z } from "zod"

export const onboardingSteps = [
  "complete_profile",
  "create_offer",
  "publish_offer",
  "view_talent",
] as const

export type OnboardingStep = (typeof onboardingSteps)[number]

export const onboardingStepSchema = z.enum(onboardingSteps)

export const updateOnboardingSchema = z.object({
  step: onboardingStepSchema.optional(),
  dismiss: z.boolean().optional(),
})
