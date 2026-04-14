"use client"

import { useQuery } from "@tanstack/react-query"

// Use API_BASE env var or fallback to ngrok for local dev with sandbox webhook
const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_BASE ??
      process.env.NEXT_PUBLIC_API_URL ??
      "https://49f0-2800-150-112-120a-9df2-e711-16ce-ee7c.ngrok-free.app")
    : "https://49f0-2800-150-112-120a-9df2-e711-16ce-ee7c.ngrok-free.app"

export type Subscription = {
  id: string
  organizationId: string
  planName: string
  isActive: boolean
  startedAt: string | null
  expiresAt: string | null
  payment_status: string | null
  mercadopago_preference_id: string | null
  mercadopago_payment_id: string | null
}

export const subscriptionKeys = {
  detail: (orgId: string) => ["subscription", orgId] as const,
}

export function useSubscription(organizationId: string | undefined) {
  return useQuery({
    queryKey: subscriptionKeys.detail(organizationId ?? ""),
    queryFn: async (): Promise<Subscription | null> => {
      if (!organizationId) return null
      const res = await fetch(`${API_BASE}/api/v1/subscription?organizationId=${organizationId}`)
      if (!res.ok) {
        if (res.status === 404) return null
        throw new Error("Error al obtener suscripción")
      }
      const data = await res.json()
      return data.subscription ?? null
    },
    enabled: Boolean(organizationId),
  })
}
