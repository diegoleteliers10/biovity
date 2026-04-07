"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Result } from "better-result"
import { getResultErrorMessage } from "@/lib/result"
import { incrementJobViews } from "@/lib/api/organization-metrics"

export function useIncrementJobViews() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (jobId: string) => {
      const result = await incrementJobViews(jobId)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    onSuccess: (data, jobId) => {
      queryClient.setQueryData(["job", jobId], (old: unknown) => {
        if (!old || typeof old !== "object") return old
        return { ...old, views: data.views }
      })
      queryClient.invalidateQueries({ queryKey: ["jobs"] })
    },
  })
}
