"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { incrementJobViews } from "@/lib/api/organization-metrics"

export function useIncrementJobViews() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (jobId: string) => {
      const result = await incrementJobViews(jobId)
      if ("error" in result) throw new Error(result.error)
      return result.data
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
