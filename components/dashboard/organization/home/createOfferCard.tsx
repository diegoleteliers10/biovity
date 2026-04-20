"use client"

import { FileAddIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function CreateOfferCard() {
  const router = useRouter()

  const handleCreateOffer = () => {
    router.push("/dashboard/ofertas")
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <HugeiconsIcon
              icon={FileAddIcon}
              size={24}
              strokeWidth={1.5}
              className="text-primary"
            />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="font-semibold">Crear nueva oferta</h3>
            <p className="text-sm text-muted-foreground">
              Publica una vacante y comienza a recibir candidatos.
            </p>
          </div>
          <Button
            onClick={handleCreateOffer}
            className="shrink-0 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <HugeiconsIcon icon={FileAddIcon} size={18} strokeWidth={1.5} className="mr-2" />
            Crear oferta
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
