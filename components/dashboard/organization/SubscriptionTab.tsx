"use client"

import { CreditCardIcon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { StateCard } from "./SettingsUi"

type SubscriptionTabProps = {
  organizationId: string
}

export function SubscriptionTab({ organizationId: _organizationId }: SubscriptionTabProps) {
  return (
    <StateCard icon={CreditCardIcon} title="Suscripción no disponible">
      <p className="mt-1 max-w-[52ch] text-sm leading-6 text-muted-foreground text-pretty">
        Aún no tienes una suscripción activa. Contáctanos para obtener más información sobre
        nuestros planes.
      </p>
      <div className="mt-4 flex flex-wrap gap-2.5">
        <Button variant="secondary" asChild>
          <a href="mailto:ventas@biovity.cl">Contactar ventas</a>
        </Button>
        <Button variant="outline" asChild>
          <a href="https://mercadopago.cl" target="_blank" rel="noopener noreferrer">
            Ver planes
          </a>
        </Button>
      </div>
    </StateCard>
  )
}
