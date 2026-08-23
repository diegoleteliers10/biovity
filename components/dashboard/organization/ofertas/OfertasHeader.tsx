"use client"

import { FileAddIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { ConnectedNotificationBell } from "@/components/common/ConnectedNotificationBell"
import { Button } from "@/components/ui/button"

interface OfertasHeaderProps {
  onCreateOffer: () => void
}

export function OfertasHeader({ onCreateOffer }: OfertasHeaderProps) {
  return (
    <div className="space-y-1">
      <div className="hidden lg:flex justify-end">
        <ConnectedNotificationBell showAgentTrigger />
      </div>
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Ofertas</h1>
          <p className="text-muted-foreground text-sm">
            Gestiona tus vacantes y publica nuevas ofertas de empleo.
          </p>
        </div>
        <div className="hidden lg:block">
          <Button
            onClick={onCreateOffer}
            className="h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-medium"
          >
            <HugeiconsIcon icon={FileAddIcon} size={16} strokeWidth={1.5} className="mr-1.5" />
            Crear oferta
          </Button>
        </div>
      </div>
    </div>
  )
}
