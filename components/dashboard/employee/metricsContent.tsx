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
import { useCallback, useState } from "react"
import { NotificationBell } from "@/components/common/NotificationBell"
import { MobileMenuButton } from "@/components/dashboard/shared/MobileMenuButton"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { authClient } from "@/lib/auth-client"
import type { Metric } from "@/lib/types/dashboard"
import { MetricCard } from "./home/metricCard"

type TimeRange = "3m" | "6m" | "12m"

// Dynamic import for heavy chart components - defer recharts bundle loading
// Per bundle-dynamic-imports: use next/dynamic for heavy components not needed on initial render
const ChartsGrid = dynamic(() => import("./metrics/MetricsCharts").then((mod) => mod.ChartsGrid), {
  ssr: false,
  loading: () => (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="border border-border/80 bg-white rounded-lg lg:col-span-2 h-[300px] animate-pulse" />
      <div className="border border-border/80 bg-white rounded-lg h-[300px] animate-pulse" />
    </div>
  ),
})

const MOCK_METRICS: Metric[] = [
  {
    title: "Postulaciones",
    value: 42,
    subtitle: "Últimos 30 días",
    icon: File02Icon,
  },
  {
    title: "Tasa de respuesta",
    value: "68%",
    subtitle: "Sobre total de postulaciones",
    icon: Pulse01Icon,
  },
  {
    title: "Entrevistas",
    value: 9,
    subtitle: "Agendadas / realizadas",
    icon: Calendar03Icon,
  },
  {
    title: "Ofertas recibidas",
    value: 2,
    subtitle: "Periodo actual",
    icon: CheckmarkCircle02Icon,
  },
  {
    title: "Tiempo medio de respuesta",
    value: "4.2 días",
    subtitle: "Desde postulación",
    icon: Clock01Icon,
  },
  {
    title: "Vistas de perfil",
    value: 76,
    subtitle: "Reclutadores únicos",
    icon: User02Icon,
  },
]

export const MetricsContent = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("6m")

  const { useSession } = authClient
  const { data: session, isPending: sessionPending } = useSession()
  const firstName = session?.user?.name?.split(" ")[0] || "Usuario"

  const handleSetRange = useCallback((range: TimeRange) => setTimeRange(range), [])

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Top row: menu button on mobile (notification not present on employee metrics) */}
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
              <h1 className="text-2xl sm:text-[28px] font-bold tracking-wide text-foreground">
                ¡Bienvenido/a de vuelta, {firstName}!
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Seguimiento de postulaciones, embudo de contratación y rendimiento reciente.
              </p>
            </div>
          )}
          <div className="hidden lg:flex items-center gap-2 rounded-lg border p-1 bg-white">
            <Button
              variant={timeRange === "3m" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleSetRange("3m")}
              aria-label="Rango 3 meses"
            >
              3M
            </Button>
            <Button
              variant={timeRange === "6m" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleSetRange("6m")}
              aria-label="Rango 6 meses"
            >
              6M
            </Button>
            <Button
              variant={timeRange === "12m" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleSetRange("12m")}
              aria-label="Rango 12 meses"
            >
              12M
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {MOCK_METRICS.map((metric) => (
          <MetricCard key={metric.title} metric={metric} />
        ))}
      </div>

      {/* Dynamic charts - loaded lazily to defer recharts bundle */}
      <ChartsGrid timeRange={timeRange} />
    </div>
  )
}
