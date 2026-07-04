import type { Result } from "better-result"
import type { ApiError, NetworkError } from "@/lib/errors"
import { fetchJson, fetchNoContent } from "@/lib/result"
import type { Notification } from "@/lib/types/dashboard"

const API_BASE =
  typeof window !== "undefined" ? "" : (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000")

export type NotificationsResponse = {
  data: Notification[]
  unreadCount: number
}

export async function getNotifications(): Promise<
  Result<NotificationsResponse, ApiError | NetworkError>
> {
  return fetchJson<NotificationsResponse>(`${API_BASE}/api/notifications`, {
    credentials: "include",
  })
}

export async function markNotificationRead(
  id: string
): Promise<Result<void, ApiError | NetworkError>> {
  return fetchNoContent(`${API_BASE}/api/notifications/read?id=${encodeURIComponent(id)}`, {
    method: "PATCH",
    credentials: "include",
  })
}

export async function markAllNotificationsRead(): Promise<Result<void, ApiError | NetworkError>> {
  return fetchNoContent(`${API_BASE}/api/notifications/read?all=true`, {
    method: "PATCH",
    credentials: "include",
  })
}
