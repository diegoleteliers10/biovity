import type { Result } from "better-result"
import type { ApiError, NetworkError } from "@/lib/errors"
import { fetchJson, fetchNoContent } from "@/lib/result"
import type { Notification } from "@/lib/types/dashboard"

const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
    : (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")

export type NotificationsResponse = {
  data: Notification[]
  unreadCount: number
}

export async function getNotifications(
  signal?: AbortSignal
): Promise<Result<NotificationsResponse, ApiError | NetworkError>> {
  const result = await fetchJson<{ data: NotificationsResponse }>(
    `${API_BASE}/api/v1/notifications`,
    {
      credentials: "include",
      signal,
    }
  )
  return result.map((response) => response.data)
}

export async function markNotificationRead(
  id: string
): Promise<Result<void, ApiError | NetworkError>> {
  return fetchNoContent(`${API_BASE}/api/v1/notifications/${encodeURIComponent(id)}/read`, {
    method: "PATCH",
    credentials: "include",
  })
}

export async function markAllNotificationsRead(): Promise<Result<void, ApiError | NetworkError>> {
  return fetchNoContent(`${API_BASE}/api/v1/notifications/read-all`, {
    method: "PATCH",
    credentials: "include",
  })
}
