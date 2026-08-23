"use client"

import {
  ArrowRight01Icon,
  Calendar04Icon,
  Cash02Icon,
  Clock01Icon,
  File02Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { ConnectedNotificationBell } from "@/components/common/ConnectedNotificationBell"
import { useDashboardSession } from "@/components/dashboard/DashboardSessionContext"
import { MobileMenuButton } from "@/components/dashboard/shared/MobileMenuButton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Application, ApplicationStatus } from "@/lib/api/applications"
import { useApplicationsByCandidate } from "@/lib/api/use-applications"
import { useOrganization } from "@/lib/api/use-organization"
import { cn, formatDateChilean } from "@/lib/utils"

type FilterTab = "all" | "in_progress" | "completed"

const PIPELINE_STAGES = [
  { id: "pendiente", label: "Postulación" },
  { id: "entrevista", label: "Entrevista" },
  { id: "oferta", label: "Oferta" },
  { id: "contratado", label: "Contratación" },
] as const

const STAGE_ORDER: Record<string, number> = {
  pendiente: 0,
  entrevista: 1,
  oferta: 2,
  contratado: 3,
}

function formatDateApplied(isoDate: string): string {
  return formatDateChilean(isoDate, "d MMM yyyy")
}

function formatSalary(
  min?: number | null,
  max?: number | null,
  currency?: string | null
): string {
  if (!min && !max) return ""
  const curr = currency ?? "CLP"
  if (min && max) {
    return `$${min.toLocaleString("es-CL")} – $${max.toLocaleString("es-CL")} ${curr}`
  }
  if (min) return `Desde $${min.toLocaleString("es-CL")} ${curr}`
  if (max) return `Hasta $${max.toLocaleString("es-CL")} ${curr}`
  return ""
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

function ApplicationStatusChip({ status }: { status: ApplicationStatus }) {
  const config: Record<
    ApplicationStatus | "desistido",
    { label: string; className: string }
  > = {
    pendiente: {
      label: "En revisión",
      className: "bg-surface-container-highest text-foreground",
    },
    entrevista: {
      label: "Entrevista",
      className: "bg-accent/15 text-foreground border border-accent/25",
    },
    oferta: {
      label: "Oferta recibida",
      className: "bg-secondary/10 text-secondary border border-secondary/20 font-semibold",
    },
    contratado: {
      label: "Contratado",
      className: "bg-secondary text-secondary-foreground font-semibold",
    },
    rechazado: {
      label: "Proceso cerrado",
      className: "bg-destructive/10 text-destructive border border-destructive/20",
    },
    desistido: {
      label: "Desistido",
      className: "bg-surface-container-highest text-muted-foreground",
    },
  }

  const { label, className } = config[status] ?? config.pendiente

  return (
    <span
      className={cn(
        "inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-md shrink-0",
        className
      )}
    >
      {label}
    </span>
  )
}

function ApplicationStepper({
  status,
  updatedAt,
}: {
  status: ApplicationStatus
  updatedAt: string
}) {
  if (status === "rechazado" || status === "desistido") {
    return (
      <div className="flex flex-wrap items-center justify-between gap-2 bg-surface-container-low rounded-lg px-3 py-2 text-xs">
        <span className="text-muted-foreground">
          {status === "rechazado"
            ? "La empresa concluyó este proceso de selección."
            : "Te retiraste voluntariamente de esta postulación."}
        </span>
        <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
          Actualizado {formatDateChilean(updatedAt, "d MMM yyyy")}
        </span>
      </div>
    )
  }

  const currentIdx = STAGE_ORDER[status] ?? 0

  return (
    <div className="space-y-1.5 pt-1">
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {PIPELINE_STAGES.map((stage, idx) => {
          const isComplete = idx < currentIdx
          const isCurrent = idx === currentIdx
          return (
            <div key={stage.id} className="flex flex-col gap-1.5">
              <div
                className={cn(
                  "h-1.5 rounded-full transition-colors",
                  isComplete && "bg-secondary",
                  isCurrent && "bg-primary",
                  !isComplete && !isCurrent && "bg-surface-container-highest"
                )}
              />
              <span
                className={cn(
                  "text-[11px] truncate",
                  isCurrent
                    ? "text-foreground font-semibold"
                    : isComplete
                      ? "text-secondary font-medium"
                      : "text-muted-foreground"
                )}
              >
                {stage.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ApplicationCard({ app }: { app: Application }) {
  const router = useRouter()
  const jobTitle = app.job?.title ?? "Cargo no disponible"
  const { data: org } = useOrganization(app.job?.organizationId)
  const company = org?.name ?? "Organización"
  const salaryText = formatSalary(app.salaryMin, app.salaryMax, app.salaryCurrency)

  return (
    <div className="rounded-xl bg-surface-container-lowest border border-border/50 p-4 sm:p-5 flex flex-col gap-3.5 shadow-none transition-colors">
      {/* Header: Organization Avatar + Job Title + Status + Action */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="size-10 rounded-lg bg-surface-container-low border border-border/40 flex items-center justify-center font-mono font-semibold text-xs text-foreground shrink-0 overflow-hidden">
            {org?.logo ? (
              <Image
                src={org.logo}
                alt={company}
                width={40}
                height={40}
                className="size-full object-cover"
                unoptimized
              />
            ) : (
              <span>{getInitials(company)}</span>
            )}
          </div>
          <div className="min-w-0 space-y-0.5">
            <h2 className="text-sm sm:text-base font-semibold text-foreground truncate leading-snug">
              {jobTitle}
            </h2>
            <p className="text-xs font-medium text-muted-foreground truncate">{company}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <ApplicationStatusChip status={app.status} />
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/dashboard/job/${app.jobId}`)}
            className="h-9 px-3 rounded-lg border-border/40 bg-surface-container-lowest hover:bg-surface-container-low text-xs font-medium text-foreground gap-1.5 transition-colors shadow-none"
          >
            <span>Ver vacante</span>
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
          </Button>
        </div>
      </div>

      {/* Metadata Row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground border-y border-border/30 py-2">
        <div className="flex items-center gap-1.5">
          <HugeiconsIcon icon={Clock01Icon} size={14} className="shrink-0 text-muted-foreground" />
          <span>
            Postulado el{" "}
            <strong className="font-medium text-foreground tabular-nums">
              {formatDateApplied(app.createdAt)}
            </strong>
          </span>
        </div>
        {salaryText && (
          <div className="flex items-center gap-1.5">
            <HugeiconsIcon icon={Cash02Icon} size={14} className="shrink-0 text-secondary" />
            <span>
              Pretensión:{" "}
              <strong className="font-medium text-foreground tabular-nums">{salaryText}</strong>
            </span>
          </div>
        )}
        {app.availabilityDate && (
          <div className="flex items-center gap-1.5">
            <HugeiconsIcon
              icon={Calendar04Icon}
              size={14}
              className="shrink-0 text-muted-foreground"
            />
            <span>
              Disponibilidad:{" "}
              <strong className="font-medium text-foreground tabular-nums">
                {formatDateChilean(app.availabilityDate, "d MMM yyyy")}
              </strong>
            </span>
          </div>
        )}
      </div>

      {/* Stage Stepper / Progress Pipeline */}
      <ApplicationStepper status={app.status} updatedAt={app.updatedAt} />
    </div>
  )
}

function ApplicationSkeleton() {
  return (
    <div className="rounded-xl bg-surface-container-lowest border border-border/50 p-4 sm:p-5 flex flex-col gap-3.5 shadow-none">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="size-10 rounded-lg bg-surface-container-highest/60 animate-pulse shrink-0" />
          <div className="space-y-1.5 flex-1">
            <div className="h-4 w-44 rounded bg-surface-container-highest/60 animate-pulse" />
            <div className="h-3 w-28 rounded bg-surface-container-highest/60 animate-pulse" />
          </div>
        </div>
        <div className="h-9 w-24 rounded-lg bg-surface-container-highest/60 animate-pulse shrink-0" />
      </div>
      <div className="h-7 w-full rounded bg-surface-container-highest/40 animate-pulse" />
      <div className="h-3 w-full rounded-full bg-surface-container-highest/60 animate-pulse" />
    </div>
  )
}

export function ApplicationsContent() {
  const router = useRouter()
  const session = useDashboardSession()
  const userId = session?.user?.id
  const { data: applications = [], isLoading, error, refetch } = useApplicationsByCandidate(userId)

  const [activeTab, setActiveTab] = useState<FilterTab>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const isPending = !userId || isLoading || applications === undefined

  const counts = useMemo(() => {
    return {
      all: applications.length,
      in_progress: applications.filter(
        (a) => a.status === "pendiente" || a.status === "entrevista" || a.status === "oferta"
      ).length,
      completed: applications.filter(
        (a) =>
          a.status === "contratado" || a.status === "rechazado" || a.status === "desistido"
      ).length,
    }
  }, [applications])

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesTab =
        activeTab === "all"
          ? true
          : activeTab === "in_progress"
            ? app.status === "pendiente" ||
              app.status === "entrevista" ||
              app.status === "oferta"
            : app.status === "contratado" ||
              app.status === "rechazado" ||
              app.status === "desistido"

      if (!matchesTab) return false

      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase().trim()
      const title = (app.job?.title ?? "").toLowerCase()
      return title.includes(q)
    })
  }, [applications, activeTab, searchQuery])

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
          <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            Mis Postulaciones
          </h1>
          <p className="text-muted-foreground text-sm">
            Sigue el estado y progreso de tus aplicaciones.
          </p>
        </div>
      </div>

      {error ? (
        <div className="flex flex-col items-center text-center gap-2.5 rounded-xl border border-destructive/40 bg-destructive/5 p-5 max-w-md mx-auto my-6 shadow-none">
          <p className="text-sm font-medium text-foreground">
            No se pudieron cargar tus postulaciones
          </p>
          <p className="text-xs text-muted-foreground">{error.message}</p>
          <Button
            variant="outline"
            size="sm"
            className="h-9 px-4 rounded-lg border-border/40 bg-surface-container-lowest hover:bg-surface-container-low text-xs font-medium text-foreground transition-colors shadow-none"
            onClick={() => refetch()}
          >
            Reintentar
          </Button>
        </div>
      ) : isPending ? (
        <div className="grid grid-cols-1 gap-3.5">
          {[0, 1, 2].map((n) => (
            <ApplicationSkeleton key={n} />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-surface-container-low border border-border/40 rounded-xl p-6 text-center max-w-md mx-auto my-6 shadow-none">
          <div className="size-10 rounded-full bg-surface-container-highest flex items-center justify-center mx-auto mb-3 text-muted-foreground">
            <HugeiconsIcon icon={File02Icon} size={20} />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">Aún no tienes postulaciones</p>
          <p className="text-xs text-muted-foreground mb-4">
            Busca empleos científicos y postula para ver el seguimiento aquí.
          </p>
          <Button
            size="sm"
            onClick={() => router.push("/dashboard/jobs")}
            className="h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-xs font-medium transition-colors shadow-none"
          >
            Buscar empleos
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Filter toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-1.5 bg-surface-container-low border border-border/40 rounded-xl shadow-none">
            {/* Status Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto">
              {(
                [
                  { id: "all", label: "Todas" },
                  { id: "in_progress", label: "En proceso" },
                  { id: "completed", label: "Finalizadas" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "h-9 px-3 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap",
                    activeTab === tab.id
                      ? "bg-surface-container-lowest text-foreground border border-border/50 shadow-none font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-surface-container-highest/50"
                  )}
                >
                  <span>{tab.label}</span>
                  <span className="text-[11px] font-mono tabular-nums text-muted-foreground px-1.5 py-0.5 rounded-full bg-surface-container-highest">
                    {counts[tab.id]}
                  </span>
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Input
                placeholder="Buscar por cargo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 bg-surface-container-lowest border-border/40 pl-8 pr-3 text-xs rounded-lg w-full text-foreground placeholder:text-muted-foreground focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
              />
              <HugeiconsIcon
                icon={Search01Icon}
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
            </div>
          </div>

          {/* List of Applications */}
          {filteredApplications.length === 0 ? (
            <div className="bg-surface-container-low border border-border/40 rounded-xl p-5 text-center max-w-md mx-auto my-6 shadow-none">
              <p className="text-xs font-medium text-foreground mb-1">
                Sin resultados para el filtro
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                No encontramos postulaciones que coincidan con la búsqueda actual.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setActiveTab("all")
                  setSearchQuery("")
                }}
                className="h-9 px-4 rounded-lg border-border/40 bg-surface-container-lowest hover:bg-surface-container-low text-xs font-medium text-foreground transition-colors shadow-none"
              >
                Restablecer filtros
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3.5">
              {filteredApplications.map((app) => (
                <ApplicationCard key={app.id} app={app} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ApplicationsContent
