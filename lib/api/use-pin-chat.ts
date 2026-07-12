"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Result } from "better-result"
import type { ApiError, NetworkError } from "@/lib/errors"
import { fetchJson } from "@/lib/result"
import { toast } from "sonner"
import type { Chat } from "./chats"

const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
    : (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")

export async function togglePinChat(
  chatId: string,
  role: "recruiter" | "professional"
): Promise<Result<Chat, ApiError | NetworkError>> {
  return fetchJson<Chat>(`${API_BASE}/api/v1/chats/${chatId}/pin?role=${role}`, {
    method: "PATCH",
  })
}

export async function toggleArchiveChat(
  chatId: string,
  role: "recruiter" | "professional"
): Promise<Result<Chat, ApiError | NetworkError>> {
  return fetchJson<Chat>(`${API_BASE}/api/v1/chats/${chatId}/archive?role=${role}`, {
    method: "PATCH",
  })
}

export function useTogglePinChatMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      chatId,
      role,
    }: {
      chatId: string
      role: "recruiter" | "professional"
    }) => {
      const result = await togglePinChat(chatId, role)
      if (!Result.isOk(result)) throw new Error(result.error.message)
      return result.value
    },
    onMutate: async ({ chatId }) => {
      await queryClient.cancelQueries({ queryKey: ["chats"] })
      const queries = queryClient.getQueriesData<Chat[]>({ queryKey: ["chats"] })

      queryClient.setQueriesData<Chat[]>({ queryKey: ["chats"] }, (old) => {
        if (!old) return old
        return old.map((c) => (c.id === chatId ? { ...c, isPinned: !c.isPinned } : c))
      })

      return { queries }
    },
    onError: (err, _, context) => {
      if (context?.queries) {
        context.queries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
      toast.error(err.message || "Error al fijar el chat")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] })
    },
  })
}

export function useToggleArchiveChatMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      chatId,
      role,
    }: {
      chatId: string
      role: "recruiter" | "professional"
    }) => {
      const result = await toggleArchiveChat(chatId, role)
      if (!Result.isOk(result)) throw new Error(result.error.message)
      return result.value
    },
    onMutate: async ({ chatId }) => {
      await queryClient.cancelQueries({ queryKey: ["chats"] })
      const queries = queryClient.getQueriesData<Chat[]>({ queryKey: ["chats"] })

      queryClient.setQueriesData<Chat[]>({ queryKey: ["chats"] }, (old) => {
        if (!old) return old
        return old.map((c) => (c.id === chatId ? { ...c, isArchived: !c.isArchived } : c))
      })

      return { queries }
    },
    onError: (err, _, context) => {
      if (context?.queries) {
        context.queries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
      toast.error(err.message || "Error al archivar el chat")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] })
    },
  })
}
