import { Result as R, type Result } from "better-result"
import type { ApiError, NetworkError } from "@/lib/errors"
import { fetchJson, fetchNoContent } from "@/lib/result"
import type { JobBenefitInput, JobLocation, JobSalary } from "./jobs"

const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
    : (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")

export type JobTemplate = {
  id: string
  organizationId: string
  name: string
  title: string
  description: string
  employmentType?: string
  experienceLevel?: string
  salary?: JobSalary
  location?: JobLocation
  benefits?: JobBenefitInput[]
  requiredSkills?: string[]
  minExperience?: number
  category?: string
  createdAt: string
  updatedAt: string
}

export type CreateJobTemplateInput = {
  name: string
  title: string
  description: string
  employmentType?: string
  experienceLevel?: string
  salary?: JobSalary
  location?: JobLocation
  benefits?: JobBenefitInput[]
  requiredSkills?: string[]
  minExperience?: number
  category?: string
}

export type UpdateJobTemplateInput = Partial<CreateJobTemplateInput>

const base = (orgId: string) => `${API_BASE}/api/v1/organizations/${orgId}/job-templates`

export async function getJobTemplates(
  organizationId: string
): Promise<Result<JobTemplate[], ApiError | NetworkError>> {
  const result = await fetchJson<unknown>(base(organizationId))
  if (result.isErr()) return R.err(result.error)
  const raw = result.value
  const arr = Array.isArray(raw) ? raw : []
  return R.ok(arr as JobTemplate[])
}

export async function createJobTemplate(
  organizationId: string,
  input: CreateJobTemplateInput
): Promise<Result<JobTemplate, ApiError | NetworkError>> {
  return fetchJson<JobTemplate>(base(organizationId), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
}

export async function updateJobTemplate(
  organizationId: string,
  id: string,
  input: UpdateJobTemplateInput
): Promise<Result<JobTemplate, ApiError | NetworkError>> {
  return fetchJson<JobTemplate>(`${base(organizationId)}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
}

export async function deleteJobTemplate(
  organizationId: string,
  id: string
): Promise<Result<void, ApiError | NetworkError>> {
  return fetchNoContent(`${base(organizationId)}/${id}`, { method: "DELETE" })
}
