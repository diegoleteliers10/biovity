"use client"

import { FileAddIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/components/ui/button"

interface OfertasEmptyStateProps {
  onCreateOffer: () => void
}

export function OfertasEmptyState({ onCreateOffer }: OfertasEmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed">
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-muted">
          <HugeiconsIcon
            icon={FileAddIcon}
            size={44}
            strokeWidth={1.5}
            className="size-11 text-muted-foreground"
          />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Aún no tienes ofertas publicadas.</p>
          <p className="text-xs text-muted-foreground">
            Crea tu primera oferta para empezar a recibir candidatos.
          </p>
        </div>
        <Button onClick={onCreateOffer} className="mt-2">
          <HugeiconsIcon icon={FileAddIcon} size={18} strokeWidth={1.5} className="mr-2" />
          Crear oferta
        </Button>
      </div>
    </div>
  )
}
