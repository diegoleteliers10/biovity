"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Result as R } from "better-result"
import type { ApiError, NetworkError } from "@/lib/errors"
import { fetchJson } from "@/lib/result"

export type NotificationPreferencesInput = {
  digest: "none" | "daily" | "weekly"
  channels: {
    email: boolean
    inApp: boolean
  }
  events: {
    application: boolean
    interview: boolean
    message: boolean
    job_alert: boolean
    system: boolean
  }
}

const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
    : (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")

export async function updateNotificationPreferences(
  input: NotificationPreferencesInput
): Promise<R<{ ok: boolean }, ApiError | NetworkError>> {
  const result = await fetchJson<{ data: { ok: boolean } }>(
    `${API_BASE}/api/v1/users/me/notification-preferences`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      credentials: "include",
    }
  )
  if (result.isErr()) return R.err(result.error)
  return R.ok(result.value.data)
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: NotificationPreferencesInput) => {
      const result = await updateNotificationPreferences(input)
      if (!R.isOk(result)) throw new Error(result.error?.message ?? "Error al guardar preferencias")
      return result.value
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "user"] })
    },
  })
}
