"use client"

import { FileAddIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRouter } from "next/navigation"
import { dashboardRaisedCardClass } from "@/components/dashboard/shared/surface-classes"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function CreateOfferCard() {
  const { push } = useRouter()

  const handleCreateOffer = () => {
    push("/dashboard/ofertas")
  }

  return (
    <Card className={dashboardRaisedCardClass}>
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <HugeiconsIcon
              icon={FileAddIcon}
              size={22}
              strokeWidth={1.5}
              className="text-primary"
            />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="text-xs leading-4 font-medium text-foreground">Crear nueva oferta</h3>
            <p className="text-sm text-muted-foreground text-pretty">
              Publica una vacante y comienza a recibir candidatos.
            </p>
          </div>
          <Button
            onClick={handleCreateOffer}
            className="h-11 shrink-0 rounded-lg px-6 text-sm font-medium"
          >
            <HugeiconsIcon icon={FileAddIcon} size={18} strokeWidth={1.5} className="mr-2" />
            Crear oferta
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
