"use client"

import { RefreshIcon, SparklesIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { AIStreamOutput } from "@/components/ai/AIStreamOutput"
import { useAIAction } from "@/hooks/useAIAction"

type Props = {
  jobTitle: string
  companyName: string
  area: string
  skills: string[]
  contractType: string
  modality: string
  sector?: string
  currentDescription?: string
  onGenerated?: (description: string) => void
  onGeneratingChange?: (isGenerating: boolean) => void
}

export function AIJobDescriptionWriter({
  jobTitle,
  companyName,
  area,
  skills,
  contractType,
  modality,
  sector = "científico y biotecnológico",
  currentDescription,
  onGenerated,
  onGeneratingChange,
}: Props) {
  const { run, isStreaming } = useAIAction({
    onDone: (text) => {
      onGenerated?.(text)
      onGeneratingChange?.(false)
    },
  })

  const handleRun = () => {
    onGeneratingChange?.(true)
    run("generate_job_description", {
      jobTitle,
      companyName,
      area,
      skills,
      contractType,
      modality,
      sector,
      currentDescription: currentDescription ?? "",
    })
  }

  return (
    <button
      type="button"
      onClick={handleRun}
      disabled={isStreaming}
      className="flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground hover:bg-muted/50 transition-colors disabled:opacity-50"
    >
      <HugeiconsIcon icon={SparklesIcon} size={13} />
      {isStreaming ? "Mejorando..." : "Mejorar con IA"}
    </button>
  )
}

export function AIJobDescriptionOld({
  jobTitle,
  companyName,
  area,
  skills,
  contractType,
  modality,
  sector = "científico y biotecnológico",
  onGenerated,
}: Props) {
  const { run, output, isStreaming, error, reset } = useAIAction({
    onDone: (text) => onGenerated?.(text),
  })

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted-foreground">Generador de descripción</h3>
        <div className="flex gap-2">
          {output && (
            <button
              type="button"
              onClick={reset}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <HugeiconsIcon icon={RefreshIcon} size={11} /> Limpiar
            </button>
          )}
          <button
            type="button"
            onClick={() =>
              run("generate_job_description", {
                jobTitle,
                companyName,
                area,
                skills,
                contractType,
                modality,
                sector,
              })
            }
            disabled={isStreaming}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm text-primary-foreground disabled:opacity-50"
          >
            <HugeiconsIcon icon={SparklesIcon} size={13} />
            {isStreaming ? "Generando..." : "Generar con IA"}
          </button>
        </div>
      </div>

      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}

      {output && (
        <div className="prose prose-sm max-w-none border-t pt-3 mt-3">
          <AIStreamOutput text={output} />
        </div>
      )}
    </div>
  )
}
