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
  onStatusChange,
  onScheduleInterview,
  onSendMessage,
}: {
  applicationId: string
  applicationStatus: ApplicationStage
  candidateId: string
  candidateName: string
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
          <SelectTrigger className="h-9 w-[160px] text-sm">
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

        <Button variant="outline" size="sm" onClick={() => onScheduleInterview?.(candidateId)}>
          <HugeiconsIcon icon={Calendar04Icon} size={14} className="mr-1.5" />
          Agendar entrevista
        </Button>

        <Button variant="outline" size="sm" onClick={() => onSendMessage?.(candidateId)}>
          <HugeiconsIcon icon={Message01Icon} size={14} className="mr-1.5" />
          Mensaje
        </Button>

        <ScorecardSheet applicationId={applicationId} candidateName={candidateName}>
          <Button variant="outline" size="sm">
            <HugeiconsIcon icon={NoteAddIcon} size={14} className="mr-1.5" />
            Evaluar
          </Button>
        </ScorecardSheet>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-rose-600 hover:text-rose-700">
              <HugeiconsIcon icon={Cancel01Icon} size={14} className="mr-1.5" />
              Rechazar
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Rechazar postulacion</AlertDialogTitle>
              <AlertDialogDescription>
                Estas seguro de que deseas rechazar a {candidateName}? Puedes dejar un motivo
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
                className="bg-rose-600 hover:bg-rose-700"
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
