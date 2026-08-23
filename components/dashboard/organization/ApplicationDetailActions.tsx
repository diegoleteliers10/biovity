"use client"

import {
  Calendar04Icon,
  Cancel01Icon,
  Message01Icon,
  NoteAddIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"
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
import type { ApplicationStage } from "@/lib/types/dashboard"
import { ApplicationNotes } from "./ApplicationNotes"
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
}) {
  const [rejectReason, setRejectReason] = useState("")

  return (
    <div className="space-y-4">
      {/* Status bar */}
      <div className="flex flex-wrap items-center gap-3">
        <Select
          defaultValue={applicationStatus}
          onValueChange={(v) => onStatusChange?.(applicationId, v as ApplicationStage)}
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

        <ScorecardSheet
          applicationId={applicationId}
          candidateName={candidateName}
          candidateAvatar={candidateAvatar}
          candidateProfession={candidateProfession}
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
                  onStatusChange?.(applicationId, "rechazado")
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

      {/* Notes section */}
      <ApplicationNotes applicationId={applicationId} />
    </div>
  )
}
