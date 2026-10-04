"use client"

import { useQuery } from "@tanstack/react-query"
import { Result } from "better-result"
import { fetchJson } from "@/lib/result"

const REFRESH_INTERVAL = 2 * 60 * 1000

export function useRealtimeUserTopic(userId: string | undefined, sessionId: string | undefined) {
  const query = useQuery({
    queryKey: ["realtime", "user-topic", userId ?? "", sessionId ?? ""],
    queryFn: async () => {
      const result = await fetchJson<{ topic: string; expiresAt: string }>(
        "/api/realtime/user-topic",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "{}",
        }
      )
      return result.isOk() ? result.value : Promise.reject(result.error)
    },
    enabled: Boolean(userId && sessionId),
    staleTime: 0,
    retry: 1,
    refetchInterval: REFRESH_INTERVAL,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  })

  return query.data?.topic
}

export function useRealtimeChatTopic(chatId: string | undefined, userId: string | undefined) {
  const query = useQuery({
    queryKey: ["realtime", "chat-topic", userId ?? "", chatId ?? ""],
    queryFn: () =>
      fetchJson<{ topic: string }>(`/api/realtime/chat-topic/${encodeURIComponent(chatId ?? "")}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      }),
    enabled: Boolean(chatId && userId),
    refetchInterval: REFRESH_INTERVAL,
    refetchOnWindowFocus: true,
  })

  return query.data && Result.isOk(query.data) ? query.data.value.topic : undefined
}
