import { Result as R, type Result } from "better-result"
import { ApiError, type NetworkError } from "@/lib/errors"
import { fetchJson, fetchJsonWithSession } from "@/lib/result"
import type { ApplicationSourceChannel } from "@/lib/types/application-source"

const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
    : (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")

export type ApplicationStatus =
  | "pendiente"
  | "oferta"
  | "entrevista"
  | "rechazado"
  | "contratado"
  | "desistido"

export type ApplicationJob = {
  id: string
  title: string
  organizationId: string
}

export type ApplicationCandidate = {
  id: string
  name: string
  email: string
  avatar?: string | null
  profession?: string | null
  education?: string | null
  skills?: string[]
  yearsOfExperience?: number
  bio?: string
}

export type Application = {
  id: string
  jobId: string
  job?: ApplicationJob
  candidateId: string
  candidate?: ApplicationCandidate
  coverLetter?: string | null
  salaryMin?: number | null
  salaryMax?: number | null
  salaryCurrency?: string | null
  availabilityDate?: string | null
  resumeUrl?: string | null
  answers?: ApplicationAnswer[]
  status: ApplicationStatus
  pipelineStageId?: string | null
  assigneeId?: string | null
  assigneeName?: string | null
  nextAction?: string | null
  targetDate?: string | null
  stageChangedAt?: string
  createdAt: string
  updatedAt: string
}

export async function updateApplicationPipelineStage(input: {
  id: string
  stageId: string
  rejectionNote?: string
  rejectionReasonId?: string
  requestHeaders?: Headers
}): Promise<Result<Application, ApiError | NetworkError>> {
  const url = `${API_BASE}/api/v1/applications/${input.id}/stage`
  const init: RequestInit = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      stageId: input.stageId,
      rejectionNote: input.rejectionNote,
      rejectionReasonId: input.rejectionReasonId,
    }),
  }
  const result = input.requestHeaders
    ? await fetchJsonWithSession<{ data?: Application } | Application>(
        url,
        input.requestHeaders,
        init
      )
    : await fetchJson<{ data?: Application } | Application>(url, init)
  if (result.isErr()) return R.err(result.error)

  const payload = result.value
  const application =
    payload && typeof payload === "object" && "data" in payload ? payload.data : payload
  if (!application || typeof application !== "object" || !("id" in application)) {
    return R.err(new ApiError({ status: 200, message: "Respuesta inválida de postulación" }))
  }
  return R.ok(application)
}

export async function reopenApplication(input: {
  id: string
  stageId: string
  reason: string
  requestHeaders?: Headers
}): Promise<Result<Application, ApiError | NetworkError>> {
  const url = `${API_BASE}/api/v1/applications/${input.id}/reopen`
  const init: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stageId: input.stageId, reason: input.reason }),
  }
  const result = input.requestHeaders
    ? await fetchJsonWithSession<{ data?: Application } | Application>(
        url,
        input.requestHeaders,
        init
      )
    : await fetchJson<{ data?: Application } | Application>(url, init)
  if (result.isErr()) return R.err(result.error)
  const payload = result.value
  const application =
    payload && typeof payload === "object" && "data" in payload ? payload.data : payload
  if (!application || typeof application !== "object" || !("id" in application)) {
    return R.err(new ApiError({ status: 200, message: "Respuesta inválida de postulación" }))
  }
  return R.ok(application)
}

export async function updateApplicationHiringPlan(input: {
  id: string
  assigneeId?: string | null
  nextAction?: string | null
  targetDate?: string | null
}): Promise<Result<Application, ApiError | NetworkError>> {
  const result = await fetchJson<{ data?: Application } | Application>(
    `${API_BASE}/api/v1/applications/${input.id}/hiring-plan`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        assigneeId: input.assigneeId,
        nextAction: input.nextAction,
        targetDate: input.targetDate,
      }),
    }
  )
  if (result.isErr()) return R.err(result.error)
  const payload = result.value
  const application =
    payload && typeof payload === "object" && "data" in payload ? payload.data : payload
  if (!application || typeof application !== "object" || !("id" in application)) {
    return R.err(new ApiError({ status: 200, message: "Respuesta inválida de postulación" }))
  }
  return R.ok(application)
}

export type ApplicationStatusHistoryItem = {
  id: string
  previousStatus: ApplicationStatus | null
  newStatus: ApplicationStatus
  changedAt: string
  changedById: string | null
  changedByName: string | null
  rejectionNote: string | null
  rejectionReasonId: string | null
  rejectionReasonSnapshot: string | null
  transitionKind: "stage" | "reopen"
  transitionNote: string | null
}

export type ApplicationAnswer = {
  id: string
  questionId: string
  value: string
  createdAt: string
}

export type GetApplicationsByJobParams = {
  page?: number
  limit?: number
  status?: ApplicationStatus
}

export async function getApplicationsByCandidate(
  candidateId: string,
  params?: GetApplicationsByJobParams
): Promise<Result<Application[], ApiError | NetworkError>> {
  const searchParams = new URLSearchParams()
  if (params?.page != null) searchParams.set("page", String(params.page))
  if (params?.limit != null) searchParams.set("limit", String(params.limit))
  if (params?.status) searchParams.set("status", params.status)

  const query = searchParams.toString()
  const url = `${API_BASE}/api/v1/applications/candidate/${candidateId}${query ? `?${query}` : ""}`

  const result = await fetchJson<{ data?: Application[] } | Application[]>(url)

  if (result.isErr()) return R.err(result.error)

  const parsed = result.value
  const apps = Array.isArray(parsed) ? parsed : (parsed?.data ?? [])
  return R.ok(apps)
}

export async function getApplicationsByJob(
  jobId: string,
  params?: GetApplicationsByJobParams,
  requestHeaders?: Headers
): Promise<Result<Application[], ApiError | NetworkError>> {
  const searchParams = new URLSearchParams()
  if (params?.page != null) searchParams.set("page", String(params.page))
  if (params?.limit != null) searchParams.set("limit", String(params.limit))
  if (params?.status) searchParams.set("status", params.status)

  const query = searchParams.toString()
  const url = `${API_BASE}/api/v1/applications/job/${jobId}${query ? `?${query}` : ""}`

  const result = requestHeaders
    ? await fetchJsonWithSession<{ data?: Application[] } | Application[]>(url, requestHeaders)
    : await fetchJson<{ data?: Application[] } | Application[]>(url)

  if (result.isErr()) return R.err(result.error)

  const parsed = result.value
  const apps = Array.isArray(parsed) ? parsed : (parsed?.data ?? [])
  return R.ok(apps)
}

export type CreateApplicationInput = {
  jobId: string
  candidateId: string
  coverLetter?: string
  salaryMin?: number
  salaryMax?: number
  salaryCurrency?: string
  availabilityDate?: string
  resumeUrl?: string
  sourceChannel?: Exclude<ApplicationSourceChannel, "unknown">
  distributionSourceId?: string
  answers?: { questionId: string; value: string }[]
}

export async function createApplication(
  input: CreateApplicationInput
): Promise<Result<Application, ApiError | NetworkError>> {
  const result = await fetchJson<{ data: Application }>(`${API_BASE}/api/v1/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  if (result.isErr()) return R.err(result.error)
  return R.ok(result.value.data)
}

export async function updateApplicationStatus(input: {
  id: string
  status: ApplicationStatus
  rejectionNote?: string
  rejectionReasonId?: string
  requestHeaders?: Headers
}): Promise<Result<Application, ApiError | NetworkError>> {
  const url = `${API_BASE}/api/v1/applications/${input.id}/status`
  const init = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      status: input.status,
      rejectionNote: input.rejectionNote,
      rejectionReasonId: input.rejectionReasonId,
    }),
  }
  const result = input.requestHeaders
    ? await fetchJsonWithSession<{ data?: Application } | Application>(
        url,
        input.requestHeaders,
        init
      )
    : await fetchJson<{ data?: Application } | Application>(url, init)

  if (result.isErr()) return R.err(result.error)

  const json = result.value
  const app = (
    json && typeof json === "object" && "data" in json ? (json as { data: Application }).data : json
  ) as Application
  return R.ok(app)
}

export async function getApplicationStatusHistory(
  id: string
): Promise<Result<ApplicationStatusHistoryItem[], ApiError | NetworkError>> {
  const result = await fetchJson<
    { data?: ApplicationStatusHistoryItem[] } | ApplicationStatusHistoryItem[]
  >(`${API_BASE}/api/v1/applications/${id}/status-history`)
  if (result.isErr()) return R.err(result.error)
  const payload = result.value
  return R.ok(Array.isArray(payload) ? payload : (payload.data ?? []))
}

export async function getApplicationDetail(
  id: string,
  requestHeaders?: Headers
): Promise<Result<Application, ApiError | NetworkError>> {
  const url = `${API_BASE}/api/v1/applications/${id}`
  const result = requestHeaders
    ? await fetchJsonWithSession<{ data?: Application } | Application>(url, requestHeaders)
    : await fetchJson<{ data?: Application } | Application>(url)

  if (result.isErr()) return R.err(result.error)

  const json = result.value as Record<string, unknown>
  const level1: unknown = json?.data ?? json
  const level1Obj = level1 as Record<string, unknown>
  const level2: unknown = level1Obj?.data ?? level1Obj
  const app = level2 as Application

  if (!app?.id) {
    return R.err(new ApiError({ status: 200, message: "Respuesta inválida de postulación" }))
  }

  return R.ok(app)
}

export type ApplicationsByOrganizationResponse = {
  data: Application[]
  total: number
  page: number
  limit: number
  totalPages: number
}

type ApplicationsByOrganizationPayload = {
  data?: Application[]
  total?: number
  page?: number
  limit?: number
  totalPages?: number
}

export async function getApplicationsByOrganization(
  organizationId: string,
  params?: { page?: number; limit?: number; includeAnswers?: boolean },
  requestHeaders?: Headers
): Promise<Result<ApplicationsByOrganizationResponse, ApiError | NetworkError>> {
  const buildQuery = (includeAnswers: boolean | undefined) => {
    const searchParams = new URLSearchParams()
    if (params?.page != null) searchParams.set("page", String(params.page))
    if (params?.limit != null) searchParams.set("limit", String(params.limit))
    if (includeAnswers) searchParams.set("includeAnswers", "true")
    return searchParams.toString() ? `?${searchParams.toString()}` : ""
  }

  const runRequest = (includeAnswers: boolean | undefined) => {
    const url = `${API_BASE}/api/v1/applications/organization/${organizationId}${buildQuery(includeAnswers)}`
    return requestHeaders
      ? fetchJsonWithSession<ApplicationsByOrganizationPayload>(url, requestHeaders)
      : fetchJson<ApplicationsByOrganizationPayload>(url)
  }

  let result = await runRequest(params?.includeAnswers)

  if (
    result.isErr() &&
    params?.includeAnswers &&
    result.error._tag === "ApiError" &&
    result.error.status === 400
  ) {
    result = await runRequest(false)
  }

  if (result.isErr()) return R.err(result.error)

  const parsed = result.value
  return R.ok({
    data: parsed?.data ?? [],
    total: parsed?.total ?? 0,
    page: parsed?.page ?? 1,
    limit: parsed?.limit ?? 10,
    totalPages: parsed?.totalPages ?? 0,
  })
}
