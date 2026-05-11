"use client"

import { Bookmark02Icon, Cash02Icon, Clock01Icon, Location05Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Job } from "@/lib/api/jobs"
import { formatJobLocation } from "@/lib/api/jobs"
import type { useRemoveSavedJobMutation, useSaveJobMutation } from "@/lib/api/use-saved-jobs"
import { formatFechaRelativa, formatSalarioRango } from "@/lib/utils"

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
  const salaryStr =
    job.salary?.min != null && job.salary?.max != null
      ? formatSalarioRango(job.salary.min, job.salary.max)
      : job.salary?.isNegotiable
        ? "A convenir"
        : "—"
  const locationStr = formatJobLocation(job.location) || "Sin especificar"
  const postedStr = job.createdAt ? formatFechaRelativa(new Date(job.createdAt)) : "—"
  const modalidad = getJobModalidad(job)

  return (
    <Card
      onClick={() => push(`/dashboard/job/${job.id}`)}
      className="group relative cursor-pointer overflow-hidden flex flex-col border border-border/80 bg-white hover:border-border transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
      <CardContent className="px-6 py-3">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-lg sm:text-xl flex-1 font-semibold text-foreground tracking-tight">
              {job.title}
            </h2>
            <div className="flex shrink-0 items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground/90">
                <HugeiconsIcon
                  icon={Clock01Icon}
                  size={16}
                  className="shrink-0 text-muted-foreground/80"
                />
                <span>{postedStr}</span>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
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
            <div className="flex min-w-0 shrink-0 items-center gap-2 text-sm text-muted-foreground/90">
              <span className="truncate">{job.organization?.name ?? "Organización"}</span>
              <span className="shrink-0 text-muted-foreground/60">|</span>
              <div className="flex min-w-0 items-center gap-1.5 text-muted-foreground/90">
                <HugeiconsIcon
                  icon={Location05Icon}
                  size={18}
                  className="shrink-0 text-muted-foreground/80"
                />
                <span className="truncate">{locationStr}</span>
              </div>
            </div>

            <div className="flex flex-col gap-y-2 sm:flex-row sm:items-center sm:gap-x-4 sm:gap-y-0 sm:shrink-0">
              <div className="mt-1.5 flex min-w-0 items-center gap-1.5 font-semibold text-foreground text-sm sm:mt-0">
                <HugeiconsIcon icon={Cash02Icon} size={18} className="shrink-0 text-secondary" />
                <span className="min-w-0 break-words">{salaryStr}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm sm:mt-0">
            <Badge variant="secondary" className="shrink-0 capitalize">
              {modalidad === "hibrido" ? "Híbrido" : modalidad}
            </Badge>
            <Badge variant="default" className="shrink-0 capitalize">
              {job.employmentType === "Full-time"
                ? "Full Time"
                : job.employmentType === "Part-time"
                  ? "Part Time"
                  : job.employmentType}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
