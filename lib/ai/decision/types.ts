export type ScoreStatus = "pending" | "processing" | "ready" | "insufficient" | "failed"

export type ExplanationStatus = "pending" | "processing" | "ready" | "failed" | "expired"

export type ScoreDetails = {
  applicationId: string
  candidateId: string
  revisionId: string
  status: ScoreStatus
  score: number | null
  label: "Bajo" | "Regular" | "Bueno" | "Excelente" | null
  confidence: number | null
  sufficiency: number | null
  distribution: Record<string, number> | null
  perQuestion: Record<string, unknown> | null
  explanationStatus: ExplanationStatus
  errorCode: string | null
  updatedAt: string
}

export type CandidateAssessmentInput = {
  applicationId: string
  candidateId: string
  jobId: string
  organizationId: string
  requestedBy: string
  fingerprint: string
  jobSnapshot: Record<string, unknown>
  candidateSnapshot: Record<string, unknown>
}

export type ClaimedAssessment = CandidateAssessmentInput & {
  revisionId: string
  leaseToken: string
  attempts: number
}

export type JevAssessment = {
  model: string
  score: number
  confidence: number
  sufficiency: number
  distribution: Record<string, number>
  perQuestion: Record<string, unknown>
  inputTokens: number
  outputTokens: number
}

export type ScoreExplanation = {
  evidenceFormat?: "plain-text"
  reason: string
  strengths: { text: string; evidence: string }[]
  gaps: { text: string; evidence: string }[]
  recommendation: "Avanzar" | "Evaluar" | "Descartar"
}

export type JevAuditOutcome =
  | { status: "ready" | "insufficient"; result: JevAssessment }
  | { status: "failed"; errorCode: "provider_error" | "persistence_error"; result?: JevAssessment }
  | { status: "aborted"; errorCode: "lease_lost"; result: JevAssessment }
