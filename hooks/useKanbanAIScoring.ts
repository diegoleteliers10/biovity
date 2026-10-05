"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Result as R, type Result } from "better-result"
import { useState } from "react"
import { z } from "zod"
import type { CandidateScore } from "@/app/api/ai/score-candidates/route"

export type ScoreEntry = {
  score: CandidateScore
  analyzedAt: Date
}

const CandidateScoreSchema = z.object({
  applicationId: z.string(),
  candidateId: z.string(),
  revisionId: z.string(),
  status: z.enum(["pending", "processing", "ready", "insufficient", "failed"]),
  score: z.number().nullable(),
  label: z.enum(["Bajo", "Regular", "Bueno", "Excelente"]).nullable(),
  confidence: z.number().nullable(),
  sufficiency: z.number().nullable(),
  distribution: z.record(z.string(), z.number()).nullable(),
  perQuestion: z.record(z.string(), z.unknown()).nullable(),
  explanationStatus: z.enum(["pending", "processing", "ready", "failed", "expired"]),
  errorCode: z.string().nullable(),
  updatedAt: z.string(),
}) satisfies z.ZodType<CandidateScore>

const ScoresResponseSchema = z.object({ scores: z.array(CandidateScoreSchema) })
const QueueResponseSchema = z.object({
  queued: z.number(),
  warning: z.string().nullable().optional(),
})

const scoreKeys = {
  job: (jobId: string | null) => ["jev-scores", jobId] as const,
}

async function fetchScores(
  jobId: string
): Promise<Result<z.infer<typeof ScoresResponseSchema>, Error>> {
  const responseResult = await R.tryPromise({
    try: () => fetch(`/api/ai/score-candidates?jobId=${encodeURIComponent(jobId)}`),
    catch: (cause) =>
      cause instanceof Error ? cause : new Error("No se pudo conectar con el análisis"),
  })
  if (responseResult.isErr()) return R.err(responseResult.error)
  if (!responseResult.value.ok) return R.err(new Error("No se pudieron cargar los análisis"))
  const bodyResult = await R.tryPromise({
    try: () => responseResult.value.json(),
    catch: () => new Error("La respuesta de análisis no es válida"),
  })
  if (bodyResult.isErr()) return R.err(bodyResult.error)
  const parsed = ScoresResponseSchema.safeParse(bodyResult.value)
  return parsed.success
    ? R.ok(parsed.data)
    : R.err(new Error("La respuesta de análisis no es válida"))
}

async function enqueueAssessments(
  jobId: string | null,
  applicationIds: string[]
): Promise<Result<z.infer<typeof QueueResponseSchema>, Error>> {
  const responseResult = await R.tryPromise({
    try: () =>
      fetch("/api/ai/score-candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, applicationIds }),
      }),
    catch: (cause) =>
      cause instanceof Error ? cause : new Error("No se pudo conectar con el análisis"),
  })
  if (responseResult.isErr()) return R.err(responseResult.error)
  const bodyResult = await R.tryPromise({
    try: () => responseResult.value.json(),
    catch: () => new Error("La respuesta de análisis no es válida"),
  })
  if (bodyResult.isErr()) return R.err(bodyResult.error)
  if (!responseResult.value.ok) {
    const parsedError = z.object({ error: z.string() }).safeParse(bodyResult.value)
    return R.err(
      new Error(parsedError.success ? parsedError.data.error : "No se pudo iniciar el análisis")
    )
  }
  const parsed = QueueResponseSchema.safeParse(bodyResult.value)
  return parsed.success
    ? R.ok(parsed.data)
    : R.err(new Error("La respuesta de análisis no es válida"))
}

export function useKanbanAIScoring(jobId: string | null) {
  const queryClient = useQueryClient()
  const [actionError, setActionError] = useState<string | null>(null)
  const query = useQuery({
    queryKey: scoreKeys.job(jobId),
    queryFn: () => fetchScores(jobId ?? ""),
    enabled: Boolean(jobId),
    refetchInterval: (state) =>
      state.state.data?.isOk() &&
      state.state.data.value.scores.some(
        (score) => score.status === "pending" || score.status === "processing"
      )
        ? 2_000
        : false,
  })
  const analyzeMutation = useMutation({
    mutationFn: (applicationIds: string[]) => enqueueAssessments(jobId, applicationIds),
    onMutate: () => setActionError(null),
    onSuccess: (result) => {
      if (result.isErr()) {
        setActionError(result.error.message)
        return
      }
      setActionError(result.value.warning ?? null)
      void queryClient.invalidateQueries({ queryKey: scoreKeys.job(jobId) })
    },
  })

  const response = query.data?.isOk() ? query.data.value : null
  const entries = new Map(
    (response?.scores ?? []).map((score) => [
      score.applicationId,
      {
        score,
        analyzedAt: new Date(score.updatedAt),
      },
    ])
  )

  return {
    analyze: (applicationIds: string[]) => analyzeMutation.mutate(applicationIds),
    getScore: (candidateId: string) => entries.get(candidateId),
    isAnalyzing:
      analyzeMutation.isPending ||
      (entries.size > 0 &&
        [...entries.values()].some(
          ({ score }) => score.status === "pending" || score.status === "processing"
        )),
    analyzedAt:
      entries.size > 0
        ? new Date(Math.max(...[...entries.values()].map(({ analyzedAt }) => analyzedAt.getTime())))
        : null,
    error: actionError ?? (query.data?.isErr() ? query.data.error.message : null),
    scores: entries,
  }
}
