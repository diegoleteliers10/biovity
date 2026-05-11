"use client"

import {
  Calendar03Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  File02Icon,
  Pulse01Icon,
  User02Icon,
} from "@hugeicons/core-free-icons"
import dynamic from "next/dynamic"
import { useState } from "react"
import { NotificationBell } from "@/components/common/NotificationBell"
import { MobileMenuButton } from "@/components/dashboard/shared/MobileMenuButton"
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
import { authClient } from "@/lib/auth-client"
import type { Metric } from "@/lib/types/dashboard"
import type { MetricsPeriod } from "@/lib/types/organization-metrics"
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

  const { useSession } = authClient
  const { data: session, isPending: sessionPending } = useSession()
  const userId = session?.user?.id

  const { data: metrics, isPending: metricsPending } = useUserMetrics(userId, period)

  const firstName = session?.user?.name?.split(" ")[0] || "Usuario"

  const kpis = metrics?.kpis

  const kpiCards: Metric[] =
    metricsPending || !kpis
      ? []
      : [
          {
            title: "Postulaciones",
            value: kpis.applicationsLast30Days,
            subtitle:
              period === "week"
                ? "esta semana"
                : period === "year"
                  ? "este año"
                  : "últimos 30 días",
            icon: File02Icon,
          },
          {
            title: "Tasa de respuesta",
            value: `${kpis.responseRate}%`,
            subtitle: "Sobre total de postulaciones",
            icon: Pulse01Icon,
          },
          {
            title: "Entrevistas",
            value: kpis.interviews,
            subtitle: "Agendadas / realizadas",
            icon: Calendar03Icon,
          },
          {
            title: "Ofertas recibidas",
            value: kpis.offers,
            subtitle: "Periodo actual",
            icon: CheckmarkCircle02Icon,
          },
          {
            title: "Tiempo medio de respuesta",
            value: `${kpis.avgResponseTimeDays} días`,
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
          <NotificationBell notifications={[]} />
        </div>
        <div className="flex items-end justify-between gap-4">
          {sessionPending ? (
            <div className="space-y-2">
              <Skeleton className="h-9 w-full max-w-[280px] sm:max-w-[320px]" />
              <Skeleton className="h-5 w-full max-w-[320px] sm:max-w-[384px]" />
            </div>
          ) : (
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-[28px] font-semibold tracking-wide">Métricas</h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Seguimiento de postulaciones, embudo de contratación y rendimiento reciente.
              </p>
            </div>
          )}
          <div className="hidden lg:block">
            <Select value={period} onValueChange={(v) => setPeriod(v as MetricsPeriod)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Esta semana</SelectItem>
                <SelectItem value="month">Este mes</SelectItem>
                <SelectItem value="year">Este año</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metricsPending
          ? [0, 1, 2, 3, 4, 5].map((n) => <KpiSkeletonCard key={n} />)
          : kpiCards.map((metric) => <MetricCard key={metric.title} metric={metric} />)}
      </div>

      <ChartsGrid metricsData={metrics} period={period} />
    </div>
  )
}
