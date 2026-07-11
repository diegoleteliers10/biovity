"use client"

import { InboxIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function MessagesEmptyState() {
  const { push } = useRouter()

  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="max-w-md rounded-2xl bg-transparent px-6 py-7 text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full border border-secondary/30 bg-secondary/10">
          <HugeiconsIcon
            icon={InboxIcon}
            size={24}
            strokeWidth={1.5}
            className="size-8 text-secondary-foreground"
          />
        </div>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Aún no tienes conversaciones
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Cuando contactes a un candidato o alguien responda a tu invitación, aparecerá aquí.
        </p>
        <Button className="mt-4" onClick={() => push("/dashboard/talent")}>
          Buscar talento
        </Button>
      </div>
    </div>
  )
}
