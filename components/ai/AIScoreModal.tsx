"use client"

import { AlertCircleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Result as R, type Result } from "better-result"
import { z } from "zod"
import type { CandidateScore } from "@/app/api/ai/score-candidates/route"
import { ScoreExplanationSummary, ScoreExplanationView } from "@/components/ai/ScoreExplanationView"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/animate-ui/components/radix/dialog"
import type { ScoreExplanation } from "@/lib/ai/decision/types"

type ExplanationResponse = {
  status: "ready" | "processing" | "failed" | "expired"
  error?: string
  explanation?: ScoreExplanation
}

const EvidenceItemSchema = z.object({ text: z.string(), evidence: z.string() })
const ExplanationResponseSchema = z.object({
  error: z.string().optional(),
  status: z.enum(["ready", "processing", "failed", "expired"]),
  explanation: z
    .object({
      reason: z.string(),
      strengths: z.array(EvidenceItemSchema),
      gaps: z.array(EvidenceItemSchema),
      recommendation: z.enum(["Avanzar", "Evaluar", "Descartar"]),
    })
    .optional(),
})

type Props = {
  score: CandidateScore
  jobId: string
  candidateName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

async function requestExplanation(
  jobId: string,
  revisionId: string,
  retry = false
): Promise<Result<ExplanationResponse, Error>> {
  const responseResult = await R.tryPromise({
    try: () =>
      fetch("/api/ai/score-explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, revisionId, retry }),
      }),
    catch: (cause) =>
      cause instanceof Error ? cause : new Error("No se pudo conectar con la explicación"),
  })
  if (responseResult.isErr()) return R.err(responseResult.error)
  const bodyResult = await R.tryPromise({
    try: () => responseResult.value.json(),
    catch: () => new Error("La respuesta de explicación no es válida"),
  })
  if (bodyResult.isErr()) return R.err(bodyResult.error)
  if (!responseResult.value.ok) return R.err(new Error("No se pudo cargar la explicación"))
  const parsed = ExplanationResponseSchema.safeParse(bodyResult.value)
  return parsed.success
    ? R.ok(parsed.data)
    : R.err(new Error("La respuesta de explicación no es válida"))
}

export function AIScoreModal({ score, jobId, candidateName, open, onOpenChange }: Props) {
  const queryClient = useQueryClient()
  const queryKey = ["jev-explanation", score.revisionId]
  const explanationQuery = useQuery({
    queryKey,
    queryFn: () => requestExplanation(jobId, score.revisionId),
    enabled: open && (score.status === "ready" || score.status === "insufficient"),
    refetchInterval: (query) =>
      query.state.data?.isOk() && query.state.data.value.status === "processing" ? 1_500 : false,
  })
  const retryMutation = useMutation({
    mutationFn: () => requestExplanation(jobId, score.revisionId, true),
    onSuccess: (result) => {
      if (result.isOk()) void queryClient.setQueryData(queryKey, result)
    },
  })

  const response = explanationQuery.data?.isOk() ? explanationQuery.data.value : null
  const explanation = response?.explanation

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-2xl max-h-[85dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="pr-8">Compatibilidad de {candidateName}</DialogTitle>
          <DialogDescription>
            Este valor mide compatibilidad con la oferta. No representa una probabilidad de éxito en
            el puesto.
          </DialogDescription>
        </DialogHeader>

        {score.status === "ready" && (
          <ScoreExplanationSummary score={score.score} reason={explanation?.reason} />
        )}

        {score.status === "insufficient" ? (
          <div className="rounded-lg border p-4 text-sm text-muted-foreground">
            Jev no encontró datos suficientes para calcular una compatibilidad. Revisa el perfil y
            el CV.
          </div>
        ) : score.status === "pending" || score.status === "processing" ? (
          <p className="text-sm text-muted-foreground">El análisis sigue en proceso.</p>
        ) : score.status === "failed" ? (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/30 p-4 text-sm">
            <HugeiconsIcon icon={AlertCircleIcon} size={16} />
            El análisis no se completó. Vuelve a solicitarlo desde la oferta.
          </div>
        ) : explanation ? (
          <ScoreExplanationView explanation={explanation} />
        ) : response?.status === "failed" || explanationQuery.data?.isErr() ? (
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              {response?.error ?? "No se pudo generar la explicación. El score de Jev no cambia."}
            </p>
            <button
              type="button"
              className="inline-flex min-h-10 items-center rounded-md px-3 text-secondary-soft underline underline-offset-4 hover:bg-secondary-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              onClick={() => retryMutation.mutate()}
              disabled={retryMutation.isPending}
            >
              {retryMutation.isPending ? "Reintentando..." : "Reintentar explicación"}
            </button>
          </div>
        ) : response?.status === "expired" ? (
          <p className="text-sm text-muted-foreground">
            La explicación expiró. Vuelve a analizar la compatibilidad para generar una nueva.
          </p>
        ) : response?.status === "processing" ? (
          <ExplanationSkeleton />
        ) : (
          <ExplanationSkeleton />
        )}
      </DialogContent>
    </Dialog>
  )
}

function ExplanationSkeleton() {
  return (
    <div role="status" aria-label="Generando explicación" className="space-y-5 py-2">
      <p className="text-sm text-muted-foreground">Generando explicación...</p>
      <div aria-hidden="true" className="space-y-3">
        <div className="h-10 w-24 rounded-md bg-muted/50" />
        <div className="h-3 w-4/5 rounded bg-muted/50" />
        <div className="h-3 w-3/5 rounded bg-muted/50" />
        <div className="h-20 rounded-lg bg-surface-container-low" />
        <div className="h-20 rounded-lg bg-surface-container-low" />
      </div>
    </div>
  )
}
