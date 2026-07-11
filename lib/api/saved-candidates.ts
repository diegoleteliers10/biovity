import { Result as R, type Result } from "better-result"
import type { ApiError, NetworkError } from "@/lib/errors"
import { fetchJson, fetchNoContent } from "@/lib/result"

const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
    : (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")

export type SavedCandidate = {
  id: string
  organizationId: string
  candidateId: string
  note?: string | null
  createdAt: string
}

export async function getSavedCandidates(
  organizationId: string
): Promise<Result<SavedCandidate[], ApiError | NetworkError>> {
  return fetchJson(`${API_BASE}/api/v1/saved-candidates?organizationId=${organizationId}`)
}

export async function saveCandidate(
  organizationId: string,
  candidateId: string,
  note?: string
): Promise<Result<SavedCandidate, ApiError | NetworkError>> {
  return fetchJson(`${API_BASE}/api/v1/saved-candidates`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ organizationId, candidateId, note }),
  })
}

export async function unsaveCandidate(
  organizationId: string,
  candidateId: string
): Promise<Result<void, ApiError | NetworkError>> {
  return fetchNoContent(
    `${API_BASE}/api/v1/saved-candidates?organizationId=${organizationId}&candidateId=${candidateId}`,
    { method: "DELETE" }
  )
}

export async function isCandidateSaved(
  organizationId: string,
  candidateId: string
): Promise<Result<boolean, ApiError | NetworkError>> {
  const result = await fetchJson<{ saved: boolean }>(
    `${API_BASE}/api/v1/saved-candidates/check?organizationId=${organizationId}&candidateId=${candidateId}`
  )
  if (R.isError(result)) return result
  return R.ok(result.value.saved)
}
