"use client"

import {
  Cancel01Icon,
  Delete03Icon,
  Message01Icon,
  Search01Icon,
  UserMultipleIcon,
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { OrganizationMember } from "@/lib/api/organization-members"
import { useRejectionReasons, type PipelineStage } from "@/lib/api/use-pipeline-stages"
import { resolveApplicantPipelineStageId } from "@/lib/pipeline-stage-board"
import type { Applicant } from "@/lib/types/dashboard"

function exportApplicantsCsv(applicants: Applicant[]) {
  const headers = ["Nombre", "Posicion", "Estado", "Salario Min", "Salario Max", "Guardado"]
  const rows = applicants.map((a) => [
    a.candidateName,
    a.position,
    a.stage,
    a.salaryMin != null ? String(a.salaryMin) : "",
    a.salaryMax != null ? String(a.salaryMax) : "",
    a.isSaved ? "Si" : "No",
  ])
  const csv = [headers, ...rows]
    .map((r) => r.map((f) => `"${f.replace(/"/g, '""')}"`).join(","))
    .join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `candidatos_${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export function PipelineToolbar({
  searchQuery,
  onSearchChange,
  stageFilter,
  onStageFilterChange,
  evaluationFilter = "all",
  onEvaluationFilterChange,
  evaluationsAvailable = true,
  selectedCount,
  selectedApplicants,
  onClearSelection,
  onBulkReject,
  onBulkMessage,
  onBulkAdvance,
  pipelineStages,
  members,
  assigneeFilter,
  onAssigneeFilterChange,
  overdueOnly,
  onOverdueOnlyChange,
  organizationId,
}: {
  searchQuery: string
  onSearchChange: (query: string) => void
  stageFilter: string
  onStageFilterChange: (stageId: string) => void
  evaluationFilter?: string
  onEvaluationFilterChange?: (value: string) => void
  evaluationsAvailable?: boolean
  selectedCount: number
  selectedApplicants: Applicant[]
  onClearSelection: () => void
  onBulkReject: (reasonId: string, note?: string) => void
  onBulkMessage: () => void
  onBulkAdvance: (stageId: string) => void
  pipelineStages: PipelineStage[]
  members: OrganizationMember[]
  assigneeFilter: string
  onAssigneeFilterChange: (userId: string) => void
  overdueOnly: boolean
  onOverdueOnlyChange: (overdueOnly: boolean) => void
  organizationId: string
}) {
  const reasonsQuery = useRejectionReasons(organizationId)
  const reasons = reasonsQuery.data?.filter((reason) => reason.active) ?? []
  const [rejectionReasonId, setRejectionReasonId] = useState("")
  const [rejectionNote, setRejectionNote] = useState("")
  const selectedStageId = selectedApplicants[0]
    ? resolveApplicantPipelineStageId(selectedApplicants[0], pipelineStages)
    : null
  const sameStage = selectedApplicants.every(
    (applicant) => resolveApplicantPipelineStageId(applicant, pipelineStages) === selectedStageId
  )
  const activeStages = pipelineStages
    .filter((stage) => !stage.isArchived)
    .sort((a, b) => a.order - b.order)
  const currentStageIndex = activeStages.findIndex((stage) => stage.id === selectedStageId)
  const advanceStage =
    sameStage && currentStageIndex >= 0 ? activeStages[currentStageIndex + 1] : undefined

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <HugeiconsIcon
            icon={Search01Icon}
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nombre..."
            className="h-9 pl-9"
          />
        </div>
        <Select value={stageFilter} onValueChange={onStageFilterChange}>
          <SelectTrigger className="h-9 w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las etapas</SelectItem>
            {pipelineStages.map((stage) => (
              <SelectItem key={stage.id} value={stage.id}>
                {stage.name}
                {stage.isArchived ? " (Archivada)" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={assigneeFilter} onValueChange={onAssigneeFilterChange}>
          <SelectTrigger className="h-9 w-[180px]" aria-label="Filtrar por responsable">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los responsables</SelectItem>
            <SelectItem value="unassigned">Sin responsable</SelectItem>
            {members
              .filter((member) => member.role === "admin" || member.role === "recruiter")
              .map((member) => (
                <SelectItem key={member.userId} value={member.userId}>
                  {member.user?.name ?? member.user?.email ?? "Miembro"}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <Button
          type="button"
          size="sm"
          variant={overdueOnly ? "default" : "outline"}
          aria-pressed={overdueOnly}
          onClick={() => onOverdueOnlyChange(!overdueOnly)}
          className="h-9"
        >
          Solo atrasadas
        </Button>
        {onEvaluationFilterChange && (
          <Select
            value={evaluationFilter}
            onValueChange={onEvaluationFilterChange}
            disabled={!evaluationsAvailable}
          >
            <SelectTrigger className="h-9 w-[190px]" aria-label="Filtrar por evaluación">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las evaluaciones</SelectItem>
              <SelectItem value="unevaluated">Sin evaluar</SelectItem>
              <SelectItem value="positive">Avanzar</SelectItem>
              <SelectItem value="neutral">Con dudas</SelectItem>
              <SelectItem value="negative">Descartar</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {selectedCount > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2">
          <HugeiconsIcon icon={UserMultipleIcon} size={16} className="text-primary" />
          <span className="text-sm font-medium">{selectedCount} seleccionados</span>
          <div className="flex-1" />
          {advanceStage && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkAdvance(advanceStage.id)}
              className="h-9 gap-1.5 rounded-md px-3 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Avanzar a {advanceStage.name}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onBulkMessage}
            className="h-9 gap-1.5 rounded-md px-3 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <HugeiconsIcon icon={Message01Icon} size={14} />
            Mensaje
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-1.5 rounded-md px-3 text-xs font-medium text-destructive hover:text-destructive"
              >
                <HugeiconsIcon icon={Delete03Icon} size={14} />
                Rechazar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Rechazar candidatos</AlertDialogTitle>
                <AlertDialogDescription>
                  Selecciona un motivo para rechazar {selectedCount} candidato
                  {selectedCount > 1 ? "s" : ""}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="space-y-2">
                <Select value={rejectionReasonId} onValueChange={setRejectionReasonId}>
                  <SelectTrigger aria-label="Motivo de rechazo">
                    <SelectValue placeholder="Seleccionar motivo" />
                  </SelectTrigger>
                  <SelectContent>
                    {reasons.map((reason) => (
                      <SelectItem key={reason.id} value={reason.id}>
                        {reason.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Textarea
                  value={rejectionNote}
                  onChange={(event) => setRejectionNote(event.target.value)}
                  maxLength={2000}
                  placeholder="Nota interna opcional"
                  className="min-h-16"
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  disabled={!rejectionReasonId || reasonsQuery.isLoading || reasons.length === 0}
                  onClick={(event) => {
                    event.preventDefault()
                    onBulkReject(rejectionReasonId, rejectionNote)
                    setRejectionReasonId("")
                    setRejectionNote("")
                  }}
                >
                  Rechazar {selectedCount}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant="ghost" size="sm" onClick={onClearSelection} className="h-9 rounded-md">
            <HugeiconsIcon icon={Cancel01Icon} size={14} />
          </Button>
        </div>
      )}
    </div>
  )
}

export { exportApplicantsCsv }
