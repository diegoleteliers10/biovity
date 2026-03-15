"use client"

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/animate-ui/components/radix/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ApplyJobButton } from "@/components/landing/trabajos/ApplyJobButton"
import { useOrganization } from "@/lib/api/use-organization-mutations"
import { useJob } from "@/lib/api/use-jobs"
import { formatJobLocation, type Job, type JobBenefit, type JobLocation } from "@/lib/api/jobs"

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

function formatDateShort(isoDate: string | undefined | null): string {
  if (!isoDate) return "—"
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleDateString("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
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
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const jobId = params?.id ?? undefined
  const { data: job, isLoading, error } = useJob(jobId)
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
        <p className="text-muted-foreground text-sm">Cargando vacante...</p>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
        <p className="text-destructive text-sm">{error?.message ?? "No se encontró la vacante."}</p>
        <button
          type="button"
          onClick={() => router.back()}
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
      <section
        className="relative border-b border-border bg-gradient-to-br from-accent/60 via-accent/30 to-transparent"
        aria-label="Encabezado de la vacante"
      >
        <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <button
              type="button"
              onClick={() => router.back()}
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
              className="h-10 w-10 rounded-md bg-primary/10 text-primary grid place-items-center"
              aria-hidden
            >
              <HugeiconsIcon
                icon={Briefcase01Icon}
                size={24}
                strokeWidth={1.5}
                className="h-5 w-5"
              />
            </div>
            <div>
              <p className="text-xs font-mono text-muted-foreground">{job.id}</p>
              <p className="text-sm font-medium text-foreground">{organizationName}</p>
            </div>
          </div>

          <h1 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight">{job.title}</h1>

          {/* Meta */}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <HugeiconsIcon
                icon={Location05Icon}
                size={24}
                strokeWidth={1.5}
                className="h-4 w-4"
              />
              {locationStr} · {modalidad}
            </span>
            <span className="inline-flex items-center gap-1">
              {job.experienceLevel} · {job.employmentType}
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-foreground">
              <HugeiconsIcon icon={Cash02Icon} size={24} strokeWidth={1.5} className="h-4 w-4" />
              {salaryStr}
            </span>
          </div>

          {/* Actions */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <ApplyJobButton jobId={job.id} compact />
            <Button variant="outline" className="px-3" aria-label="Guardar">
              <HugeiconsIcon
                icon={Bookmark02Icon}
                size={24}
                strokeWidth={1.5}
                className="h-4 w-4"
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
                      className="h-4 w-4"
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
                      className="mr-2 h-4 w-4"
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
                      className="mr-2 h-4 w-4"
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
                      className="mr-2 h-4 w-4"
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
                      className="mr-2 h-4 w-4"
                    />
                    WhatsApp
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <main className="mx-auto max-w-6xl w-full px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Description */}
        <Card className="lg:col-span-2">
          <CardContent className="prose prose-sm max-w-none p-4 md:p-6 text-foreground">
            <h2 className="text-base font-semibold">Descripción</h2>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {job.description || "Sin descripción."}
            </p>

            {job.benefits && job.benefits.length > 0 && (
              <>
                <h3 className="mt-4 text-sm font-semibold">Beneficios incluidos</h3>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  {job.benefits.map((b) => (
                    <li key={b.title}>
                      {b.title}
                      {b.description ? ` — ${b.description}` : ""}
                    </li>
                  ))}
                </ul>
              </>
            )}

            <h3 className="mt-4 text-sm font-semibold">Detalles</h3>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Modalidad: {modalidad}</li>
              <li>Horario: {job.employmentType}</li>
              <li>Nivel: {job.experienceLevel}</li>
            </ul>
          </CardContent>
        </Card>

        {/* Sidebar info */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Publicado</span>
                <span className="inline-flex items-center gap-1">
                  <HugeiconsIcon
                    icon={Clock01Icon}
                    size={24}
                    strokeWidth={1.5}
                    className="h-4 w-4"
                  />
                  {formatDateShort(job.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Postulaciones</span>
                <span className="font-medium">{job.applicationsCount ?? "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Respuesta</span>
                <span className="font-medium">1–14 días</span>
              </div>
            </CardContent>
          </Card>

          {benefits.length > 0 && (
            <Card>
              <CardContent className="p-4 space-y-3">
                <h3 className="text-sm font-semibold">Beneficios</h3>
                <div className="space-y-2">
                  {benefits.map((b) => {
                    const Icon = getBenefitIcon(b)
                    return (
                      <div
                        key={b.title}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <HugeiconsIcon
                          icon={Icon}
                          className="h-4 w-4 text-foreground/80 shrink-0"
                          aria-hidden
                        />
                        <span>{b.title}</span>
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
