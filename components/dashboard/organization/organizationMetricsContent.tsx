"use client"

import {
  Calendar03Icon,
  ClockIcon,
  Download01Icon,
  File02Icon,
  FileAddIcon,
  UserIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRouter } from "next/navigation"
import { useId, useState } from "react"
import { chartTooltipStyles } from "@/components/ui/chart-tooltip-styles"

const [LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis] = await Promise.all([
  import("recharts").then((m) => m.LineChart),
  import("recharts").then((m) => m.Line),
  import("recharts").then((m) => m.ResponsiveContainer),
  import("recharts").then((m) => m.Tooltip),
  import("recharts").then((m) => m.XAxis),
  import("recharts").then((m) => m.YAxis),
])

const [BarChart, Bar] = await Promise.all([
  import("recharts").then((m) => m.BarChart),
  import("recharts").then((m) => m.Bar),
])

const sourceChannelLabels: Record<string, string> = {
  biovity: "Biovity",
  linkedin: "LinkedIn",
  laborum: "Laborum",
  other_job_board: "Otro portal de empleo",
  company_website: "Sitio web de la empresa",
  social_media: "Redes sociales",
  university: "Universidad o institución educativa",
  referral: "Recomendación",
  event: "Feria o evento",
  other: "Otro",
  unknown: "Desconocida",
}

import { ConnectedNotificationBell } from "@/components/common/ConnectedNotificationBell"
import { MobileMenuButton } from "@/components/dashboard/shared/MobileMenuButton"
import { dashboardRaisedCardClass } from "@/components/dashboard/shared/surface-classes"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  useOrganizationMetrics,
  useResponseTimeVisits,
  useSourceApplications,
  useStageDurationVisits,
} from "@/lib/api/use-organization-dashboard"
import type { MetricsPeriod, ResponseTimeBucket } from "@/lib/types/organization-metrics"
import { formatDateChilean } from "@/lib/utils"
import { exportMetricsCsv } from "@/lib/utils/export-metrics-csv"
import { useDashboardSession } from "../DashboardSessionContext"
import { ConversionFunnelCard } from "./ConversionFunnelCard"
import { CustomStageConversionsCard } from "./CustomStageConversionsCard"
import { GeographicDistributionCard } from "./GeographicDistributionCard"

const statusLabels: Record<string, string> = {
  pendiente: "Pendiente",
  entrevista: "Entrevista",
  oferta: "Oferta",
  rechazado: "Rechazado",
  contratado: "Contratado",
}

const statusColors: Record<string, string> = {
  pendiente:
    "bg-secondary/10 text-secondary border-secondary/20 dark:bg-info/15 dark:text-info dark:border-info/30",
  entrevista:
    "bg-primary/10 text-primary border-primary/20 dark:bg-secondary-container dark:text-on-secondary-container dark:border-secondary-soft/35",
  oferta: "bg-warning/10 text-warning border-warning/20",
  rechazado: "bg-destructive/10 text-destructive border-destructive/20",
  contratado:
    "bg-secondary/10 text-secondary border-secondary/20 dark:bg-secondary dark:text-secondary-foreground dark:border-secondary",
}

type KpiCardProps = {
  title: string
  value: string | number
  subtitle?: string
  trend?: string
  trendPositive?: boolean
  icon: import("@hugeicons/react").IconSvgElement
}

function KpiCard({ title, value, subtitle, trend, trendPositive, icon: Icon }: KpiCardProps) {
  return (
    <Card className={`${dashboardRaisedCardClass} gap-0`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>{title}</CardTitle>
        <HugeiconsIcon icon={Icon} size={16} strokeWidth={1.5} className="text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground tracking-tight tabular-nums">
          {value}
        </div>
        {trend && (
          <p
            className={`text-xs leading-4 ${trendPositive ? "text-secondary" : "text-destructive"}`}
          >
            {trend}
          </p>
        )}
        {subtitle && <p className="text-xs leading-4 text-muted-foreground">{subtitle}</p>}
      </CardContent>
    </Card>
  )
}

export function OrganizationMetricsContent() {
  const router = useRouter()
  const session = useDashboardSession()
  const organizationId = session?.user?.organizationId ?? undefined

  const [period, setPeriod] = useState<MetricsPeriod>("month")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [selectedStageKey, setSelectedStageKey] = useState<string>()
  const [visitsPage, setVisitsPage] = useState(1)
  const [responseBucket, setResponseBucket] = useState<ResponseTimeBucket>()
  const [responsePage, setResponsePage] = useState(1)
  const [selectedSourceKey, setSelectedSourceKey] = useState<string>()
  const [sourcePage, setSourcePage] = useState(1)

  const {
    data: metrics,
    isPending,
    isError,
    refetch,
  } = useOrganizationMetrics(
    organizationId,
    period,
    period === "custom" ? startDate || undefined : undefined,
    period === "custom" ? endDate || undefined : undefined
  )
  const _skeletonId = useId()
  const selectedStage = metrics?.pipeline.stageDurations.find(
    (stage) => `${stage.jobId}-${stage.stageId}` === selectedStageKey
  )
  const stageVisitsQuery = useStageDurationVisits(
    organizationId,
    selectedStage?.jobId,
    selectedStage?.stageId,
    period === "custom" ? startDate || undefined : undefined,
    period === "custom" ? endDate || undefined : undefined,
    visitsPage
  )
  const stageVisits = stageVisitsQuery.data?.isOk() ? stageVisitsQuery.data.value : undefined
  const responseVisitsQuery = useResponseTimeVisits(
    organizationId,
    responseBucket,
    period,
    period === "custom" ? startDate || undefined : undefined,
    period === "custom" ? endDate || undefined : undefined,
    responsePage
  )
  const selectedSource = metrics?.sourceAttribution?.find(
    (source) => `${source.sourceChannel}:${source.sourceMethod}` === selectedSourceKey
  )
  const sourceApplicationsQuery = useSourceApplications(
    organizationId,
    selectedSource?.sourceChannel,
    selectedSource?.sourceMethod,
    period,
    period === "custom" ? startDate || undefined : undefined,
    period === "custom" ? endDate || undefined : undefined,
    sourcePage
  )
  const sourceApplications = sourceApplicationsQuery.data?.isOk()
    ? sourceApplicationsQuery.data.value
    : undefined
  const responseVisits = responseVisitsQuery.data?.isOk()
    ? responseVisitsQuery.data.value
    : undefined

  const totalViews = metrics?.topJobs.reduce((sum, job) => sum + job.views, 0) ?? 0

  const chartData = metrics?.recentTrend.map((item) => ({
    date: new Date(item.date).toLocaleDateString("es-CL", {
      day: "numeric",
      month: "short",
    }),
    aplicaciones: item.applications,
    entrevistas: item.interviews,
  }))

  // F11.1 Funnel conversion rates
  const totalApps = metrics?.pipeline.totalApplications ?? 0
  const reachedPendiente = totalApps
  const reachedEntrevista = metrics?.pipeline.reachedCounts.entrevista ?? 0
  const reachedOferta = metrics?.pipeline.reachedCounts.oferta ?? 0
  const reachedContratado = metrics?.pipeline.reachedCounts.contratado ?? 0

  const ratePendiente = 100
  const rateEntrevista = totalApps > 0 ? Math.round((reachedEntrevista / totalApps) * 100) : 0
  const rateOferta = totalApps > 0 ? Math.round((reachedOferta / totalApps) * 100) : 0
  const rateContratado = totalApps > 0 ? Math.round((reachedContratado / totalApps) * 100) : 0

  const responseTimeData = metrics?.responseTimeDistribution
    ? [
        {
          key: "lessThan24h" as const,
          bucket: "< 24h",
          count: metrics.responseTimeDistribution.lessThan24h,
        },
        {
          key: "oneToThreeDays" as const,
          bucket: "1-3d",
          count: metrics.responseTimeDistribution.oneToThreeDays,
        },
        {
          key: "threeToSevenDays" as const,
          bucket: "3-7d",
          count: metrics.responseTimeDistribution.threeToSevenDays,
        },
        {
          key: "moreThanSevenDays" as const,
          bucket: "> 7d",
          count: metrics.responseTimeDistribution.moreThanSevenDays,
        },
      ]
    : []
  const unansweredCount = metrics?.unansweredCount ?? 0

  if (isError) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-between rounded-lg border border-destructive/50 bg-destructive/5 p-4">
          <p className="text-destructive text-sm">Error al cargar metricas. Intenta nuevamente.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="h-9 px-4">
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Top row: menu + notification on mobile */}
      <div className="flex items-center justify-between lg:hidden">
        <MobileMenuButton />
        <div className="flex items-center gap-2">
          {metrics && (
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-9"
              onClick={() => exportMetricsCsv(metrics, period)}
              aria-label="Exportar métricas"
            >
              <HugeiconsIcon icon={Download01Icon} size={16} />
            </Button>
          )}
          <ConnectedNotificationBell showAgentTrigger />
        </div>
      </div>

      <div className="space-y-1">
        <div className="hidden lg:flex justify-end">
          <ConnectedNotificationBell showAgentTrigger />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Métricas
            </h1>
            <p className="text-muted-foreground text-sm">
              Analiza el rendimiento de tus ofertas y candidatos.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={period} onValueChange={(v) => setPeriod(v as MetricsPeriod)}>
              <SelectTrigger className="h-9 w-[140px] bg-surface-container-low border-border/40 text-sm rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Esta semana</SelectItem>
                <SelectItem value="month">Este mes</SelectItem>
                <SelectItem value="year">Este año</SelectItem>
                <SelectItem value="custom">Rango Personalizado</SelectItem>
              </SelectContent>
            </Select>

            {period === "custom" && (
              <div className="flex items-center gap-1.5">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-[130px] h-9 bg-surface-container-low border-border/40 text-sm rounded-lg"
                />
                <span className="text-muted-foreground text-xs">a</span>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-[130px] h-9 bg-surface-container-low border-border/40 text-sm rounded-lg"
                />
              </div>
            )}

            {metrics && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportMetricsCsv(metrics, period)}
                className="h-9 rounded-md px-3 text-xs font-medium text-muted-foreground hover:text-foreground gap-2"
              >
                <HugeiconsIcon icon={Download01Icon} size={16} />
                Exportar
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {isPending ? (
          ["kpi-1", "kpi-2", "kpi-3", "kpi-4", "kpi-5"].map((id) => (
            <Card key={id} className={dashboardRaisedCardClass}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <KpiCard
              title="Ofertas activas"
              value={metrics?.dashboard.activeJobs ?? 0}
              subtitle={
                period === "week"
                  ? "esta semana"
                  : period === "year"
                    ? "este año"
                    : period === "custom"
                      ? "en rango"
                      : "este mes"
              }
              icon={FileAddIcon}
            />
            <KpiCard
              title="Aplicaciones recibidas"
              value={metrics?.pipeline.totalApplications ?? 0}
              subtitle={
                period === "week"
                  ? "esta semana"
                  : period === "year"
                    ? "este año"
                    : period === "custom"
                      ? "en rango"
                      : "este mes"
              }
              icon={File02Icon}
              trend={`${(metrics?.dashboard.applicationsTrend ?? 0) > 0 ? "+" : ""}${metrics?.dashboard.applicationsTrend ?? 0}%`}
              trendPositive={(metrics?.dashboard.applicationsTrend ?? 0) >= 0}
            />
            <KpiCard
              title="Entrevistas"
              value={metrics?.dashboard.interviewsThisPeriod ?? 0}
              subtitle={
                period === "week"
                  ? "esta semana"
                  : period === "year"
                    ? "este año"
                    : period === "custom"
                      ? "en rango"
                      : "este mes"
              }
              icon={Calendar03Icon}
              trend={`${(metrics?.dashboard.interviewsTrend ?? 0) > 0 ? "+" : ""}${metrics?.dashboard.interviewsTrend ?? 0}%`}
              trendPositive={(metrics?.dashboard.interviewsTrend ?? 0) >= 0}
            />
            <KpiCard
              title="Vistas de ofertas"
              value={totalViews}
              subtitle={
                period === "week"
                  ? "esta semana"
                  : period === "year"
                    ? "este año"
                    : period === "custom"
                      ? "en rango"
                      : "este mes"
              }
              icon={ViewIcon}
            />
            <KpiCard
              title="Tiempo hasta contratación"
              value={`${metrics?.avgHiringTimeDays ?? 0} días`}
              subtitle="desde postulación"
              icon={ClockIcon}
            />
          </>
        )}
      </div>

      {/* Middle row: conversion funnel & average stage durations */}

      <CustomStageConversionsCard
        organizationId={organizationId}
        period={period}
        startDate={period === "custom" ? startDate || undefined : undefined}
        endDate={period === "custom" ? endDate || undefined : undefined}
        stages={metrics?.pipeline.customStageConversions ?? []}
        isPending={isPending}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Funnel Conversion */}
        <ConversionFunnelCard
          isPending={isPending}
          totalApps={totalApps}
          reachedPendiente={reachedPendiente}
          reachedEntrevista={reachedEntrevista}
          reachedOferta={reachedOferta}
          reachedContratado={reachedContratado}
          ratePendiente={ratePendiente}
          rateEntrevista={rateEntrevista}
          rateOferta={rateOferta}
          rateContratado={rateContratado}
        />

        {/* Stage duration stats */}
        <Card className={dashboardRaisedCardClass}>
          <CardHeader>
            <CardTitle>Tiempo promedio por etapa</CardTitle>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <div className="space-y-4 py-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : metrics?.pipeline.stageDurations?.length ? (
              <div className="max-h-80 space-y-3 overflow-y-auto py-2">
                {metrics.pipeline.stageDurations?.map((stage) => (
                  <button
                    type="button"
                    key={`${stage.jobId}-${stage.stageId}-${stage.stageName}`}
                    onClick={() => {
                      const key = `${stage.jobId}-${stage.stageId}`
                      setSelectedStageKey((selected) => (selected === key ? undefined : key))
                      setVisitsPage(1)
                    }}
                    aria-expanded={selectedStageKey === `${stage.jobId}-${stage.stageId}`}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 border-b border-border/50 pb-3 text-left last:border-0 hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring/50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{stage.stageName}</p>
                      <p className="truncate text-xs text-muted-foreground">{stage.jobTitle}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold">{stage.averageCompletedDays} días</p>
                      <p className="text-xs text-muted-foreground">
                        {stage.completedVisitCount} visitas cerradas
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No hay visitas cerradas en el período.
              </p>
            )}
            {selectedStage && (
              <div className="mt-3 border-t border-border/50 pt-3" aria-live="polite">
                <p className="text-xs leading-4 font-medium">
                  Postulaciones de {selectedStage.stageName}
                </p>
                {stageVisitsQuery.isPending ? (
                  <Skeleton className="mt-3 h-12 w-full" />
                ) : stageVisitsQuery.data?.isErr() ? (
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <p className="text-xs text-destructive">No se pudieron cargar las visitas.</p>
                    <Button size="sm" variant="outline" onClick={() => stageVisitsQuery.refetch()}>
                      Reintentar
                    </Button>
                  </div>
                ) : stageVisits?.rows.length ? (
                  <div className="mt-2 space-y-2">
                    {stageVisits.rows.map((visit) => (
                      <div
                        key={visit.visitId}
                        className="flex items-center justify-between gap-3 border-b border-border/40 pb-2 text-xs last:border-0"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-medium">{visit.applicantName}</p>
                          <p className="truncate text-muted-foreground">
                            Postulación {visit.applicationId.slice(0, 8)}
                          </p>
                          <p className="text-muted-foreground">
                            {new Date(visit.enteredAt).toLocaleString("es-CL", {
                              timeZone: "America/Santiago",
                              dateStyle: "short",
                              timeStyle: "short",
                            })}
                            {" a "}
                            {new Date(visit.exitedAt).toLocaleString("es-CL", {
                              timeZone: "America/Santiago",
                              dateStyle: "short",
                              timeStyle: "short",
                            })}
                          </p>
                        </div>
                        <span className="shrink-0 tabular-nums">
                          {visit.durationDays.toFixed(1)} días
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-muted-foreground">
                        Página {stageVisits.page} de{" "}
                        {Math.max(1, Math.ceil(stageVisits.total / stageVisits.pageSize))}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={visitsPage <= 1}
                          onClick={() => setVisitsPage((page) => page - 1)}
                        >
                          Anterior
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={visitsPage * stageVisits.pageSize >= stageVisits.total}
                          onClick={() => setVisitsPage((page) => page + 1)}
                        >
                          Siguiente
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-muted-foreground">
                    No hay visitas en este rango.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className={dashboardRaisedCardClass}>
          <CardHeader>
            <CardTitle>Distribución de candidatos</CardTitle>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <div className="space-y-3">
                {Object.entries(metrics?.pipeline.byStatus ?? {}).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={statusColors[status]}>
                        {statusLabels[status] ?? status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary dark:bg-secondary-soft"
                          style={{
                            width: `${metrics ? (count / Math.max(1, metrics.pipeline.totalApplications)) * 100 : 0}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className={dashboardRaisedCardClass}>
          <CardHeader>
            <CardTitle>Tendencia de postulaciones</CardTitle>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <Skeleton className="h-[200px] w-full" />
            ) : chartData && chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip {...chartTooltipStyles} />
                  <Line
                    type="monotone"
                    dataKey="aplicaciones"
                    stroke="var(--accent)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="entrevistas"
                    stroke="var(--secondary)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                Sin datos disponibles
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className={dashboardRaisedCardClass}>
          <CardHeader>
            <CardTitle>Top ofertas con más postulaciones</CardTitle>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <div className="space-y-3">
                {["topjob-1", "topjob-2", "topjob-3"].map((id) => (
                  <div key={id} className="flex items-center justify-between">
                    <Skeleton className="size-48" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            ) : metrics?.topJobs && metrics.topJobs.length > 0 ? (
              <div className="space-y-3">
                {metrics.topJobs.map((job) => (
                  <div
                    key={job.jobId}
                    className="flex items-center justify-between border-b border-border/30 pb-3 last:border-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{job.jobTitle}</p>
                      <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <HugeiconsIcon icon={ViewIcon} size={12} /> {job.views} vistas
                        </span>
                        <span>{job.applications} postulaciones</span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-secondary/10 text-secondary border-secondary/20"
                    >
                      {job.applicationRate}% conversión
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No hay ofertas con postulaciones.</p>
            )}
          </CardContent>
        </Card>

        <GeographicDistributionCard
          isPending={isPending}
          geographicDistribution={metrics?.geographicDistribution}
        />
      </div>

      <Card className={dashboardRaisedCardClass}>
        <CardHeader>
          <CardTitle>Productividad del Reclutador</CardTitle>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <Skeleton className="h-[150px] w-full" />
          ) : metrics?.recruiterProductivity && metrics.recruiterProductivity.length > 0 ? (
            <div className="space-y-4">
              {metrics.recruiterProductivity.map((rec) => (
                <div
                  key={rec.userId}
                  className="flex items-center gap-4 rounded-lg border border-border/40 p-4"
                >
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <HugeiconsIcon icon={UserIcon} size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{rec.userName}</p>
                    <p className="text-xs text-muted-foreground">{rec.userEmail}</p>
                  </div>
                  <div className="flex gap-6">
                    <div className="text-center">
                      <p className="text-lg leading-6 font-semibold tracking-[-0.1px] text-foreground">
                        {rec.applicationsProcessed}
                      </p>
                      <p className="text-xs leading-4 text-muted-foreground">Procesadas</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg leading-6 font-semibold tracking-[-0.1px] text-foreground">
                        {rec.interviewsConducted}
                      </p>
                      <p className="text-xs leading-4 text-muted-foreground">Entrevistas</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg leading-6 font-semibold tracking-[-0.1px] text-foreground">
                        {rec.avgResponseTimeDays}d
                      </p>
                      <p className="text-xs leading-4 text-muted-foreground">Tiempo resp.</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No hay datos de productividad disponibles. Agrega miembros al equipo para ver métricas
              individuales.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className={dashboardRaisedCardClass}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tiempo de respuesta</CardTitle>
            <div className="flex items-center gap-2">
              {unansweredCount > 0 && (
                <Badge
                  variant="outline"
                  className="bg-surface-container-highest text-muted-foreground"
                >
                  {unansweredCount} sin responder
                </Badge>
              )}
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {metrics?.avgHiringTimeDays ?? 0} días promedio
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <Skeleton className="h-[180px] w-full" />
          ) : responseTimeData.length > 0 ? (
            <div className="space-y-3">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={responseTimeData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                  <XAxis dataKey="bucket" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip
                    {...chartTooltipStyles}
                    cursor={{ fill: "var(--muted)" }}
                    formatter={(value) => [Number(value ?? 0).toLocaleString("es-CL"), "Postulaciones"]}
                  />
                  <Bar dataKey="count" fill="var(--secondary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs text-muted-foreground">
                Selecciona un grupo para abrir sus postulaciones.
              </p>
              <div className="flex flex-wrap gap-2">
                {responseTimeData.map((item) => {
                  const selectedBucket = item.key
                  return (
                    <Button
                      key={selectedBucket}
                      size="sm"
                      variant={responseBucket === selectedBucket ? "default" : "outline"}
                      onClick={() => {
                        setResponseBucket((selected) =>
                          selected === selectedBucket ? undefined : selectedBucket
                        )
                        setResponsePage(1)
                      }}
                      aria-expanded={responseBucket === selectedBucket}
                    >
                      {item.bucket} · {item.count}
                    </Button>
                  )
                })}
                <Button
                  size="sm"
                  variant={responseBucket === "unanswered" ? "default" : "outline"}
                  onClick={() => {
                    setResponseBucket((selected) =>
                      selected === "unanswered" ? undefined : "unanswered"
                    )
                    setResponsePage(1)
                  }}
                  aria-expanded={responseBucket === "unanswered"}
                >
                  Sin responder · {unansweredCount}
                </Button>
              </div>
              {responseBucket && (
                <div className="space-y-3 rounded-lg border border-border/50 p-3">
                  {period === "custom" && (!startDate || !endDate) ? (
                    <p className="text-sm text-muted-foreground">
                      Selecciona las dos fechas para revisar este grupo.
                    </p>
                  ) : responseVisitsQuery.isPending ? (
                    <Skeleton className="h-16 w-full" />
                  ) : responseVisitsQuery.isError || responseVisitsQuery.data?.isErr() ? (
                    <p className="text-sm text-destructive">
                      No se pudieron cargar las postulaciones.
                    </p>
                  ) : responseVisits && responseVisits.rows.length > 0 ? (
                    <>
                      {responseVisits.rows.map((visit) => (
                        <button
                          key={visit.applicationId}
                          type="button"
                          onClick={() =>
                            router.push(
                              `/dashboard/offers/${visit.jobId}/applications/${visit.applicationId}`
                            )
                          }
                          className="flex w-full items-center justify-between gap-3 border-b border-border/40 pb-3 text-left last:border-0 hover:bg-muted/40"
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-medium">
                              {visit.applicantName}
                            </span>
                            <span className="block truncate text-xs text-muted-foreground">
                              {visit.jobTitle} ·{" "}
                              {statusLabels[visit.currentStatus] ?? visit.currentStatus}
                            </span>
                            <span className="block truncate text-xs text-muted-foreground">
                              Postuló{" "}
                              {new Date(visit.submittedAt).toLocaleString("es-CL", {
                                timeZone: "America/Santiago",
                                dateStyle: "short",
                                timeStyle: "short",
                              })}
                              {visit.respondedAt &&
                                ` · Respondida ${new Date(visit.respondedAt).toLocaleString(
                                  "es-CL",
                                  {
                                    timeZone: "America/Santiago",
                                    dateStyle: "short",
                                    timeStyle: "short",
                                  }
                                )}`}
                            </span>
                          </span>
                          <span className="shrink-0 text-right text-xs text-muted-foreground">
                            {visit.responseDays === null
                              ? "Pendiente"
                              : `${visit.responseDays.toFixed(1)} días`}
                          </span>
                        </button>
                      ))}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          Página {responseVisits.page} de{" "}
                          {Math.max(1, Math.ceil(responseVisits.total / responseVisits.pageSize))}
                        </span>
                        <span className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={responsePage <= 1}
                            onClick={() => setResponsePage((page) => page - 1)}
                          >
                            Anterior
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={
                              responsePage * responseVisits.pageSize >= responseVisits.total
                            }
                            onClick={() => setResponsePage((page) => page + 1)}
                          >
                            Siguiente
                          </Button>
                        </span>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No hay postulaciones en este grupo.
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex min-h-[180px] flex-col items-center justify-center gap-3 text-center">
              <p className="text-sm font-medium">Sin datos de tiempo de respuesta</p>
              {responseTimeData.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2">
                  {responseTimeData.map((item) => {
                    const selectedBucket = item.key
                    return (
                      <Button
                        key={selectedBucket}
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setResponseBucket(selectedBucket)
                          setResponsePage(1)
                        }}
                      >
                        {item.bucket} · {item.count}
                      </Button>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className={dashboardRaisedCardClass}>
        <CardHeader>
          <CardTitle>Fuentes de postulación</CardTitle>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <Skeleton className="h-32 w-full" />
          ) : isError ? (
            <p className="text-sm text-destructive">No se pudieron cargar las fuentes.</p>
          ) : (metrics?.sourceAttribution?.length ?? 0) === 0 ? (
            <p className="text-sm text-muted-foreground">Sin postulaciones en este período.</p>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-[minmax(0,1fr)_repeat(3,5rem)] gap-2 border-b border-border/40 pb-2 text-xs font-medium text-muted-foreground">
                <span>Fuente</span>
                <span className="text-right">Postulaciones</span>
                <span className="text-right">Llegan a entrevista</span>
                <span className="text-right">Contratos</span>
              </div>
              {metrics?.sourceAttribution?.map((source) => {
                const sourceKey = `${source.sourceChannel}:${source.sourceMethod}`
                return (
                  <button
                    type="button"
                    key={sourceKey}
                    aria-expanded={selectedSourceKey === sourceKey}
                    onClick={() => {
                      setSelectedSourceKey(sourceKey)
                      setSourcePage(1)
                    }}
                    className="grid w-full grid-cols-[minmax(0,1fr)_repeat(3,5rem)] gap-2 rounded-md py-1 text-left text-sm hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring/50"
                  >
                    <span className="truncate">
                      {sourceChannelLabels[source.sourceChannel] ?? source.sourceChannel}
                      {source.sourceMethod === "unknown"
                        ? " · sin dato confirmado"
                        : source.sourceMethod === "tracked_link"
                          ? " · enlace registrado"
                          : " · declarado"}
                    </span>
                    <span className="text-right tabular-nums">{source.applications}</span>
                    <span className="text-right tabular-nums">{source.reachedInterview}</span>
                    <span className="text-right tabular-nums">{source.hired}</span>
                  </button>
                )
              })}
            </div>
          )}
          {selectedSource && (
            <div className="mt-3 border-t border-border/50 pt-3" aria-live="polite">
              <p className="text-xs leading-4 font-medium">
                Postulaciones · {sourceChannelLabels[selectedSource.sourceChannel]}
              </p>
              {sourceApplicationsQuery.isPending ? (
                <Skeleton className="mt-3 h-12 w-full" />
              ) : sourceApplicationsQuery.data?.isErr() ? (
                <div className="mt-2 flex items-center justify-between gap-2">
                  <p className="text-xs text-destructive">
                    No se pudieron cargar las postulaciones.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => sourceApplicationsQuery.refetch()}
                  >
                    Reintentar
                  </Button>
                </div>
              ) : sourceApplications?.rows.length ? (
                <div className="mt-2 space-y-2">
                  {sourceApplications.rows.map((application) => (
                    <button
                      type="button"
                      key={application.applicationId}
                      onClick={() =>
                        router.push(
                          `/dashboard/offers/${application.jobId}/applications/${application.applicationId}`
                        )
                      }
                      className="flex w-full items-center justify-between gap-3 rounded-md border border-border/40 p-2 text-left hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring/50"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">
                          {application.candidateName}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {application.jobTitle}
                        </span>
                      </span>
                      <span className="shrink-0 text-right text-xs text-muted-foreground">
                        {statusLabels[application.status] ?? application.status}
                        <span className="block">
                          {formatDateChilean(application.appliedAt, "d MMM yyyy")}
                        </span>
                      </span>
                    </button>
                  ))}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      Página {sourceApplications.page} de{" "}
                      {Math.max(
                        1,
                        Math.ceil(sourceApplications.total / sourceApplications.pageSize)
                      )}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={sourceApplications.page <= 1}
                        onClick={() => setSourcePage((page) => Math.max(1, page - 1))}
                      >
                        Anterior
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={
                          sourceApplications.page * sourceApplications.pageSize >=
                          sourceApplications.total
                        }
                        onClick={() => setSourcePage((page) => page + 1)}
                      >
                        Siguiente
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="mt-2 text-xs text-muted-foreground">
                  No hay postulaciones de esta fuente en el período.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
