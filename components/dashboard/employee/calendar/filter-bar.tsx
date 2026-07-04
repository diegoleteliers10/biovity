"use client"

import { Calendar01Icon, Cancel01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { EventStatus, EventType } from "@/lib/types/events"

type FilterBarProps = {
  activeType?: EventType
  activeStatus?: EventStatus
  onTypeChange: (type: EventType | undefined) => void
  onStatusChange: (status: EventStatus | undefined) => void
}

const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: "interview", label: "Entrevista" },
  { value: "onboarding", label: "Onboarding" },
  { value: "task_deadline", label: "Tarea" },
  { value: "announcement", label: "Anuncio" },
]

const EVENT_STATUSES: { value: EventStatus; label: string }[] = [
  { value: "scheduled", label: "Programado" },
  { value: "completed", label: "Completado" },
  { value: "cancelled", label: "Cancelado" },
]

const typeColor: Record<EventType, string> = {
  interview: "bg-primary/10 text-primary border-primary/20",
  onboarding: "bg-secondary/10 text-secondary-foreground border-secondary/20",
  task_deadline: "bg-accent/10 text-accent-foreground border-accent/20",
  announcement: "bg-muted/40 text-muted-foreground border-border/30",
}

const statusColor: Record<EventStatus, string> = {
  scheduled: "bg-primary/10 text-primary border-primary/20",
  completed: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
}

export function FilterBar({
  activeType,
  activeStatus,
  onTypeChange,
  onStatusChange,
}: FilterBarProps) {
  const hasFilters = activeType || activeStatus

  return (
    <div className="flex flex-wrap items-center gap-2">
      <HugeiconsIcon icon={Calendar01Icon} className="size-4 text-muted-foreground" />

      {EVENT_TYPES.map((et) => (
        <button
          key={et.value}
          type="button"
          onClick={() => onTypeChange(activeType === et.value ? undefined : et.value)}
          className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
            activeType === et.value
              ? typeColor[et.value]
              : "bg-transparent text-muted-foreground border-border/30 hover:bg-muted/30"
          }`}
        >
          {et.label}
        </button>
      ))}

      <span className="w-px h-4 bg-border/30" />

      {EVENT_STATUSES.map((es) => (
        <button
          key={es.value}
          type="button"
          onClick={() => onStatusChange(activeStatus === es.value ? undefined : es.value)}
          className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
            activeStatus === es.value
              ? statusColor[es.value]
              : "bg-transparent text-muted-foreground border-border/30 hover:bg-muted/30"
          }`}
        >
          {es.label}
        </button>
      ))}

      {hasFilters && (
        <button
          type="button"
          onClick={() => {
            onTypeChange(undefined)
            onStatusChange(undefined)
          }}
          className="flex items-center gap-1 px-2 py-1 rounded-full text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <HugeiconsIcon icon={Cancel01Icon} className="size-3" />
          Limpiar
        </button>
      )}
    </div>
  )
}
