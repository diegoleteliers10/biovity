"use client"

/* eslint-disable react-doctor/no-giant-component -- large component, intentional */
import {
  AirplaneLanding01Icon,
  ArrowLeft02Icon,
  Bookmark02Icon,
  Briefcase01Icon,
  Cash02Icon,
  Clock01Icon,
  GraduationScrollIcon,
  HeartAddIcon,
  LaptopIcon,
  Location05Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useParams, useRouter } from "next/navigation"
import { useDashboardSession } from "@/components/dashboard/DashboardSessionContext"
import { HtmlContent } from "@/components/dashboard/shared/HtmlContent"
import { dashboardRaisedCardClass } from "@/components/dashboard/shared/surface-classes"
import { ApplyJobButton } from "@/components/landing/trabajos/ApplyJobButton"
import { JobShareButtons } from "@/components/landing/trabajos/JobShareButtons"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useMountEffect } from "@/hooks/use-mount-effect"
import { formatJobLocation, type JobBenefit, type JobLocation } from "@/lib/api/jobs"
import { useJob } from "@/lib/api/use-jobs"
import { useIncrementJobViews } from "@/lib/api/use-jobs-views"
import { useOrganization } from "@/lib/api/use-organization-mutations"
import {
  useCheckSavedJob,
  useRemoveSavedJobMutation,
  useSaveJobMutation,
} from "@/lib/api/use-saved-jobs"

import { formatDateChilean, formatJobSalary } from "@/lib/utils"

function getJobModalidad(loc: JobLocation | null | undefined): string {
  if (!loc) return "Presencial"
  if (loc.isRemote) return "Remoto"
  if (loc.isHybrid) return "Híbrido"
  return "Presencial"
}

function formatDateShort(isoDate: string | undefined | null): string {
  if (!isoDate) return "—"
  try {
    return formatDateChilean(isoDate, "d MMM")
  } catch {
    return "—"
  }
}

function getBenefitIcon(benefit: JobBenefit) {
  const t = benefit.title.toLowerCase()
  if (/salud|médico|medico|dental|seguro/.test(t)) return HeartAddIcon
  if (/vacacion|vacation/.test(t)) return AirplaneLanding01Icon
  if (/formación|formacion|capacitación|aprendizaje|learning|formación/.test(t))
    return GraduationScrollIcon
  if (/equipo|laptop|remoto|equipment|teletrabajo|computador/.test(t)) return LaptopIcon
  return LaptopIcon
}

function JobDetailSkeleton() {
  return (
    <div className="flex flex-1 flex-col" aria-hidden>
      <section className="bg-surface-container-low">
        <div className="mx-auto w-full max-w-6xl px-4 py-6">
          <div className={`${dashboardRaisedCardClass} p-4 md:p-6`}>
            <div className="h-4 w-40 rounded-md bg-surface-container-highest/60 animate-pulse" />
            <div className="mt-5 h-7 w-2/3 rounded-md bg-surface-container-highest/60 animate-pulse" />
            <div className="mt-4 flex gap-2">
              <div className="h-5 w-32 rounded-md bg-surface-container-highest/60 animate-pulse" />
              <div className="h-5 w-24 rounded-md bg-surface-container-highest/60 animate-pulse" />
              <div className="h-5 w-28 rounded-md bg-surface-container-highest/60 animate-pulse" />
            </div>
            <div className="mt-5 h-9 w-36 rounded-lg bg-surface-container-highest/60 animate-pulse" />
          </div>
        </div>
      </section>
      <main className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 px-4 py-6 lg:grid-cols-3">
        <div className={`${dashboardRaisedCardClass} h-96 animate-pulse lg:col-span-2`} />
        <div className="space-y-4">
          <div className={`${dashboardRaisedCardClass} h-44 animate-pulse`} />
          <div className={`${dashboardRaisedCardClass} h-56 animate-pulse`} />
        </div>
      </main>
    </div>
  )
}

export default function JobDetailPage() {
  const { back } = useRouter()
  const params = useParams<{ id: string }>()
  const jobId = params?.id ?? undefined
  const { data: job, isLoading, error } = useJob(jobId)

  const session = useDashboardSession()
  const professionalId = session?.user?.id ?? ""

  const { data: savedCheck, isLoading: savedCheckLoading } = useCheckSavedJob(professionalId, jobId)
  const isSaved = savedCheck?.isSaved ?? false

  const saveMutation = useSaveJobMutation()
  const removeMutation = useRemoveSavedJobMutation()

  const handleToggleSaved = () => {
    if (!professionalId) return
    if (!jobId) return
    if (isSaved) removeMutation.mutate({ userId: professionalId, jobId })
    else saveMutation.mutate({ userId: professionalId, jobId })
  }

  const incrementViews = useIncrementJobViews()

  useMountEffect(() => {
    if (jobId) incrementViews.mutate(jobId)
  })

  const { data: organization } = useOrganization(
    job && !job.organization && job.organizationId ? job.organizationId : undefined
  )

  if (!jobId) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <p className="text-sm text-muted-foreground">ID de trabajo no válido.</p>
      </div>
    )
  }

  if (isLoading) {
    return <JobDetailSkeleton />
  }

  if (error || !job) {
    return (
      <div className="flex flex-1 items-start justify-center p-6">
        <div className="flex w-full max-w-md flex-col items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/5 p-6 shadow-none">
          <p className="text-sm font-medium text-foreground">No se pudo cargar la vacante</p>
          <p className="text-xs text-muted-foreground">
            {error?.message ?? "No se encontró la vacante."}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-lg border-border/40 bg-surface-container-lowest px-4 text-xs font-medium"
            onClick={() => back()}
          >
            Volver
          </Button>
        </div>
      </div>
    )
  }

  const organizationName = job.organization?.name ?? organization?.name ?? "Organización"
  const locationStr = formatJobLocation(job.location) || "Sin especificar"
  const modalidad = getJobModalidad(job.location)
  const salaryStr = formatJobSalary(job.salary)
  const benefits = job.benefits ?? []

  return (
    <div className="flex flex-1 flex-col">
      {/* Hero header */}
      <section className="bg-surface-container-low" aria-label="Encabezado de la vacante">
        <div className="mx-auto w-full max-w-6xl px-4 py-6">
          <div className={`${dashboardRaisedCardClass} p-4 md:p-6`}>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <button
                type="button"
                onClick={() => back()}
                className="inline-flex cursor-pointer items-center gap-1 rounded-md p-0 font-medium text-inherit transition-colors duration-150 hover:text-foreground"
                aria-label="Volver"
              >
                <HugeiconsIcon icon={ArrowLeft02Icon} size={14} strokeWidth={1.5} aria-hidden />
                Volver
              </button>
              <span className="text-border">/</span>
              <span className="truncate">{job.title}</span>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div
                className="grid size-10 place-items-center rounded-lg border border-border/40 bg-surface-container-low text-primary"
                aria-hidden
              >
                <HugeiconsIcon
                  icon={Briefcase01Icon}
                  size={24}
                  strokeWidth={1.5}
                  className="size-5"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate font-mono text-xs text-muted-foreground tabular-nums">
                  {job.id}
                </p>
                <p className="text-sm font-medium text-foreground">{organizationName}</p>
              </div>
            </div>

            <h1 className="mt-3 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {job.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-surface-container-highest px-2 py-0.5 text-xs leading-4 text-muted-foreground">
                <HugeiconsIcon
                  icon={Location05Icon}
                  size={16}
                  strokeWidth={1.5}
                  className="size-3.5 shrink-0"
                />
                {locationStr} · {modalidad}
              </span>
              <span className="inline-flex items-center rounded-md bg-surface-container-highest px-2 py-0.5 text-xs leading-4 text-muted-foreground">
                {[job.experienceLevel, job.employmentType].filter(Boolean).join(" · ") ||
                  "Sin especificar"}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-surface-container-highest px-2 py-0.5 text-xs font-semibold tabular-nums text-foreground">
                <HugeiconsIcon
                  icon={Cash02Icon}
                  size={16}
                  strokeWidth={1.5}
                  className="size-3.5 shrink-0 text-secondary"
                />
                {salaryStr}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border/40 pt-4">
              <ApplyJobButton jobId={job.id} jobTitle={job.title} compact />
              <Button
                variant="ghost"
                className="rounded-md text-muted-foreground hover:text-secondary"
                type="button"
                onClick={handleToggleSaved}
                disabled={savedCheckLoading || saveMutation.isPending || removeMutation.isPending}
                aria-label={isSaved ? "Quitar de guardados" : "Guardar vacante"}
                aria-pressed={isSaved}
              >
                <HugeiconsIcon
                  icon={Bookmark02Icon}
                  size={24}
                  strokeWidth={1.5}
                  className={`size-4 ${isSaved ? "fill-current text-secondary" : ""}`}
                />
              </Button>
              <JobShareButtons
                jobId={job.id}
                jobTitle={job.title}
                organizationName={organizationName}
                location={locationStr}
                salary={salaryStr}
                variant="dropdown"
                className="ml-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <main className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 px-4 py-6 lg:grid-cols-3">
        {/* Description */}
        <Card className={`${dashboardRaisedCardClass} lg:col-span-2`}>
          <CardContent className="max-w-none space-y-5 p-4 text-foreground md:p-6">
            <h2 className="text-base font-semibold text-foreground">Descripción</h2>
            <HtmlContent html={job.description} className="text-sm leading-relaxed" />
          </CardContent>
        </Card>

        {/* Sidebar info */}
        <div className="space-y-4">
          <Card className={dashboardRaisedCardClass}>
            <CardContent className="space-y-3 p-4 sm:p-5">
              <p className="text-xs leading-4 font-medium text-foreground">Resumen rápido</p>
              <div className="rounded-lg bg-surface-container-low px-3 py-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Publicado</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground tabular-nums">
                    <HugeiconsIcon icon={Clock01Icon} size={16} strokeWidth={1.5} aria-hidden />
                    {formatDateShort(job.createdAt)}
                  </span>
                </div>
              </div>
              <div className="rounded-lg bg-surface-container-low px-3 py-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Postulaciones</span>
                  <span className="text-xs font-semibold tabular-nums text-foreground">
                    {job.applicationsCount ?? "—"}
                  </span>
                </div>
              </div>
              <div className="rounded-lg bg-surface-container-low px-3 py-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Respuesta</span>
                  <span className="text-xs font-semibold text-secondary">1–14 días</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {benefits.length > 0 && (
            <Card className={dashboardRaisedCardClass}>
              <CardContent className="space-y-3 p-4 sm:p-5">
                <p className="text-xs leading-4 font-medium text-foreground">Beneficios</p>
                <div className="space-y-2">
                  {benefits.map((b) => {
                    const Icon = getBenefitIcon(b)
                    return (
                      <div
                        key={b.title}
                        className="flex items-center gap-2.5 rounded-lg bg-surface-container-low px-3 py-2 text-sm text-foreground"
                      >
                        <HugeiconsIcon
                          icon={Icon}
                          className="size-4 shrink-0 text-muted-foreground"
                          aria-hidden
                        />
                        <span className="line-clamp-1">{b.title}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
