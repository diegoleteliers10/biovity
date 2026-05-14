"use client"

/* eslint-disable react-doctor/no-giant-component -- large component, intentional */
import {
  AirplaneLanding01Icon,
  Bookmark02Icon,
  Briefcase01Icon,
  Cash02Icon,
  Clock01Icon,
  GraduationScrollIcon,
  HeartAddIcon,
  LaptopIcon,
  Link04Icon,
  Linkedin02Icon,
  Location05Icon,
  Mail01Icon,
  Share05Icon,
  WhatsappIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef } from "react"
import { HtmlContent } from "@/components/dashboard/shared/HtmlContent"
import { ApplyJobButton } from "@/components/landing/trabajos/ApplyJobButton"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatJobLocation, type Job, type JobBenefit, type JobLocation } from "@/lib/api/jobs"
import { useJob } from "@/lib/api/use-jobs"
import { useIncrementJobViews } from "@/lib/api/use-jobs-views"
import { useOrganization } from "@/lib/api/use-organization-mutations"
import {
  useCheckSavedJob,
  useRemoveSavedJobMutation,
  useSaveJobMutation,
} from "@/lib/api/use-saved-jobs"
import { authClient } from "@/lib/auth-client"

function getJobModalidad(loc: JobLocation | null | undefined): string {
  if (!loc) return "Presencial"
  if (loc.isRemote) return "Remoto"
  if (loc.isHybrid) return "Híbrido"
  return "Presencial"
}

function formatJobSalary(job: Job): string {
  const s = job.salary
  if (!s) return "A convenir"
  if (s.min != null && s.max != null) {
    const currency = s.currency === "USD" ? "USD" : "CLP"
    const period = s.period === "monthly" ? "mes" : (s.period ?? "")
    return `$${s.min.toLocaleString("es-CL")} - ${s.max.toLocaleString("es-CL")} ${currency}/${period}`
  }
  if (s.isNegotiable) return "A convenir"
  return "A convenir"
}

import { formatDateChilean } from "@/lib/utils"

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

export default function JobDetailPage() {
  const { back } = useRouter()
  const params = useParams<{ id: string }>()
  const jobId = params?.id ?? undefined
  const { data: job, isLoading, error } = useJob(jobId)

  const { useSession } = authClient
  const { data: session } = useSession()
  const professionalId =
    (session?.user as { id?: string; userId?: string; sub?: string } | undefined)?.id ??
    (session?.user as { userId?: string } | undefined)?.userId ??
    (session?.user as { sub?: string } | undefined)?.sub ??
    ""

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
  const hasIncrementedView = useRef(false)

  useEffect(() => {
    if (jobId && !hasIncrementedView.current) {
      hasIncrementedView.current = true
      incrementViews.mutate(jobId)
    }
  }, [jobId, incrementViews])

  const { data: organization } = useOrganization(
    job && !job.organization && job.organizationId ? job.organizationId : undefined
  )

  if (!jobId) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-muted-foreground text-sm">ID de trabajo no válido.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-muted-foreground text-sm">Cargando vacante…</p>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
        <p className="text-destructive text-sm">{error?.message ?? "No se encontró la vacante."}</p>
        <button
          type="button"
          onClick={() => back()}
          className="text-primary text-sm hover:underline bg-transparent border-none p-0 font-inherit cursor-pointer"
          aria-label="Volver"
        >
          ← Volver
        </button>
      </div>
    )
  }

  const organizationName = job.organization?.name ?? organization?.name ?? "Organización"
  const locationStr = formatJobLocation(job.location) || "Sin especificar"
  const modalidad = getJobModalidad(job.location)
  const salaryStr = formatJobSalary(job)
  const benefits = job.benefits ?? []

  return (
    <div className="flex flex-1 flex-col">
      {/* Hero header */}
      <section className="relative bg-[#f3f3f5]" aria-label="Encabezado de la vacante">
        <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
          <div className="rounded-xl border border-border/10 bg-white p-5 md:p-6">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <button
                type="button"
                onClick={() => back()}
                className="hover:text-foreground cursor-pointer bg-transparent border-none p-0 font-inherit text-inherit"
                aria-label="Volver"
              >
                ← Volver
              </button>
              <span className="text-muted-foreground/60">/</span>
              <span className="truncate">{job.title}</span>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div
                className="grid size-10 place-items-center rounded-lg border border-border/30 bg-card text-primary"
                aria-hidden
              >
                <HugeiconsIcon
                  icon={Briefcase01Icon}
                  size={24}
                  strokeWidth={1.5}
                  className="size-5"
                />
              </div>
              <div>
                <p className="font-mono text-[11px] text-muted-foreground/80">{job.id}</p>
                <p className="text-sm font-medium text-foreground">{organizationName}</p>
              </div>
            </div>

            <h1 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
              {job.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f3f3f5] px-3 py-1 text-xs text-muted-foreground">
                <HugeiconsIcon
                  icon={Location05Icon}
                  size={16}
                  strokeWidth={1.5}
                  className="size-3.5"
                />
                {locationStr} · {modalidad}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f3f3f5] px-3 py-1 text-xs text-muted-foreground">
                {job.experienceLevel} · {job.employmentType}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f3f3f5] px-3 py-1 text-xs font-semibold text-foreground">
                <HugeiconsIcon
                  icon={Cash02Icon}
                  size={16}
                  strokeWidth={1.5}
                  className="size-3.5 text-secondary"
                />
                {salaryStr}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2 border-border/10 border-t pt-4">
              <ApplyJobButton jobId={job.id} jobTitle={job.title} compact />
              <Button
                variant="ghost"
                className="px-3 hover:bg-secondary/10"
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
              <div className="ml-auto flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Compartir</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Compartir">
                      <HugeiconsIcon
                        icon={Share05Icon}
                        size={24}
                        strokeWidth={1.5}
                        className="size-4"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>Compartir</DropdownMenuLabel>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(window.location.href)
                        } catch {}
                      }}
                    >
                      <HugeiconsIcon
                        icon={Link04Icon}
                        size={24}
                        strokeWidth={1.5}
                        className="mr-2 size-4"
                      />
                      Copiar enlace
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => {
                        const url = encodeURIComponent(window.location.href)
                        window.open(
                          `https://www.linkedin.com/shareArticle?mini=true&url=${url}`,
                          "_blank"
                        )
                      }}
                    >
                      <HugeiconsIcon
                        icon={Linkedin02Icon}
                        size={24}
                        strokeWidth={1.5}
                        className="mr-2 size-4"
                      />
                      LinkedIn
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => {
                        const url = encodeURIComponent(window.location.href)
                        window.location.href = `mailto:?subject=${encodeURIComponent(job.title)}&body=${url}`
                      }}
                    >
                      <HugeiconsIcon
                        icon={Mail01Icon}
                        size={24}
                        strokeWidth={1.5}
                        className="mr-2 size-4"
                      />
                      Email
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => {
                        const url = encodeURIComponent(window.location.href)
                        window.open(`https://wa.me/?text=${url}`, "_blank")
                      }}
                    >
                      <HugeiconsIcon
                        icon={WhatsappIcon}
                        size={24}
                        strokeWidth={1.5}
                        className="mr-2 size-4"
                      />
                      WhatsApp
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <main className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-3">
        {/* Description */}
        <Card className="lg:col-span-2 border border-border/10 bg-white">
          <CardContent className="max-w-none space-y-6 p-5 text-foreground md:p-7">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/80">
                Sobre la vacante
              </p>
              <h2 className="text-base font-semibold tracking-tight text-foreground md:text-lg">
                Descripción
              </h2>
            </div>
            <HtmlContent html={job.description} className="text-sm leading-7 md:text-[15px]" />

            <section className="space-y-3">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Detalles</h3>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[#f3f3f5] px-3 py-1.5 text-xs font-medium text-foreground">
                  Modalidad: <span className="text-secondary">{modalidad}</span>
                </span>
                <span className="rounded-full bg-[#f3f3f5] px-3 py-1.5 text-xs font-medium text-foreground">
                  Horario: <span className="text-secondary">{job.employmentType}</span>
                </span>
                <span className="rounded-full bg-[#f3f3f5] px-3 py-1.5 text-xs font-medium text-foreground">
                  Nivel: <span className="text-secondary">{job.experienceLevel}</span>
                </span>
              </div>
            </section>
          </CardContent>
        </Card>

        {/* Sidebar info */}
        <div className="space-y-4">
          <Card className="border border-border/10 bg-white">
            <CardContent className="space-y-4 p-4 text-sm md:p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/80">
                Resumen rápido
              </p>
              <div className="rounded-lg bg-[#f3f3f5] px-3 py-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground/90">Publicado</span>
                  <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                    <HugeiconsIcon
                      icon={Clock01Icon}
                      size={24}
                      strokeWidth={1.5}
                      className="size-4 text-muted-foreground/80"
                    />
                    {formatDateShort(job.createdAt)}
                  </span>
                </div>
              </div>
              <div className="rounded-lg bg-[#f3f3f5] px-3 py-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground/90">Postulaciones</span>
                  <span className="font-semibold text-foreground">
                    {job.applicationsCount ?? "—"}
                  </span>
                </div>
              </div>
              <div className="rounded-lg bg-[#f3f3f5] px-3 py-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground/90">Respuesta</span>
                  <span className="font-semibold text-secondary">1–14 días</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {benefits.length > 0 && (
            <Card className="border border-border/10 bg-white">
              <CardContent className="space-y-3 p-4 md:p-5">
                <h3 className="text-sm font-semibold tracking-tight text-foreground">Beneficios</h3>
                <div className="space-y-2">
                  {benefits.map((b) => {
                    const Icon = getBenefitIcon(b)
                    return (
                      <div
                        key={b.title}
                        className="flex items-center gap-2.5 rounded-lg bg-[#f3f3f5] px-2.5 py-2 text-sm text-foreground/95"
                      >
                        <HugeiconsIcon
                          icon={Icon}
                          className="size-4 shrink-0 text-accent"
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
