"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Result } from "better-result"
import { getResultErrorMessage } from "@/lib/result"
import { createOrFindChat, getChatsByProfessional, getChatsByRecruiter } from "./chats"

export const chatsKeys = {
  byRecruiter: (recruiterId: string) => ["chats", "recruiter", recruiterId] as const,
  byProfessional: (professionalId: string) => ["chats", "professional", professionalId] as const,
}

export function useChatsByRecruiter(recruiterId: string | undefined) {
  return useQuery({
    queryKey: chatsKeys.byRecruiter(recruiterId ?? ""),
    queryFn: async () => {
      if (!recruiterId) throw new Error("Recruiter ID required")
      const result = await getChatsByRecruiter(recruiterId)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    enabled: Boolean(recruiterId),
  })
}

export function useChatsByProfessional(professionalId: string | undefined) {
  return useQuery({
    queryKey: chatsKeys.byProfessional(professionalId ?? ""),
    queryFn: async () => {
      if (!professionalId) throw new Error("Professional ID required")
      const result = await getChatsByProfessional(professionalId)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    enabled: Boolean(professionalId),
  })
}

export function useCreateOrFindChatMutation(recruiterId: string | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (professionalId: string) => {
      const result = await createOrFindChat(professionalId)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    onSuccess: () => {
      if (recruiterId) {
        void queryClient.invalidateQueries({
          queryKey: chatsKeys.byRecruiter(recruiterId),
        })
      }
    },
  })
}
