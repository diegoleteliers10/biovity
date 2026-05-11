"use client"

import { Add01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/components/ui/button"

export function QuestionsHeader({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Preguntas de postulación</h3>
        <p className="text-xs text-muted-foreground">
          Crea preguntas para que los candidatos respondan al aplicar
        </p>
      </div>
      <Button onClick={onAdd} size="sm" className="gap-1.5">
        <HugeiconsIcon icon={Add01Icon} size={14} />
        Agregar pregunta
      </Button>
    </div>
  )
}
