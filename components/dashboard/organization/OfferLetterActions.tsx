"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  cancelOfferLetter,
  getOfferLettersByApplication,
  resendOfferLetter,
} from "@/lib/api/offer-letters"

function defaultExpiryDate(): string {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "America/Santiago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date())
  const year = Number(parts.find((part) => part.type === "year")?.value)
  const month = Number(parts.find((part) => part.type === "month")?.value)
  const day = Number(parts.find((part) => part.type === "day")?.value)
  return new Date(Date.UTC(year, month - 1, day + 7)).toISOString().slice(0, 10)
}

const statusLabels = {
  sent: "Enviada",
  accepted: "Aceptada",
  rejected: "Rechazada",
  cancelled: "Cancelada",
  expired: "Vencida",
} as const

export function OfferLetterActions({ applicationId }: { applicationId: string }) {
  const queryClient = useQueryClient()
  const [expiresOn, setExpiresOn] = useState(defaultExpiryDate)
  const [activeOfferId, setActiveOfferId] = useState<string | null>(null)
  const offerLetters = useQuery({
    queryKey: ["offer-letters", applicationId],
    queryFn: async () => {
      const result = await getOfferLettersByApplication(applicationId)
      if (result.isErr()) {
        toast.error("No se pudieron cargar las cartas de oferta")
        return []
      }
      return result.value
    },
  })

  const handleCancel = async (offerId: string) => {
    setActiveOfferId(offerId)
    const result = await cancelOfferLetter(offerId)
    setActiveOfferId(null)
    if (result.isErr()) {
      toast.error("No se pudo cancelar la oferta")
      return
    }
    toast.success("Oferta cancelada")
    await queryClient.invalidateQueries({ queryKey: ["offer-letters", applicationId] })
  }

  const handleResend = async (offerId: string) => {
    setActiveOfferId(offerId)
    const result = await resendOfferLetter(offerId, expiresOn)
    setActiveOfferId(null)
    if (result.isErr()) {
      toast.error(result.error.message)
      return
    }
    toast.success(result.value.emailQueued ? "Oferta reenviada" : "Oferta reenviada por chat")
    await queryClient.invalidateQueries({ queryKey: ["offer-letters", applicationId] })
  }

  if (!offerLetters.data?.length) return null

  return (
    <section className="space-y-3 rounded-xl border border-border/60 p-4">
      <h3 className="text-sm font-semibold">Cartas de oferta</h3>
      {offerLetters.data.map((offer) => (
        <div
          key={offer.id}
          className="flex flex-wrap items-center gap-3 border-t border-border/50 pt-3"
        >
          <div className="min-w-40 flex-1">
            <p className="text-sm font-medium">{offer.title ?? "Carta de oferta"}</p>
            <p className="text-xs text-muted-foreground">
              {statusLabels[offer.status]}
              {offer.expiresAt
                ? ` · vence ${new Intl.DateTimeFormat("es-CL", { dateStyle: "medium", timeZone: "America/Santiago" }).format(new Date(offer.expiresAt))}`
                : ""}
            </p>
          </div>
          {offer.status === "sent" && (
            <>
              <Input
                aria-label="Nueva fecha de vigencia"
                className="w-40"
                type="date"
                value={expiresOn}
                onChange={(event) => setExpiresOn(event.target.value)}
              />
              <Button
                disabled={activeOfferId !== null || !expiresOn}
                onClick={() => void handleResend(offer.id)}
                size="sm"
                variant="outline"
              >
                Reenviar
              </Button>
              <Button
                disabled={activeOfferId !== null}
                onClick={() => void handleCancel(offer.id)}
                size="sm"
                variant="ghost"
              >
                Cancelar
              </Button>
            </>
          )}
        </div>
      ))}
    </section>
  )
}
