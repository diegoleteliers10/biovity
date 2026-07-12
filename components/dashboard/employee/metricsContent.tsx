"use client"

import {
  Calendar03Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Download04Icon,
  File02Icon,
  Pulse01Icon,
  User02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import dynamic from "next/dynamic"
import { useState } from "react"
import { ConnectedNotificationBell } from "@/components/common/ConnectedNotificationBell"
import { useDashboardSession } from "@/components/dashboard/DashboardSessionContext"
import { MobileMenuButton } from "@/components/dashboard/shared/MobileMenuButton"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useUserMetrics } from "@/lib/api/use-user-metrics"
import type { Metric } from "@/lib/types/dashboard"
import type { MetricsPeriod } from "@/lib/types/organization-metrics"
import { exportUserMetricsCsv } from "@/lib/utils/export-metrics-csv"
import { MetricCard } from "./home/metricCard"

const ChartsGrid = dynamic(() => import("./metrics/MetricsCharts").then((mod) => mod.ChartsGrid), {
  ssr: false,
  loading: () => (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="border border-border/80 bg-white rounded-lg lg:col-span-2 h-[300px] animate-pulse" />
      <div className="border border-border/80 bg-white rounded-lg h-[300px] animate-pulse" />
    </div>
  ),
})

const PERIOD_LABEL: Record<MetricsPeriod, string> = {
  week: "Esta semana",
  month: "Este mes",
  year: "Este año",
  custom: "Personalizado",
}

function KpiSkeletonCard() {
  return (
    <Card className="border border-border/80 bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="size-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16 mb-1" />
        <Skeleton className="h-3 w-20" />
      </CardContent>
    </Card>
  )
}

export const MetricsContent = () => {
  const [period, setPeriod] = useState<MetricsPeriod>("month")

  const session = useDashboardSession()
  const userId = session?.user?.id ?? undefined

  const { data: metrics, isPending: metricsPending } = useUserMetrics(userId, period)

  const firstName = session?.user?.name?.split(" ")[0] || "Usuario"
  const kpis = metrics?.kpis
  const responseRate = metrics?.quickMetrics.responseRate

  const periodSubtitle =
    period === "week" ? "esta semana" : period === "year" ? "este año" : "últimos 30 días"

  const kpiCards: Metric[] =
    metricsPending || !kpis || responseRate === undefined
      ? []
      : [
          {
            title: "Postulaciones",
            value: kpis.applicationsLast30Days,
            subtitle: periodSubtitle,
            icon: File02Icon,
          },
          {
            title: "Tasa de respuesta",
            value: `${responseRate}%`,
            subtitle: "Sobre total de postulaciones",
            icon: Pulse01Icon,
          },
          {
            title: "Entrevistas",
            value: kpis.interviews,
            subtitle: "Alcanzadas (acumulado)",
            icon: Calendar03Icon,
          },
          {
            title: "Ofertas recibidas",
            value: kpis.offers,
            subtitle: "Alcanzadas (acumulado)",
            icon: CheckmarkCircle02Icon,
          },
          {
            title: "Tiempo medio de respuesta",
            value:
              kpis.avgResponseTimeDays === null ? "Sin datos" : `${kpis.avgResponseTimeDays} días`,
            subtitle: "Desde postulación",
            icon: Clock01Icon,
          },
          {
            title: "Vistas de perfil",
            value: kpis.profileViews,
            subtitle: "Reclutadores únicos",
            icon: User02Icon,
          },
        ]

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between lg:hidden">
        <MobileMenuButton />
      </div>

      <div className="space-y-1">
        <div className="hidden lg:flex justify-end">
          <ConnectedNotificationBell />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-[28px] font-semibold tracking-wide">
              Hola, {firstName}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Seguimiento de postulaciones, embudo de contratación y rendimiento reciente.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={(v) => setPeriod(v as MetricsPeriod)}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">{PERIOD_LABEL.week}</SelectItem>
                <SelectItem value="month">{PERIOD_LABEL.month}</SelectItem>
                <SelectItem value="year">{PERIOD_LABEL.year}</SelectItem>
              </SelectContent>
            </Select>
            {metrics && (
              <Button
                variant="outline"
                size="icon"
                aria-label="Exportar metricas a CSV"
                onClick={() => exportUserMetricsCsv(metrics, period)}
              >
                <HugeiconsIcon icon={Download04Icon} size={18} />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metricsPending
          ? [0, 1, 2, 3, 4, 5].map((n) => <KpiSkeletonCard key={n} />)
          : kpiCards.map((metric) => <MetricCard key={metric.title} metric={metric} />)}
      </div>

      <ChartsGrid metricsData={metrics} period={period} />
    </div>
  )
}
