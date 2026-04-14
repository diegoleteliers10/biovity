"use client"

import { SparklesIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useAIAction } from "@/hooks/useAIAction"
import type { AIActionType } from "@/lib/ai/types"

interface AIButtonProps {
  action: AIActionType
  context: Record<string, unknown>
  children: React.ReactNode
  className?: string
  onDone?: (text: string) => void
}

export function AIButton({ action, context, children, className, onDone }: AIButtonProps) {
  const { run, isStreaming } = useAIAction({ onDone })

  return (
    <button
      type="button"
      onClick={() => run(action, context)}
      disabled={isStreaming}
      className={className}
    >
      <HugeiconsIcon icon={SparklesIcon} size={13} />
      {isStreaming ? "Generando..." : children}
    </button>
  )
}
