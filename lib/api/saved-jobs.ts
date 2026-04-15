import { Result as R, type Result } from "better-result"
import { ApiError, NetworkError } from "@/lib/errors"
import { fetchJson } from "@/lib/result"

const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
    : (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")

export type SavedJob = {
  id: string
  userId: string
  jobId: string
}

export type SavedJobsByUserResponse = {
  data: SavedJob[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type CheckSavedJobResponse = {
  isSaved: boolean
}

function unwrapData(payload: unknown): unknown {
  if (!payload || typeof payload !== "object") return payload
  const p = payload as Record<string, unknown>
  if (p.data === undefined) return payload
  return p.data
}

function extractString(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value
  if (value == null) return null
  return String(value)
}

function normalizeSavedJobItem(raw: unknown): SavedJob | null {
  if (!raw || typeof raw !== "object") return null
  const obj = raw as Record<string, unknown>

  const jobIdCandidateFromId = extractString(obj.jobId ?? obj.job_id)

  const jobId =
    jobIdCandidateFromId ??
    (obj.job && typeof obj.job === "object"
      ? extractString((obj.job as Record<string, unknown>).id)
      : null) ??
    null

  if (!jobId) return null

  const id = extractString(obj.id ?? obj.savedJobId ?? obj._id) ?? jobId
  const userId = extractString(obj.userId ?? obj.user_id) ?? ""

  return { id, userId, jobId }
}

function extractSavedJobsList(payload: unknown): {
  data: SavedJob[]
  total: number
  page: number
  limit: number
  totalPages: number
} {
  if (!payload || typeof payload !== "object") {
    return { data: [], total: 0, page: 1, limit: 10, totalPages: 1 }
  }

  const p = payload as Record<string, unknown>

  const total = typeof p.total === "number" ? p.total : 0
  const page = typeof p.page === "number" ? p.page : 1
  const limit = typeof p.limit === "number" ? p.limit : 10
  const totalPages = typeof p.totalPages === "number" ? p.totalPages : 1

  const maybeData = p.data

  const listCandidate = Array.isArray(maybeData)
    ? maybeData
    : maybeData && typeof maybeData === "object"
      ? (maybeData as Record<string, unknown>).data
      : null

  const itemsArray = Array.isArray(listCandidate) ? listCandidate : []
  const items = itemsArray.map(normalizeSavedJobItem).filter((x): x is SavedJob => Boolean(x))

  return { data: items, total, page, limit, totalPages }
}

export async function checkSavedJob(
  userId: string,
  jobId: string
): Promise<Result<CheckSavedJobResponse, ApiError | NetworkError>> {
  const url = `${API_BASE}/api/v1/saved-jobs/check/${userId}/${jobId}`

  const result = await fetchJson<unknown>(url)

  if (result.isErr()) return R.err(result.error)

  const json = result.value
  const dataLevel1 = unwrapData(json)
  const dataLevel2 = unwrapData(dataLevel1)

  const isSaved: boolean =
    typeof (dataLevel2 as Record<string, unknown> | undefined)?.isSaved === "boolean"
      ? ((dataLevel2 as Record<string, unknown>).isSaved as boolean)
      : typeof (dataLevel1 as Record<string, unknown> | undefined)?.isSaved === "boolean"
        ? ((dataLevel1 as Record<string, unknown>).isSaved as boolean)
        : false

  return R.ok({ isSaved })
}

export async function getSavedJobsByUserId(
  userId: string,
  params?: { page?: number; limit?: number }
): Promise<Result<SavedJobsByUserResponse, ApiError | NetworkError>> {
  const searchParams = new URLSearchParams()
  if (params?.page != null) searchParams.set("page", String(params.page))
  if (params?.limit != null) searchParams.set("limit", String(params.limit))
  const query = searchParams.toString()

  const url = `${API_BASE}/api/v1/saved-jobs/user/${userId}${query ? `?${query}` : ""}`

  const result = await fetchJson<unknown>(url)

  if (result.isErr()) return R.err(result.error)

  const extracted = extractSavedJobsList(result.value)
  return R.ok(extracted)
}

export async function saveJob(
  userId: string,
  jobId: string
): Promise<Result<SavedJob, ApiError | NetworkError>> {
  const url = `${API_BASE}/api/v1/saved-jobs`

  const result = await fetchJson<unknown>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, jobId }),
  })

  if (result.isErr()) return R.err(result.error)

  const json = result.value
  const dataLevel1 = unwrapData(json)
  const dataLevel2 = unwrapData(dataLevel1)

  const saved =
    normalizeSavedJobItem(dataLevel2) ??
    normalizeSavedJobItem(dataLevel1) ??
    normalizeSavedJobItem(json)
  if (!saved) return R.err(new ApiError({ status: 200, message: "Respuesta inválida" }))

  return R.ok(saved)
}

export async function removeSavedJob(
  userId: string,
  jobId: string
): Promise<Result<{ success: true }, ApiError | NetworkError>> {
  const url = `${API_BASE}/api/v1/saved-jobs/user/${userId}/job/${jobId}`

  return fetchJson<{ success: true }>(url, { method: "DELETE" })
}
