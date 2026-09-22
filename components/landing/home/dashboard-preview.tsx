"use client"

import { Search01Icon, SparklesIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { MetricCard } from "@/components/dashboard/employee/home/metricCard"
import { RecentApplicationsCard } from "@/components/dashboard/employee/home/recentApplicationsCard"
import { RecentMessagesCard } from "@/components/dashboard/employee/home/recentMessagesCard"
import { JobListItem } from "@/components/dashboard/employee/jobListItem"
import { SearchFilters } from "@/components/dashboard/employee/searchFilters"
import { DemoFrame } from "@/components/landing/demo/demo-frame"
import { DemoHeader } from "@/components/landing/demo/demo-header"
import { DemoJobAlertsCard } from "@/components/landing/demo/demo-job-alerts-card"
import { type DemoNavItem, DemoSidebar } from "@/components/landing/demo/demo-sidebar"
import { StopClick } from "@/components/landing/demo/stop-click"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"
import { getTransition, LANDING_ANIMATION, LANDING_ANIMATION_MOBILE } from "@/lib/animations"
import { formatJobLocation } from "@/lib/api/jobs"
import type * as SavedJobsHooks from "@/lib/api/use-saved-jobs"
import {
  DEMO_APPLICATIONS,
  DEMO_CHATS,
  DEMO_JOB_ALERTS,
  DEMO_JOBS,
  DEMO_RECRUITER_NAMES,
  DEMO_SAVED_JOB_IDS,
  DEMO_USER,
  DEMO_USER_METRICS,
  DEMO_USER_NAV_BADGES,
} from "@/lib/data/demo/user-demo"
import { NAV_DATA } from "@/lib/data/nav-data"

const idleSaveMutation = { isPending: false } as unknown as ReturnType<
  typeof SavedJobsHooks.useSaveJobMutation
>
const idleRemoveMutation = { isPending: false } as unknown as ReturnType<
  typeof SavedJobsHooks.useRemoveSavedJobMutation
>

/** Sidebar entries mirror the live shell (NAV_DATA) with demo badges. */
const DEMO_NAV_ITEMS: DemoNavItem[] = NAV_DATA.navMain.map((item) => ({
  id: item.url,
  title: item.title,
  icon: item.icon,
  badge: DEMO_USER_NAV_BADGES[item.url],
  view: item.url === "/dashboard" ? "home" : undefined,
}))

const DEMO_EXPLORE_ITEMS: DemoNavItem[] = (NAV_DATA.explore ?? []).map((item) => ({
  id: item.url,
  title: item.title,
  icon: item.icon,
  view: item.url === "/dashboard/jobs" ? "jobs" : undefined,
}))

function UserHomeView({ onCta }: { onCta: () => void }) {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DemoHeader
        title={`¡Bienvenido/a de vuelta, ${DEMO_USER.firstName}!`}
        subtitle="Aquí está lo que está pasando con tus aplicaciones de trabajo hoy."
        unreadNotifications={2}
      />

      {/* Metrics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {DEMO_USER_METRICS.map((metric) => (
          <MetricCard key={metric.title} metric={metric} />
        ))}
      </div>

      {/* Recent Applications and Messages */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StopClick className="min-w-0">
          <RecentApplicationsCard
            applications={DEMO_APPLICATIONS}
            onJobClick={onCta}
            onViewAll={onCta}
            isLoading={false}
          />
        </StopClick>
        <StopClick className="min-w-0">
          <RecentMessagesCard
            chats={DEMO_CHATS}
            isLoading={false}
            namesMap={DEMO_RECRUITER_NAMES}
            participantIdKey="recruiterId"
            defaultName="Reclutador"
            onViewAll={onCta}
          />
        </StopClick>
      </div>

      {/* Recommended Jobs Section — mirrors the live home */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-foreground">Empleos Recomendados</h2>
        <div className="rounded-xl border border-border/40 bg-surface-container-low p-6 text-center shadow-none">
          <div className="size-10 rounded-full bg-surface-container-highest flex items-center justify-center mx-auto mb-3 text-muted-foreground">
            <HugeiconsIcon icon={SparklesIcon} size={20} />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">Recomendaciones en camino</p>
          <p className="text-xs text-muted-foreground">
            Próximamente recibirás recomendaciones personalizadas basadas en tu perfil y
            preferencias.
          </p>
        </div>
      </section>

      {/* Job Alerts Section */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-foreground">Alertas de Empleo</h2>
        <DemoJobAlertsCard initialAlerts={DEMO_JOB_ALERTS} />
      </section>
    </div>
  )
}

function UserJobsView({ onCta }: { onCta: () => void }) {
  const [query, setQuery] = useState("")
  const [location, setLocation] = useState("")
  const [jobType, setJobType] = useState("any")
  const [experience, setExperience] = useState("any")
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [savedIds, setSavedIds] = useState<Set<string>>(() => new Set(DEMO_SAVED_JOB_IDS))

  const filteredJobs = useMemo(() => {
    let result = DEMO_JOBS
    const normalizedQuery = query.trim().toLowerCase()
    if (normalizedQuery) {
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(normalizedQuery) ||
          (job.organization?.name ?? "").toLowerCase().includes(normalizedQuery)
      )
    }
    const normalizedLocation = location.trim().toLowerCase()
    if (normalizedLocation) {
      result = result.filter((job) =>
        formatJobLocation(job.location).toLowerCase().includes(normalizedLocation)
      )
    }
    if (remoteOnly) {
      result = result.filter((job) => job.location?.isRemote)
    }
    if (jobType !== "any") {
      result = result.filter((job) => job.employmentType === jobType)
    }
    if (experience !== "any") {
      result = result.filter((job) => job.experienceLevel === experience)
    }
    return result
  }, [query, location, remoteOnly, jobType, experience])

  const handleSave = (jobId: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev)
      if (next.has(jobId)) {
        next.delete(jobId)
      } else {
        next.add(jobId)
      }
      return next
    })
  }

  const handleClear = () => {
    setQuery("")
    setLocation("")
    setJobType("any")
    setExperience("any")
    setRemoteOnly(false)
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DemoHeader
        title="Buscar Empleos"
        subtitle="Encuentra oportunidades acorde a tus preferencias."
        unreadNotifications={2}
      />

      <SearchFilters
        query={query}
        location={location}
        jobType={jobType}
        experience={experience}
        remoteOnly={remoteOnly}
        showAdvanced={showAdvanced}
        onQueryChange={setQuery}
        onLocationChange={setLocation}
        onJobTypeChange={setJobType}
        onExperienceChange={setExperience}
        onRemoteOnlyChange={setRemoteOnly}
        onShowAdvancedChange={setShowAdvanced}
        onClear={handleClear}
      />

      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">{`${filteredJobs.length} resultados`}</p>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="flex w-full max-w-md flex-col items-center bg-transparent p-6 text-center shadow-none">
            <div className="size-10 rounded-full bg-surface-container-highest flex items-center justify-center mb-3 text-muted-foreground">
              <HugeiconsIcon icon={Search01Icon} size={20} />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              {query.trim() ? "Sin resultados" : "Busca tu próxima oferta"}
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              {query.trim()
                ? "Ajusta los filtros o usa términos más generales."
                : "Usa el buscador para encontrar oportunidades."}
            </p>
            {query.trim() && (
              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-lg border-border/40 bg-surface-container-lowest text-xs font-medium"
                onClick={handleClear}
              >
                Limpiar filtros
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredJobs.map((job) => (
            <JobListItem
              key={job.id}
              job={job}
              isSaved={savedIds.has(job.id)}
              userId="demo-user"
              onSave={handleSave}
              saveMutation={idleSaveMutation}
              removeMutation={idleRemoveMutation}
              onOpen={onCta}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function DashboardPreview() {
  const { push } = useRouter()
  const reducedMotion = useReducedMotion()
  const isMobile = useMediaQuery("(max-width: 767px)")
  const isReduced = Boolean(reducedMotion)
  const [view, setView] = useState("home")

  const viewportMargin = isMobile
    ? LANDING_ANIMATION_MOBILE.viewportMargin
    : LANDING_ANIMATION.viewportMargin
  const t = (delay = 0) => getTransition({ delay, reducedMotion, isMobile })

  const handleCta = () => {
    toast.info("Crea tu cuenta gratis para usar el panel completo.", {
      description: "Todo lo que ves en la demo queda disponible al registrarte.",
      action: {
        label: "Crear cuenta",
        onClick: () => push("/register"),
      },
    })
  }

  return (
    <section className="w-full bg-surface-container-lowest py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <m.div
          initial={isReduced ? false : { opacity: 0, y: isMobile ? 16 : 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: viewportMargin }}
          transition={t()}
          className="mb-10 text-center md:mb-14"
        >
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-3 block">
            El producto • Demo interactiva
          </span>
          <h2 className="text-2xl font-semibold text-foreground mb-4 tracking-tight text-balance sm:text-3xl md:text-4xl">
            Así se ve tu <span className="text-accent font-semibold">dashboard</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-0 max-w-3xl mx-auto leading-relaxed text-pretty">
            Explora el panel real de Biovity con datos de ejemplo: revisa tus postulaciones,
            conversa con reclutadores, crea alertas y busca tu próximo empleo en ciencias.
          </p>
        </m.div>

        <m.div
          initial={isReduced ? false : { opacity: 0, y: isMobile ? 16 : 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: viewportMargin }}
          transition={t(0.1)}
        >
          <DemoFrame
            url="biovity.cl/dashboard"
            activeView={view}
            onViewChange={setView}
            views={[
              { id: "home", label: "Dashboard" },
              { id: "jobs", label: "Buscar Empleos" },
            ]}
            sidebar={
              <DemoSidebar
                items={DEMO_NAV_ITEMS}
                exploreItems={DEMO_EXPLORE_ITEMS}
                activeView={view}
                onSelect={setView}
                user={DEMO_USER}
                avatarGradient="blue"
                profileProgress={{
                  percentage: 80,
                  title: "Progreso del Perfil",
                  subtitle: "Completitud",
                  actionText: "Completar Perfil",
                }}
              />
            }
          >
            {view === "jobs" ? (
              <UserJobsView onCta={handleCta} />
            ) : (
              <UserHomeView onCta={handleCta} />
            )}
          </DemoFrame>
        </m.div>

        <m.div
          initial={isReduced ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: viewportMargin }}
          transition={t(0.15)}
          className="mt-8 flex flex-col items-center gap-4"
        >
          <p className="text-xs text-muted-foreground">
            Navega desde el menú lateral — Dashboard y Buscar Empleos están activos en la demo.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Button size="lg" className="h-11 px-6 rounded-lg text-sm font-medium" asChild>
              <Link href="/register">Crear cuenta gratis</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 rounded-lg border-border/40 bg-surface-container-lowest text-sm font-medium hover:bg-surface-container-low"
              asChild
            >
              <Link href="/jobs">Ver empleos publicados</Link>
            </Button>
          </div>
        </m.div>
      </div>
    </section>
  )
}

export default DashboardPreview
