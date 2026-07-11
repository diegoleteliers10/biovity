"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Result } from "better-result"
import type { ApiError, NetworkError } from "@/lib/errors"
import { fetchJson } from "@/lib/result"

const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
    : (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")

export async function togglePinChat(
  chatId: string
): Promise<Result<{ pinned: boolean }, ApiError | NetworkError>> {
  return fetchJson<{ pinned: boolean }>(`${API_BASE}/api/v1/chats/${chatId}/pin`, {
    method: "PATCH",
  })
}

export async function toggleArchiveChat(
  chatId: string
): Promise<Result<{ archived: boolean }, ApiError | NetworkError>> {
  return fetchJson<{ archived: boolean }>(`${API_BASE}/api/v1/chats/${chatId}/archive`, {
    method: "PATCH",
  })
}

export function useTogglePinChatMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (chatId: string) => {
      const result = await togglePinChat(chatId)
      if (!Result.isOk(result)) throw new Error(result.error.message)
      return result.value
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] })
    },
  })
}

export function useToggleArchiveChatMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (chatId: string) => {
      const result = await toggleArchiveChat(chatId)
      if (!Result.isOk(result)) throw new Error(result.error.message)
      return result.value
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] })
    },
  })
}
