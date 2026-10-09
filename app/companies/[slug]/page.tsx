import {
  Briefcase01Icon,
  Calendar03Icon,
  Cash02Icon,
  GlobalIcon,
  Link04Icon,
  Location05Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Result } from "better-result"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { HtmlContent } from "@/components/dashboard/shared/HtmlContent"
import { JsonLd } from "@/components/seo/JsonLd"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { formatJobLocation, getJobs, type JobLocation } from "@/lib/api/jobs"
import { getPublicOrganization } from "@/lib/api/organizations"
import { formatDateChilean, formatJobSalary } from "@/lib/utils"

type Props = {
  params: Promise<{ slug: string }>
}

function getModalidad(loc: JobLocation | null | undefined): string {
  if (!loc) return "Presencial"
  if (loc.isRemote) return "Remoto"
  if (loc.isHybrid) return "Híbrido"
  return "Presencial"
}

function formatLocation(
  location: { city?: string; state?: string; country?: string } | undefined
): string {
  if (!location) return "Chile"
  const parts = [location.city, location.state, location.country].filter(Boolean)
  return parts.join(", ") || "Chile"
}

function socialUrl(url: string | undefined): string | null {
  if (!url) return null
  return url.startsWith("http") ? url : `https://${url}`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const result = await getPublicOrganization(decodeURIComponent(slug))
  if (!Result.isOk(result)) {
    return { title: "Empresa no encontrada | Biovity" }
  }
  const org = result.value
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://biovity.cl"
  const url = `${siteUrl}/companies/${org.slug ?? slug}`
  const locationStr = formatLocation(org.location)
  const description =
    org.description?.replace(/<[^>]*>/g, "").substring(0, 160) ||
    `Conoce a ${org.name}: ${[org.industry, org.size, locationStr].filter(Boolean).join(" · ")}. Ofertas activas en Biovity.`

  return {
    title: `${org.name} | Empresas de Biovity`,
    description,
    openGraph: {
      title: `${org.name} | Empresas de Biovity`,
      description,
      url,
      siteName: "Biovity",
      locale: "es_CL",
      type: "website",
    },
    twitter: {
      title: `${org.name} | Empresas de Biovity`,
      description,
    },
    alternates: {
      canonical: url,
    },
  }
}

export default async function CompanyProfilePage({ params }: Props) {
  const { slug } = await params
  const orgResult = await getPublicOrganization(decodeURIComponent(slug))
  if (!Result.isOk(orgResult)) {
    notFound()
  }
  const org = orgResult.value

  const jobsResult = await getJobs({
    organizationId: org.id,
    status: "active",
    limit: 50,
  })
  const activeJobs = Result.isOk(jobsResult) ? jobsResult.value.data : []

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://biovity.cl"
  const profileUrl = `${siteUrl}/companies/${org.slug ?? slug}`
  const locationStr = formatLocation(org.location)
  const websiteUrl = socialUrl(org.website)
  const linkedinUrl = socialUrl(org.linkedinUrl)
  const twitterUrl = socialUrl(org.twitterUrl)

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: org.name,
          url: profileUrl,
          ...(org.logo ? { logo: org.logo } : {}),
          ...(org.description
            ? { description: org.description.replace(/<[^>]*>/g, "").substring(0, 500) }
            : {}),
          ...(org.foundedYear ? { foundingDate: String(org.foundedYear) } : {}),
          sameAs: [linkedinUrl, twitterUrl, websiteUrl ? websiteUrl : null].filter(
            (u): u is string => Boolean(u)
          ),
          address: {
            "@type": "PostalAddress",
            addressLocality: org.location?.city,
            addressRegion: org.location?.state,
            addressCountry: org.location?.country ?? "CL",
          },
        }}
      />
      <article className="bg-surface-container-lowest py-8 sm:py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb className="mb-6 sm:mb-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/jobs">Ofertas</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{org.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
            {/* Columna izquierda */}
            <div className="min-w-0 space-y-8">
              <header className="border-b border-border/40 pb-8">
                <div className="flex items-start gap-4">
                  <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border/40 bg-surface-container-low font-mono text-xl font-semibold text-secondary">
                    {org.logo ? (
                      <Image
                        src={org.logo}
                        alt={org.name}
                        width={64}
                        height={64}
                        className="size-full object-cover"
                        unoptimized
                      />
                    ) : (
                      org.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="mb-2 block font-mono text-xs font-semibold uppercase tracking-wider text-secondary">
                      EMPRESA {org.industry ? `• ${org.industry}` : ""}
                    </span>
                    <h1 className="text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl">
                      {org.name}
                    </h1>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <HugeiconsIcon icon={Location05Icon} size={16} />
                    {locationStr}
                  </span>
                  {org.size && (
                    <>
                      <span className="text-border/60">•</span>
                      <span className="inline-flex items-center gap-1.5">
                        <HugeiconsIcon icon={UserGroupIcon} size={16} />
                        {org.size}
                      </span>
                    </>
                  )}
                  {org.foundedYear && (
                    <>
                      <span className="text-border/60">•</span>
                      <span className="inline-flex items-center gap-1.5 tabular-nums">
                        <HugeiconsIcon icon={Calendar03Icon} size={16} />
                        Fundada en {org.foundedYear}
                      </span>
                    </>
                  )}
                  <span className="text-border/60">•</span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs font-medium tabular-nums">
                    {org.activeJobsCount}{" "}
                    {org.activeJobsCount === 1 ? "oferta activa" : "ofertas activas"}
                  </span>
                </div>
              </header>

              {org.description && (
                <section>
                  <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                    Sobre la Empresa
                  </h2>
                  <div className="prose max-w-none leading-relaxed text-muted-foreground">
                    <HtmlContent html={org.description} className="text-base leading-7" />
                  </div>
                </section>
              )}

              <section id="ofertas" className="scroll-mt-8">
                <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  Ofertas Activas
                </h2>
                {activeJobs.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border/60 py-10 text-center">
                    <HugeiconsIcon
                      icon={Briefcase01Icon}
                      size={32}
                      className="mx-auto mb-2 size-8 text-muted-foreground"
                    />
                    <p className="text-sm text-muted-foreground">
                      {org.name} no tiene ofertas activas por ahora.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeJobs.map((job) => (
                      <Link
                        key={job.id}
                        href={`/jobs/${job.id}`}
                        className="block rounded-2xl border border-border/40 bg-surface-container-low p-5 transition-colors hover:bg-surface-container-highest/40"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <h3 className="font-semibold tracking-tight text-foreground">
                            {job.title}
                          </h3>
                          <span className="rounded-full border border-secondary/20 bg-secondary/10 px-2.5 py-0.5 font-mono text-xs font-medium text-secondary">
                            {getModalidad(job.location)}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <HugeiconsIcon icon={Location05Icon} size={13} />
                            {formatJobLocation(job.location) || "Chile"}
                          </span>
                          {job.salary && (
                            <span className="inline-flex items-center gap-1 font-mono tabular-nums">
                              <HugeiconsIcon icon={Cash02Icon} size={13} />
                              {formatJobSalary(job.salary)}
                            </span>
                          )}
                          {job.createdAt && (
                            <span className="tabular-nums">
                              Publicada {formatDateChilean(job.createdAt, "d MMM yyyy")}
                            </span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* Columna derecha */}
            <aside className="h-fit lg:sticky lg:top-8">
              <div className="space-y-5 rounded-2xl border border-border/40 bg-surface-container-low p-6 shadow-none">
                <h3 className="text-base font-semibold tracking-tight text-foreground">
                  Información de la Empresa
                </h3>
                <div className="space-y-2.5 text-sm">
                  {org.industry && (
                    <div className="flex items-center justify-between border-b border-border/30 py-2">
                      <span className="text-xs text-muted-foreground sm:text-sm">Industria:</span>
                      <span className="text-xs font-medium text-foreground sm:text-sm">
                        {org.industry}
                      </span>
                    </div>
                  )}
                  {org.size && (
                    <div className="flex items-center justify-between border-b border-border/30 py-2">
                      <span className="text-xs text-muted-foreground sm:text-sm">
                        Trabajadores:
                      </span>
                      <span className="text-xs font-medium text-foreground sm:text-sm">
                        {org.size}
                      </span>
                    </div>
                  )}
                  {org.foundedYear && (
                    <div className="flex items-center justify-between border-b border-border/30 py-2">
                      <span className="text-xs text-muted-foreground sm:text-sm">Fundación:</span>
                      <span className="text-xs font-medium text-foreground tabular-nums sm:text-sm">
                        {org.foundedYear}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between border-b border-border/30 py-2">
                    <span className="text-xs text-muted-foreground sm:text-sm">Ubicación:</span>
                    <span className="text-xs font-medium text-foreground sm:text-sm">
                      {locationStr}
                    </span>
                  </div>
                </div>

                {(websiteUrl || linkedinUrl || twitterUrl) && (
                  <div className="space-y-2 pt-1">
                    {websiteUrl && (
                      <a
                        href={websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 rounded-lg border border-border/40 bg-surface-container-lowest p-3 transition-colors hover:bg-surface-container-highest/40"
                      >
                        <HugeiconsIcon
                          icon={GlobalIcon}
                          size={18}
                          className="shrink-0 text-muted-foreground"
                        />
                        <span className="min-w-0 truncate text-sm text-foreground">
                          {org.website}
                        </span>
                      </a>
                    )}
                    {linkedinUrl && (
                      <a
                        href={linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 rounded-lg border border-border/40 bg-surface-container-lowest p-3 transition-colors hover:bg-surface-container-highest/40"
                      >
                        <HugeiconsIcon
                          icon={Link04Icon}
                          size={18}
                          className="shrink-0 text-muted-foreground"
                        />
                        <span className="text-sm text-foreground">LinkedIn</span>
                      </a>
                    )}
                    {twitterUrl && (
                      <a
                        href={twitterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 rounded-lg border border-border/40 bg-surface-container-lowest p-3 transition-colors hover:bg-surface-container-highest/40"
                      >
                        <HugeiconsIcon
                          icon={Link04Icon}
                          size={18}
                          className="shrink-0 text-muted-foreground"
                        />
                        <span className="text-sm text-foreground">X (Twitter)</span>
                      </a>
                    )}
                  </div>
                )}

                {activeJobs.length > 0 && (
                  <Link
                    href="#ofertas"
                    className="block rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Ver {org.activeJobsCount} {org.activeJobsCount === 1 ? "oferta" : "ofertas"}
                  </Link>
                )}
              </div>
            </aside>
          </div>
        </div>
      </article>
    </>
  )
}
