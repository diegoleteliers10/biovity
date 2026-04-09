"use client"

import {
  Bookmark02Icon,
  Cash02Icon,
  Clock01Icon,
  Delete01Icon,
  Location05Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRouter } from "next/navigation"
import type * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatJobLocation, type Job } from "@/lib/api/jobs"
import { useJob } from "@/lib/api/use-jobs"
import { useOrganization } from "@/lib/api/use-organization-mutations"
import { useRemoveSavedJobMutation, useSavedJobsByUser } from "@/lib/api/use-saved-jobs"
import { authClient } from "@/lib/auth-client"
import { formatFechaRelativa, formatSalarioRango } from "@/lib/utils"

function getSalaryDisplay(job: Job): string {
  const s = job.salary
  if (!s) return "A convenir"

  if (s.min != null && s.max != null) {
    return formatSalarioRango(s.min, s.max)
  }

  return s.isNegotiable ? "A convenir" : "—"
}

function getPostedDisplay(iso: string | null | undefined): string {
  if (!iso) return "—"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "—"
  return formatFechaRelativa(d)
}

function SavedJobCard({ userId, jobId }: { userId: string; jobId: string }) {
  const router = useRouter()
  const removeMutation = useRemoveSavedJobMutation()

  const { data: job, isLoading: jobLoading } = useJob(jobId)
  const { data: organization } = useOrganization(
    job && !job.organization && job.organizationId ? job.organizationId : undefined
  )

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    removeMutation.mutate({ userId, jobId })
  }

  const handleOpenJob = () => {
    router.push(`/dashboard/job/${jobId}`)
  }

  const organizationName = job?.organization?.name ?? organization?.name ?? "Organización"
  const locationStr = formatJobLocation(job?.location) || "Sin especificar"
  const salaryStr = job ? getSalaryDisplay(job) : "—"
  const postedStr = getPostedDisplay(job?.createdAt)

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={handleOpenJob}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          handleOpenJob()
        }
      }}
      className="cursor-pointer relative overflow-hidden flex flex-col border border-border/80 bg-white hover:border-border transition-colors duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label="Ver vacante guardada"
    >
      <CardHeader className="pb-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-0.5">
            <CardTitle className="text-[15px] md:text-base font-semibold leading-tight line-clamp-2 text-foreground tracking-tight">
              {jobLoading ? "Cargando..." : (job?.title ?? "Vacante")}
            </CardTitle>
            <p className="text-sm text-muted-foreground/90 truncate">{organizationName}</p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="rounded-md"
              onClick={handleRemove}
              disabled={removeMutation.isPending || jobLoading}
              aria-label="Quitar de guardados"
            >
              <HugeiconsIcon icon={Delete01Icon} size={24} strokeWidth={1.5} className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-3 flex-1 flex flex-col">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-muted-foreground/90">
          <div className="flex items-center gap-1.5">
            <HugeiconsIcon
              icon={Location05Icon}
              size={24}
              strokeWidth={1.5}
              className="h-3.5 w-3.5 text-muted-foreground/80"
            />
            <span className="truncate">{locationStr}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <HugeiconsIcon
              icon={Clock01Icon}
              size={24}
              strokeWidth={1.5}
              className="h-3.5 w-3.5 text-muted-foreground/80"
            />
            <span className="truncate">{postedStr}</span>
          </div>
          <div className="flex items-center gap-1.5 text-foreground">
            <HugeiconsIcon
              icon={Cash02Icon}
              size={24}
              strokeWidth={1.5}
              className="h-3.5 w-3.5 text-secondary"
            />
            <span className="truncate font-medium">{salaryStr}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export const SavedContent = () => {
  const { useSession } = authClient
  const { data: session, isPending: sessionPending } = useSession()
  const userId = (session?.user as { id?: string })?.id

  const { data: savedJobs, isLoading: savedJobsLoading } = useSavedJobsByUser(userId, {
    page: 1,
    limit: 50,
  })

  const jobIds = savedJobs?.data.map((j) => j.jobId).filter((id) => Boolean(id)) ?? []
  const hasJobs = jobIds.length > 0

  const router = useRouter()

  const isPending = sessionPending || savedJobsLoading || savedJobs === undefined

  if (isPending) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Skeleton className="h-9 w-72" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card
              key={i}
              className="relative overflow-hidden flex flex-col border border-border/80 bg-white"
            >
              <CardHeader className="pb-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-0.5 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-7 w-7 rounded-md shrink-0" />
                </div>
              </CardHeader>
              <CardContent className="space-y-2 pt-3 flex-1 flex flex-col">
                <div className="flex items-center gap-1.5">
                  <Skeleton className="h-3.5 w-3.5 rounded" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="flex items-center gap-1.5">
                  <Skeleton className="h-3.5 w-3.5 rounded" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <div className="flex items-center gap-1.5">
                  <Skeleton className="h-3.5 w-3.5 rounded" />
                  <Skeleton className="h-3 w-28" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed py-12">
          <p className="text-muted-foreground text-sm">
            Inicia sesión para ver tus empleos guardados.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-[28px] font-bold tracking-wide">Empleos Guardados</h1>
          <p className="text-muted-foreground text-sm">
            Revisa rápidamente los empleos que marcaste para ver más tarde.
          </p>
        </div>
      </div>

      {!hasJobs ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed">
          <div className="flex flex-col items-center justify-center text-center gap-4 py-12">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <HugeiconsIcon
                icon={Bookmark02Icon}
                size={44}
                strokeWidth={1.5}
                className="h-11 w-11 text-muted-foreground"
              />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Aún no tienes empleos guardados.</p>
              <p className="text-xs text-muted-foreground">
                Usa el icono de guardar en los listados para añadirlos aquí.
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/dashboard/jobs")}
              className="mt-4 inline-flex items-center gap-2 px-6 py-2 bg-secondary text-secondary-foreground rounded-md shadow transition-colors hover:bg-secondary/90"
            >
              Ver todos los empleos
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobIds.map((jobId) => (
            <SavedJobCard key={jobId} userId={userId} jobId={jobId} />
          ))}
        </div>
      )}
    </div>
  )
}

export default SavedContent
