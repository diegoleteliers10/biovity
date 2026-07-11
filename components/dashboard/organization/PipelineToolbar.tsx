"use client"

import {
  Cancel01Icon,
  Delete03Icon,
  Download01Icon,
  Message01Icon,
  Search01Icon,
  UserMultipleIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Applicant, ApplicationStage } from "@/lib/types/dashboard"

const STAGE_FILTER_OPTIONS: { value: ApplicationStage | "all"; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "pendiente", label: "Pendiente" },
  { value: "entrevista", label: "Entrevista" },
  { value: "oferta", label: "Oferta" },
  { value: "contratado", label: "Contratado" },
  { value: "rechazado", label: "Rechazado" },
]

const STAGE_ORDER: ApplicationStage[] = ["pendiente", "entrevista", "oferta", "contratado"]

function getNextStage(current: ApplicationStage): ApplicationStage | null {
  const idx = STAGE_ORDER.indexOf(current)
  if (idx === -1 || idx >= STAGE_ORDER.length - 1) return null
  return STAGE_ORDER[idx + 1]
}

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
  selectedCount,
  selectedApplicants,
  onClearSelection,
  onBulkReject,
  onBulkMessage,
  onBulkAdvance,
}: {
  searchQuery: string
  onSearchChange: (query: string) => void
  stageFilter: ApplicationStage | "all"
  onStageFilterChange: (stage: ApplicationStage | "all") => void
  selectedCount: number
  selectedApplicants: Applicant[]
  onClearSelection: () => void
  onBulkReject: () => void
  onBulkMessage: () => void
  onBulkAdvance: (stage: ApplicationStage) => void
}) {
  const canAdvance = selectedApplicants.some((a) => getNextStage(a.stage) !== null)
  const advanceStage =
    selectedApplicants.length > 0
      ? (STAGE_ORDER[STAGE_ORDER.indexOf(selectedApplicants[0].stage) + 1] ?? null)
      : null

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
            className="h-9 pl-9 text-sm"
          />
        </div>
        <Select
          value={stageFilter}
          onValueChange={(v) => onStageFilterChange(v as ApplicationStage | "all")}
        >
          <SelectTrigger className="h-9 w-[140px] text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STAGE_FILTER_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedCount > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2">
          <HugeiconsIcon icon={UserMultipleIcon} size={16} className="text-primary" />
          <span className="text-sm font-medium">{selectedCount} seleccionados</span>
          <div className="flex-1" />
          {canAdvance && advanceStage && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkAdvance(advanceStage)}
              className="h-8 gap-1.5"
            >
              Avanzar a {advanceStage}
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={onBulkMessage} className="h-8 gap-1.5">
            <HugeiconsIcon icon={Message01Icon} size={14} />
            Mensaje
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-rose-600 hover:text-rose-700"
              >
                <HugeiconsIcon icon={Delete03Icon} size={14} />
                Rechazar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Rechazar candidatos</AlertDialogTitle>
                <AlertDialogDescription>
                  Se rechazaran {selectedCount} candidato{selectedCount > 1 ? "s" : ""}. Esta accion
                  no se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction variant="destructive" onClick={onBulkReject}>
                  Rechazar {selectedCount}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant="ghost" size="sm" onClick={onClearSelection} className="h-8">
            <HugeiconsIcon icon={Cancel01Icon} size={14} />
          </Button>
        </div>
      )}
    </div>
  )
}

export { exportApplicantsCsv }
