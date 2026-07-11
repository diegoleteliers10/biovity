"use client"

import { Download02Icon, UserAdd02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/components/ui/button"
import type { User } from "@/lib/api/users"
import { formatUserLocation } from "@/lib/api/users"

interface TalentBulkBarProps {
  selectedCount: number
  selectedUsers: User[]
  onClearSelection: () => void
  onExportCSV: (users: User[]) => void
  onInviteAll?: () => void
}

export function TalentBulkBar({
  selectedCount,
  selectedUsers,
  onClearSelection,
  onExportCSV,
  onInviteAll,
}: TalentBulkBarProps) {
  if (selectedCount === 0) return null

  return (
    <div className="flex items-center gap-3 rounded-lg border border-secondary/20 bg-secondary/5 px-4 py-2.5 text-sm animate-in slide-in-from-bottom-2 duration-200">
      <span className="font-medium text-secondary">
        {selectedCount} candidato{selectedCount !== 1 ? "s" : ""} seleccionado
        {selectedCount !== 1 ? "s" : ""}
      </span>
      <div className="flex items-center gap-2 ml-auto">
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs gap-1.5"
          onClick={() => onExportCSV(selectedUsers)}
          id="bulk-export-csv"
        >
          <HugeiconsIcon icon={Download02Icon} size={13} strokeWidth={1.5} />
          Exportar CSV
        </Button>
        {onInviteAll && (
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs gap-1.5"
            onClick={onInviteAll}
            id="bulk-invite"
          >
            <HugeiconsIcon icon={UserAdd02Icon} size={13} strokeWidth={1.5} />
            Invitar a oferta
          </Button>
        )}
        <button
          type="button"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors ml-1"
          onClick={onClearSelection}
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}

/** Generates and triggers download of a CSV file from the selected users */
export function exportTalentCSV(users: User[]) {
  const headers = ["Nombre", "Email", "Profesión", "Teléfono", "Ubicación", "Creado"]
  const rows = users.map((u) => [
    `"${u.name.replace(/"/g, '""')}"`,
    `"${u.email.replace(/"/g, '""')}"`,
    `"${(u.profession ?? "").replace(/"/g, '""')}"`,
    `"${(u.phone ?? "").replace(/"/g, '""')}"`,
    `"${formatUserLocation(u.location).replace(/"/g, '""')}"`,
    `"${u.createdAt ? new Date(u.createdAt).toLocaleDateString("es-CL") : ""}"`,
  ])

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", `talento-biovity-${new Date().toISOString().slice(0, 10)}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
