"use client"

import { BubbleChatIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export function EmptyStateView() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="max-w-md rounded-2xl bg-transparent px-6 py-7 text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full border border-secondary/30 bg-secondary/10">
          <HugeiconsIcon
            icon={BubbleChatIcon}
            size={24}
            strokeWidth={1.5}
            className="size-8 text-secondary-foreground"
          />
        </div>
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Mensajeria
        </p>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Tus mensajes</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Selecciona una conversacion en la izquierda para comenzar.
        </p>
      </div>
    </div>
  )
}
