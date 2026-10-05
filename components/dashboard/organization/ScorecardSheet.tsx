"use client"

import { Result } from "better-result"
import { useState } from "react"
import { useDashboardSession } from "@/components/dashboard/DashboardSessionContext"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import {
  type Evaluation,
  useEvaluations,
  useUpsertEvaluationMutation,
} from "@/hooks/use-evaluations"
import type { ApplicationStage } from "@/lib/types/dashboard"
import { cn, formatDateChilean } from "@/lib/utils"
import { CONTEXTS, CRITERIA, DECISIONS, QUICK_TAGS, STAGES } from "./ScorecardSheet.constants"
import type {
  EvaluationDraft,
  EvaluationEditorProps,
  EvaluationLoaderProps,
  ScorecardSheetProps,
} from "./ScorecardSheet.types"

function makeDraft(existing: Evaluation | undefined): EvaluationDraft {
  const skills = existing?.skills_assessment
  return {
    rating: existing?.rating ?? null,
    context: skills?.context ?? "cv_review",
    technical: skills?.technical ?? "0",
    cultural: skills?.cultural ?? "0",
    expectations: skills?.expectations ?? "0",
    notes: existing?.notes ?? "",
    tags:
      skills?.tags
        ?.split(",")
        .map((tag) => tag.trim())
        .filter(Boolean) ?? [],
  }
}

export function ScorecardSheet(props: ScorecardSheetProps) {
  const [open, setOpen] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [discard, setDiscard] = useState(false)
  const [saving, setSaving] = useState(false)

  function changeOpen(next: boolean) {
    if (!next && saving) return
    if (!next && dirty) {
      setDiscard(true)
      return
    }
    setOpen(next)
  }

  return (
    <>
      <Sheet open={open} onOpenChange={changeOpen}>
        <SheetTrigger asChild>{props.children}</SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg h-full p-0 gap-0 border-l border-border/40 bg-surface-container-lowest shadow-none overflow-hidden">
          <SheetHeader className="border-b border-border/40 bg-surface-container-low p-6 text-left shrink-0">
            <div className="flex items-center gap-3 pr-8">
              <Avatar className="size-11 border border-border/40 shadow-none">
                {props.candidateAvatar && (
                  <AvatarImage src={props.candidateAvatar} alt={props.candidateName} />
                )}
                <AvatarFallback>
                  {props.candidateName.trim().slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <SheetTitle className="truncate">{props.candidateName}</SheetTitle>
                {props.candidateProfession && (
                  <p className="text-xs text-muted-foreground">{props.candidateProfession}</p>
                )}
              </div>
            </div>
            <SheetDescription className="sr-only">
              Evaluación interna del candidato
            </SheetDescription>
          </SheetHeader>
          {open && (
            <EvaluationLoader
              key={props.applicationId}
              {...props}
              onDirtyChange={setDirty}
              onSavingChange={setSaving}
              onClose={() => changeOpen(false)}
            />
          )}
        </SheetContent>
      </Sheet>
      <AlertDialog open={discard} onOpenChange={setDiscard}>
        <AlertDialogContent className="shadow-none">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Descartar los cambios?</AlertDialogTitle>
            <AlertDialogDescription>Los cambios sin guardar se perderán.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Seguir editando</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setDirty(false)
                setOpen(false)
              }}
            >
              Descartar cambios
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function EvaluationLoader(props: EvaluationLoaderProps) {
  const session = useDashboardSession()
  const query = useEvaluations(props.applicationId)
  const [loaded, setLoaded] = useState(false)
  if (!loaded && query.isFetchedAfterMount && !query.isError && query.data !== undefined) {
    setLoaded(true)
  }
  if (!session?.user.id)
    return (
      <p role="alert" className="p-6">
        No se pudo identificar al evaluador. Vuelve a iniciar sesión.
      </p>
    )
  if (loaded && query.data !== undefined)
    return (
      <EvaluationEditor
        {...props}
        evaluations={query.data}
        evaluatorId={session.user.id}
        refreshError={query.isError}
      />
    )
  if (query.isError)
    return (
      <div className="p-6 space-y-3">
        <p role="alert">No se pudieron cargar las evaluaciones.</p>
        <Button variant="outline" onClick={() => void query.refetch()}>
          Reintentar
        </Button>
      </div>
    )
  return (
    <p role="status" className="p-6">
      Cargando evaluación...
    </p>
  )
}

function EvaluationEditor(props: EvaluationEditorProps) {
  const [existing, setExisting] = useState(() =>
    props.evaluations.find((evaluation) => evaluation.evaluator_id === props.evaluatorId)
  )
  const [draft, setDraft] = useState(() => makeDraft(existing))
  const [savedDraft, setSavedDraft] = useState(() => makeDraft(existing))
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [targetStage, setTargetStage] = useState<ApplicationStage | null>(null)
  const [stagePending, setStagePending] = useState(false)
  const mutation = useUpsertEvaluationMutation(props.applicationId)
  const needsNotes = draft.rating === "neutral" || draft.rating === "negative"
  const canSave = draft.rating !== null && (!needsNotes || draft.notes.trim().length > 0)

  function update(patch: Partial<EvaluationDraft>) {
    const next = { ...draft, ...patch }
    setDraft(next)
    props.onDirtyChange(JSON.stringify(next) !== JSON.stringify(savedDraft))
    setSaved(false)
    setError(null)
  }

  async function save() {
    if (!canSave || draft.rating === null || mutation.isPending) return
    props.onSavingChange(true)
    const result = await mutation.mutateAsync({
      rating: draft.rating,
      notes: draft.notes.trim(),
      skillsAssessment: {
        ...existing?.skills_assessment,
        context: draft.context,
        technical: draft.technical,
        cultural: draft.cultural,
        expectations: draft.expectations,
        tags: draft.tags.join(","),
      },
    })
    props.onSavingChange(false)
    if (result.isErr()) {
      setError("No se pudo guardar la evaluación. Tus cambios siguen aquí. Reintenta.")
      return
    }
    setExisting(result.value)
    setSavedDraft(draft)
    props.onDirtyChange(false)
    setSaved(true)
    setError(null)
  }

  async function changeStage() {
    if (!targetStage || !props.onStatusChange || stagePending) return
    setStagePending(true)
    const stage = targetStage
    const result = await Result.tryPromise(() =>
      Promise.resolve(props.onStatusChange?.(props.applicationId, stage))
    )
    setStagePending(false)
    setTargetStage(null)
    if (result.isErr())
      setError("La evaluación está guardada. No se pudo cambiar la etapa. Reintenta.")
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {props.refreshError && (
          <p role="alert" className="text-xs text-destructive">
            No se pudo actualizar la evaluación. Tus cambios siguen aquí.
          </p>
        )}
        <fieldset disabled={mutation.isPending} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="evaluation-context" className="text-sm font-medium">
              Contexto
            </label>
            <select
              id="evaluation-context"
              value={draft.context}
              onChange={(event) => update({ context: event.target.value })}
              className="w-full rounded-md border border-border bg-surface-container-low p-2 text-sm"
            >
              {CONTEXTS.map((context) => (
                <option key={context.value} value={context.value}>
                  {context.label}
                </option>
              ))}
            </select>
          </div>
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium mb-2">Dictamen</legend>
            <div className="grid grid-cols-3 gap-2">
              {DECISIONS.map((decision) => (
                <button
                  key={decision.value}
                  type="button"
                  aria-pressed={draft.rating === decision.value}
                  onClick={() => update({ rating: decision.value })}
                  className={cn(
                    "rounded-lg border p-3 text-xs font-medium",
                    draft.rating === decision.value
                      ? "bg-secondary/10 text-secondary border-secondary/40"
                      : "bg-surface-container-low border-border/40"
                  )}
                >
                  {decision.label}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="space-y-3">
            {CRITERIA.map((criterion) => (
              <fieldset key={criterion.key} className="rounded-lg border border-border/40 p-3">
                <legend className="px-1 text-xs font-medium">{criterion.label}</legend>
                <div className="flex flex-wrap gap-2">
                  {["0", "1", "2", "3", "4", "5"].map((value) => (
                    <button
                      key={value}
                      type="button"
                      aria-label={`${criterion.label}: ${value === "0" ? "No evaluado" : value}`}
                      aria-pressed={draft[criterion.key] === value}
                      onClick={() => update({ [criterion.key]: value })}
                      className={cn(
                        "rounded-md border px-3 py-2 text-xs",
                        draft[criterion.key] === value
                          ? "bg-secondary/10 border-secondary/40 text-secondary"
                          : "border-border/40"
                      )}
                    >
                      {value === "0" ? "No evaluado" : value}
                    </button>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium mb-2">Etiquetas de feedback</legend>
            <div className="flex flex-wrap gap-2">
              {[...new Set([...QUICK_TAGS, ...draft.tags])].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  aria-pressed={draft.tags.includes(tag)}
                  onClick={() =>
                    update({
                      tags: draft.tags.includes(tag)
                        ? draft.tags.filter((item) => item !== tag)
                        : [...draft.tags, tag],
                    })
                  }
                  className={cn(
                    "rounded-md border px-3 py-2 text-xs",
                    draft.tags.includes(tag)
                      ? "bg-secondary/10 border-secondary/40 text-secondary"
                      : "border-border/40"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="space-y-2">
            <label htmlFor="evaluation-notes" className="text-sm font-medium">
              Notas internas {needsNotes ? "(obligatorias)" : "(opcionales)"}
            </label>
            <Textarea
              id="evaluation-notes"
              value={draft.notes}
              required={needsNotes}
              onChange={(event) => update({ notes: event.target.value })}
              className="min-h-28 resize-y"
            />
          </div>
        </fieldset>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        {saved && (
          <div className="space-y-3 border-t border-border/40 pt-4">
            <p role="status" className="text-sm font-medium text-secondary">
              Evaluación guardada
            </p>
            <div className="flex flex-wrap gap-2">
              {props.onScheduleInterview && (
                <Button
                  variant="outline"
                  onClick={() => {
                    props.onClose()
                    props.onScheduleInterview?.()
                  }}
                >
                  Agendar entrevista
                </Button>
              )}
              {props.onSendMessage && (
                <Button
                  variant="outline"
                  onClick={() => {
                    props.onClose()
                    props.onSendMessage?.()
                  }}
                >
                  Enviar mensaje
                </Button>
              )}
            </div>
            {props.onStatusChange && (
              <fieldset className="space-y-2">
                <legend className="text-xs font-medium mb-2">Cambiar etapa</legend>
                <div className="flex flex-wrap gap-2">
                  {STAGES.filter((stage) => stage.value !== props.applicationStatus).map(
                    (stage) => (
                      <Button
                        key={stage.value}
                        size="sm"
                        variant="outline"
                        onClick={() => setTargetStage(stage.value)}
                      >
                        {stage.label}
                      </Button>
                    )
                  )}
                </div>
              </fieldset>
            )}
          </div>
        )}
        {existing && (
          <p className="text-xs text-muted-foreground">
            Tu última evaluación: {formatDateChilean(existing.updated_at, "d MMM yyyy HH:mm")}
          </p>
        )}
        {props.evaluations.some((evaluation) => evaluation.evaluator_id !== props.evaluatorId) && (
          <details className="border-t border-border/40 pt-4">
            <summary className="cursor-pointer text-sm font-medium">
              Evaluaciones del equipo
            </summary>
            <div className="space-y-4 pt-3">
              {props.evaluations
                .filter((evaluation) => evaluation.evaluator_id !== props.evaluatorId)
                .map((evaluation) => (
                  <article
                    key={evaluation.id}
                    className="rounded-lg border border-border/40 p-3 space-y-2"
                  >
                    <p className="text-sm font-medium">
                      {evaluation.evaluator_name || "Reclutador"}
                    </p>
                    <p className="text-xs">
                      {DECISIONS.find((decision) => decision.value === evaluation.rating)?.label}
                    </p>
                    {evaluation.notes && (
                      <p className="whitespace-pre-wrap text-xs text-muted-foreground">
                        {evaluation.notes}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {formatDateChilean(evaluation.updated_at, "d MMM yyyy HH:mm")}
                    </p>
                  </article>
                ))}
            </div>
          </details>
        )}
      </div>
      <div className="shrink-0 border-t border-border/40 p-4 flex justify-between gap-3">
        <Button variant="ghost" disabled={mutation.isPending} onClick={props.onClose}>
          Cerrar
        </Button>
        <Button
          disabled={!canSave || mutation.isPending}
          onClick={() => void save()}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
        >
          {mutation.isPending ? "Guardando..." : "Guardar evaluación"}
        </Button>
      </div>
      <AlertDialog
        open={targetStage !== null}
        onOpenChange={(open) => {
          if (!open && !stagePending) setTargetStage(null)
        }}
      >
        <AlertDialogContent className="shadow-none">
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Cambiar la etapa a {STAGES.find((stage) => stage.value === targetStage)?.label}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              La evaluación está guardada. Confirma el cambio de etapa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={stagePending}>Cancelar</AlertDialogCancel>
            <Button disabled={stagePending} onClick={() => void changeStage()}>
              {stagePending ? "Cambiando..." : "Confirmar cambio"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
