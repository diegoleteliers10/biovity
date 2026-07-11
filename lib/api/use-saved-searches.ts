"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Result } from "better-result"
import type { ApiError, NetworkError } from "@/lib/errors"
import { fetchJson, fetchNoContent, getResultErrorMessage } from "@/lib/result"

const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
    : (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")

export type SavedSearch = {
  id: string
  organizationId: string
  name: string
  filters: Record<string, unknown>
  notify: boolean
  createdAt: string
  updatedAt: string
}

export const savedSearchesKeys = {
  byOrganization: (organizationId: string) => ["savedSearches", organizationId] as const,
}

function extractSearches(payload: unknown): SavedSearch[] {
  if (Array.isArray(payload)) return payload as SavedSearch[]
  if (!payload || typeof payload !== "object") return []
  const p = payload as Record<string, unknown>
  const data = p.data
  if (Array.isArray(data)) return data as SavedSearch[]
  if (data && typeof data === "object") {
    const nested = (data as Record<string, unknown>).data
    if (Array.isArray(nested)) return nested as SavedSearch[]
  }
  return []
}

export async function getSavedSearches(
  organizationId: string
): Promise<Result<SavedSearch[], ApiError | NetworkError>> {
  const result = await fetchJson<unknown>(
    `${API_BASE}/api/v1/saved-searches?organizationId=${encodeURIComponent(organizationId)}`
  )
  if (result.isErr()) return Result.err(result.error)
  const searches = extractSearches(result.value)
  return Result.ok(searches)
}

export async function createSavedSearch(data: {
  organizationId: string
  name: string
  filters: Record<string, unknown>
  notify: boolean
}): Promise<Result<SavedSearch, ApiError | NetworkError>> {
  const result = await fetchJson<{ data: SavedSearch }>(`${API_BASE}/api/v1/saved-searches`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (result.isErr()) return Result.err(result.error)
  return Result.ok(result.value.data)
}

export async function deleteSavedSearch(
  id: string
): Promise<Result<void, ApiError | NetworkError>> {
  return fetchNoContent(`${API_BASE}/api/v1/saved-searches/${id}`, {
    method: "DELETE",
  })
}

export function useSavedSearches(organizationId: string | undefined) {
  return useQuery({
    queryKey: savedSearchesKeys.byOrganization(organizationId ?? ""),
    queryFn: async () => {
      if (!organizationId) throw new Error("Organization ID required")
      const result = await getSavedSearches(organizationId)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    enabled: Boolean(organizationId),
  })
}

export function useCreateSavedSearchMutation(organizationId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: {
      name: string
      filters: Record<string, unknown>
      notify: boolean
    }) => {
      const result = await createSavedSearch({ organizationId, ...data })
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: savedSearchesKeys.byOrganization(organizationId) })
    },
  })
}

export function useDeleteSavedSearchMutation(organizationId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteSavedSearch(id)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: savedSearchesKeys.byOrganization(organizationId) })
    },
  })
}
