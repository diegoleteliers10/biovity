import { Result as R, type Result } from "better-result"
import type { ApiError, NetworkError } from "@/lib/errors"
import { fetchJson, fetchNoContent } from "@/lib/result"

const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
    : (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")

export type CandidateTag = {
  id: string
  organizationId: string
  name: string
  color: string
  createdAt: string
}

export type CandidateTagAssignment = {
  id: string
  tagId: string
  candidateId: string
}

export async function getTags(
  organizationId: string
): Promise<Result<CandidateTag[], ApiError | NetworkError>> {
  return fetchJson(`${API_BASE}/api/v1/candidate-tags?organizationId=${organizationId}`)
}

export async function createTag(
  organizationId: string,
  name: string,
  color?: string
): Promise<Result<CandidateTag, ApiError | NetworkError>> {
  return fetchJson(`${API_BASE}/api/v1/candidate-tags`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ organizationId, name, color }),
  })
}

export async function deleteTag(tagId: string): Promise<Result<void, ApiError | NetworkError>> {
  return fetchNoContent(`${API_BASE}/api/v1/candidate-tags/${tagId}`, { method: "DELETE" })
}

export async function assignTag(
  tagId: string,
  candidateId: string
): Promise<Result<CandidateTagAssignment, ApiError | NetworkError>> {
  return fetchJson(`${API_BASE}/api/v1/candidate-tags/${tagId}/assign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ candidateId }),
  })
}

export async function unassignTag(
  tagId: string,
  candidateId: string
): Promise<Result<void, ApiError | NetworkError>> {
  return fetchNoContent(
    `${API_BASE}/api/v1/candidate-tags/${tagId}/assign?candidateId=${candidateId}`,
    {
      method: "DELETE",
    }
  )
}

export async function getCandidateTags(
  candidateId: string,
  organizationId: string
): Promise<Result<CandidateTag[], ApiError | NetworkError>> {
  return fetchJson(
    `${API_BASE}/api/v1/candidate-tags/candidate/${candidateId}?organizationId=${organizationId}`
  )
}
