"use client"

import { SparklesIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"
import { AgentChat } from "@/components/ai/AgentChat"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/animate-ui/components/animate/tooltip"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/animate-ui/components/radix/sheet"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type AgentSheetTriggerProps = {
  className?: string
}

export function AgentSheetTrigger({ className }: AgentSheetTriggerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(true)}
            className={cn("text-accent", className)}
            aria-label="Abrir asistente de reclutamiento"
          >
            <HugeiconsIcon icon={SparklesIcon} size={20} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>AI Agent</p>
        </TooltipContent>
      </Tooltip>

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
            Puedo ayudarte a gestionar candidatos, ofertas y metricas de contratacion.
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1">
          <AgentChat />
        </div>
      </SheetContent>
    </Sheet>
  )
}
