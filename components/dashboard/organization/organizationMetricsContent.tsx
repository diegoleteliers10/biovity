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
import { useId, useState } from "react"

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

import { ConnectedNotificationBell } from "@/components/common/ConnectedNotificationBell"
import { MobileMenuButton } from "@/components/dashboard/shared/MobileMenuButton"
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
import { useOrganizationMetrics } from "@/lib/api/use-organization-dashboard"
import type { MetricsPeriod } from "@/lib/types/organization-metrics"
import { exportMetricsCsv } from "@/lib/utils/export-metrics-csv"
import { useDashboardSession } from "../DashboardSessionContext"
import { PipelineResumenCard } from "./PipelineResumenCard"

const statusLabels: Record<string, string> = {
  pendiente: "Pendiente",
  entrevista: "Entrevista",
  oferta: "Oferta",
  rechazado: "Rechazado",
  contratado: "Contratado",
}

const statusColors: Record<string, string> = {
  pendiente: "bg-secondary/10 text-secondary border-secondary/20",
  entrevista: "bg-primary/10 text-primary border-primary/20",
  oferta: "bg-accent/10 text-accent border-accent/20",
  rechazado: "bg-destructive/10 text-destructive border-destructive/20",
  contratado: "bg-green-500/10 text-green-600 border-green-500/20",
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <HugeiconsIcon
          icon={Icon}
          size={24}
          strokeWidth={1.5}
          className="size-4 text-muted-foreground"
        />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={`text-xs ${trendPositive ? "text-green-600" : "text-red-600"}`}>{trend}</p>
        )}
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </CardContent>
    </Card>
  )
}

export function OrganizationMetricsContent() {
  const session = useDashboardSession()
  const organizationId = session?.user?.organizationId ?? undefined

  const [period, setPeriod] = useState<MetricsPeriod>("month")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")

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
  const skeletonId = useId()

  const totalViews = metrics?.topJobs.reduce((sum, job) => sum + job.views, 0) ?? 0

  const chartData = metrics?.recentTrend.map((item) => ({
    date: new Date(item.date).toLocaleDateString("es-CL", { day: "numeric", month: "short" }),
    aplicaciones: item.applications,
    entrevistas: item.interviews,
  }))

  // F11.1 Funnel conversion rates
  const totalApps = metrics?.pipeline.totalApplications ?? 0
  const countPendiente = metrics?.pipeline.byStatus.pendiente ?? 0
  const countEntrevista = metrics?.pipeline.byStatus.entrevista ?? 0
  const countOferta = metrics?.pipeline.byStatus.oferta ?? 0
  const countContratado = metrics?.pipeline.byStatus.contratado ?? 0

  // Accumulate counts for funnel stages (since to get to hired you pass offer/interview)
  const reachedPendiente = totalApps
  const reachedEntrevista = countEntrevista + countOferta + countContratado
  const reachedOferta = countOferta + countContratado
  const reachedContratado = countContratado

  const ratePendiente = 100
  const rateEntrevista = totalApps > 0 ? Math.round((reachedEntrevista / totalApps) * 100) : 0
  const rateOferta = totalApps > 0 ? Math.round((reachedOferta / totalApps) * 100) : 0
  const rateContratado = totalApps > 0 ? Math.round((reachedContratado / totalApps) * 100) : 0

  const responseTimeData = metrics?.responseTimeDistribution
    ? [
        { bucket: "< 24h", count: metrics.responseTimeDistribution.lessThan24h },
        { bucket: "1-3d", count: metrics.responseTimeDistribution.oneToThreeDays },
        { bucket: "3-7d", count: metrics.responseTimeDistribution.threeToSevenDays },
        { bucket: "> 7d", count: metrics.responseTimeDistribution.moreThanSevenDays },
      ]
    : []
  const responseTimeTotal = responseTimeData.reduce((sum, item) => sum + item.count, 0)
  const hasResponseTimeData = responseTimeTotal > 0
  const unansweredCount = metrics?.unansweredCount ?? 0

  if (isError) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-between rounded-lg border border-destructive/50 bg-destructive/5 p-4">
          <p className="text-destructive text-sm">Error al cargar metricas. Intenta nuevamente.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
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
            <Button variant="outline" size="sm" onClick={() => exportMetricsCsv(metrics, period)}>
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
            <h1 className="text-2xl sm:text-[28px] font-semibold tracking-wide">Métricas</h1>
            <p className="text-muted-foreground text-sm">
              Analiza el rendimiento de tus ofertas y candidatos.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={period} onValueChange={(v) => setPeriod(v as MetricsPeriod)}>
              <SelectTrigger className="w-[140px]">
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
                  className="w-[130px] h-9 text-xs"
                />
                <span className="text-muted-foreground text-xs">a</span>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-[130px] h-9 text-xs"
                />
              </div>
            )}

            {metrics && (
              <Button variant="outline" size="sm" onClick={() => exportMetricsCsv(metrics, period)}>
                <HugeiconsIcon icon={Download01Icon} size={16} className="mr-1.5" />
                Exportar
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {isPending ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={`${skeletonId}-${i}`}>
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
              title="Promedio contratación"
              value={`${metrics?.avgHiringTimeDays ?? 0} días`}
              subtitle="desde postulación"
              icon={ClockIcon}
            />
          </>
        )}
      </div>

      {/* Middle row: conversion funnel & average stage durations */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Funnel Conversion */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Funnel de Conversión (Drop-off)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <div className="space-y-4 py-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <div className="space-y-5 py-2">
                {/* Stage 1: Pendiente */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-secondary" />
                      1. Postulados (Pendiente)
                    </span>
                    <span>
                      {reachedPendiente} ({ratePendiente}%)
                    </span>
                  </div>
                  <div className="w-full h-7 bg-muted/40 rounded-md overflow-hidden relative border border-border/40">
                    <div
                      className="h-full bg-secondary/20 transition-all duration-500 ease-out"
                      style={{ width: `${ratePendiente}%` }}
                    />
                    <span className="absolute inset-0 flex items-center pl-3 text-[11px] font-semibold text-secondary-foreground">
                      Base inicial
                    </span>
                  </div>
                </div>

                {/* Stage 2: Entrevista */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-primary" />
                      2. Entrevistados
                    </span>
                    <span>
                      {reachedEntrevista} ({rateEntrevista}%)
                    </span>
                  </div>
                  <div className="w-full h-7 bg-muted/40 rounded-md overflow-hidden relative border border-border/40">
                    <div
                      className="h-full bg-primary/20 transition-all duration-500 ease-out"
                      style={{ width: `${rateEntrevista}%` }}
                    />
                    <span className="absolute inset-0 flex items-center pl-3 text-[11px] font-semibold text-primary">
                      {rateEntrevista > 0
                        ? `${rateEntrevista}% pasan a entrevista`
                        : "Sin postulantes evaluados"}
                    </span>
                  </div>
                </div>

                {/* Stage 3: Oferta */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-accent" />
                      3. Ofertas Enviadas
                    </span>
                    <span>
                      {reachedOferta} ({rateOferta}%)
                    </span>
                  </div>
                  <div className="w-full h-7 bg-muted/40 rounded-md overflow-hidden relative border border-border/40">
                    <div
                      className="h-full bg-accent/20 transition-all duration-500 ease-out"
                      style={{ width: `${rateOferta}%` }}
                    />
                    <span className="absolute inset-0 flex items-center pl-3 text-[11px] font-semibold text-accent-foreground">
                      {rateOferta > 0 ? `${rateOferta}% alcanzan oferta` : "Sin ofertas enviadas"}
                    </span>
                  </div>
                </div>

                {/* Stage 4: Contratado */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-green-500" />
                      4. Contratados
                    </span>
                    <span>
                      {reachedContratado} ({rateContratado}%)
                    </span>
                  </div>
                  <div className="w-full h-7 bg-muted/40 rounded-md overflow-hidden relative border border-border/40">
                    <div
                      className="h-full bg-green-500/25 transition-all duration-500 ease-out"
                      style={{ width: `${rateContratado}%` }}
                    />
                    <span className="absolute inset-0 flex items-center pl-3 text-[11px] font-semibold text-green-700">
                      {rateContratado > 0
                        ? `Hiring Rate: ${rateContratado}%`
                        : "Sin contrataciones aún"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stage duration stats */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Tiempos Promedio en Etapa (Días)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <div className="space-y-4 py-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <div className="space-y-6 py-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary border border-primary/20">
                    <HugeiconsIcon icon={Calendar03Icon} size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-semibold">Hasta Entrevista</span>
                      <span className="text-base font-bold text-primary">
                        {metrics?.pipeline.avgTimeInStages?.entrevista ?? 0} días
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Días promedio transcurridos desde postulación hasta agendar entrevista.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 border-t border-border/50 pt-4">
                  <div className="flex items-center justify-center size-10 rounded-lg bg-accent/10 text-accent border border-accent/20">
                    <HugeiconsIcon icon={File02Icon} size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-semibold">Hasta Oferta</span>
                      <span className="text-base font-bold text-accent">
                        {metrics?.pipeline.avgTimeInStages?.oferta ?? 0} días
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Días promedio transcurridos desde postulación hasta formalizar oferta.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 border-t border-border/50 pt-4">
                  <div className="flex items-center justify-center size-10 rounded-lg bg-green-500/10 text-green-600 border border-green-500/20">
                    <HugeiconsIcon icon={ClockIcon} size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-semibold">Hasta Contratación</span>
                      <span className="text-base font-bold text-green-600">
                        {metrics?.pipeline.avgTimeInStages?.contratado ?? 0} días
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Días promedio desde postulación hasta marcar como contratado.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
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
                          className="h-full bg-primary"
                          style={{
                            width: `${metrics ? (count / Math.max(1, metrics.pipeline.totalApplications)) * 100 : 0}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8">{count}</span>
                    </div>
                  </div>
                ))}
                <div className="pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tasa de conversión</span>
                    <span className="font-medium">{metrics?.pipeline.conversionRate ?? 0}%</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
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
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="aplicaciones"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="entrevistas"
                    stroke="#10b981"
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
        <PipelineResumenCard />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top ofertas con más postulaciones</CardTitle>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={`${skeletonId}-topjob-${i}`}
                  className="flex items-center justify-between"
                >
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
                  className="flex items-center justify-between border-b pb-3 last:border-0"
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
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
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

      <Card>
        <CardHeader>
          <CardTitle>Distribución geográfica</CardTitle>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <Skeleton className="h-[200px] w-full" />
          ) : metrics?.geographicDistribution && metrics.geographicDistribution.length > 0 ? (
            <div className="space-y-3">
              {metrics.geographicDistribution.map((geo) => (
                <div key={geo.city} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{geo.city}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${geo.percentage}%` }} />
                    </div>
                    <span className="text-sm font-medium w-8">{geo.count}</span>
                    <span className="text-xs text-muted-foreground w-10">{geo.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No hay datos geogr&aacute;ficos disponibles.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
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
                  className="flex items-center gap-4 rounded-lg border border-border/60 p-4"
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
                      <p className="text-lg font-semibold text-foreground">
                        {rec.applicationsProcessed}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        Procesadas
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-foreground">
                        {rec.interviewsConducted}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        Entrevistas
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-foreground">
                        {rec.avgResponseTimeDays}d
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        Tiempo resp.
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No hay datos de productividad disponibles. Agrega miembros al equipo para ver
              m&eacute;tricas individuales.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tiempo de respuesta</CardTitle>
            <div className="flex items-center gap-2">
              {unansweredCount > 0 && (
                <Badge variant="outline" className="bg-muted/40 text-muted-foreground border-border/60">
                  {unansweredCount} sin responder
                </Badge>
              )}
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {metrics?.avgHiringTimeDays ?? 0} d&iacute;as promedio
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <Skeleton className="h-[180px] w-full" />
          ) : hasResponseTimeData ? (
            <div className="space-y-3">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={responseTimeData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                  <XAxis dataKey="bucket" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip
                    cursor={{ fill: "rgba(16, 185, 129, 0.08)" }}
                    formatter={(value: number) => [value.toLocaleString("es-CL"), "Postulaciones"]}
                  />
                  <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs text-muted-foreground">
                Distribuci&oacute;n de postulaciones seg&uacute;n el tiempo que tardaste en responder.
              </p>
            </div>
          ) : (
            <div className="flex h-[180px] flex-col items-center justify-center gap-1 text-center">
              <p className="text-sm font-medium">Sin datos de tiempo de respuesta</p>
              <p className="text-xs text-muted-foreground">
                Cuando respondas postulaciones, veremos aqu&iacute; la distribuci&oacute;n por rango de tiempo.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
