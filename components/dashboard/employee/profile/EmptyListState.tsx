"use client"

import { InboxIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/components/ui/button"
import { useProfileContext } from "./profile-context"

type EmptyListStateProps = {
  message: string
  icon?: Parameters<typeof HugeiconsIcon>[0]["icon"]
}

export function EmptyListState({ message, icon = InboxIcon }: EmptyListStateProps) {
  const { handleEditAll } = useProfileContext()

  return (
    <div className="flex flex-col items-center rounded-xl border border-border/40 bg-surface-container-low p-5 text-center shadow-none">
      <div className="mb-2.5 flex size-10 items-center justify-center rounded-full bg-surface-container-highest text-muted-foreground">
        <HugeiconsIcon icon={icon} size={20} />
      </div>
      <p className="text-xs text-muted-foreground mb-3">{message}</p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-9 px-4 rounded-lg border border-border/40 bg-surface-container-lowest hover:bg-surface-container-low text-xs font-medium text-foreground transition-colors shadow-none"
        onClick={handleEditAll}
      >
        Editar perfil
      </Button>
    </div>
  )
}
