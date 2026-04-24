"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Result } from "better-result"
import { useRef } from "react"
import { incrementJobViews } from "@/lib/api/organization-metrics"
import { getResultErrorMessage } from "@/lib/result"

export function useIncrementJobViews() {
  const queryClient = useQueryClient()
  const pendingRef = useRef<Set<string>>(new Set())

  return useMutation({
    mutationFn: async (jobId: string) => {
      if (pendingRef.current.has(jobId)) return null
      pendingRef.current.add(jobId)

      const result = await incrementJobViews(jobId)
      pendingRef.current.delete(jobId)

      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    onSuccess: (data, jobId) => {
      if (!data) return

      queryClient.setQueryData(["job", jobId], (old: unknown) => {
        if (!old || typeof old !== "object") return old
        return { ...old, views: data.views }
      })
    },
  })
}
