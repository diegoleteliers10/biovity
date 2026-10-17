import { Result } from "better-result"
import { fetchJson } from "@/lib/result"

export type InterviewRating = "positive" | "neutral" | "negative"
export type InterviewRecommendation = "advance" | "hold" | "no_advance"

export type EventInterviewRubric = {
  version_id: string | null
  stage_name: string
  roles: Array<{ id: string; label: string }>
  criteria: Array<{
    id: string
    label: string
    description: string | null
    roleIds: string[]
  }>
}

export type EventInterviewCriterionResponse = {
  criterion_id: string
  score: number
  evidence: string | null
}

export type EventInterviewEvaluation = {
  id: string
  event_id: string
  rubric_version_id: string | null
  evaluator_id: string
  evaluator_name: string
  evaluator_role_id: string | null
  evaluator_role_label: string | null
  rating: InterviewRating
  notes: string | null
  skills_assessment: Record<string, string>
  criterion_responses: EventInterviewCriterionResponse[]
  recommendation: InterviewRecommendation | null
  created_at: string
  updated_at: string
}

export type EventInterviewOutcome = {
  event_id: string
  outcome: InterviewRecommendation
  decision_maker_id: string
  decision_maker_name: string
  notes: string | null
  updated_at: string
}

export type EventInterviewOutcomeSummary = Pick<EventInterviewOutcome, "outcome"> &
  Partial<Pick<EventInterviewOutcome, "notes">>

export type EventInterviewAuditRecord = {
  id: string
  actor_id: string
  actor_name: string
  record_type: "evaluation" | "outcome"
  subject_user_id: string | null
  action: "saved" | "changed"
  before_data: Record<string, unknown> | null
  after_data: Record<string, unknown>
  created_at: string
}

export type EventInterviewRecords = {
  rubric: EventInterviewRubric | null
  evaluations: EventInterviewEvaluation[]
  outcome: EventInterviewOutcomeSummary | null
  audit: EventInterviewAuditRecord[]
  viewerRoleId: string | null
  viewerRoleLabel: string | null
  canViewHiringRecords: boolean
  canEvaluate: boolean
  canViewOutcome: boolean
  canDecideOutcome: boolean
}

export async function getEventInterviewRecords(eventId: string) {
  const result = await fetchJson<EventInterviewRecords>(
    `/api/v1/events/${eventId}/interview-evaluations`
  )
  return Result.isOk(result) ? Result.ok(result.value) : Result.err(result.error)
}

export async function saveEventInterviewEvaluation(
  eventId: string,
  input: {
    rating: InterviewRating
    notes?: string
    skillsAssessment?: Record<string, string>
    criterionResponses?: Array<{
      criterionId: string
      score: number
      evidence?: string
    }>
    recommendation?: InterviewRecommendation
  }
) {
  const result = await fetchJson<EventInterviewEvaluation>(
    `/api/v1/events/${eventId}/interview-evaluations/me`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }
  )
  return Result.isOk(result) ? Result.ok(result.value) : Result.err(result.error)
}

export async function saveEventInterviewOutcome(
  eventId: string,
  input: { outcome: InterviewRecommendation; notes?: string }
) {
  const result = await fetchJson<EventInterviewOutcome>(
    `/api/v1/events/${eventId}/interview-outcome`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }
  )
  return Result.isOk(result) ? Result.ok(result.value) : Result.err(result.error)
}
