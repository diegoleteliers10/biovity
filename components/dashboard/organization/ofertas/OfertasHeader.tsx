"use client"

import { FileAddIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { NotificationBell } from "@/components/common/NotificationBell"
import { Button } from "@/components/ui/button"

interface OfertasHeaderProps {
  onCreateOffer: () => void
}

export function OfertasHeader({ onCreateOffer }: OfertasHeaderProps) {
  return (
    <div className="space-y-1">
      <div className="hidden lg:flex justify-end">
        <NotificationBell notifications={[]} showAgentTrigger />
      </div>
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-[28px] font-semibold tracking-wide">Ofertas</h1>
          <p className="text-muted-foreground text-sm">
            Gestiona tus vacantes y publica nuevas ofertas de empleo.
          </p>
        </div>
        <div className="hidden lg:block">
          <Button onClick={onCreateOffer}>
            <HugeiconsIcon icon={FileAddIcon} size={18} strokeWidth={1.5} className="mr-2" />
            Crear oferta
          </Button>
        </div>
      </div>
    </div>
  )
}
