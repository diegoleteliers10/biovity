"use client"

import { CreditCardIcon } from "@hugeicons/core-free-icons"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { fetchJson } from "@/lib/result"
import { StateCard } from "./SettingsUi"

type SubscriptionTabProps = { organizationId: string }
type OrganizationSubscription = { planName: string; isActive: boolean; expiresAt: string | null }

export function SubscriptionTab({ organizationId }: SubscriptionTabProps) {
  const subscription = useQuery({
    queryKey: ["subscription", organizationId],
    queryFn: async () => {
      const result = await fetchJson<{ data: { subscription: OrganizationSubscription | null } }>(
        `/api/v1/subscription?organizationId=${encodeURIComponent(organizationId)}`
      )
      return result.isOk() ? result.value.data.subscription : Promise.reject(result.error)
    },
    enabled: Boolean(organizationId),
  })
  if (subscription.isPending)
    return (
      <StateCard icon={CreditCardIcon} title="Cargando suscripción">
        {null}
      </StateCard>
    )
  if (subscription.isError)
    return (
      <StateCard icon={CreditCardIcon} title="No se pudo cargar la suscripción">
        <Button onClick={() => subscription.refetch()}>Reintentar</Button>
      </StateCard>
    )
  const current = subscription.data
  return (
    <StateCard
      icon={CreditCardIcon}
      title={current ? `Plan ${current.planName}` : "Sin suscripción"}
    >
      {current && <p>{current.isActive ? "Activa" : "Inactiva"}</p>}
      {current?.expiresAt && (
        <p>Vence: {new Date(current.expiresAt).toLocaleDateString("es-CL")}</p>
      )}
      <Button variant="secondary" asChild className="mt-4">
        <a href="mailto:ventas@biovity.cl">Contactar ventas</a>
      </Button>
    </StateCard>
  )
}
