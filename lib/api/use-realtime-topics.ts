"use client"

import { useQuery } from "@tanstack/react-query"
import { Result } from "better-result"
import { fetchJson } from "@/lib/result"

const REFRESH_INTERVAL = 2 * 60 * 1000

export function useRealtimeUserTopic(userId: string | undefined) {
  const query = useQuery({
    queryKey: ["realtime", "user-topic", userId ?? ""],
    queryFn: () =>
      fetchJson<{ topic: string }>("/api/realtime/user-topic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      }),
    enabled: Boolean(userId),
    refetchInterval: REFRESH_INTERVAL,
    refetchOnWindowFocus: true,
  })

  return query.data && Result.isOk(query.data) ? query.data.value.topic : undefined
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
