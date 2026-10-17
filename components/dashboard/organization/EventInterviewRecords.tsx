"use client"

import { useState } from "react"
import { useDashboardSession } from "@/components/dashboard/DashboardSessionContext"
import { Button } from "@/components/ui/button"
import type {
  EventInterviewCriterionResponse,
  EventInterviewEvaluation,
  InterviewRating,
  InterviewRecommendation,
} from "@/lib/api/event-interviews"
import {
  useEventInterviewRecords,
  useSaveEventInterviewEvaluation,
  useSaveEventInterviewOutcome,
} from "@/lib/api/use-event-interviews"

const ratingLabels: Record<InterviewRating, string> = {
  positive: "Positiva",
  neutral: "Neutral",
  negative: "Negativa",
}

const recommendationLabels: Record<InterviewRecommendation, string> = {
  advance: "Avanzar",
  hold: "Mantener en revisión",
  no_advance: "No avanzar",
}

const skillLabels: Record<string, string> = {
  technical: "Técnica",
  cultural: "Cultura",
  expectations: "Expectativas",
}

function isRating(value: string): value is InterviewRating {
  return value === "positive" || value === "neutral" || value === "negative"
}

function isRecommendation(value: string): value is InterviewRecommendation {
  return value === "advance" || value === "hold" || value === "no_advance"
}

function scoreValue(evaluation: EventInterviewEvaluation | undefined, skill: string): string {
  return evaluation?.skills_assessment[skill] ?? ""
}

export function EventInterviewRecords({ eventId }: { eventId: string }) {
  const session = useDashboardSession()
  const userId = session?.user?.id
  const query = useEventInterviewRecords(eventId, true)
  const saveEvaluation = useSaveEventInterviewEvaluation(eventId)
  const saveOutcome = useSaveEventInterviewOutcome(eventId)
  const [ratingDraft, setRatingDraft] = useState<InterviewRating | "" | undefined>()
  const [recommendationDraft, setRecommendationDraft] = useState<
    InterviewRecommendation | "" | undefined
  >()
  const [notesDraft, setNotesDraft] = useState<string | undefined>()
  const [outcomeDraft, setOutcomeDraft] = useState<InterviewRecommendation | "" | undefined>()
  const [outcomeNotesDraft, setOutcomeNotesDraft] = useState<string | undefined>()
  const [scoresDraft, setScoresDraft] = useState<Record<string, string>>({})
  const [criterionDraft, setCriterionDraft] = useState<
    Record<string, { score: string; evidence: string }>
  >({})

  const visibleEvaluations = query.data?.canViewHiringRecords
    ? query.data.canEvaluate
      ? query.data.evaluations
          .filter((item) => item.evaluator_role_id === query.data.viewerRoleId)
          .map((item) => ({
            ...item,
            criterion_responses: item.criterion_responses.filter((response) =>
              query.data.rubric?.criteria.some(
                (criterion) =>
                  criterion.id === response.criterion_id &&
                  (criterion.roleIds.length === 0 ||
                    criterion.roleIds.includes(query.data.viewerRoleId ?? ""))
              )
            ),
          }))
      : query.data.evaluations
    : []
  const ownEvaluation = visibleEvaluations.find((item) => item.evaluator_id === userId)
  const visibleCriteria = (query.data?.rubric?.criteria ?? []).filter(
    (criterion) =>
      criterion.roleIds.length === 0 || criterion.roleIds.includes(query.data?.viewerRoleId ?? "")
  )
  const rating = ratingDraft ?? ownEvaluation?.rating ?? ""
  const recommendation = recommendationDraft ?? ownEvaluation?.recommendation ?? ""
  const outcome = outcomeDraft ?? query.data?.outcome?.outcome ?? ""
  const ratingNotes = notesDraft ?? ownEvaluation?.notes ?? ""
  const outcomeNotes = outcomeNotesDraft ?? query.data?.outcome?.notes ?? ""

  if (query.isLoading) {
    return <p className="text-xs text-muted-foreground">Cargando evaluaciones...</p>
  }
  if (query.isError || !query.data) {
    return <p className="text-xs text-destructive">No se pudieron cargar las evaluaciones.</p>
  }

  const handleSaveEvaluation = () => {
    if (!isRating(rating)) return
    const criterionResponses: EventInterviewCriterionResponse[] = visibleCriteria.map(
      (criterion) => {
        const draft = criterionDraft[criterion.id]
        const saved = ownEvaluation?.criterion_responses.find(
          (response) => response.criterion_id === criterion.id
        )
        const score = Number(draft?.score ?? saved?.score)
        return {
          criterion_id: criterion.id,
          score,
          evidence: (draft?.evidence ?? saved?.evidence ?? "").trim() || null,
        }
      }
    )
    const skillsAssessment = Object.fromEntries(
      ["technical", "cultural", "expectations"].flatMap((skill) => {
        const score = scoresDraft[skill] ?? scoreValue(ownEvaluation, skill)
        return score ? [[skill, score]] : []
      })
    )
    saveEvaluation.mutate({
      rating,
      notes: ratingNotes || undefined,
      skillsAssessment,
      criterionResponses: criterionResponses.map((response) => ({
        criterionId: response.criterion_id,
        score: response.score,
        ...(response.evidence ? { evidence: response.evidence } : {}),
      })),
      recommendation: isRecommendation(recommendation) ? recommendation : undefined,
    })
  }

  const handleSaveOutcome = () => {
    if (!isRecommendation(outcome)) return
    saveOutcome.mutate({ outcome, notes: outcomeNotes || undefined })
  }

  return (
    <section className="w-full space-y-3 rounded-lg border border-border/40 bg-surface-container-low p-3">
      <h3 className="text-xs leading-4 font-medium text-foreground">Evaluación interna</h3>
      {!query.data.canViewHiringRecords ? null : !query.data.rubric ? (
        <p className="text-xs text-muted-foreground">Esta entrevista no tiene rúbrica capturada.</p>
      ) : (
        !query.data.canEvaluate && (
          <div className="rounded-md border border-border/40 p-2">
            <p className="text-xs font-medium text-foreground">
              Rúbrica · {query.data.rubric.stage_name}
            </p>
            {query.data.rubric.criteria.length === 0 ? (
              <p className="mt-1 text-xs text-muted-foreground">Sin criterios definidos.</p>
            ) : (
              <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                {query.data.rubric.criteria.map((criterion) => (
                  <li key={criterion.id}>
                    {criterion.label}
                    {criterion.description && ` · ${criterion.description}`}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      )}
      {!query.data.canViewHiringRecords ? null : visibleEvaluations.length === 0 ? (
        <p className="text-xs text-muted-foreground">Aún no hay evaluaciones.</p>
      ) : (
        <ul className="space-y-2">
          {visibleEvaluations.map((evaluation) => (
            <li key={evaluation.id} className="rounded-md border border-border/40 p-2 text-xs">
              <p className="font-medium text-foreground">
                {evaluation.evaluator_name} · {ratingLabels[evaluation.rating]}
                {evaluation.evaluator_role_label && ` · ${evaluation.evaluator_role_label}`}
                {evaluation.recommendation &&
                  ` · ${recommendationLabels[evaluation.recommendation]}`}
              </p>
              {Object.entries(evaluation.skills_assessment).length > 0 && (
                <p className="mt-1 text-muted-foreground">
                  {Object.entries(evaluation.skills_assessment)
                    .map(([skill, score]) => `${skillLabels[skill] ?? skill}: ${score}/5`)
                    .join(" · ")}
                </p>
              )}
              {evaluation.criterion_responses.length > 0 && (
                <ul className="mt-1 space-y-1 text-muted-foreground">
                  {evaluation.criterion_responses.map((response) => {
                    const criterion = query.data.rubric?.criteria.find(
                      (item) => item.id === response.criterion_id
                    )
                    return (
                      <li key={response.criterion_id}>
                        {criterion?.label ?? "Criterio"}: {response.score}/5
                        {response.evidence && ` · ${response.evidence}`}
                      </li>
                    )
                  })}
                </ul>
              )}
              {evaluation.notes && <p className="mt-1 text-muted-foreground">{evaluation.notes}</p>}
            </li>
          ))}
        </ul>
      )}

      {query.data.canEvaluate && (
        <div className="space-y-2 border-t border-border/40 pt-3">
          {query.data.rubric && (
            <fieldset className="space-y-2 rounded-md border border-border/40 p-2">
              <legend className="px-1 text-xs font-medium text-foreground">
                Criterios · {query.data.rubric.stage_name}
              </legend>
              {query.data.canEvaluate && query.data.viewerRoleLabel && (
                <p className="text-xs text-muted-foreground">
                  Función: {query.data.viewerRoleLabel}
                </p>
              )}
              {visibleCriteria.map((criterion) => {
                const saved = ownEvaluation?.criterion_responses.find(
                  (response) => response.criterion_id === criterion.id
                )
                const value = criterionDraft[criterion.id] ?? {
                  score: saved ? String(saved.score) : "",
                  evidence: saved?.evidence ?? "",
                }
                return (
                  <div key={criterion.id} className="space-y-1 rounded-md bg-background p-2">
                    <label className="block space-y-1 text-xs">
                      <span>{criterion.label} · Puntaje 1 a 5</span>
                      {criterion.description && (
                        <span className="block text-muted-foreground">{criterion.description}</span>
                      )}
                      <select
                        className="h-9 w-full rounded-md border border-border/40 bg-background px-2"
                        value={value.score}
                        onChange={(event) =>
                          setCriterionDraft((current) => ({
                            ...current,
                            [criterion.id]: {
                              ...value,
                              score: event.currentTarget.value,
                            },
                          }))
                        }
                        aria-label={`Puntaje de ${criterion.label}`}
                      >
                        <option value="">Selecciona un puntaje</option>
                        {[1, 2, 3, 4, 5].map((score) => (
                          <option key={score} value={score}>
                            {score}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block space-y-1 text-xs">
                      <span>Evidencia opcional</span>
                      <textarea
                        className="min-h-14 w-full rounded-md border border-border/40 bg-background p-2"
                        maxLength={2000}
                        value={value.evidence}
                        onChange={(event) =>
                          setCriterionDraft((current) => ({
                            ...current,
                            [criterion.id]: {
                              ...value,
                              evidence: event.currentTarget.value,
                            },
                          }))
                        }
                      />
                    </label>
                  </div>
                )
              })}
            </fieldset>
          )}
          <label className="block space-y-1 text-xs">
            <span>Tu evaluación</span>
            <select
              className="h-9 w-full rounded-md border border-border/40 bg-background px-2"
              value={rating}
              onChange={(event) =>
                setRatingDraft(isRating(event.currentTarget.value) ? event.currentTarget.value : "")
              }
            >
              <option value="">Selecciona una evaluación</option>
              {Object.entries(ratingLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1 text-xs">
            <span>Recomendación</span>
            <select
              className="h-9 w-full rounded-md border border-border/40 bg-background px-2"
              value={recommendation}
              onChange={(event) =>
                setRecommendationDraft(
                  isRecommendation(event.currentTarget.value) ? event.currentTarget.value : ""
                )
              }
            >
              <option value="">Sin recomendación</option>
              {Object.entries(recommendationLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              ["technical", "Técnica"],
              ["cultural", "Cultura"],
              ["expectations", "Expectativas"],
            ].map(([skill, label]) => (
              <label key={skill} className="space-y-1 text-xs">
                <span>{label} / 5</span>
                <input
                  className="h-9 w-full rounded-md border border-border/40 bg-background px-2"
                  type="number"
                  min="0"
                  max="5"
                  step="1"
                  value={scoresDraft[skill] ?? scoreValue(ownEvaluation, skill)}
                  onChange={(event) =>
                    setScoresDraft((current) => ({
                      ...current,
                      [skill]: event.currentTarget.value,
                    }))
                  }
                />
              </label>
            ))}
          </div>
          <label className="block space-y-1 text-xs">
            <span>Notas {rating && rating !== "positive" ? "(obligatorias)" : ""}</span>
            <textarea
              className="min-h-20 w-full rounded-md border border-border/40 bg-background p-2"
              maxLength={5000}
              value={ratingNotes}
              onChange={(event) => setNotesDraft(event.currentTarget.value)}
            />
          </label>
          {saveEvaluation.isError && (
            <p className="text-xs text-destructive">No se pudo guardar tu evaluación.</p>
          )}
          <Button
            type="button"
            size="sm"
            className="h-9"
            disabled={
              !isRating(rating) ||
              (visibleCriteria.some((criterion) => {
                const score =
                  criterionDraft[criterion.id]?.score ??
                  ownEvaluation?.criterion_responses
                    .find((response) => response.criterion_id === criterion.id)
                    ?.score?.toString() ??
                  ""
                return !/^[1-5]$/.test(score)
              }) ??
                false) ||
              (rating !== "positive" && !ratingNotes.trim()) ||
              saveEvaluation.isPending
            }
            onClick={handleSaveEvaluation}
          >
            {saveEvaluation.isPending ? "Guardando..." : "Guardar evaluación"}
          </Button>
        </div>
      )}

      {query.data.canViewOutcome && (
        <div className="space-y-2 border-t border-border/40 pt-3">
          <p className="text-xs font-medium text-foreground">
            Resultado final:{" "}
            {query.data.outcome ? recommendationLabels[query.data.outcome.outcome] : "Pendiente"}
          </p>
          {query.data.canDecideOutcome && (
            <>
              <label className="block space-y-1 text-xs">
                <span>Decisión de la empresa</span>
                <select
                  className="h-9 w-full rounded-md border border-border/40 bg-background px-2"
                  value={outcome}
                  onChange={(event) =>
                    setOutcomeDraft(
                      isRecommendation(event.currentTarget.value) ? event.currentTarget.value : ""
                    )
                  }
                >
                  <option value="">Selecciona un resultado</option>
                  {Object.entries(recommendationLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <textarea
                aria-label="Notas del resultado final"
                className="min-h-16 w-full rounded-md border border-border/40 bg-background p-2 text-xs"
                maxLength={5000}
                placeholder="Notas de la decisión"
                value={outcomeNotes}
                onChange={(event) => setOutcomeNotesDraft(event.currentTarget.value)}
              />
              {saveOutcome.isError && (
                <p className="text-xs text-destructive">No se pudo guardar el resultado.</p>
              )}
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-9"
                disabled={!isRecommendation(outcome) || saveOutcome.isPending}
                onClick={handleSaveOutcome}
              >
                {saveOutcome.isPending ? "Guardando..." : "Guardar resultado"}
              </Button>
            </>
          )}
        </div>
      )}

      {query.data.canViewHiringRecords && (
        <details className="border-t border-border/40 pt-2">
          <summary className="cursor-pointer text-xs font-medium">Actividad de evaluación</summary>
          {query.data.audit.length === 0 ? (
            <p className="mt-2 text-xs text-muted-foreground">Sin cambios registrados.</p>
          ) : (
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              {query.data.audit.map((entry) => (
                <li key={entry.id}>
                  {entry.actor_name} {entry.action === "saved" ? "guardó" : "actualizó"}{" "}
                  {entry.record_type === "evaluation" ? "una evaluación" : "el resultado"} ·{" "}
                  {new Date(entry.created_at).toLocaleString("es-CL")}
                </li>
              ))}
            </ul>
          )}
        </details>
      )}
    </section>
  )
}
