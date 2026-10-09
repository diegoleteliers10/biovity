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
import type { ApplicationStage } from "@/lib/types/dashboard"
import { ApplicationNotes } from "./ApplicationNotes"
import { EvaluationSummary } from "./EvaluationSummary"
import { ScorecardSheet } from "./ScorecardSheet"

const STATUS_OPTIONS: { value: ApplicationStage; label: string }[] = [
  { value: "pendiente", label: "Pendiente" },
  { value: "entrevista", label: "Entrevista" },
  { value: "oferta", label: "Oferta" },
  { value: "contratado", label: "Contratado" },
  { value: "rechazado", label: "Rechazado" },
]

export function ApplicationDetailActions({
  applicationId,
  applicationStatus,
  candidateId,
  candidateName,
  candidateAvatar,
  candidateProfession,
  onStatusChange,
  onScheduleInterview,
  onSendMessage,
  onSendOffer,
}: {
  applicationId: string
  applicationStatus: ApplicationStage
  candidateId: string
  candidateName: string
  candidateAvatar?: string | null
  candidateProfession?: string | null
  onStatusChange?: (applicationId: string, newStage: ApplicationStage) => void | Promise<void>
  onScheduleInterview?: (candidateId: string) => void
  onSendMessage?: (candidateId: string) => void
  onSendOffer?: () => void
}) {
  const evaluationQuery = useEvaluations(applicationId)
  const [rejectReason, setRejectReason] = useState("")

  async function changeStage(stage: ApplicationStage) {
    if (!onStatusChange) return
    const result = await Result.tryPromise(() =>
      Promise.resolve(onStatusChange(applicationId, stage))
    )
    if (result.isErr()) toast.error("No se pudo cambiar la etapa. Reintenta.")
  }

  return (
    <div className="space-y-4">
      {/* Status bar */}
      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={applicationStatus}
          onValueChange={(value) => {
            const stage = STATUS_OPTIONS.find((option) => option.value === value)?.value
            if (stage) void changeStage(stage)
          }}
        >
          <SelectTrigger className="h-9 w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={() => onScheduleInterview?.(candidateId)}
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

        <Button variant="outline" onClick={() => onSendOffer?.()} className="h-9 rounded-md px-3">
          <HugeiconsIcon icon={Mail01Icon} size={14} className="mr-1.5" />
          Enviar oferta
        </Button>

        <ScorecardSheet
          applicationId={applicationId}
          candidateName={candidateName}
          candidateAvatar={candidateAvatar}
          candidateProfession={candidateProfession}
          applicationStatus={applicationStatus}
          onStatusChange={onStatusChange}
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

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
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
                ¿Estás seguro de que deseas rechazar a {candidateName}? Puedes dejar un motivo
                opcional.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-2">
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Motivo del rechazo (opcional)"
                className="min-h-[80px] text-sm"
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  void changeStage("rechazado")
                  setRejectReason("")
                }}
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                Rechazar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

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
