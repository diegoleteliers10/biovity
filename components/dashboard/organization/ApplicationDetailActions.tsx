"use client"

import {
  Calendar04Icon,
  Cancel01Icon,
  Mail01Icon,
  Message01Icon,
  NoteAddIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Result } from "better-result"
import { useState } from "react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useEvaluations } from "@/hooks/use-evaluations"
import type { ApplicationStatus } from "@/lib/api/applications"
import { useApplicationStatusHistory } from "@/lib/api/use-applications"
import { type PipelineStage, useRejectionReasons } from "@/lib/api/use-pipeline-stages"
import type { ApplicationStage } from "@/lib/types/dashboard"
import { formatDateChilean } from "@/lib/utils"
import { ApplicationNotes } from "./ApplicationNotes"
import { EvaluationSummary } from "./EvaluationSummary"
import { ScorecardSheet } from "./ScorecardSheet"

const STATUS_OPTIONS: { value: ApplicationStage; label: string }[] = [
  { value: "pendiente", label: "Pendiente" },
  { value: "entrevista", label: "Entrevista" },
  { value: "oferta", label: "Oferta" },
  { value: "contratado", label: "Contratado" },
  { value: "rechazado", label: "Rechazado" },
  { value: "desistido", label: "Desistido" },
]

const TERMINAL_STATUSES: ReadonlySet<ApplicationStatus> = new Set([
  "contratado",
  "rechazado",
  "desistido",
])
const OPEN_STATUSES: ReadonlySet<PipelineStage["statusProjection"]> = new Set([
  "pendiente",
  "entrevista",
  "oferta",
])

type StatusChangeHandler =
  | ((
      applicationId: string,
      stage: ApplicationStage,
      rejectionNote?: string,
      rejectionReasonId?: string
    ) => void)
  | ((
      applicationId: string,
      stage: ApplicationStage,
      rejectionNote?: string,
      rejectionReasonId?: string
    ) => boolean | Promise<boolean>)

export function ApplicationDetailActions({
  applicationId,
  organizationId,
  applicationStatus,
  candidateId,
  candidateName,
  candidateAvatar,
  candidateProfession,
  onStatusChange,
  pipelineStageId,
  pipelineStages,
  onStageChange,
  onReopen,
  onScheduleInterview,
  onSendMessage,
  onSendOffer,
}: {
  applicationId: string
  organizationId: string
  applicationStatus: ApplicationStage
  candidateId: string
  candidateName: string
  candidateAvatar?: string | null
  candidateProfession?: string | null
  onStatusChange?: StatusChangeHandler
  pipelineStageId?: string | null
  pipelineStages?: PipelineStage[]
  onStageChange?: (
    applicationId: string,
    stageId: string,
    rejectionNote?: string,
    rejectionReasonId?: string
  ) => Promise<boolean>
  onReopen?: (applicationId: string, stageId: string, reason: string) => Promise<boolean>
  onScheduleInterview?: (candidateId: string) => void
  onSendMessage?: (candidateId: string) => void
  onSendOffer?: () => void
}) {
  const evaluationQuery = useEvaluations(applicationId)
  const historyQuery = useApplicationStatusHistory(applicationId)
  const rejectionReasonsQuery = useRejectionReasons(organizationId)
  const activeRejectionReasons = rejectionReasonsQuery.data?.filter((reason) => reason.active) ?? []
  const [rejectReason, setRejectReason] = useState("")
  const [rejectReasonId, setRejectReasonId] = useState("")
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [reopenDialogOpen, setReopenDialogOpen] = useState(false)
  const [reopenStageId, setReopenStageId] = useState("")
  const [reopenReason, setReopenReason] = useState("")
  const [rejectStageId, setRejectStageId] = useState<string | null>(null)
  const currentStage = pipelineStages?.find((stage) => stage.id === pipelineStageId)
  const isTerminal = TERMINAL_STATUSES.has(applicationStatus)
  const reopenStages =
    pipelineStages?.filter(
      (stage) => !stage.isArchived && OPEN_STATUSES.has(stage.statusProjection)
    ) ?? []

  async function changePipelineStage(
    stageId: string,
    note?: string,
    reasonId?: string
  ): Promise<boolean> {
    if (!onStageChange) return false
    const result = await Result.tryPromise(() =>
      onStageChange(applicationId, stageId, note, reasonId)
    )
    if (result.isErr() || result.value === false) {
      toast.error("No se pudo cambiar la etapa. Reintenta.")
      return false
    }
    return true
  }

  async function changeStage(
    stage: ApplicationStage,
    note?: string,
    reasonId?: string
  ): Promise<boolean> {
    if (!onStatusChange) return false
    const result = await Result.tryPromise(() =>
      Promise.resolve(onStatusChange(applicationId, stage, note, reasonId))
    )
    if (result.isErr() || result.value === false) {
      toast.error("No se pudo cambiar la etapa. Reintenta.")
      return false
    }
    return true
  }

  async function reopenApplication(): Promise<boolean> {
    if (!onReopen || !reopenStageId || !reopenReason.trim()) return false
    const result = await Result.tryPromise(() =>
      onReopen(applicationId, reopenStageId, reopenReason.trim())
    )
    if (result.isErr() || result.value === false) {
      toast.error("No se pudo reabrir la postulación. Revisa el motivo y reintenta.")
      return false
    }
    setReopenReason("")
    setReopenStageId("")
    setReopenDialogOpen(false)
    toast.success("Postulación reabierta")
    return true
  }

  return (
    <div className="space-y-4">
      {/* Status bar */}
      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={pipelineStages ? (currentStage?.id ?? "") : applicationStatus}
          disabled={isTerminal}
          onValueChange={(value) => {
            if (pipelineStages) {
              const target = pipelineStages.find((stage) => stage.id === value)
              if (!target || target.isArchived || target.id === pipelineStageId) return
              if (target.statusProjection === "rechazado") {
                setRejectStageId(target.id)
                setRejectDialogOpen(true)
              } else {
                void changePipelineStage(target.id)
              }
              return
            }
            const stage = STATUS_OPTIONS.find((option) => option.value === value)?.value
            if (stage === "rechazado") setRejectDialogOpen(true)
            else if (stage) void changeStage(stage)
          }}
        >
          <SelectTrigger className="h-9 w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pipelineStages
              ? pipelineStages
                  .filter((stage) => !stage.isArchived || stage.id === pipelineStageId)
                  .map((stage) => (
                    <SelectItem key={stage.id} value={stage.id} disabled={stage.isArchived}>
                      {stage.name}
                    </SelectItem>
                  ))
              : STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={() => onScheduleInterview?.(candidateId)}
          disabled={isTerminal}
          className="h-9 rounded-md px-3"
        >
          <HugeiconsIcon icon={Calendar04Icon} size={14} className="mr-1.5" />
          Agendar entrevista
        </Button>

        <Button
          variant="outline"
          onClick={() => onSendMessage?.(candidateId)}
          className="h-9 rounded-md px-3"
        >
          <HugeiconsIcon icon={Message01Icon} size={14} className="mr-1.5" />
          Mensaje
        </Button>

        <Button
          variant="outline"
          onClick={() => onSendOffer?.()}
          disabled={isTerminal}
          className="h-9 rounded-md px-3"
        >
          <HugeiconsIcon icon={Mail01Icon} size={14} className="mr-1.5" />
          Enviar oferta
        </Button>

        <ScorecardSheet
          applicationId={applicationId}
          candidateName={candidateName}
          candidateAvatar={candidateAvatar}
          candidateProfession={candidateProfession}
          applicationStatus={applicationStatus}
          onStatusChange={isTerminal ? undefined : onStatusChange}
          pipelineStageId={pipelineStageId}
          pipelineStages={pipelineStages}
          onStageChange={isTerminal ? undefined : onStageChange}
          onScheduleInterview={
            onScheduleInterview ? () => onScheduleInterview(candidateId) : undefined
          }
          onSendMessage={onSendMessage ? () => onSendMessage(candidateId) : undefined}
        >
          <Button
            variant="outline"
            className="h-9 gap-1.5 rounded-md px-3 border-secondary/30 hover:bg-secondary/10 hover:text-secondary"
          >
            <HugeiconsIcon icon={NoteAddIcon} size={14} />
            Evaluar
          </Button>
        </ScorecardSheet>

        <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              disabled={isTerminal}
              className="h-9 rounded-md px-3 text-destructive hover:text-destructive/80 border-destructive/30 hover:bg-destructive/10"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={14} className="mr-1.5" />
              Rechazar
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Rechazar postulación</AlertDialogTitle>
              <AlertDialogDescription>
                Selecciona un motivo para rechazar a {candidateName}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-2">
              <Select value={rejectReasonId} onValueChange={setRejectReasonId}>
                <SelectTrigger aria-label="Motivo de rechazo">
                  <SelectValue placeholder="Seleccionar motivo" />
                </SelectTrigger>
                <SelectContent>
                  {activeRejectionReasons.map((reason) => (
                    <SelectItem key={reason.id} value={reason.id}>
                      {reason.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                maxLength={2000}
                placeholder="Nota interna opcional"
                className="min-h-[80px] text-sm"
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={(event) => {
                  event.preventDefault()
                  const save = rejectStageId
                    ? changePipelineStage(rejectStageId, rejectReason, rejectReasonId)
                    : changeStage("rechazado", rejectReason, rejectReasonId)
                  void save.then((saved) => {
                    if (!saved) return
                    setRejectReason("")
                    setRejectReasonId("")
                    setRejectStageId(null)
                    setRejectDialogOpen(false)
                  })
                }}
                className="bg-destructive text-white hover:bg-destructive/90"
                disabled={
                  isTerminal ||
                  !rejectReasonId ||
                  rejectionReasonsQuery.isLoading ||
                  activeRejectionReasons.length === 0
                }
              >
                Rechazar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {isTerminal && (
          <AlertDialog
            open={reopenDialogOpen}
            onOpenChange={(isOpen) => {
              setReopenDialogOpen(isOpen)
              if (isOpen && !reopenStageId) setReopenStageId(reopenStages[0]?.id ?? "")
              if (!isOpen) {
                setReopenReason("")
                setReopenStageId("")
              }
            }}
          >
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                disabled={!reopenStages.length}
                className="h-9 rounded-md px-3"
              >
                Reabrir postulación
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reabrir postulación</AlertDialogTitle>
                <AlertDialogDescription>
                  Elige una etapa activa y registra el motivo.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="space-y-3 py-2">
                <Select value={reopenStageId} onValueChange={setReopenStageId}>
                  <SelectTrigger aria-label="Etapa activa">
                    <SelectValue placeholder="Seleccionar etapa" />
                  </SelectTrigger>
                  <SelectContent>
                    {reopenStages.map((stage) => (
                      <SelectItem key={stage.id} value={stage.id}>
                        {stage.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Textarea
                  value={reopenReason}
                  onChange={(event) => setReopenReason(event.target.value)}
                  maxLength={2000}
                  placeholder="Motivo de reapertura"
                  className="min-h-[80px] text-sm"
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(event) => {
                    event.preventDefault()
                    void reopenApplication()
                  }}
                  disabled={!reopenStageId || !reopenReason.trim()}
                >
                  Reabrir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <section className="space-y-3 rounded-xl bg-surface-container-low p-4">
        <h3 className="text-xs font-medium">Historial de etapas</h3>
        {historyQuery.isLoading ? (
          <p className="text-xs text-muted-foreground">Cargando historial...</p>
        ) : historyQuery.isError ? (
          <div role="alert" className="text-xs text-destructive">
            No se pudo cargar el historial.
            <button
              type="button"
              onClick={() => void historyQuery.refetch()}
              className="ml-2 underline"
            >
              Reintentar
            </button>
          </div>
        ) : historyQuery.data?.length ? (
          <ol className="space-y-3">
            {historyQuery.data.map((item) => (
              <li key={item.id} className="border-l border-border pl-3 text-xs">
                <p className="font-medium">
                  {item.previousStatus ?? "Postulación"} → {item.newStatus}
                </p>
                <p className="text-muted-foreground">
                  {item.changedByName ?? "Sistema"} ·{" "}
                  {formatDateChilean(item.changedAt, "d MMM yyyy, HH:mm")}
                </p>
                {item.rejectionNote && (
                  <p className="mt-1 whitespace-pre-wrap text-muted-foreground">
                    Motivo interno: {item.rejectionNote}
                  </p>
                )}
                {item.rejectionReasonSnapshot && (
                  <p className="mt-1 text-muted-foreground">
                    Motivo seleccionado: {item.rejectionReasonSnapshot}
                  </p>
                )}
                {item.transitionKind === "reopen" && item.transitionNote && (
                  <p className="mt-1 text-muted-foreground">
                    Motivo de reapertura: {item.transitionNote}
                  </p>
                )}
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-xs text-muted-foreground">Sin cambios de etapa.</p>
        )}
      </section>

      <section
        className="space-y-3 rounded-xl bg-surface-container-low p-4"
        aria-label="Evaluación humana"
      >
        <h3 className="text-xs font-medium">Evaluación del equipo</h3>
        {evaluationQuery.isLoading ? (
          <p className="text-xs text-muted-foreground">Cargando evaluaciones...</p>
        ) : evaluationQuery.isError ? (
          <div role="alert" className="text-xs text-destructive">
            No se pudieron cargar las evaluaciones.
            <button
              type="button"
              onClick={() => void evaluationQuery.refetch()}
              className="ml-2 underline"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <EvaluationSummary evaluations={evaluationQuery.data ?? []} mode="detail" />
        )}
      </section>

      {/* Notes section */}
      <ApplicationNotes applicationId={applicationId} />
    </div>
  )
}
