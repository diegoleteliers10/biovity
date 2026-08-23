import {
  AirplaneLanding01Icon,
  Briefcase01Icon,
  Cash02Icon,
  Clock01Icon,
  GraduationScrollIcon,
  HeartAddIcon,
  LaptopIcon,
  Location05Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Result } from "better-result"
import type { Metadata } from "next"
import { headers } from "next/headers"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Fragment } from "react"
import { JobViewsTracker } from "@/components/common/job-views-tracker"
import { HtmlContent } from "@/components/dashboard/shared/HtmlContent"
import { ApplyJobButton } from "@/components/landing/trabajos/ApplyJobButton"
import { JobShareButtons } from "@/components/landing/trabajos/JobShareButtons"
import { BreadcrumbJsonLd, JobPostingJsonLd, OrganizationJsonLd } from "@/components/seo/JsonLd"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  formatJobLocation,
  getJob,
  type Job,
  type JobBenefit,
  type JobLocation,
} from "@/lib/api/jobs"
import { getOrganization } from "@/lib/api/organizations"
import {
  formatFechaLarga,
  formatJobSalary,
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
  return formatJobSalary(job.salary)
}

function getBenefitIcon(benefit: JobBenefit) {
  const t = benefit.title.toLowerCase()
  if (/salud|médico|medico|dental|seguro/.test(t)) return HeartAddIcon
  if (/vacacion|vacation/.test(t)) return AirplaneLanding01Icon
  if (/formación|formacion|capacitación|aprendizaje|learning/.test(t)) return GraduationScrollIcon
  if (/equipo|laptop|remoto|equipment|teletrabajo|computador/.test(t)) return LaptopIcon
  return LaptopIcon
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

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://biovity.cl"
  const url = `${siteUrl}/trabajos/${job.id}`
  const ogImageUrl = `${siteUrl}/og/job/${job.id}`
  const orgName = job.organization?.name ?? "Biovity"
  const locStr = formatJobLocation(job.location) || "Chile"
  const desc = job.description
    ? job.description.replace(/<[^>]*>/g, "").substring(0, 160)
    : `Postula a la vacante de ${job.title} en ${orgName} (${locStr}) a través de Biovity.`

  return {
    title: `${job.title} - ${orgName} | Biovity`,
    description: desc,
    openGraph: {
      title: `${job.title} - ${orgName}`,
      description: desc,
      url,
      siteName: "Biovity",
      locale: "es_CL",
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${job.title} en ${orgName} | Biovity`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${job.title} - ${orgName}`,
      description: desc,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: url,
    },
  }
}

export default async function TrabajoDetailPage({ params }: Props) {
  const { id } = await params
  const [headersList, jobResult] = await Promise.all([await headers(), getJob(id)])
  const referer = headersList.get("referer")
  if (!Result.isOk(jobResult)) {
    notFound()
  }

  const job = jobResult.value
  let organizationName = job.organization?.name
  let organizationLogo = ""
  if (job.organizationId) {
    const orgResult = await getOrganization(job.organizationId)
    if (Result.isOk(orgResult)) {
      organizationName = organizationName ?? orgResult.value.name
      organizationLogo = orgResult.value.logo ?? ""
    }
  }
  organizationName = organizationName ?? "Organización"

  const modalidad = getJobModalidad(job.location)
  const ubicacion = formatJobLocation(job.location) || "Sin especificar"
  const salaryStr = formatJobSalaryDisplay(job)
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
      <article className="py-8 sm:py-12 md:py-16 bg-surface-container-lowest">
        <JobViewsTracker jobId={job.id} jobOrganizationId={job.organizationId} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6 sm:mb-8">
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
          <div className="mb-10 pb-8 border-b border-border/40">
            {/* Plain Green Monospace Eyebrow per §3.2 A */}
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-3 block">
              OFERTA LABORAL • {organizationName}
            </span>

            <div className="flex items-center gap-3.5 mb-4">
              <div className="size-12 rounded-xl bg-surface-container-low border border-border/40 text-secondary flex items-center justify-center shrink-0 overflow-hidden font-mono font-semibold text-sm">
                {organizationLogo ? (
                  <Image
                    src={organizationLogo}
                    alt={organizationName}
                    width={48}
                    height={48}
                    className="size-full object-cover"
                    unoptimized
                  />
                ) : (
                  <HugeiconsIcon
                    icon={Briefcase01Icon}
                    size={22}
                    className="text-secondary"
                  />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-lg font-semibold text-foreground tracking-tight truncate">
                  {organizationName}
                </p>
                <p className="text-xs text-muted-foreground font-mono">ID: {job.id.slice(0, 8)}</p>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground tracking-tight mb-5 text-balance">
              {job.title}
            </h1>

            {/* Meta información */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <HugeiconsIcon icon={Location05Icon} size={16} className="text-muted-foreground" />
                <span>{ubicacion}</span>
              </div>
              <span className="text-border/60">•</span>
              <span className="px-2.5 py-1 rounded-full font-mono text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20 capitalize">
                {modalidad === "hibrido" ? "Híbrido" : modalidad}
              </span>
              {job.employmentType && (
                <span className="px-2.5 py-1 rounded-full font-mono text-xs font-medium bg-surface-container-highest text-foreground border border-border/40 capitalize">
                  {job.employmentType}
                </span>
              )}
              {job.experienceLevel && (
                <span className="px-2.5 py-1 rounded-full font-mono text-xs font-medium bg-surface-container-low text-muted-foreground border border-border/40 capitalize">
                  {job.experienceLevel === "Mid-Senior" ? "Semi Senior" : job.experienceLevel}
                </span>
              )}
              <div className="flex items-center gap-1.5 font-mono font-semibold text-secondary tabular-nums">
                <HugeiconsIcon icon={Cash02Icon} size={18} className="text-secondary" />
                <span>{salaryStr}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums">
                <HugeiconsIcon icon={Clock01Icon} size={16} className="text-muted-foreground" />
                <span suppressHydrationWarning>
                  Publicado {formatFechaLarga(new Date(job.createdAt))}
                </span>
              </div>
              {"views" in job && typeof job.views === "number" && job.views > 0 && (
                <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground tabular-nums">
                  <HugeiconsIcon icon={ViewIcon} size={16} className="text-muted-foreground" />
                  <span>{job.views} vistas</span>
                </div>
              )}
            </div>

            <JobShareButtons
              jobId={job.id}
              jobTitle={job.title}
              organizationName={organizationName}
              location={ubicacion}
              salary={salaryStr}
              variant="pills"
              className="mt-2"
            />
          </div>

          {/* Contenido principal - 2 columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
            {/* Columna izquierda */}
            <div className="space-y-8 min-w-0">
              {/* Descripción */}
              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-4">
                  Descripción del Puesto
                </h2>
                <div className="text-muted-foreground leading-relaxed prose max-w-none">
                  {job.description ? (
                    <HtmlContent
                      html={job.description}
                      className="text-base leading-7"
                    />
                  ) : (
                    <p className="text-muted-foreground">Sin descripción detallada.</p>
                  )}
                </div>
              </section>

              {/* Habilidades requeridas si existen */}
              {job.requiredSkills && job.requiredSkills.length > 0 && (
                <section className="pt-6 border-t border-border/40">
                  <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-4">
                    Requisitos y Habilidades
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-surface-container-highest px-3 py-1 text-xs font-medium text-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Beneficios */}
              {job.benefits && job.benefits.length > 0 && (
                <section className="pt-6 border-t border-border/40">
                  <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-4">
                    Beneficios Ofrecidos
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {job.benefits.map((beneficio) => {
                      const Icon = getBenefitIcon(beneficio)
                      return (
                        <div
                          key={beneficio.title}
                          className="flex items-center gap-3 rounded-xl bg-surface-container-low px-4 py-3.5 border border-border/40 text-sm text-foreground shadow-none"
                        >
                          <div className="size-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-secondary shrink-0 border border-border/40">
                            <HugeiconsIcon
                              icon={Icon}
                              size={16}
                              aria-hidden
                            />
                          </div>
                          <span className="line-clamp-1">
                            <span className="font-medium text-foreground">
                              {beneficio.title}
                            </span>
                            {beneficio.description ? (
                              <span className="text-muted-foreground">{` — ${beneficio.description}`}</span>
                            ) : null}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </section>
              )}
            </div>

            {/* Columna derecha - Card fija */}
            <div className="lg:sticky lg:top-8 h-fit">
              <div className="rounded-2xl border border-border/40 bg-surface-container-low p-6 sm:p-7 shadow-none space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-4 text-base tracking-tight">
                    Resumen de la Oferta
                  </h3>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between items-center py-2 border-b border-border/30">
                      <span className="text-muted-foreground text-xs sm:text-sm">Ubicación:</span>
                      <span className="font-medium text-foreground text-xs sm:text-sm">{ubicacion}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/30">
                      <span className="text-muted-foreground text-xs sm:text-sm">Modalidad:</span>
                      <span className="font-medium text-foreground text-xs sm:text-sm capitalize">
                        {modalidad === "hibrido" ? "Híbrido" : modalidad}
                      </span>
                    </div>
                    {job.employmentType && (
                      <div className="flex justify-between items-center py-2 border-b border-border/30">
                        <span className="text-muted-foreground text-xs sm:text-sm">Jornada:</span>
                        <span className="font-medium text-foreground text-xs sm:text-sm">{job.employmentType}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center py-2 border-b border-border/30">
                      <span className="text-muted-foreground text-xs sm:text-sm">Compensación:</span>
                      <span className="font-mono font-semibold text-secondary tabular-nums text-xs sm:text-sm">{salaryStr}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <ApplyJobButton jobId={job.id} jobTitle={job.title} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
