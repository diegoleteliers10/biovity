"use client"

import { SparklesIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"
import { AgentChat } from "@/components/ai/AgentChat"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/animate-ui/components/radix/sheet"

export function FloatingAgentPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [jobOfferId, setJobOfferId] = useState<string>("")

  return (
    <>
      {/* Floating toggle button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all"
        aria-label="Abrir asistente de IA"
      >
        <HugeiconsIcon icon={SparklesIcon} size={20} />
        <span className="absolute -top-1 -right-1 size-3 rounded-full bg-emerald-500 animate-pulse" />
      </button>

      {/* Sheet panel */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-[400px] p-0">
          <SheetHeader className="border-b px-4 py-3 bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={SparklesIcon} size={16} className="text-primary" />
                <SheetTitle className="text-sm font-semibold">
                  Asistente de Reclutamiento
                </SheetTitle>
              </div>
            </div>
          </SheetHeader>

          {/* Job selector */}
          <div className="border-b px-4 py-2">
            <input
              type="text"
              value={jobOfferId}
              onChange={(e) => setJobOfferId(e.target.value)}
              placeholder="Ingresa el ID de la oferta (o déjalo vacío para consultas generales)"
              className="w-full rounded-md border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Chat */}
          <div className="flex-1 h-[calc(100%-120px)]">
            <AgentChat jobOfferId={jobOfferId} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
