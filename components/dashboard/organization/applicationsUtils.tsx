"use client"

import { ArrowDown01Icon, File02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
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
      <aside className="hidden lg:flex h-full w-64 shrink-0 flex-col gap-2 overflow-y-auto rounded-lg border bg-muted/20 p-2">
        <p className="px-2 text-muted-foreground text-xs font-medium">Ofertas</p>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : error ? (
          <p className="px-2 text-destructive text-sm">{error.message}</p>
        ) : !jobs.length ? (
          <p className="px-2 text-muted-foreground text-sm">No hay ofertas publicadas.</p>
        ) : (
          jobs.map((job) => (
            <button
              key={job.id}
              type="button"
              onClick={() => onSelectJobId(job.id)}
              className={cn(
                "flex flex-col gap-0.5 rounded-md px-3 py-2 text-left transition-all duration-150 active:scale-[0.98]",
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
            className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-2 pr-12 text-sm"
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
            className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
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
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-muted">
        <HugeiconsIcon
          icon={File02Icon}
          size={44}
          strokeWidth={1.5}
          className="size-11 text-muted-foreground"
        />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">
          {jobTitle ? `Sin postulantes en "${jobTitle}".` : "Sin postulantes en esta oferta."}
        </p>
        <p className="text-muted-foreground text-xs">
          Las aplicaciones aparecerán aquí cuando los candidatos se postulen.
        </p>
      </div>
    </div>
  )
}

type NoJobSelectedStateProps = Record<string, never>

export function NoJobSelectedState(_props: NoJobSelectedStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-muted">
        <HugeiconsIcon
          icon={File02Icon}
          size={44}
          strokeWidth={1.5}
          className="size-11 text-muted-foreground"
        />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">Selecciona una oferta</p>
        <p className="px-4 text-muted-foreground text-xs lg:px-0">
          Elige una oferta de la lista para ver y gestionar las postulaciones en el tablero.
        </p>
      </div>
    </div>
  )
}
