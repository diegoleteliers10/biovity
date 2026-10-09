import {
  ArrowRight01Icon,
  Briefcase01Icon,
  Cash02Icon,
  GlobalIcon,
  Link04Icon,
  Location05Icon,
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
  const memberSince = org.createdAt ? formatDateChilean(org.createdAt, "MMM yyyy") : null

  const stats = [
    org.size ? { label: "Trabajadores", value: org.size, mono: false } : null,
    org.foundedYear ? { label: "Fundación", value: String(org.foundedYear), mono: true } : null,
    {
      label: org.activeJobsCount === 1 ? "Oferta activa" : "Ofertas activas",
      value: String(org.activeJobsCount),
      mono: true,
    },
  ].filter((s): s is { label: string; value: string; mono: boolean } => Boolean(s))

  const linkRows = [
    websiteUrl ? { href: websiteUrl, label: org.website, icon: GlobalIcon } : null,
    linkedinUrl ? { href: linkedinUrl, label: "LinkedIn", icon: Link04Icon } : null,
    twitterUrl ? { href: twitterUrl, label: "X (Twitter)", icon: Link04Icon } : null,
  ].filter((r): r is { href: string; label: string; icon: typeof GlobalIcon } => Boolean(r))

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

      {/* Hero band: identity + facts, each fact exactly once */}
      <section className="relative overflow-hidden border-b border-border/40 bg-surface-container-low">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-28 size-80 rounded-full bg-secondary/10 blur-[100px]"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <Breadcrumb>
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

          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border/40 bg-surface-container-lowest p-1.5 font-mono text-xl font-semibold text-secondary sm:size-20">
              {org.logo ? (
                <Image
                  src={org.logo}
                  alt={org.name}
                  width={80}
                  height={80}
                  className="size-full object-contain"
                  unoptimized
                />
              ) : (
                org.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="min-w-0">
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-secondary">
                Empresa{org.industry ? ` · ${org.industry}` : ""}
              </p>
              <h1 className="mt-1.5 text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl">
                {org.name}
              </h1>
              <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <HugeiconsIcon icon={Location05Icon} size={15} className="shrink-0" />
                {locationStr}
              </p>
            </div>
          </div>

          {stats.length > 0 && (
            <dl className="mt-8 flex flex-col divide-y divide-border/40 overflow-hidden rounded-2xl border border-border/40 bg-surface-container-lowest sm:flex-row sm:divide-x sm:divide-y-0">
              {stats.map((stat) => (
                <div key={stat.label} className="flex-1 px-5 py-4">
                  <dt className="font-mono text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </dt>
                  <dd
                    className={`mt-1 text-lg font-semibold text-foreground ${
                      stat.mono ? "font-mono tabular-nums" : ""
                    }`}
                  >
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
          {/* Contenido */}
          <div className="min-w-0 space-y-12">
            {org.description && (
              <section>
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">
                  Sobre la empresa
                </h2>
                <div className="prose max-w-none leading-relaxed text-muted-foreground">
                  <HtmlContent html={org.description} className="text-base leading-7" />
                </div>
              </section>
            )}

            <section id="ofertas" className="scroll-mt-8">
              <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">
                Ofertas activas{" "}
                <span className="font-mono text-base font-medium text-muted-foreground tabular-nums">
                  ({activeJobs.length})
                </span>
              </h2>
              {activeJobs.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border/60 py-12 text-center">
                  <HugeiconsIcon
                    icon={Briefcase01Icon}
                    size={32}
                    className="mx-auto mb-2 size-8 text-muted-foreground"
                  />
                  <p className="text-sm text-muted-foreground">
                    {org.name} no tiene ofertas activas por ahora.
                  </p>
                  <Link
                    href="/jobs"
                    className="mt-3 inline-block text-sm font-medium text-secondary hover:underline"
                  >
                    Explorar otras ofertas en Biovity
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeJobs.map((job) => (
                    <Link
                      key={job.id}
                      href={`/jobs/${job.id}`}
                      className="group flex items-start justify-between gap-4 rounded-2xl border border-border/40 bg-surface-container-low p-5 transition-colors duration-200 hover:border-secondary/40 hover:bg-surface-container-highest/40"
                    >
                      <div className="min-w-0">
                        <h3 className="font-semibold tracking-tight text-foreground transition-colors duration-200 group-hover:text-secondary">
                          {job.title}
                        </h3>
                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <HugeiconsIcon icon={Location05Icon} size={13} />
                            {formatJobLocation(job.location) || "Chile"}
                          </span>
                          <span className="rounded-full border border-secondary/20 bg-secondary/10 px-2 py-0.5 font-mono font-medium text-secondary">
                            {getModalidad(job.location)}
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
                      </div>
                      <span
                        aria-hidden
                        className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-border/40 text-muted-foreground transition-colors duration-200 group-hover:border-secondary/40 group-hover:bg-secondary/10 group-hover:text-secondary"
                      >
                        <HugeiconsIcon
                          icon={ArrowRight01Icon}
                          size={16}
                          className="transition-transform duration-200 ease-out group-hover:translate-x-0.5"
                        />
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Acciones */}
          <aside className="h-fit lg:sticky lg:top-8">
            <div className="rounded-2xl border border-border/40 bg-surface-container-low p-5">
              {linkRows.length > 0 ? (
                <div className="space-y-2.5">
                  {linkRows.map((row) => (
                    <a
                      key={row.label}
                      href={row.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 rounded-xl border border-border/40 bg-surface-container-lowest p-3 transition-colors duration-150 hover:bg-surface-container-highest/40"
                    >
                      <HugeiconsIcon
                        icon={row.icon}
                        size={18}
                        className="shrink-0 text-muted-foreground"
                      />
                      <span className="min-w-0 truncate text-sm text-foreground">{row.label}</span>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{org.name} aún no comparte enlaces.</p>
              )}

              {activeJobs.length > 0 && (
                <a
                  href="#ofertas"
                  className="mt-4 flex h-10 w-full items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-[transform,background-color] duration-150 ease-out hover:bg-primary/90 active:scale-[0.98]"
                >
                  Ver {org.activeJobsCount} {org.activeJobsCount === 1 ? "oferta" : "ofertas"}
                </a>
              )}
            </div>
            {memberSince && (
              <p className="mt-3 text-center font-mono text-xs text-muted-foreground">
                En Biovity desde {memberSince}
              </p>
            )}
          </aside>
        </div>
      </div>
    </>
  )
}
