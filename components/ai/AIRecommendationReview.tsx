"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Result as R, type Result } from "better-result"
import { useState } from "react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { ScoreExplanation } from "@/lib/ai/decision/types"

const RecommendationSchema = z.enum(["Avanzar", "Evaluar", "Descartar"])
const ReviewSchema = z.object({
  id: z.string().uuid(),
  actionId: z.string().uuid(),
  revisionId: z.string().uuid(),
  reviewerId: z.string().uuid().nullable(),
  reviewerName: z.string(),
  aiRecommendation: RecommendationSchema,
  decision: RecommendationSchema,
  reason: z.string().nullable(),
  createdAt: z.string(),
})
const ReviewsResponseSchema = z.object({ reviews: z.array(ReviewSchema) })
const ReviewResponseSchema = z.object({ review: ReviewSchema })
type Review = z.infer<typeof ReviewSchema>
type Recommendation = ScoreExplanation["recommendation"]

const choices: Recommendation[] = ["Avanzar", "Evaluar", "Descartar"]

async function readReviews(jobId: string, revisionId: string): Promise<Result<Review[], Error>> {
  const search = new URLSearchParams({ jobId, revisionId })
  const responseResult = await R.tryPromise({
    try: () => fetch(`/api/ai/score-review?${search}`),
    catch: (cause) => (cause instanceof Error ? cause : new Error("No se pudo conectar")),
  })
  if (responseResult.isErr()) return R.err(responseResult.error)
  const bodyResult = await R.tryPromise({
    try: () => responseResult.value.json(),
    catch: () => new Error("La respuesta de revisión no es válida"),
  })
  if (bodyResult.isErr()) return R.err(bodyResult.error)
  if (!responseResult.value.ok) return R.err(new Error("No se pudo cargar el historial"))
  const parsed = ReviewsResponseSchema.safeParse(bodyResult.value)
  return parsed.success ? R.ok(parsed.data.reviews) : R.err(new Error("Historial inválido"))
}

async function saveReview(input: {
  jobId: string
  revisionId: string
  actionId: string
  decision: Recommendation
  reason: string | null
}): Promise<Result<Review, Error>> {
  const responseResult = await R.tryPromise({
    try: () =>
      fetch("/api/ai/score-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }),
    catch: (cause) => (cause instanceof Error ? cause : new Error("No se pudo conectar")),
  })
  if (responseResult.isErr()) return R.err(responseResult.error)
  const bodyResult = await R.tryPromise({
    try: () => responseResult.value.json(),
    catch: () => new Error("La respuesta de revisión no es válida"),
  })
  if (bodyResult.isErr()) return R.err(bodyResult.error)
  if (!responseResult.value.ok) {
    const body = z.object({ error: z.string().optional() }).safeParse(bodyResult.value)
    return R.err(
      new Error(body.success ? (body.data.error ?? "No se pudo guardar") : "No se pudo guardar")
    )
  }
  const parsed = ReviewResponseSchema.safeParse(bodyResult.value)
  return parsed.success
    ? R.ok(parsed.data.review)
    : R.err(new Error("La respuesta de revisión no es válida"))
}

export function AIRecommendationReview({
  jobId,
  revisionId,
  recommendation,
}: {
  jobId: string
  revisionId: string
  recommendation: Recommendation
}) {
  const queryClient = useQueryClient()
  const queryKey = ["jev-review", jobId, revisionId]
  const [decision, setDecision] = useState<Recommendation>(recommendation)
  const [reason, setReason] = useState("")
  const [actionId, setActionId] = useState<string | null>(null)
  const reviewsQuery = useQuery({
    queryKey,
    queryFn: () => readReviews(jobId, revisionId),
  })
  const mutation = useMutation({
    mutationFn: saveReview,
    onSuccess: (result) => {
      if (result.isOk()) {
        setActionId(null)
        void queryClient.invalidateQueries({ queryKey })
      }
    },
  })
  const needsReason = decision !== recommendation
  const saved = mutation.data?.isOk() ? mutation.data.value : null
  const error = mutation.data?.isErr() ? mutation.data.error.message : null

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const retryActionId = actionId ?? crypto.randomUUID()
    setActionId(retryActionId)
    mutation.mutate({
      jobId,
      revisionId,
      actionId: retryActionId,
      decision,
      reason: reason.trim() || null,
    })
  }

  return (
    <section className="space-y-4 border-t border-border/40 pt-4" aria-labelledby="ai-review-title">
      <h3 id="ai-review-title" className="text-sm font-semibold">
        Revisión humana
      </h3>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <fieldset className="space-y-2">
          <legend className="text-xs font-medium">Decisión</legend>
          <div className="flex flex-wrap gap-2">
            {choices.map((choice) => (
              <label
                key={choice}
                className={`inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm ${decision === choice ? "border-secondary bg-secondary/10 text-secondary" : "border-border/50"}`}
              >
                <input
                  type="radio"
                  name={`ai-review-${revisionId}`}
                  value={choice}
                  checked={decision === choice}
                  disabled={mutation.isPending}
                  onChange={() => {
                    mutation.reset()
                    setDecision(choice)
                    setActionId(null)
                  }}
                />
                {choice}
              </label>
            ))}
          </div>
        </fieldset>

        {needsReason && (
          <label
            className="block space-y-1.5 text-xs font-medium"
            htmlFor={`ai-review-reason-${revisionId}`}
          >
            Motivo del cambio
            <Textarea
              id={`ai-review-reason-${revisionId}`}
              value={reason}
              disabled={mutation.isPending}
              onChange={(event) => {
                mutation.reset()
                setReason(event.target.value)
                setActionId(null)
              }}
              maxLength={1000}
              required
              rows={3}
              className="text-sm font-normal"
            />
          </label>
        )}

        <Button
          type="submit"
          size="sm"
          disabled={mutation.isPending || (needsReason && !reason.trim())}
        >
          {mutation.isPending ? "Guardando..." : "Guardar revisión"}
        </Button>
        {saved && (
          <p role="status" className="text-xs text-secondary">
            Revisión guardada.
          </p>
        )}
        {error && (
          <p role="alert" className="text-xs text-destructive">
            {error}
          </p>
        )}
      </form>

      <section className="space-y-2" aria-label="Historial de revisión">
        <h4 className="text-xs font-medium">Historial</h4>
        {reviewsQuery.isPending ? (
          <p className="text-xs text-muted-foreground">Cargando historial...</p>
        ) : reviewsQuery.isError || !reviewsQuery.data?.isOk() ? (
          <p role="alert" className="text-xs text-muted-foreground">
            No se pudo cargar el historial.
          </p>
        ) : reviewsQuery.data.value.length === 0 ? (
          <p className="text-xs text-muted-foreground">Sin revisiones.</p>
        ) : (
          <ol className="space-y-2">
            {reviewsQuery.data.value.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </ol>
        )}
      </section>
    </section>
  )
}

function ReviewItem({ review }: { review: Review }) {
  const changed = review.aiRecommendation !== review.decision
  return (
    <li className="rounded-lg bg-surface-container-low p-3 text-xs">
      <p className="font-medium">
        {review.reviewerName}: {review.decision}
      </p>
      {changed && (
        <p className="mt-1 text-muted-foreground">Sugerencia de IA: {review.aiRecommendation}</p>
      )}
      {review.reason && (
        <p className="mt-1 whitespace-pre-wrap text-muted-foreground">{review.reason}</p>
      )}
      <time className="mt-1 block text-muted-foreground" dateTime={review.createdAt}>
        {new Intl.DateTimeFormat("es-CL", { dateStyle: "medium", timeStyle: "short" }).format(
          new Date(review.createdAt)
        )}
      </time>
    </li>
  )
}
