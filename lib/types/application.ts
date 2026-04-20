import type { ApplicationStatus } from "@/lib/validations/application"

export type ApplicationAnswerResponse = {
  id: string
  questionId: string
  value: string
  createdAt: string
}

export type ApplicationJobSummary = {
  id: string
  title: string
  organizationId: string
}

export type ApplicationCandidateSummary = {
  id: string
  name: string
  email: string
  avatar?: string
  profession?: string
}

export type ApplicationResponse = {
  id: string
  jobId: string
  candidateId: string
  status: ApplicationStatus
  coverLetter?: string
  salaryMin?: number
  salaryMax?: number
  salaryCurrency: string
  availabilityDate?: string
  resumeUrl?: string
  createdAt: string
  updatedAt: string
  job?: ApplicationJobSummary
  candidate?: ApplicationCandidateSummary
  answers?: ApplicationAnswerResponse[]
}
