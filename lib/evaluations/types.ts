export type EvaluationRating = "positive" | "neutral" | "negative"
export type EvaluationContext =
  | "cv_review"
  | "initial_interview"
  | "technical_interview"
  | "final_review"
export type Evaluation = {
  id: string
  application_id: string
  evaluator_id: string
  evaluator_name?: string
  rating: EvaluationRating
  notes: string | null
  skills_assessment: Record<string, string>
  created_at: string
  updated_at: string
}
export type EvaluationInput = {
  rating: EvaluationRating
  notes?: string
  skillsAssessment?: Record<string, string>
}

export type EvaluationQueryData =
  | { kind: "ready"; evaluations: Evaluation[] }
  | { kind: "failed"; evaluations: Evaluation[] | undefined; error: Error }
