"use client"

import { InboxIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function MessagesEmptyState() {
  const { push } = useRouter()

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <div className="max-w-md rounded-xl border border-border/40 bg-surface-container-low px-6 py-6 text-center shadow-none">
        <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-surface-container-highest text-muted-foreground">
          <HugeiconsIcon icon={InboxIcon} size={20} strokeWidth={1.5} />
        </div>
        <p className="mb-1 text-sm font-medium text-foreground">Aún no tienes conversaciones</p>
        <p className="text-xs text-muted-foreground max-w-[280px] mx-auto mb-4">
          Cuando contactes a un candidato o alguien responda a tu invitación, aparecerá aquí.
        </p>
        <Button
          size="sm"
          className="h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-xs font-medium"
          onClick={() => push("/dashboard/talent")}
        >
          Buscar talento
        </Button>
      </div>
    </div>
  )
}
