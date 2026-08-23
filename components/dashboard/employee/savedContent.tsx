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
import { useCallback, useMemo } from "react"
import { ConnectedNotificationBell } from "@/components/common/ConnectedNotificationBell"
import { useDashboardSession } from "@/components/dashboard/DashboardSessionContext"
import { MobileMenuButton } from "@/components/dashboard/shared/MobileMenuButton"
import { dashboardRaisedCardClass } from "@/components/dashboard/shared/surface-classes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatJobLocation, type Job } from "@/lib/api/jobs"
import { useJob } from "@/lib/api/use-jobs"
import { useOrganization } from "@/lib/api/use-organization-mutations"
import { useRemoveSavedJobMutation, useSavedJobsByUserInfinite } from "@/lib/api/use-saved-jobs"
import { formatFechaRelativa, formatJobSalary } from "@/lib/utils"

function getSalaryDisplay(job: Job): string {
  return formatJobSalary(job.salary)
}

function getPostedDisplay(iso: string | null | undefined): string {
  if (!iso) return "—"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "—"
  return formatFechaRelativa(d)
}

function SavedJobCard({ userId, jobId }: { userId: string; jobId: string }) {
  const { push } = useRouter()
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
    push(`/dashboard/job/${jobId}`)
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
      className={`cursor-pointer flex flex-col transition-colors duration-150 hover:bg-surface-container-low group focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${dashboardRaisedCardClass}`}
      aria-label="Ver vacante guardada"
    >
      <CardHeader className="px-4 sm:px-5 pt-4 sm:pt-5 pb-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <CardTitle className="text-sm font-medium leading-tight line-clamp-2 text-foreground">
              {jobLoading ? "Cargando..." : (job?.title ?? "Vacante")}
            </CardTitle>
            <p className="text-xs text-muted-foreground truncate">{organizationName}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="rounded-md text-muted-foreground hover:text-foreground"
              onClick={handleRemove}
              disabled={removeMutation.isPending || jobLoading}
              aria-label="Quitar de guardados"
            >
              <HugeiconsIcon icon={Delete01Icon} size={16} strokeWidth={1.5} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 sm:px-5 pb-4 sm:pb-5 pt-3 flex-1 flex flex-col">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <HugeiconsIcon
              icon={Location05Icon}
              size={16}
              strokeWidth={1.5}
              className="shrink-0 text-muted-foreground"
            />
            <span className="truncate">{locationStr}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <HugeiconsIcon
              icon={Clock01Icon}
              size={16}
              strokeWidth={1.5}
              className="shrink-0 text-muted-foreground"
            />
            <span className="truncate">{postedStr}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <HugeiconsIcon
              icon={Cash02Icon}
              size={16}
              strokeWidth={1.5}
              className="shrink-0 text-secondary"
            />
            <span className="truncate font-medium text-foreground">{salaryStr}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export const SavedContent = () => {
  const session = useDashboardSession()
  const userId = session?.user?.id

  const {
    data,
    isLoading: savedJobsLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useSavedJobsByUserInfinite(userId, 12)

  const allJobIds = useMemo(
    () =>
      (data?.pages ?? []).flatMap((p) =>
        p.data.map((j) => j.jobId).filter((id): id is string => Boolean(id))
      ),
    [data]
  )
  const total = data?.pages[0]?.total ?? 0

  const hasJobs = allJobIds.length > 0
  const hasMore = hasNextPage

  const { push } = useRouter()

  const handleLoadMore = useCallback(() => {
    void fetchNextPage()
  }, [fetchNextPage])

  const isPending = savedJobsLoading

  if (isPending) {
    const skeletonBlock = "rounded-md bg-surface-container-highest/60 animate-pulse"

    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className={`h-6 w-56 ${skeletonBlock}`} />
            <div className={`h-4 w-80 ${skeletonBlock}`} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <Card key={n} className={dashboardRaisedCardClass}>
              <CardHeader className="px-4 sm:px-5 pt-4 sm:pt-5 pb-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-2 flex-1">
                    <div className={`h-4 w-3/4 ${skeletonBlock}`} />
                    <div className={`h-3 w-1/2 ${skeletonBlock}`} />
                  </div>
                  <div className={`size-8 rounded-md shrink-0 ${skeletonBlock}`} />
                </div>
              </CardHeader>
              <CardContent className="px-4 sm:px-5 pb-4 sm:pb-5 pt-3 flex-1 flex flex-col">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className={`size-4 rounded shrink-0 ${skeletonBlock}`} />
                    <div className={`h-3 w-24 ${skeletonBlock}`} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={`size-4 rounded shrink-0 ${skeletonBlock}`} />
                    <div className={`h-3 w-16 ${skeletonBlock}`} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={`size-4 rounded shrink-0 ${skeletonBlock}`} />
                    <div className={`h-3 w-28 ${skeletonBlock}`} />
                  </div>
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
        <div className="bg-surface-container-low border border-border/40 rounded-xl p-6 text-center max-w-md mx-auto my-6 shadow-none">
          <p className="text-sm font-medium text-foreground mb-1">Sesión no iniciada</p>
          <p className="text-xs text-muted-foreground">
            Inicia sesión para ver tus empleos guardados.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Top row: menu on mobile */}
      <div className="flex items-center justify-between lg:hidden">
        <MobileMenuButton />
      </div>

      <div className="space-y-1">
        <div className="hidden lg:flex justify-end">
          <ConnectedNotificationBell />
        </div>
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Empleos Guardados
          </h1>
          <p className="text-muted-foreground text-sm">
            Revisa rápidamente los empleos que marcaste para ver más tarde.
          </p>
        </div>
      </div>

      {!hasJobs ? (
        <div className="bg-surface-container-low border border-border/40 rounded-xl p-6 text-center max-w-md mx-auto my-6 shadow-none">
          <div className="size-10 rounded-full bg-surface-container-highest flex items-center justify-center mx-auto mb-3 text-muted-foreground">
            <HugeiconsIcon icon={Bookmark02Icon} size={20} />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">
            Aún no tienes empleos guardados
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            Usa el icono de guardar en los listados para añadirlos aquí.
          </p>
          <Button
            size="sm"
            onClick={() => push("/dashboard/jobs")}
            className="h-9 px-4 bg-primary text-primary-foreground rounded-lg text-xs font-medium"
          >
            Ver todos los empleos
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allJobIds.map((jobId) => (
              <SavedJobCard key={jobId} userId={userId} jobId={jobId} />
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center pt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleLoadMore}
                disabled={isFetchingNextPage}
                className="h-9 px-4 rounded-lg border-border/40 bg-surface-container-lowest hover:bg-surface-container-low text-xs font-medium"
              >
                {isFetchingNextPage
                  ? "Cargando..."
                  : `Cargar más (${allJobIds.length} de ${total})`}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default SavedContent
