"use client"

import { Bookmark02Icon, Cash02Icon, Clock01Icon, Location05Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Job } from "@/lib/api/jobs"
import { formatJobLocation } from "@/lib/api/jobs"
import type { useRemoveSavedJobMutation, useSaveJobMutation } from "@/lib/api/use-saved-jobs"
import { formatFechaRelativa, formatJobSalary } from "@/lib/utils"

function getJobModalidad(job: Job): string {
  const loc = job.location
  if (!loc) return "presencial"
  if (loc.isRemote) return "remoto"
  if (loc.isHybrid) return "hibrido"
  return "presencial"
}

interface JobListItemProps {
  job: Job
  isSaved: boolean
  userId: string
  onSave: (jobId: string) => void
  saveMutation: ReturnType<typeof useSaveJobMutation>
  removeMutation: ReturnType<typeof useRemoveSavedJobMutation>
}

export function JobListItem({
  job,
  isSaved,
  userId,
  onSave,
  saveMutation,
  removeMutation,
}: JobListItemProps) {
  const { push } = useRouter()
  const salaryStr = formatJobSalary(job.salary)
  const locationStr = formatJobLocation(job.location) || "Sin especificar"
  const postedStr = job.createdAt ? formatFechaRelativa(new Date(job.createdAt)) : "—"
  const modalidad = getJobModalidad(job)

  return (
    <Card
      onClick={() => push(`/dashboard/job/${job.id}`)}
      className="group relative cursor-pointer gap-0 overflow-hidden rounded-xl border-border/50 bg-surface-container-lowest py-0 shadow-none transition-colors duration-150 hover:bg-surface-container-low focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          push(`/dashboard/job/${job.id}`)
        }
      }}
      aria-label={`Ver detalles de ${job.title}`}
    >
      <CardContent className="px-4 py-3">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-start justify-between gap-4">
            <h2 className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
              {job.title}
            </h2>
            <div className="flex shrink-0 items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums">
                <HugeiconsIcon
                  icon={Clock01Icon}
                  size={16}
                  className="shrink-0 text-muted-foreground"
                />
                <span>{postedStr}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-md hover:bg-muted"
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onSave(job.id)
                }}
                aria-label={isSaved ? `Quitar ${job.title} de guardados` : `Guardar ${job.title}`}
                aria-pressed={isSaved}
                disabled={!userId || saveMutation.isPending || removeMutation.isPending}
              >
                <HugeiconsIcon
                  icon={Bookmark02Icon}
                  size={24}
                  strokeWidth={1.5}
                  className={`size-4 ${isSaved ? "fill-current text-secondary" : ""}`}
                />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="flex min-w-0 shrink-0 items-center gap-2 text-xs text-muted-foreground">
              <span className="truncate">{job.organization?.name ?? "Organización"}</span>
              <span className="shrink-0 text-border">|</span>
              <div className="flex min-w-0 items-center gap-1.5">
                <HugeiconsIcon icon={Location05Icon} size={16} className="shrink-0" />
                <span className="truncate">{locationStr}</span>
              </div>
            </div>

            <div className="flex flex-col gap-y-2 sm:flex-row sm:items-center sm:gap-x-4 sm:gap-y-0 sm:shrink-0">
              <div className="mt-1.5 flex min-w-0 items-center gap-1.5 text-sm font-semibold text-foreground tabular-nums sm:mt-0">
                <HugeiconsIcon icon={Cash02Icon} size={16} className="shrink-0 text-secondary" />
                <span className="min-w-0 break-words">{salaryStr}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs sm:mt-0">
            <span className="rounded-md bg-surface-container-highest px-2 py-0.5 font-medium text-muted-foreground">
              {modalidad === "hibrido" ? "Híbrido" : modalidad}
            </span>
            {job.employmentType && (
              <span className="rounded-md bg-surface-container-highest px-2 py-0.5 font-medium text-muted-foreground">
                {job.employmentType === "Full-time"
                  ? "Full Time"
                  : job.employmentType === "Part-time"
                    ? "Part Time"
                    : job.employmentType}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
