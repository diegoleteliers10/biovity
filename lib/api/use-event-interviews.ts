"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Result } from "better-result"
import type { InterviewRating, InterviewRecommendation } from "@/lib/api/event-interviews"
import {
  getEventInterviewRecords,
  saveEventInterviewEvaluation,
  saveEventInterviewOutcome,
} from "@/lib/api/event-interviews"
import { getResultErrorMessage } from "@/lib/result"

const eventInterviewKeys = {
  records: (eventId: string) => ["event-interviews", eventId] as const,
}

export function useEventInterviewRecords(eventId: string, enabled: boolean) {
  return useQuery({
    queryKey: eventInterviewKeys.records(eventId),
    queryFn: async () => {
      const result = await getEventInterviewRecords(eventId)
      if (!Result.isOk(result))
        return Promise.reject(new Error(getResultErrorMessage(result.error)))
      return result.value
    },
    enabled,
  })
}

export function useSaveEventInterviewEvaluation(eventId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: {
      rating: InterviewRating
      notes?: string
      skillsAssessment?: Record<string, string>
      criterionResponses?: Array<{
        criterionId: string
        score: number
        evidence?: string
      }>
      recommendation?: InterviewRecommendation
    }) => {
      const result = await saveEventInterviewEvaluation(eventId, input)
      if (!Result.isOk(result))
        return Promise.reject(new Error(getResultErrorMessage(result.error)))
      return result.value
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: eventInterviewKeys.records(eventId) }),
  })
}

export function useSaveEventInterviewOutcome(eventId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: { outcome: InterviewRecommendation; notes?: string }) => {
      const result = await saveEventInterviewOutcome(eventId, input)
      if (!Result.isOk(result))
        return Promise.reject(new Error(getResultErrorMessage(result.error)))
      return result.value
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: eventInterviewKeys.records(eventId) }),
  })
}
