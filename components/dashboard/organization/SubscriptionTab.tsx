"use client"

import { Clock01Icon, CreditCardIcon, DangerIcon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSubscription } from "@/lib/api/use-subscription"
import {
  getPlanDisplayPrice,
  isContactPlan,
  PLAN_DISPLAY_NAMES,
  PLAN_FEATURES,
  PLAN_PRICES_CLP,
  type PlanKey,
} from "@/lib/data/plans"
import { cn } from "@/lib/utils"

type PaymentStatus = "success" | "failure" | "pending" | null

type SubscriptionTabProps = {
  organizationId: string
}

function PaymentAlert({ status }: { status: PaymentStatus }) {
  if (!status) return null

  const config = {
    success: {
      variant: "default" as const,
      icon: Tick02Icon,
      title: "¡Pago aprobado!",
      description: "Tu suscripción está activa. Ya puedes disfrutar de tu nuevo plan.",
    },
    failure: {
      variant: "destructive" as const,
      icon: DangerIcon,
      title: "Pago rechazado",
      description: "El pago fue rechazado. Por favor intenta novamente o usa otra tarjeta.",
    },
    pending: {
      variant: "default" as const,
      icon: Clock01Icon,
      title: "Pago pendiente",
      description: "El pago está siendo procesado. Te notificaremos cuando se acredite.",
    },
  }

  const { variant, icon, title, description } = config[status]

  return (
    <Alert
      variant={variant}
      className={cn(
        "mb-4",
        status === "success" && "border-success/50 bg-success/5",
        status === "pending" && "border-accent/50 bg-accent/5"
      )}
    >
      <HugeiconsIcon icon={icon} size={18} className="shrink-0" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  )
}

function getStatusBadge(status: string | null, isActive: boolean) {
  if (isActive) {
    return (
      <Badge variant="secondary" className="gap-1.5">
        <HugeiconsIcon icon={Tick02Icon} size={12} />
        Activo
      </Badge>
    )
  }
  if (status === "pending") {
    return (
      <Badge variant="secondary" className="gap-1.5">
        <HugeiconsIcon icon={Clock01Icon} size={12} />
        Pendiente
      </Badge>
    )
  }
  if (status === "rejected" || status === "cancelled") {
    return (
      <Badge variant="destructive" className="gap-1.5">
        <HugeiconsIcon icon={DangerIcon} size={12} />
        {status === "rejected" ? "Rechazado" : "Cancelado"}
      </Badge>
    )
  }
  return (
    <Badge variant="secondary" className="gap-1.5">
      <HugeiconsIcon icon={Clock01Icon} size={12} />
      Sin plan
    </Badge>
  )
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-"
  return new Date(dateStr).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

const AVAILABLE_PLANS: Array<{ key: PlanKey; highlighted?: boolean }> = [
  { key: "pro", highlighted: true },
  { key: "business" },
]

export function SubscriptionTab({ organizationId }: SubscriptionTabProps) {
  const { data: subscription, isLoading } = useSubscription(
    organizationId && organizationId !== "undefined" ? organizationId : undefined
  )
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const status = params.get("payment")
    if (status === "success" || status === "failure" || status === "pending") {
      setPaymentStatus(status)
      window.history.replaceState({}, "", window.location.pathname)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-32 animate-pulse rounded-xl bg-muted" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-40 animate-pulse rounded-xl bg-muted" />
          <div className="h-40 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    )
  }

  const currentPlan = subscription?.planName as PlanKey | null
  const isCurrentPlan = (key: PlanKey) => currentPlan === key && subscription?.isActive

  return (
    <div className="space-y-6">
      <PaymentAlert status={paymentStatus} />

      {/* Current Plan Status */}
      <Card className="bg-white border border-border/10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between text-base">
            <span className="flex items-center gap-2">
              <HugeiconsIcon icon={CreditCardIcon} size={18} />
              Tu plan actual
            </span>
            {subscription && getStatusBadge(subscription.payment_status, subscription.isActive)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {subscription ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-4">
                <p className="text-xs font-medium text-muted-foreground mb-1">Plan</p>
                <p className="text-lg font-semibold text-foreground">
                  {PLAN_DISPLAY_NAMES[subscription.planName as PlanKey] ?? subscription.planName}
                </p>
              </div>
              <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-4">
                <p className="text-xs font-medium text-muted-foreground mb-1">Precio</p>
                <p className="text-lg font-semibold text-foreground">
                  {PLAN_PRICES_CLP[subscription.planName as PlanKey]
                    ? `$${getPlanDisplayPrice(subscription.planName as PlanKey)} CLP`
                    : "Personalizado"}
                </p>
              </div>
              <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-4">
                <p className="text-xs font-medium text-muted-foreground mb-1">Inicio</p>
                <p className="text-sm font-medium text-foreground">
                  {formatDate(subscription.startedAt)}
                </p>
              </div>
              <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-4">
                <p className="text-xs font-medium text-muted-foreground mb-1">Vencimiento</p>
                <p className="text-sm font-medium text-foreground">
                  {formatDate(subscription.expiresAt)}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/20 py-10 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted ring-2 ring-border/60">
                <HugeiconsIcon icon={CreditCardIcon} size={24} className="text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-foreground">Sin suscripción activa</p>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Selecciona un plan abajo para activar tu cuenta de empresa en Biovity.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Planes disponibles</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {AVAILABLE_PLANS.map(({ key, highlighted }) => {
            const price = PLAN_PRICES_CLP[key]
            const features = PLAN_FEATURES[key]
            const isActive = isCurrentPlan(key)

            return (
              <Card
                key={key}
                className={cn(
                  "relative bg-white border transition-colors",
                  highlighted ? "border-secondary shadow-md" : "border-border/60",
                  isActive && "ring-2 ring-success/30"
                )}
              >
                {highlighted && (
                  <span className="absolute -top-2.5 left-4 text-xs font-semibold text-white bg-secondary px-3 py-1 rounded-full">
                    Más popular
                  </span>
                )}
                {isActive && (
                  <span className="absolute -top-2.5 right-4 text-xs font-semibold text-success bg-success/10 px-3 py-1 rounded-full">
                    Plan actual
                  </span>
                )}
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{PLAN_DISPLAY_NAMES[key]}</CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-foreground">
                      ${getPlanDisplayPrice(key)}
                    </span>
                    <span className="text-sm text-muted-foreground">CLP/mes</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <HugeiconsIcon
                          icon={Tick02Icon}
                          size={14}
                          className="mt-0.5 shrink-0 text-success"
                        />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {subscription?.isActive && subscription.planName === key ? (
                    <Button variant="outline" className="w-full" disabled>
                      Plan activo
                    </Button>
                  ) : (
                    <PaymentButtonWrapper
                      plan={key}
                      organizationId={organizationId}
                      isPending={subscription?.payment_status === "pending"}
                    />
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

import { PaymentButton } from "@/components/dashboard/organization/PaymentButton"

function PaymentButtonWrapper({
  plan,
  organizationId,
  isPending,
}: {
  plan: PlanKey
  organizationId: string
  isPending: boolean
}) {
  if (!organizationId || organizationId === "undefined") {
    return (
      <Button className="w-full" disabled>
        Organization ID no disponible
      </Button>
    )
  }
  if (isPending) {
    return (
      <Button className="w-full" disabled>
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        Procesando pago...
      </Button>
    )
  }
  return (
    <PaymentButton plan={plan} organizationId={organizationId} className="w-full">
      Seleccionar plan
    </PaymentButton>
  )
}
