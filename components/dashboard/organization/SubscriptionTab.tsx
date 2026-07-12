"use client"

import { CreditCardIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"

type SubscriptionTabProps = {
  organizationId: string
}

export function SubscriptionTab({ organizationId: _organizationId }: SubscriptionTabProps) {
  return (
    <div className="space-y-6">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <HugeiconsIcon icon={CreditCardIcon} size={24} />
          </EmptyMedia>
          <EmptyTitle>Suscripción no disponible</EmptyTitle>
          <EmptyDescription>
            Aún no tienes una suscripción activa. Contáctanos para obtener
            más información sobre nuestros planes.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
      <div className="flex gap-3 justify-center">
        <Button variant="outline" asChild>
          <a href="mailto:ventas@biovity.cl">Contactar ventas</a>
        </Button>
        <Button asChild>
          <a href="https://mercadopago.cl" target="_blank" rel="noopener noreferrer">
            Ver planes
          </a>
        </Button>
      </div>
    </div>
  )
}
