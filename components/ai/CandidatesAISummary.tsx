"use client"

import { RefreshIcon, SparklesIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { AIStreamOutput } from "@/components/ai/AIStreamOutput"
import { useAIAction } from "@/hooks/useAIAction"
import type { CandidateContext, JobOfferContext } from "@/lib/ai/types"

interface Props {
  jobOffer: JobOfferContext
  candidates: CandidateContext[]
}

export function CandidatesAISummary({ jobOffer, candidates }: Props) {
  const { run, output, isStreaming, error, reset } = useAIAction()

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted-foreground">Análisis IA de candidatos</h3>
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
              run("summarize_candidates", {
                jobTitle: jobOffer.title,
                jobDescription: jobOffer.description,
                requiredSkills: jobOffer.requiredSkills,
                minExperience: jobOffer.minExperience,
                candidates,
              })
            }
            disabled={isStreaming || candidates.length === 0}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm text-primary-foreground disabled:opacity-50"
          >
            <HugeiconsIcon icon={SparklesIcon} size={13} />
            {isStreaming ? "Analizando..." : "Analizar con IA"}
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
