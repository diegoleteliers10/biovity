"use client"

import {
  type InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import type { SavedJob, SavedJobsByUserResponse } from "./saved-jobs"
import { checkSavedJob, getSavedJobsByUserId, removeSavedJob, saveJob } from "./saved-jobs"

export const savedJobsKeys = {
  byUser: (userId: string) => ["saved-jobs", "user", userId] as const,
  check: (userId: string, jobId: string) => ["saved-jobs", "check", userId, jobId] as const,
}

export function useCheckSavedJob(userId: string | undefined, jobId: string | undefined) {
  return useQuery({
    queryKey:
      userId && jobId
        ? savedJobsKeys.check(userId, jobId)
        : (["saved-jobs", "check", "disabled"] as const),
    queryFn: async () => {
      if (!userId) return Promise.reject(new Error("User ID required"))
      if (!jobId) return Promise.reject(new Error("Job ID required"))
      const result = await checkSavedJob(userId, jobId)
      if (result.isErr()) return Promise.reject(new Error(result.error.message))
      return result.value
    },
    enabled: Boolean(userId && jobId),
  })
}

export function useSavedJobsByUser(
  userId: string | undefined,
  params?: { page?: number; limit?: number }
) {
  return useQuery({
    queryKey:
      userId && params
        ? [...savedJobsKeys.byUser(userId), params.page ?? 1, params.limit ?? 10]
        : userId
          ? [...savedJobsKeys.byUser(userId), 1, 10]
          : (["saved-jobs", "user", "disabled", 1, 10] as const),
    queryFn: async () => {
      if (!userId) return Promise.reject(new Error("User ID required"))
      const result = await getSavedJobsByUserId(userId, {
        page: params?.page,
        limit: params?.limit,
      })
      if (result.isErr()) return Promise.reject(new Error(result.error.message))
      return result.value
    },
    enabled: Boolean(userId),
  })
}

export function useSavedJobsByUserInfinite(userId: string | undefined, limit = 10) {
  return useInfiniteQuery({
    queryKey: userId
      ? [...savedJobsKeys.byUser(userId), "infinite", limit]
      : (["saved-jobs", "user", "disabled", "infinite", limit] as const),
    queryFn: async ({ pageParam }) => {
      if (!userId) return Promise.reject(new Error("User ID required"))
      const result = await getSavedJobsByUserId(userId, {
        page: pageParam,
        limit,
      })
      if (result.isErr()) return Promise.reject(new Error(result.error.message))
      return result.value
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    enabled: Boolean(userId),
  })
}

function updateSavedJobsPage(
  page: SavedJobsByUserResponse,
  jobId: string,
  savedJob: SavedJob | null
): SavedJobsByUserResponse {
  const total = Math.max(0, page.total + (savedJob ? 1 : -1))
  const remaining = page.data.filter((job) => job.jobId !== jobId)
  return {
    ...page,
    data: savedJob && page.page === 1 ? [savedJob, ...remaining].slice(0, page.limit) : remaining,
    total,
    totalPages: Math.ceil(total / page.limit),
  }
}

function updateSavedJobsCache(
  old: SavedJobsByUserResponse | InfiniteData<SavedJobsByUserResponse> | undefined,
  jobId: string,
  savedJob: SavedJob | null
) {
  if (!old) return old
  if ("pages" in old)
    return { ...old, pages: old.pages.map((page) => updateSavedJobsPage(page, jobId, savedJob)) }
  return updateSavedJobsPage(old, jobId, savedJob)
}

export function useSaveJobMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, jobId }: { userId: string; jobId: string }) => {
      const result = await saveJob(userId, jobId)
      if (result.isErr()) return Promise.reject(new Error(result.error.message))
      return result.value
    },
    onSuccess: async (data, variables) => {
      queryClient.setQueriesData<SavedJobsByUserResponse | InfiniteData<SavedJobsByUserResponse>>(
        { queryKey: savedJobsKeys.byUser(variables.userId) },
        (old) => updateSavedJobsCache(old, variables.jobId, data)
      )
      queryClient.setQueryData(savedJobsKeys.check(variables.userId, variables.jobId), {
        isSaved: true,
      })
      await queryClient.invalidateQueries({ queryKey: savedJobsKeys.byUser(variables.userId) })
      await queryClient.invalidateQueries({
        queryKey: savedJobsKeys.check(variables.userId, variables.jobId),
      })
    },
  })
}

export function useRemoveSavedJobMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, jobId }: { userId: string; jobId: string }) => {
      const result = await removeSavedJob(userId, jobId)
      if (result.isErr()) return Promise.reject(new Error(result.error.message))
      return result.value
    },
    onSuccess: async (_, variables) => {
      queryClient.setQueriesData<SavedJobsByUserResponse | InfiniteData<SavedJobsByUserResponse>>(
        { queryKey: savedJobsKeys.byUser(variables.userId) },
        (old) => updateSavedJobsCache(old, variables.jobId, null)
      )
      queryClient.setQueryData(savedJobsKeys.check(variables.userId, variables.jobId), {
        isSaved: false,
      })
      await queryClient.invalidateQueries({ queryKey: savedJobsKeys.byUser(variables.userId) })
      await queryClient.invalidateQueries({
        queryKey: savedJobsKeys.check(variables.userId, variables.jobId),
      })
    },
  })
}
