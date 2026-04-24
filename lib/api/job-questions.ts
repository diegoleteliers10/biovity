import { Result as R, type Result } from "better-result"
import type { ApiError, NetworkError } from "@/lib/errors"
import { fetchJson } from "@/lib/result"

const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
    : (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")

export type QuestionType =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "multiselect"
  | "boolean"
  | "date"

export type QuestionStatus = "draft" | "published"

export type JobQuestion = {
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

export type CreateQuestionInput = {
  label: string
  type: QuestionType
  required?: boolean
  placeholder?: string
  helperText?: string
  options?: string[]
  orderIndex?: number
  status?: QuestionStatus
}

export type UpdateQuestionInput = Partial<CreateQuestionInput>

export type ReorderQuestionItem = {
  id: string
  orderIndex: number
}

export async function getQuestionsByJob(
  jobId: string
): Promise<Result<JobQuestion[], ApiError | NetworkError>> {
  const result = await fetchJson<{ data?: JobQuestion[] } | JobQuestion[]>(
    `${API_BASE}/api/v1/jobs/${jobId}/questions`
  )
  if (result.isErr()) return R.err(result.error)
  const parsed = result.value as Record<string, unknown>
  const level1: unknown = parsed?.data ?? parsed
  const level1Obj = level1 as Record<string, unknown>
  const level2: unknown = level1Obj?.data ?? level1Obj
  const questions = Array.isArray(level2)
    ? level2
    : ((level2 as { data?: JobQuestion[] })?.data ?? [])
  return R.ok(questions)
}

export async function getOrgQuestionsByJob(
  orgId: string,
  jobId: string
): Promise<Result<JobQuestion[], ApiError | NetworkError>> {
  const result = await fetchJson<{ data?: JobQuestion[] } | JobQuestion[]>(
    `${API_BASE}/api/v1/organizations/${orgId}/jobs/${jobId}/questions`
  )
  if (result.isErr()) return R.err(result.error)
  const parsed = result.value as Record<string, unknown>
  const level1: unknown = parsed?.data ?? parsed
  const level1Obj = level1 as Record<string, unknown>
  const level2: unknown = level1Obj?.data ?? level1Obj
  const questions = Array.isArray(level2)
    ? level2
    : ((level2 as { data?: JobQuestion[] })?.data ?? [])
  return R.ok(questions)
}

export async function createQuestion(
  orgId: string,
  jobId: string,
  input: CreateQuestionInput
): Promise<Result<JobQuestion, ApiError | NetworkError>> {
  const result = await fetchJson<{ data?: JobQuestion } | JobQuestion>(
    `${API_BASE}/api/v1/organizations/${orgId}/jobs/${jobId}/questions`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }
  )
  if (result.isErr()) return R.err(result.error)
  const parsed = result.value as Record<string, unknown>
  const level1: unknown = parsed?.data ?? parsed
  const level1Obj = level1 as Record<string, unknown>
  const question: JobQuestion = (level1Obj?.data ?? level1Obj) as JobQuestion
  return R.ok(question)
}

export async function updateQuestion(
  questionId: string,
  input: UpdateQuestionInput
): Promise<Result<JobQuestion, ApiError | NetworkError>> {
  const result = await fetchJson<{ data?: JobQuestion } | JobQuestion>(
    `${API_BASE}/api/v1/jobs/questions/${questionId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }
  )
  if (result.isErr()) return R.err(result.error)
  const parsed = result.value as Record<string, unknown>
  const level1: unknown = parsed?.data ?? parsed
  const level1Obj = level1 as Record<string, unknown>
  const level2: unknown = level1Obj?.data ?? level1Obj
  const question: JobQuestion = level2 as JobQuestion
  return R.ok(question)
}

export async function deleteQuestion(
  questionId: string
): Promise<Result<void, ApiError | NetworkError>> {
  const result = await fetchJson<{ success?: boolean }>(
    `${API_BASE}/api/v1/jobs/questions/${questionId}`,
    {
      method: "DELETE",
    }
  )
  if (result.isErr()) return R.err(result.error)
  return R.ok(undefined)
}

export async function publishQuestion(
  questionId: string
): Promise<Result<{ id: string; status: string }, ApiError | NetworkError>> {
  return fetchJson<{ data?: { id: string; status: string } } | { id: string; status: string }>(
    `${API_BASE}/api/v1/jobs/questions/${questionId}/publish`,
    {
      method: "PATCH",
    }
  ).then((r) => {
    if (r.isErr()) return R.err(r.error)
    const json = r.value
    const data = (
      json && typeof json === "object" && "data" in json
        ? (json as { data: { id: string; status: string } }).data
        : json
    ) as { id: string; status: string }
    return R.ok(data)
  })
}

export async function unpublishQuestion(
  questionId: string
): Promise<Result<{ id: string; status: string }, ApiError | NetworkError>> {
  return fetchJson<{ data?: { id: string; status: string } } | { id: string; status: string }>(
    `${API_BASE}/api/v1/jobs/questions/${questionId}/unpublish`,
    {
      method: "PATCH",
    }
  ).then((r) => {
    if (r.isErr()) return R.err(r.error)
    const json = r.value
    const data = (
      json && typeof json === "object" && "data" in json
        ? (json as { data: { id: string; status: string } }).data
        : json
    ) as { id: string; status: string }
    return R.ok(data)
  })
}

export async function reorderQuestions(
  orgId: string,
  jobId: string,
  items: ReorderQuestionItem[]
): Promise<Result<void, ApiError | NetworkError>> {
  const result = await fetchJson<{ success?: boolean }>(
    `${API_BASE}/api/v1/organizations/${orgId}/jobs/${jobId}/questions/reorder`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    }
  )
  if (result.isErr()) return R.err(result.error)
  return R.ok(undefined)
}
