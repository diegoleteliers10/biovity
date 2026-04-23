export type AIActionType =
  | "summarize_candidates"
  | "generate_reply"
  | "generate_job_description"
  | "enhance_profile"
  | "generate_cover_letter"
  | "generate_interview_questions"
  | "score_candidate_fit"

export type AIActionPayload = {
  action: AIActionType
  context: Record<string, unknown>
}

export type CandidateContext = {
  name: string
  education: string
  skills: string[]
  yearsOfExperience: number
  bio: string
  specialization?: string
  resumeUrl?: string
  experiences?: string[]
  certifications?: string[]
  languages?: string[]
}

export type JobOfferContext = {
  title: string
  description: string
  requiredSkills: string[]
  minExperience: number
  area?: string
  companyName?: string
  contractType?: string
  modality?: string
}

export type MessageContext = {
  content: string
  senderRole: "recruiter" | "candidate"
}

export type FitScoreResult = {
  score: number
  label: "Excelente" | "Bueno" | "Regular" | "Bajo"
  reason: string
}
