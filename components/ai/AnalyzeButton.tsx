"use client"

import { RefreshIcon, SparklesIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/components/ui/button"
import type { JobOfferContext } from "@/lib/ai/types"
import { cn } from "@/lib/utils"

type Props = {
  onAnalyze: () => void
  isAnalyzing: boolean
  analyzedAt: Date | null
  onClear: () => void
  disabled?: boolean
  jobOffer: JobOfferContext
}

export function AnalyzeButton({ onAnalyze, isAnalyzing, analyzedAt, onClear, disabled }: Props) {
  return (
    <div className="flex items-center gap-2">
      {analyzedAt && (
        <span className="text-xs text-muted-foreground">
          Analizado {analyzedAt.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}
        </span>
      )}
      {analyzedAt && (
        <Button variant="ghost" size="sm" onClick={onClear} className="h-8 text-xs">
          <HugeiconsIcon icon={RefreshIcon} size={11} />
          Revisar
        </Button>
      )}
      <Button
        variant="default"
        size="sm"
        onClick={onAnalyze}
        disabled={disabled || isAnalyzing}
        className={cn("h-8 text-xs gap-1.5", isAnalyzing && "opacity-70")}
      >
        <HugeiconsIcon icon={SparklesIcon} size={11} />
        {isAnalyzing ? "Analizando..." : "Analizar con IA"}
      </Button>
    </div>
  )
}
