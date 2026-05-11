"use client"

import { Edit02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export function QuestionsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-10 text-center">
      <HugeiconsIcon
        icon={Edit02Icon}
        size={32}
        strokeWidth={1.5}
        className="mb-2 size-8 text-muted-foreground"
      />
      <p className="text-sm text-muted-foreground">
        No hay preguntas configuradas para esta oferta.
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Agrega preguntas para conocer mejor a los postulantes.
      </p>
    </div>
  )
}
