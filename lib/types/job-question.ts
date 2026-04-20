import type { QuestionStatus, QuestionType } from "@/lib/validations/question"

export type JobQuestionResponse = {
  id: string
  jobId: string
  organizationId: string
  label: string
  type: QuestionType
  required: boolean
  orderIndex: number
  status: QuestionStatus
  placeholder?: string
  helperText?: string
  options?: string[]
  createdAt: string
  updatedAt: string
}
