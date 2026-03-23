"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
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
      if (!userId) throw new Error("User ID required")
      if (!jobId) throw new Error("Job ID required")
      const result = await checkSavedJob(userId, jobId)
      if ("error" in result) throw new Error(result.error)
      return result.data
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
      if (!userId) throw new Error("User ID required")
      const result = await getSavedJobsByUserId(userId, {
        page: params?.page,
        limit: params?.limit,
      })
      if ("error" in result) throw new Error(result.error)
      return result.data
    },
    enabled: Boolean(userId),
  })
}

export function useSaveJobMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, jobId }: { userId: string; jobId: string }) => {
      const result = await saveJob(userId, jobId)
      if ("error" in result) throw new Error(result.error)
      return result.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: savedJobsKeys.byUser(variables.userId) })
      queryClient.invalidateQueries({
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
      if ("error" in result) throw new Error(result.error)
      return result
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: savedJobsKeys.byUser(variables.userId) })
      queryClient.invalidateQueries({
        queryKey: savedJobsKeys.check(variables.userId, variables.jobId),
      })
    },
  })
}
