"use client"

import { CreditCardIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"

type SubscriptionTabProps = {
  organizationId: string
}

export function SubscriptionTab({ organizationId }: SubscriptionTabProps) {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <HugeiconsIcon icon={CreditCardIcon} size={20} className="text-primary" />
          Plan y Suscripci&oacute;n
        </CardTitle>
        <CardDescription>
          Gestiona el plan de suscripci&oacute;n de tu organizaci&oacute;n.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <HugeiconsIcon icon={CreditCardIcon} size={24} />
              </EmptyMedia>
              <EmptyTitle>Suscripci&oacute;n no disponible</EmptyTitle>
              <EmptyDescription>
                A&uacute;n no tienes una suscripci&oacute;n activa. Cont&aacute;ctanos para obtener
                m&aacute;s informaci&oacute;n sobre nuestros planes.
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
      </CardContent>
    </Card>
  )
}
