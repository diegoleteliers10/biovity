import {
  Briefcase01Icon,
  Cash02Icon,
  Clock01Icon,
  Location05Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Result } from "better-result"
import type { Metadata } from "next"
import { headers } from "next/headers"
import { notFound } from "next/navigation"
import { Fragment } from "react"
import { JobViewsTracker } from "@/components/common/job-views-tracker"
import { ApplyJobButton } from "@/components/landing/trabajos/ApplyJobButton"
import { BreadcrumbJsonLd, JobPostingJsonLd, OrganizationJsonLd } from "@/components/seo/JsonLd"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent } from "@/components/ui/card"
import { formatJobLocation, getJob, type Job, type JobLocation } from "@/lib/api/jobs"
import { getOrganization } from "@/lib/api/organizations"
import {
  formatFechaLarga,
  formatSalarioRango,
  getFormatoBadgeColor,
  getModalidadBadgeColor,
} from "@/lib/utils"

type Props = {
  params: Promise<{ id: string }>
}

function getJobModalidad(loc: JobLocation | null | undefined): string {
  if (!loc) return "presencial"
  if (loc.isRemote) return "remoto"
  if (loc.isHybrid) return "hibrido"
  return "presencial"
}

function formatJobSalaryDisplay(job: Job): string {
  const s = job.salary
  if (!s) return "A convenir"
  if (s.min != null && s.max != null) return formatSalarioRango(s.min, s.max)
  if (s.isNegotiable) return "A convenir"
  return "A convenir"
}

type BreadcrumbSegment = { label: string; href?: string }

function getJobBreadcrumbs(referer: string | null, jobTitle: string): BreadcrumbSegment[] {
  let refPath = ""
  try {
    if (referer) refPath = new URL(referer).pathname
  } catch {
    refPath = ""
  }

  if (refPath.startsWith("/dashboard")) {
    const segments: BreadcrumbSegment[] = [{ label: "Dashboard", href: "/dashboard" }]
    if (refPath.startsWith("/dashboard/jobs") || refPath.startsWith("/dashboard/search")) {
      segments.push({ label: "Buscar Empleos", href: "/dashboard/jobs" })
    }
    segments.push({ label: jobTitle })
    return segments
  }

  return [
    { label: "Inicio", href: "/" },
    { label: "Trabajos", href: "/trabajos" },
    { label: jobTitle },
  ]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const result = await getJob(id)
  if (!Result.isOk(result)) {
    return {
      title: "Trabajo no encontrado | Biovity",
    }
  }

  const job = result.value
  const url = `/trabajos/${job.id}`
  const desc = job.description?.substring(0, 160) ?? ""
  return {
    title: `${job.title} | Biovity`,
    description: desc,
    openGraph: {
      title: `${job.title} | Biovity`,
      description: desc,
      url,
    },
    twitter: {
      card: "summary",
      title: job.title,
      description: desc,
    },
    alternates: {
      canonical: url,
    },
  }
}

export default async function TrabajoDetailPage({ params }: Props) {
  const { id } = await params
  const [headersList, jobResult] = await Promise.all([headers(), getJob(id)])
  const referer = headersList.get("referer")
  if (!Result.isOk(jobResult)) {
    notFound()
  }

  const job = jobResult.value
  let organizationName = job.organization?.name
  if (!organizationName && job.organizationId) {
    const orgResult = await getOrganization(job.organizationId)
    if (Result.isOk(orgResult)) organizationName = orgResult.value.name
  }
  organizationName = organizationName ?? "Organización"

  const modalidad = getJobModalidad(job.location)
  const ubicacion = formatJobLocation(job.location) || "Sin especificar"
  const salaryStr = formatJobSalaryDisplay(job)
  const employmentTypeKey = job.employmentType.toLowerCase()
  const breadcrumbs = getJobBreadcrumbs(referer, job.title)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://biovity.cl"

  return (
    <>
      <OrganizationJsonLd />
      <BreadcrumbJsonLd
        items={breadcrumbs.map((b) => ({
          name: b.label,
          url: b.href ? `${siteUrl}${b.href}` : `${siteUrl}/trabajos/${job.id}`,
        }))}
      />
      <JobPostingJsonLd
        jobId={job.id}
        title={job.title}
        description={job.description?.substring(0, 5000) || ""}
        organizationName={organizationName}
        datePosted={job.createdAt}
        validThrough={job.expiresAt}
        employmentType={job.employmentType}
        experienceLevel={job.experienceLevel}
        locationCity={job.location?.city}
        locationRegion={job.location?.state}
        locationCountry={job.location?.country}
        isRemote={job.location?.isRemote}
        isHybrid={job.location?.isHybrid}
        salaryMin={job.salary?.min}
        salaryMax={job.salary?.max}
        salaryCurrency={job.salary?.currency}
        url={`${siteUrl}/trabajos/${job.id}`}
      />
      <article className="py-16">
        <JobViewsTracker jobId={job.id} jobOrganizationId={job.organizationId} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb - reflects navigation path (referer) */}
          <Breadcrumb className="mb-8">
            <BreadcrumbList>
              {breadcrumbs.map((b, i) => (
                <Fragment key={`${b.label}-${b.href ?? "current"}`}>
                  <BreadcrumbItem>
                    {b.href ? (
                      <BreadcrumbLink href={b.href}>{b.label}</BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{b.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {i < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>

          {/* Hero del trabajo */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-12 rounded-lg bg-primary/10 text-primary grid place-items-center">
                <HugeiconsIcon
                  icon={Briefcase01Icon}
                  size={24}
                  strokeWidth={1.5}
                  className="size-6"
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-mono">{job.id}</p>
                <p className="text-lg font-semibold text-foreground">{organizationName}</p>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-zinc-900 mb-6">
              {job.title}
            </h1>

            {/* Meta información */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600 mb-6">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Location05Icon} size={20} className="text-muted-foreground" />
                <span>{ubicacion}</span>
              </div>
              <Badge className={`${getModalidadBadgeColor(modalidad)} capitalize`}>
                {modalidad === "hibrido" ? "Híbrido" : modalidad}
              </Badge>
              <Badge className={`${getFormatoBadgeColor(employmentTypeKey)} capitalize`}>
                {job.employmentType}
              </Badge>
              {job.experienceLevel && (
                <Badge className="bg-zinc-100 text-zinc-800 capitalize">
                  {job.experienceLevel === "Mid-Senior" ? "Semi Senior" : job.experienceLevel}
                </Badge>
              )}
              <div className="flex items-center gap-2 font-semibold text-zinc-900">
                <HugeiconsIcon icon={Cash02Icon} size={20} className="text-muted-foreground" />
                <span>{salaryStr}</span>
              </div>
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Clock01Icon} size={20} className="text-muted-foreground" />
                <span suppressHydrationWarning>
                  Publicado {formatFechaLarga(new Date(job.createdAt))}
                </span>
              </div>
              {"views" in job && typeof job.views === "number" && job.views > 0 && (
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={ViewIcon} size={20} className="text-muted-foreground" />
                  <span>{job.views} vistas</span>
                </div>
              )}
            </div>
          </div>

          {/* Contenido principal - 2 columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
            {/* Columna izquierda (70%) */}
            <div className="space-y-8">
              {/* Descripción */}
              <section>
                <h2 className="text-2xl font-semibold text-zinc-900 mb-4">Descripción</h2>
                <div className="text-zinc-700 leading-relaxed prose prose-gray max-w-none">
                  {job.description ? (
                    <p className="whitespace-pre-wrap">{job.description}</p>
                  ) : (
                    <p className="text-muted-foreground">Sin descripción.</p>
                  )}
                </div>
              </section>

              {/* Beneficios */}
              {job.benefits && job.benefits.length > 0 && (
                <section>
                  <h2 className="text-2xl font-semibold text-zinc-900 mb-4">Beneficios</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {job.benefits.map((beneficio) => (
                      <div
                        key={beneficio.title}
                        className="flex flex-col gap-1 p-3 bg-zinc-50 rounded-lg"
                      >
                        <span className="font-medium text-zinc-900">{beneficio.title}</span>
                        {beneficio.description && (
                          <span className="text-zinc-600 text-sm">{beneficio.description}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Columna derecha (30%) - Card fija */}
            <div className="lg:sticky lg:top-8 h-fit">
              <Card className="shadow-lg border-0">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold text-zinc-900 mb-2">Información del Trabajo</h3>
                    <div className="space-y-2 text-sm text-zinc-600">
                      <div className="flex justify-between">
                        <span>Ubicación:</span>
                        <span className="font-medium text-zinc-900">{ubicacion}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Modalidad:</span>
                        <span className="font-medium text-zinc-900 capitalize">
                          {modalidad === "hibrido" ? "Híbrido" : modalidad}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Formato:</span>
                        <span className="font-medium text-zinc-900">{job.employmentType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Salario:</span>
                        <span className="font-medium text-zinc-900">{salaryStr}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <ApplyJobButton jobId={job.id} jobTitle={job.title} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
