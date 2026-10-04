"use client"

import { SparklesIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

type Props = {
  onAnalyze: () => void
  isAnalyzing: boolean
  analyzedAt: Date | null
  disabled?: boolean
}

export function AnalyzeButton({ onAnalyze, isAnalyzing, analyzedAt, disabled }: Props) {
  const [disclosureOpen, setDisclosureOpen] = useState(false)
  const [canShareProfiles, setCanShareProfiles] = useState(false)

  return (
    <>
      <div className="flex items-center gap-2">
        {analyzedAt && (
          <span className="text-xs text-muted-foreground">
            Última actualización{" "}
            {analyzedAt.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}
          </span>
        )}
        <Button
          variant="default"
          size="sm"
          onClick={() => {
            setCanShareProfiles(false)
            setDisclosureOpen(true)
          }}
          disabled={disabled || isAnalyzing}
          className={cn(
            "h-9 px-3 rounded-md text-xs font-medium gap-1.5",
            isAnalyzing && "opacity-70"
          )}
        >
          <HugeiconsIcon icon={SparklesIcon} size={11} />
          {isAnalyzing ? "Analizando compatibilidad..." : "Analizar compatibilidad"}
        </Button>
      </div>

      <Dialog open={disclosureOpen} onOpenChange={setDisclosureOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Compartir perfiles con Jev</DialogTitle>
            <DialogDescription>
              Jev de TypeSafe AI procesará la experiencia, formación y habilidades de estos perfiles
              junto con los requisitos de la oferta. Biovity elimina el perfil de análisis y su
              explicación en un máximo de 30 días. La compatibilidad queda guardada en cada
              postulación.
            </DialogDescription>
          </DialogHeader>
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={canShareProfiles}
              onChange={(event) => setCanShareProfiles(event.target.checked)}
              className="mt-1 accent-primary"
            />
            Confirmo que puedo compartir estos perfiles con Jev para este análisis.
          </label>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDisclosureOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setDisclosureOpen(false)
                onAnalyze()
              }}
              disabled={!canShareProfiles || disabled || isAnalyzing}
            >
              Confirmar y analizar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
