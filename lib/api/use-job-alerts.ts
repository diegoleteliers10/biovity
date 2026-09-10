"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { CreateJobAlertPayload } from "./job-alerts"
import { createJobAlert, deleteJobAlert, getJobAlerts } from "./job-alerts"

export const jobAlertsKeys = {
  byUser: (userId: string) => ["job-alerts", "user", userId] as const,
}

export function useJobAlerts(userId: string | undefined) {
  return useQuery({
    queryKey: userId ? jobAlertsKeys.byUser(userId) : (["job-alerts", "user", "disabled"] as const),
    queryFn: async () => {
      if (!userId) throw new Error("User ID required")
      const result = await getJobAlerts(userId)
      return result.match({
        ok: (data) => data,
        err: (e) => {
          throw new Error(e.message)
        },
      })
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
      return result.match({
        ok: (data) => data,
        err: (e) => {
          throw new Error(e.message)
        },
      })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: jobAlertsKeys.byUser(variables.userId) })
    },
  })
}

export function useDeleteJobAlert() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId: string }) => {
      const result = await deleteJobAlert(id, userId)
      return result.match({
        ok: (data) => data,
        err: (e) => {
          throw new Error(e.message)
        },
      })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: jobAlertsKeys.byUser(variables.userId) })
    },
  })
}
