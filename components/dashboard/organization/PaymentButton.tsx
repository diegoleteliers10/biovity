"use client"
// PaymentButton - Triggers MercadoPago checkout for organization subscription plans
// Calls NestJS backend

import { useState } from "react"
import type { PlanKey } from "@/lib/data/plans"

// Use API_BASE env var or fallback to ngrok for local dev with sandbox webhook
const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_BASE ??
      process.env.NEXT_PUBLIC_API_URL ??
      "https://49f0-2800-150-112-120a-9df2-e711-16ce-ee7c.ngrok-free.app")
    : "https://49f0-2800-150-112-120a-9df2-e711-16ce-ee7c.ngrok-free.app"

type PaymentButtonProps = {
  plan: PlanKey
  organizationId: string
  children: React.ReactNode
  className?: string
}

export function PaymentButton({
  plan,
  organizationId,
  children,
  className = "",
}: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePayment = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_BASE}/api/v1/subscription/preference`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, organizationId }),
      })

      const { data } = await res.json()
      const mp_url = data?.data.initPoint

      if (!res.ok) {
        throw new Error(data.message ?? data.error ?? "Error al crear preferencia de pago")
      }

      // Redirect to MercadoPago checkout
      window.open(mp_url, "_blank")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido"
      setError(message)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handlePayment}
        disabled={isLoading}
        className={`inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      >
        {isLoading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Procesando...
          </>
        ) : (
          children
        )}
      </button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
