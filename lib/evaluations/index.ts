import { z } from "zod"
import type { Evaluation } from "./types"

export { evaluationContextLabels, evaluationRatingLabels } from "./constants"
export type { Evaluation, EvaluationContext, EvaluationInput, EvaluationRating } from "./types"

export const evaluationRatingSchema = z.enum(["positive", "neutral", "negative"])
export const evaluationContextSchema = z.enum([
  "cv_review",
  "initial_interview",
  "technical_interview",
  "final_review",
])
const scoreSchema = z.string().regex(/^[0-5]$/, "El puntaje debe ser un entero de 0 a 5")
const assessmentSchema = z.record(z.string(), z.string()).superRefine((assessment, ctx) => {
  for (const key of ["technical", "cultural", "expectations"]) {
    if (assessment[key] !== undefined && !scoreSchema.safeParse(assessment[key]).success)
      ctx.addIssue({
        code: "custom",
        path: [key],
        message: "El puntaje debe ser un entero de 0 a 5",
      })
  }
  if (
    assessment.context !== undefined &&
    !evaluationContextSchema.safeParse(assessment.context).success
  )
    ctx.addIssue({ code: "custom", path: ["context"], message: "Contexto inválido" })
})
export const evaluationInputSchema = z
  .object({
    applicationId: z.string().uuid(),
    rating: evaluationRatingSchema,
    notes: z.string().optional(),
    skillsAssessment: assessmentSchema.optional(),
  })
  .superRefine((input, ctx) => {
    if (input.rating !== "positive" && !input.notes?.trim())
      ctx.addIssue({
        code: "custom",
        path: ["notes"],
        message: "Agrega una nota para esta recomendación",
      })
  })
export const evaluationSchema = z.object({
  id: z.string(),
  application_id: z.string(),
  evaluator_id: z.string(),
  evaluator_name: z.string().optional(),
  rating: evaluationRatingSchema,
  notes: z.string().nullable(),
  skills_assessment: z.record(z.string(), z.string()),
  created_at: z.string(),
  updated_at: z.string(),
})
export function latestEvaluationByApplication(
  evaluations: readonly Evaluation[]
): Map<string, Evaluation> {
  const latest = new Map<string, Evaluation>()
  for (const evaluation of evaluations) {
    const previous = latest.get(evaluation.application_id)
    if (
      !previous ||
      evaluation.updated_at > previous.updated_at ||
      (evaluation.updated_at === previous.updated_at && evaluation.id > previous.id)
    )
      latest.set(evaluation.application_id, evaluation)
  }
  return latest
}
