"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Result } from "better-result"
import { getResultErrorMessage } from "@/lib/result"
import {
  type ActivityLog,
  type CreateActivityLogInput,
  getActivityLogs,
  logActivity,
} from "./activity-logs"

export const activityLogsKeys = {
  byOrg: (organizationId: string) => ["activity-logs", "org", organizationId] as const,
}

export function useActivityLogs(organizationId: string | undefined) {
  const safeOrgId = organizationId ?? ""
  return useQuery({
    queryKey: activityLogsKeys.byOrg(safeOrgId),
    queryFn: async () => {
      if (!safeOrgId) return []
      const result = await getActivityLogs(safeOrgId)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    enabled: Boolean(safeOrgId),
    // Fallback only. The realtime broadcast is the primary path, so this poll
    // just covers a dropped channel. It pauses while the tab is hidden.
    refetchInterval: 60_000,
  })
}

export function useLogActivityMutation(organizationId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateActivityLogInput) => {
      const result = await logActivity(organizationId, input)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    onSuccess: (newLog) => {
      qc.setQueryData<ActivityLog[]>(activityLogsKeys.byOrg(organizationId), (old) =>
        old ? [newLog, ...old] : [newLog]
      )
    },
  })
}
