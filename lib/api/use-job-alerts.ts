"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { JobAlert } from "@/lib/types/job-alert"
import type { CreateJobAlertPayload } from "./job-alerts"
import { createJobAlert, deleteJobAlert, getJobAlerts } from "./job-alerts"

export const jobAlertsKeys = {
  byUser: (userId: string) => ["job-alerts", "user", userId] as const,
}

export function useJobAlerts(userId: string | undefined) {
  return useQuery({
    queryKey: userId ? jobAlertsKeys.byUser(userId) : (["job-alerts", "user", "disabled"] as const),
    queryFn: async () => {
      if (!userId) return Promise.reject(new Error("User ID required"))
      const result = await getJobAlerts(userId)
      if (result.isErr()) return Promise.reject(new Error(result.error.message))
      return result.value
    },
    enabled: Boolean(userId),
    staleTime: 30 * 1000,
  })
}

export function useCreateJobAlert() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateJobAlertPayload) => {
      const result = await createJobAlert(payload)
      if (result.isErr()) return Promise.reject(new Error(result.error.message))
      return result.value
    },
    onSuccess: (data, variables) => {
      void queryClient.cancelQueries({ queryKey: ["job-alerts"] })
      queryClient.setQueryData<JobAlert[]>(jobAlertsKeys.byUser(variables.userId), (old) =>
        old ? [data, ...old.filter((alert) => alert.id !== data.id)] : [data]
      )
      void queryClient.invalidateQueries({ queryKey: jobAlertsKeys.byUser(variables.userId) })
    },
  })
}

export function useDeleteJobAlert() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId: string }) => {
      const result = await deleteJobAlert(id, userId)
      if (result.isErr()) return Promise.reject(new Error(result.error.message))
      return result.value
    },
    onSuccess: (_, variables) => {
      void queryClient.cancelQueries({ queryKey: ["job-alerts"] })
      queryClient.setQueryData<JobAlert[]>(jobAlertsKeys.byUser(variables.userId), (old) =>
        old?.filter((alert) => alert.id !== variables.id)
      )
      void queryClient.invalidateQueries({ queryKey: jobAlertsKeys.byUser(variables.userId) })
    },
  })
}
