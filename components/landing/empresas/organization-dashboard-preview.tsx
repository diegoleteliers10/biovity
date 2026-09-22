"use client"

import {
  AlertCircleIcon,
  ArrowRight01Icon,
  Calendar03Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Delete03Icon,
  FileAddIcon,
  Globe02Icon,
  Message01Icon,
  Search01Icon,
  SparklesIcon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { MetricCard } from "@/components/dashboard/employee/home/metricCard"
import { RecentMessagesCard } from "@/components/dashboard/employee/home/recentMessagesCard"
import { ApplicationsKanban } from "@/components/dashboard/organization/ApplicationsKanban"
import { JobSelector } from "@/components/dashboard/organization/applicationsUtils"
import { CreateOfferCard } from "@/components/dashboard/organization/home/createOfferCard"
import { OrganizationRecentApplicationsCard } from "@/components/dashboard/organization/home/organizationRecentApplicationsCard"
import { PlaceholderCard } from "@/components/dashboard/organization/home/placeholderCard"
import {
  dashboardRaisedCardClass,
  dashboardTonalCardClass,
} from "@/components/dashboard/shared/surface-classes"
import { DemoFrame } from "@/components/landing/demo/demo-frame"
import { DemoHeader } from "@/components/landing/demo/demo-header"
import { type DemoNavItem, DemoSidebar } from "@/components/landing/demo/demo-sidebar"
import { StopClick } from "@/components/landing/demo/stop-click"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useMediaQuery } from "@/hooks/use-media-query"
import type { ScoreEntry } from "@/hooks/useKanbanAIScoring"
import { getTransition, LANDING_ANIMATION, LANDING_ANIMATION_MOBILE } from "@/lib/animations"
import {
  DEMO_ACCION_REQUERIDA,
  DEMO_AI_SCORES,
  DEMO_CANDIDATE_NAMES,
  DEMO_KANBAN_BY_JOB,
  DEMO_ONBOARDING_DONE,
  DEMO_ORG,
  DEMO_ORG_APPLICATIONS,
  DEMO_ORG_CHATS,
  DEMO_ORG_JOBS,
  DEMO_ORG_METRICS,
  DEMO_ORG_NAV_BADGES,
  DEMO_UPCOMING_INTERVIEWS,
} from "@/lib/data/demo/organization-demo"
import { NAV_DATA_ORGANIZATION } from "@/lib/data/nav-data"
import type { Applicant, ApplicationStage } from "@/lib/types/dashboard"

const DEMO_NAV_ITEMS: DemoNavItem[] = NAV_DATA_ORGANIZATION.navMain.map((item) => ({
  id: item.url,
  title: item.title,
  icon: item.icon,
  badge: DEMO_ORG_NAV_BADGES[item.url],
  view:
    item.url === "/dashboard"
      ? "home"
      : item.url === "/dashboard/applications"
        ? "applications"
        : undefined,
}))

const DEMO_EXPLORE_ITEMS: DemoNavItem[] = (NAV_DATA_ORGANIZATION.explore ?? []).map((item) => ({
  id: item.url,
  title: item.title,
  icon: item.icon,
}))

/** Static replica of the live OnboardingChecklist (2 of 4 done). */
function DemoOnboardingChecklist() {
  const steps = [
    {
      id: "complete_profile",
      label: "Completar perfil",
      description: "Agrega info de tu organizacion",
      icon: UserIcon,
    },
    {
      id: "create_offer",
      label: "Crear tu primera oferta",
      description: "Publica una vacante",
      icon: FileAddIcon,
    },
    {
      id: "publish_offer",
      label: "Publicar una oferta",
      description: "Activa una oferta para recibir postulaciones",
      icon: Globe02Icon,
    },
    {
      id: "view_talent",
      label: "Explorar talento",
      description: "Busca candidatos en el pool de talento",
      icon: Search01Icon,
    },
  ]
  const completedCount = DEMO_ONBOARDING_DONE.length

  return (
    <Card className={dashboardTonalCardClass}>
      <CardContent className="p-5 sm:p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-xs leading-4 font-medium text-foreground">Bienvenido a Biovity</h3>
            <p className="text-xs text-muted-foreground text-pretty">
              Completa estos pasos para empezar a recibir candidatos
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs tabular-nums text-muted-foreground">
              {completedCount}/{steps.length}
            </span>
            <span className="inline-flex size-6 items-center justify-center rounded-md text-muted-foreground/60">
              <HugeiconsIcon icon={Cancel01Icon} size={14} />
            </span>
          </div>
        </div>

        <div className="relative mb-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-secondary transition-all duration-500"
            style={{ width: `${(completedCount / steps.length) * 100}%` }}
          />
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {steps.map((step) => {
            const done = DEMO_ONBOARDING_DONE.includes(step.id)
            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 rounded-lg border p-3 text-left ${
                  done
                    ? "border-secondary/20 bg-secondary/5 opacity-80"
                    : "border-border/30 bg-surface-container-lowest"
                }`}
              >
                <div
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
                    done ? "bg-secondary/10" : "bg-primary/10"
                  }`}
                >
                  {done ? (
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      size={16}
                      className="text-secondary"
                    />
                  ) : (
                    <HugeiconsIcon icon={step.icon} size={16} className="text-primary" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-foreground">{step.label}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{step.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

/** Static replica of the live AccionRequeridaWidget (populated state). */
function DemoAccionRequerida() {
  return (
    <Card className={dashboardRaisedCardClass}>
      <div className="px-4 pt-4 sm:px-5 sm:pt-5 pb-0">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={AlertCircleIcon} size={20} className="text-destructive" />
          <span className="text-xs leading-4 font-medium text-foreground">Acción Requerida</span>
        </div>
      </div>
      <CardContent className="px-4 sm:px-5 pb-4 sm:pb-5">
        <div className="space-y-3">
          {DEMO_ACCION_REQUERIDA.map((item) => (
            <div
              key={item.jobId}
              className="flex items-center justify-between rounded-lg bg-surface-container-low p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {item.count} postulaciones pendientes · {item.daysSince} días sin cambios
                </p>
              </div>
              <Button variant="ghost" size="sm" className="shrink-0" tabIndex={-1}>
                <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="mr-1" />
                Ver
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function OrganizationHomeView({ onCta }: { onCta: () => void }) {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
      <DemoHeader
        title={`¡Bienvenido/a de vuelta, ${DEMO_ORG.name}!`}
        subtitle="Aquí está el resumen de tu actividad como empleador hoy."
        unreadNotifications={3}
      />

      <DemoOnboardingChecklist />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {DEMO_ORG_METRICS.map((metric) => (
          <MetricCard key={metric.title} metric={metric} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StopClick className="min-w-0">
          <OrganizationRecentApplicationsCard applications={DEMO_ORG_APPLICATIONS} />
        </StopClick>
        <StopClick className="min-w-0">
          <RecentMessagesCard
            chats={DEMO_ORG_CHATS}
            isLoading={false}
            namesMap={DEMO_CANDIDATE_NAMES}
            participantIdKey="professionalId"
            defaultName="Candidato"
            onViewAll={onCta}
          />
        </StopClick>
      </div>

      <StopClick>
        <CreateOfferCard />
      </StopClick>

      <div className="grid gap-4 md:grid-cols-2">
        <PlaceholderCard
          title="Proximas entrevistas"
          description="calendario de entrevistas"
          icon={Calendar03Icon}
        >
          <div className="mt-2 space-y-4">
            {DEMO_UPCOMING_INTERVIEWS.map((interview) => (
              <div
                key={interview.id}
                className="flex flex-col gap-1 border-b border-border/30 pb-3 last:border-0"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{interview.candidateName}</span>
                  <span className="text-xs text-muted-foreground">
                    {interview.date}, {interview.time}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{interview.position}</span>
                  <span className="inline-flex items-center rounded-md bg-surface-container-highest px-2 py-0.5 text-xs font-medium text-foreground">
                    {interview.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </PlaceholderCard>

        <PlaceholderCard
          title="Candidatos destacados"
          description="Recomendaciones inteligentes"
          icon={SparklesIcon}
          iconColor="accent"
        >
          <div className="flex h-full flex-col items-center justify-center rounded-xl bg-surface-container-low p-4 text-center sm:p-5">
            <div className="mb-2.5 flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <HugeiconsIcon icon={SparklesIcon} size={18} strokeWidth={1.5} />
            </div>
            <h4 className="mb-1 text-xs leading-4 font-medium text-foreground">
              Emparejamiento con IA
            </h4>
            <p className="max-w-[240px] text-xs leading-relaxed text-muted-foreground text-pretty">
              Próximamente analizaremos los perfiles automáticamente para sugerirte los
              profesionales más adecuados para tus vacantes.
            </p>
            <span className="mt-3 inline-flex items-center rounded-full border-0 bg-accent/15 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-accent">
              Próximamente
            </span>
          </div>
        </PlaceholderCard>
      </div>

      <DemoAccionRequerida />
    </div>
  )
}

const STAGE_FILTER_OPTIONS: { value: ApplicationStage | "all"; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "pendiente", label: "Pendiente" },
  { value: "entrevista", label: "Entrevista" },
  { value: "oferta", label: "Oferta" },
  { value: "contratado", label: "Contratado" },
  { value: "rechazado", label: "Rechazado" },
]

const STAGE_ORDER: ApplicationStage[] = ["pendiente", "entrevista", "oferta", "contratado"]

function getNextStage(current: ApplicationStage): ApplicationStage | null {
  const idx = STAGE_ORDER.indexOf(current)
  if (idx === -1 || idx >= STAGE_ORDER.length - 1) return null
  return STAGE_ORDER[idx + 1]
}

function OrganizationApplicationsView({ onCta }: { onCta: () => void }) {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(DEMO_ORG_JOBS[0]?.id ?? null)
  const [kanbanByJob, setKanbanByJob] = useState<Record<string, Applicant[]>>(DEMO_KANBAN_BY_JOB)
  const [searchQuery, setSearchQuery] = useState("")
  const [stageFilter, setStageFilter] = useState<ApplicationStage | "all">("all")
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const selectedJob = DEMO_ORG_JOBS.find((job) => job.id === selectedJobId) ?? null
  const applicants = selectedJobId ? (kanbanByJob[selectedJobId] ?? []) : []

  const filteredApplicants = useMemo(() => {
    let list = applicants
    const normalized = searchQuery.trim().toLowerCase()
    if (normalized) {
      list = list.filter((a) => a.candidateName.toLowerCase().includes(normalized))
    }
    if (stageFilter !== "all") {
      list = list.filter((a) => a.stage === stageFilter)
    }
    return list
  }, [applicants, searchQuery, stageFilter])

  const handleStatusChange = (applicationId: string, newStage: ApplicationStage) => {
    setKanbanByJob((prev) => {
      const job = selectedJobId
      if (!job) return prev
      const list = prev[job] ?? []
      return {
        ...prev,
        [job]: list.map((app) => (app.id === applicationId ? { ...app, stage: newStage } : app)),
      }
    })
  }

  const getScore = (candidateId: string): ScoreEntry | undefined => {
    const score = DEMO_AI_SCORES[candidateId]
    return score ? { score, analyzedAt: new Date() } : undefined
  }

  const handleToggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const toggleSelectionMode = () => {
    setSelectionMode((prev) => {
      if (prev) setSelectedIds(new Set())
      return !prev
    })
  }

  const selectedApplicants = filteredApplicants.filter((a) => selectedIds.has(a.id))
  const canAdvance = selectedApplicants.some((a) => getNextStage(a.stage) !== null)
  const advanceStage =
    selectedApplicants.length > 0
      ? (STAGE_ORDER[STAGE_ORDER.indexOf(selectedApplicants[0].stage) + 1] ?? null)
      : null

  const handleBulkAdvance = (targetStage: ApplicationStage) => {
    for (const applicant of selectedApplicants) {
      handleStatusChange(applicant.id, targetStage)
    }
    setSelectedIds(new Set())
  }

  const handleBulkReject = () => {
    handleBulkAdvance("rechazado" as ApplicationStage)
    toast.info(`${selectedIds.size} candidatos movidos a Rechazado (demo)`)
    setSelectedIds(new Set())
  }

  return (
    <div className="flex h-full w-full flex-1 flex-col gap-3 overflow-hidden p-3 sm:p-4 min-h-0">
      <DemoHeader
        title="Aplicaciones"
        subtitle="Revisa las postulaciones de candidatos a tus ofertas."
        unreadNotifications={3}
      />

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden lg:flex-row">
        <JobSelector
          selectedJobId={selectedJobId}
          onSelectJobId={setSelectedJobId}
          jobs={DEMO_ORG_JOBS}
          isLoading={false}
          error={null}
        />

        <section
          className={`flex h-full min-w-0 flex-1 flex-col overflow-hidden ${dashboardRaisedCardClass}`}
        >
          {selectedJob ? (
            <div className="flex h-full flex-col overflow-hidden">
              <div className="shrink-0 border-b px-4 py-3">
                <div className="mb-1 flex items-center justify-between">
                  <h2 className="text-base font-semibold text-foreground">{selectedJob.title}</h2>
                  <button
                    type="button"
                    onClick={toggleSelectionMode}
                    className={`h-9 rounded-md px-3 text-xs font-medium transition-colors ${
                      selectionMode
                        ? "bg-primary text-primary-foreground"
                        : "bg-surface-container-highest text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {selectionMode ? "Salir seleccion" : "Seleccionar"}
                  </button>
                </div>
                <p className="text-muted-foreground text-sm">
                  {selectedJob.location?.isRemote ? "Remoto" : "Presencial"} ·{" "}
                  {filteredApplicants.length} postulantes
                  {filteredApplicants.length !== applicants.length
                    ? ` de ${applicants.length}`
                    : ""}
                </p>
              </div>

              <div className="flex flex-col gap-3 overflow-hidden p-3 lg:p-4 min-h-0 flex-1">
                {/* Toolbar replica (search + stage filter + bulk bar) */}
                <div className="shrink-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative min-w-[200px] flex-1">
                      <HugeiconsIcon
                        icon={Search01Icon}
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar por nombre..."
                        className="h-9 pl-9"
                        aria-label="Buscar candidatos (demo)"
                      />
                    </div>
                    <Select
                      value={stageFilter}
                      onValueChange={(v) => setStageFilter(v as ApplicationStage | "all")}
                    >
                      <SelectTrigger className="h-9 w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STAGE_FILTER_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedIds.size > 0 && (
                    <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2">
                      <HugeiconsIcon icon={UserIcon} size={16} className="text-primary" />
                      <span className="text-sm font-medium">{selectedIds.size} seleccionados</span>
                      <div className="flex-1" />
                      {canAdvance && advanceStage && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBulkAdvance(advanceStage)}
                          className="h-9 gap-1.5 rounded-md px-3 text-xs font-medium text-muted-foreground hover:text-foreground"
                        >
                          Avanzar a {advanceStage}
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onCta}
                        className="h-9 gap-1.5 rounded-md px-3 text-xs font-medium text-muted-foreground hover:text-foreground"
                      >
                        <HugeiconsIcon icon={Message01Icon} size={14} />
                        Mensaje
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleBulkReject}
                        className="h-9 gap-1.5 rounded-md px-3 text-xs font-medium text-destructive hover:text-destructive"
                      >
                        <HugeiconsIcon icon={Delete03Icon} size={14} />
                        Rechazar
                      </Button>
                    </div>
                  )}
                </div>

                <div className="min-h-0 flex-1 overflow-hidden">
                  <ApplicationsKanban
                    applicants={filteredApplicants}
                    onStatusChange={handleStatusChange}
                    getScore={getScore}
                    onScoreClick={onCta}
                    onViewProfile={onCta}
                    onViewDetail={onCta}
                    onMessage={onCta}
                    selectionMode={selectionMode}
                    selectedIds={selectedIds}
                    onToggleSelection={handleToggleSelection}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center p-6 text-sm text-muted-foreground">
              Selecciona una oferta para ver sus postulaciones.
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export function OrganizationDashboardPreview() {
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
    toast.info("Crea la cuenta de tu organización para usar el ATS completo.", {
      description: "Publica ofertas, gestiona tu pipeline y puntúa candidatos con IA.",
      action: {
        label: "Publicar una oferta",
        onClick: () => push("/register/organization"),
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
            El ATS • Demo interactiva
          </span>
          <h2 className="text-2xl font-semibold text-foreground mb-4 tracking-tight text-balance sm:text-3xl md:text-4xl">
            Así se ve tu <span className="text-accent font-semibold">panel de reclutamiento</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-0 max-w-3xl mx-auto leading-relaxed text-pretty">
            El mismo ATS que usa tu equipo, con datos de ejemplo. Explora el pipeline de candidatos,
            arrastra tarjetas entre etapas y revisa el scoring de IA.
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
            scroll={view !== "applications"}
            views={[
              { id: "home", label: "Dashboard" },
              { id: "applications", label: "Aplicaciones" },
            ]}
            sidebar={
              <DemoSidebar
                items={DEMO_NAV_ITEMS}
                exploreItems={DEMO_EXPLORE_ITEMS}
                activeView={view}
                onSelect={setView}
                user={{ name: DEMO_ORG.recruiter.name, title: DEMO_ORG.recruiter.title }}
                avatarGradient="purple"
                profileProgress={{
                  percentage: 60,
                  title: "Perfil Organizacion",
                  subtitle: "Completitud",
                  actionText: "Completar Perfil",
                }}
              />
            }
          >
            {view === "applications" ? (
              <OrganizationApplicationsView onCta={handleCta} />
            ) : (
              <OrganizationHomeView onCta={handleCta} />
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
            Cambia de oferta en el panel izquierdo y arrastra las tarjetas del pipeline entre etapas
            — funciona en la demo.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Button size="lg" className="h-11 px-6 rounded-lg text-sm font-medium" asChild>
              <Link href="/register/organization">Publicar mi primera oferta</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 rounded-lg border-border/40 bg-surface-container-lowest text-sm font-medium hover:bg-surface-container-low"
              asChild
            >
              <Link href="/plans">Ver planes y precios</Link>
            </Button>
          </div>
        </m.div>
      </div>
    </section>
  )
}

export default OrganizationDashboardPreview
