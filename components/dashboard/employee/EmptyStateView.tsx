"use client"

import { BubbleChatIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export function EmptyStateView() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="max-w-md px-6 text-center">
        <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-surface-container-highest text-muted-foreground">
          <HugeiconsIcon icon={BubbleChatIcon} size={20} />
        </div>
        <p className="mb-1 text-sm font-medium text-foreground">Tus mensajes</p>
        <p className="text-xs text-muted-foreground">
          Selecciona una conversación a la izquierda para comenzar.
        </p>
      </div>
    </div>
  )
}
