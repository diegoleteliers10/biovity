"use client"

import { ArrowDown01Icon, File02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { dashboardRaisedCardClass } from "@/components/dashboard/shared/surface-classes"
import type { Job } from "@/lib/api/jobs"
import { cn } from "@/lib/utils"

interface JobSelectorProps {
  selectedJobId: string | null
  onSelectJobId: (id: string | null) => void
  jobs: Job[]
  isLoading: boolean
  error: Error | null
}

export function JobSelector({
  selectedJobId,
  onSelectJobId,
  jobs,
  isLoading,
  error,
}: JobSelectorProps) {
  return (
    <div className="lg:h-full lg:w-64 shrink-0">
      <aside
        className={`hidden lg:flex h-full w-64 shrink-0 flex-col gap-2 overflow-y-auto p-2 ${dashboardRaisedCardClass}`}
      >
        <p className="px-2 text-xs leading-4 font-medium text-muted-foreground">Ofertas</p>
        {isLoading ? (
          <div className="flex flex-col gap-2 px-1 py-1">
            {[0, 1, 2].map((i) => (
              <div
                key={`job-skeleton-${i}`}
                className="h-8 animate-pulse rounded-md bg-surface-container-highest/60"
              />
            ))}
          </div>
        ) : error ? (
          <p className="px-2 text-destructive text-sm">{error.message}</p>
        ) : !jobs.length ? (
          <div className="flex flex-col gap-1 px-2 py-3">
            <p className="text-sm font-medium text-foreground">Sin ofertas publicadas</p>
            <p className="text-xs text-muted-foreground">
              Crea una oferta para ver sus postulaciones aquí.
            </p>
          </div>
        ) : (
          jobs.map((job) => (
            <button
              key={job.id}
              type="button"
              onClick={() => onSelectJobId(job.id)}
              className={cn(
                "flex flex-col gap-0.5 rounded-md px-3 py-2 text-left transition-colors duration-150",
                selectedJobId === job.id ? "bg-primary/10 text-primary" : "hover:bg-muted/60"
              )}
              aria-pressed={selectedJobId === job.id}
              aria-label={`Ver aplicaciones de ${job.title}`}
            >
              <span className="truncate font-medium text-sm">{job.title}</span>
            </button>
          ))
        )}
      </aside>

      <div className="lg:hidden mb-3">
        <div className="relative">
          <select
            value={selectedJobId ?? ""}
            onChange={(e) => onSelectJobId(e.target.value || null)}
            className="h-11 w-full appearance-none rounded-lg border border-border/40 bg-surface-container-low px-3.5 pr-9 text-sm text-foreground outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
            aria-label="Seleccionar oferta"
          >
            <option value="">Selecciona una oferta</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            aria-hidden="true"
            className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
        </div>
      </div>
    </div>
  )
}

interface NoApplicantsEmptyStateProps {
  jobTitle?: string
}

export function NoApplicantsEmptyState({ jobTitle }: NoApplicantsEmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 py-12 text-center">
      <div className="size-10 rounded-full bg-surface-container-highest flex items-center justify-center text-muted-foreground">
        <HugeiconsIcon icon={File02Icon} size={20} strokeWidth={1.5} />
      </div>
      <p className="text-sm font-medium text-foreground">
        {jobTitle ? `Sin postulantes en "${jobTitle}".` : "Sin postulantes en esta oferta."}
      </p>
      <p className="text-xs text-muted-foreground max-w-[240px]">
        Las aplicaciones aparecerán aquí cuando los candidatos se postulen.
      </p>
    </div>
  )
}

type NoJobSelectedStateProps = Record<string, never>

export function NoJobSelectedState(_props: NoJobSelectedStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 py-12 text-center">
      <div className="size-10 rounded-full bg-surface-container-highest flex items-center justify-center text-muted-foreground">
        <HugeiconsIcon icon={File02Icon} size={20} strokeWidth={1.5} />
      </div>
      <p className="text-sm font-medium text-foreground">Selecciona una oferta</p>
      <p className="text-xs text-muted-foreground max-w-[240px]">
        Elige una oferta de la lista para ver y gestionar las postulaciones en el tablero.
      </p>
    </div>
  )
}
