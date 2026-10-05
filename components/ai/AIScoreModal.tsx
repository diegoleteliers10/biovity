"use client"

import { AlertCircleIcon, CheckmarkCircle02Icon, Target02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Result as R, type Result } from "better-result"
import { z } from "zod"
import type { CandidateScore } from "@/app/api/ai/score-candidates/route"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/animate-ui/components/radix/dialog"

type EvidenceItem = { text: string; evidence: string }
type ScoreExplanation = {
  reason: string
  strengths: EvidenceItem[]
  gaps: EvidenceItem[]
  recommendation: "Avanzar" | "Evaluar" | "Descartar"
}
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
  const scoreValue = score.score === null ? "Sin score" : `Compatibilidad: ${score.score}/100`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {scoreValue} · {candidateName}
          </DialogTitle>
          <DialogDescription>
            Este valor mide compatibilidad con la oferta. No representa una probabilidad de éxito en
            el puesto.
          </DialogDescription>
        </DialogHeader>

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
          <div className="space-y-4">
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="text-xs font-medium text-muted-foreground">Compatibilidad</p>
              <p className="mt-1 text-sm">{explanation.reason}</p>
            </div>
            {explanation.strengths.length > 0 && (
              <EvidenceList
                title="Coincidencias"
                icon={CheckmarkCircle02Icon}
                items={explanation.strengths}
              />
            )}
            {explanation.gaps.length > 0 && (
              <EvidenceList
                title="Aspectos para revisar"
                icon={Target02Icon}
                items={explanation.gaps}
              />
            )}
            <p className="text-xs text-muted-foreground">
              Sugerencia: {explanation.recommendation}. La decisión requiere revisión humana.
              {score.confidence !== null &&
                ` Confianza de Jev: ${Math.round(score.confidence * 100)}%. Este valor no mide exactitud.`}
            </p>
          </div>
        ) : response?.status === "failed" || explanationQuery.data?.isErr() ? (
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              {response?.error ?? "No se pudo generar la explicación. El score de Jev no cambia."}
            </p>
            <button
              type="button"
              className="text-primary underline"
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
          <p className="text-sm text-muted-foreground">Generando explicación...</p>
        ) : (
          <p className="text-sm text-muted-foreground">Generando explicación...</p>
        )}
      </DialogContent>
    </Dialog>
  )
}

function EvidenceList({
  title,
  icon,
  items,
}: {
  title: string
  icon: typeof CheckmarkCircle02Icon
  items: EvidenceItem[]
}) {
  return (
    <section className="space-y-2">
      <h3 className="flex items-center gap-1 text-sm font-medium">
        <HugeiconsIcon icon={icon} size={14} />
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={`${item.text}:${item.evidence}`} className="rounded-lg border p-3 text-sm">
            <p>{item.text}</p>
            <p className="mt-1 border-l-2 pl-2 text-xs text-muted-foreground">“{item.evidence}”</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
