"use client"

import { SparklesIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import dynamic from "next/dynamic"
import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/animate-ui/components/radix/sheet"

const AgentChat = dynamic(() => import("@/components/ai/AgentChat").then((m) => m.AgentChat), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  ),
})

export function GlobalAgentSheet() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:bg-primary/90"
        aria-label="Abrir asistente de reclutamiento"
      >
        <HugeiconsIcon icon={SparklesIcon} size={20} />
        <span className="absolute -top-1 -right-1 h-3 w-3 animate-pulse rounded-full bg-emerald-500" />
      </button>

      <SheetContent
        side="right"
        className="p-0 data-[side=right]:w-[88vw] data-[side=right]:sm:max-w-none data-[side=right]:md:w-[48rem] data-[side=right]:lg:w-[56rem]"
        showCloseButton
      >
        <SheetHeader className="border-b bg-muted/30 px-4 py-3">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={SparklesIcon} size={16} className="text-primary" />
            <SheetTitle>Asistente de Reclutamiento</SheetTitle>
          </div>
          <SheetDescription>
            Puedo ayudarte a gestionar candidatos, ofertas y métricas de contratación.
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1">
          <AgentChat />
        </div>
      </SheetContent>
    </Sheet>
  )
}
