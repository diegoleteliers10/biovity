"use client"

import {
  Calendar03Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  DashboardSquare02Icon,
  File02Icon,
  Logout01Icon,
  Message01Icon,
  PieChart02Icon,
  Time04Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { dashboardRaisedCardClass } from "@/components/dashboard/shared/surface-classes"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { MetricsPeriod } from "@/lib/types/organization-metrics"
import type { UserMetrics } from "@/lib/types/user-metrics"

const [
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
] = await Promise.all([
  import("recharts").then((m) => m.Area),
  import("recharts").then((m) => m.AreaChart),
  import("recharts").then((m) => m.Bar),
  import("recharts").then((m) => m.BarChart),
  import("recharts").then((m) => m.CartesianGrid),
  import("recharts").then((m) => m.Cell),
  import("recharts").then((m) => m.PieChart),
  import("recharts").then((m) => m.Pie),
  import("recharts").then((m) => m.ResponsiveContainer),
  import("recharts").then((m) => m.Tooltip),
  import("recharts").then((m) => m.XAxis),
  import("recharts").then((m) => m.YAxis),
])

type ChartsGridProps = {
  metricsData: UserMetrics | undefined
  period: MetricsPeriod
}

const MONTH_SHORT = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
]

const PERIOD_AXIS_LABEL: Record<MetricsPeriod, string> = {
  week: "semana",
  month: "mes",
  year: "año",
  custom: "período",
}

const CATEGORY_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#f43f5e", "#8b5cf6", "#0ea5e9"]

function formatTrendTick(value: string, period: MetricsPeriod): string {
  if (!value) return ""
  const parts = value.split("-")
  const year = Number(parts[0])
  const month = Number(parts[1]) - 1
  const day = Number(parts[2])
  if (!year || Number.isNaN(month) || Number.isNaN(day)) return value

  if (period === "year") return String(year)
  if (period === "month") return MONTH_SHORT[month] ?? value
  const end = new Date(year, month, day + 6)
  return `${day}-${end.getDate()} ${MONTH_SHORT[end.getMonth()] ?? ""}`
}

const EmptyChartState = ({ message = "Sin datos suficientes" }: { message?: string }) => (
  <div className="flex h-[220px] flex-col items-center justify-center gap-1.5 text-center p-4">
    <p className="text-sm font-medium text-foreground">{message}</p>
    <p className="text-xs text-muted-foreground">
      Las métricas se actualizarán automáticamente a medida que interactúes.
    </p>
  </div>
)

export function ChartsGrid({ metricsData, period }: ChartsGridProps) {
  if (!metricsData) {
    return (
      <div className="grid gap-4 lg:grid-cols-3">
        <div className={`${dashboardRaisedCardClass} lg:col-span-2 h-[300px] animate-pulse`} />
        <div className={`${dashboardRaisedCardClass} h-[300px] animate-pulse`} />
      </div>
    )
  }

  const applicationsTrend = metricsData.applicationsTrend ?? []
  const responseTimeDistribution = metricsData.responseTimeDistribution
  const statusBreakdown = metricsData.statusBreakdown
  const categoriesApplied = metricsData.categoriesApplied ?? []

  const responseTimeData = responseTimeDistribution
    ? [
        { period: "< 24h", count: responseTimeDistribution.lessThan24h },
        { period: "1-3 días", count: responseTimeDistribution.oneToThreeDays },
        { period: "4-7 días", count: responseTimeDistribution.threeToSevenDays },
        { period: "> 7 días", count: responseTimeDistribution.moreThanSevenDays },
      ]
    : []

  const totalApplications = statusBreakdown
    ? Object.values(statusBreakdown).reduce((sum, step) => sum + step.count, 0)
    : 0

  const statusRows = statusBreakdown
    ? [
        {
          key: "pendiente",
          label: "Pendientes",
          count: statusBreakdown.pendiente.count,
          percentage: statusBreakdown.pendiente.percentage,
          bgColor: "bg-surface-container-highest",
          textColor: "text-foreground",
          icon: Time04Icon,
        },
        {
          key: "entrevista",
          label: "En entrevista",
          count: statusBreakdown.entrevista.count,
          percentage: statusBreakdown.entrevista.percentage,
          bgColor: "bg-primary/15",
          textColor: "text-primary",
          icon: Message01Icon,
        },
        {
          key: "oferta",
          label: "Con oferta",
          count: statusBreakdown.oferta.count,
          percentage: statusBreakdown.oferta.percentage,
          bgColor: "bg-amber-500/15",
          textColor: "text-amber-700",
          icon: Calendar03Icon,
        },
        {
          key: "contratado",
          label: "Contratado",
          count: statusBreakdown.contratado.count,
          percentage: statusBreakdown.contratado.percentage,
          bgColor: "bg-secondary/15",
          textColor: "text-secondary",
          icon: CheckmarkCircle02Icon,
        },
        {
          key: "rechazado",
          label: "Rechazadas",
          count: statusBreakdown.rechazado.count,
          percentage: statusBreakdown.rechazado.percentage,
          bgColor: "bg-destructive/10",
          textColor: "text-destructive",
          icon: Cancel01Icon,
        },
        {
          key: "desistido",
          label: "Desistidas",
          count: statusBreakdown.desistido.count,
          percentage: statusBreakdown.desistido.percentage,
          bgColor: "bg-muted",
          textColor: "text-muted-foreground",
          icon: Logout01Icon,
        },
      ]
    : []

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* Chart 1: Applications Trend */}
      <Card className={`${dashboardRaisedCardClass} lg:col-span-2 flex flex-col`}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              icon={DashboardSquare02Icon}
              size={16}
              className="text-muted-foreground"
            />
            <CardTitle>Postulaciones por {PERIOD_AXIS_LABEL[period]}</CardTitle>
          </div>
          <CardDescription>Evolución temporal de tus aplicaciones enviadas</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-4">
          {applicationsTrend.length === 0 ? (
            <EmptyChartState />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart
                data={applicationsTrend}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="userAppGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border)"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  tickFormatter={(val: string) => formatTrendTick(val, period)}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ stroke: "#6366f1", strokeWidth: 1, strokeDasharray: "2 2" }}
                  formatter={(value: number) => [`${value} postulaciones`, "Postulados"]}
                  labelFormatter={(label) => formatTrendTick(String(label), period)}
                />
                <Area
                  type="monotone"
                  dataKey="applications"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fill="url(#userAppGradient)"
                  dot={{ r: 3, fill: "#6366f1" }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Chart 2: Response Time Distribution */}
      <Card className={`${dashboardRaisedCardClass} flex flex-col`}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={Clock01Icon} size={16} className="text-muted-foreground" />
            <CardTitle>Tiempo de respuesta</CardTitle>
          </div>
          <CardDescription>Rango de tiempo de respuesta de empresas</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center pb-4">
          {responseTimeData.every((d) => d.count === 0) ? (
            <EmptyChartState message="Sin datos de respuesta aún" />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={responseTimeData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border)"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="period"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(16, 185, 129, 0.08)" }}
                  formatter={(val: number) => [`${val} aplicaciones`, "Postulaciones"]}
                />
                <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Chart 3: Estado de mis postulaciones */}
      <Card className={`${dashboardRaisedCardClass} lg:col-span-2 flex flex-col`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={File02Icon} size={16} className="text-muted-foreground" />
              <CardTitle>Estado de mis postulaciones</CardTitle>
            </div>
            <Badge
              variant="secondary"
              className="bg-surface-container-highest text-muted-foreground border-0 text-xs font-medium"
            >
              {totalApplications} postulaciones en total
            </Badge>
          </div>
          <CardDescription>Distribución actual de tus postulaciones por estado</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center pb-5">
          {totalApplications === 0 ? (
            <EmptyChartState message="Sin postulaciones registradas" />
          ) : (
            <div className="space-y-4 py-1">
              {statusRows.map((row) => (
                <div key={row.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="flex items-center gap-2 text-foreground">
                      <HugeiconsIcon icon={row.icon} size={16} className={row.textColor} />
                      {row.label}
                    </span>
                    <span className="tabular-nums text-muted-foreground font-semibold">
                      {row.count} ({row.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-6 bg-surface-container-low rounded-lg overflow-hidden relative border border-border/40">
                    <div
                      className={`h-full ${row.bgColor} transition-all duration-500 ease-out`}
                      style={{ width: `${Math.max(row.percentage, row.count > 0 ? 5 : 0)}%` }}
                    />
                    <span
                      className={`absolute inset-0 flex items-center pl-3 text-xs font-semibold ${row.textColor}`}
                    >
                      {row.count > 0
                        ? `${row.count} postulaciones`
                        : "Sin postulaciones en este estado"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chart 4: Categories Donut Chart + Detailed Legend */}
      <Card className={`${dashboardRaisedCardClass} flex flex-col`}>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={PieChart02Icon} size={16} className="text-muted-foreground" />
            <CardTitle>Categorías aplicadas</CardTitle>
          </div>
          <CardDescription>Distribución por área o especialidad</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between pb-4">
          {categoriesApplied.length === 0 ? (
            <div className="flex flex-col gap-3 py-1">
              <div className="h-[150px] w-full flex items-center justify-center relative">
                <div className="size-28 rounded-full border-4 border-dashed border-muted flex items-center justify-center">
                  <span className="text-xs font-medium text-muted-foreground text-center px-2">
                    Sin postulaciones
                  </span>
                </div>
              </div>
              <div className="space-y-1.5 border-t border-border/40 pt-3">
                <p className="text-xs font-mono font-medium uppercase tracking-wider text-muted-foreground mb-2">
                  Categorías sugeridas
                </p>
                {[
                  { name: "Bioinformática", color: CATEGORY_COLORS[0] },
                  { name: "Biotecnología", color: CATEGORY_COLORS[1] },
                  { name: "Investigación Clínica", color: CATEGORY_COLORS[2] },
                  { name: "Farmacéutica", color: CATEGORY_COLORS[3] },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 truncate text-muted-foreground">
                      <span
                        className="size-2.5 rounded-full shrink-0 opacity-50"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="truncate">{item.name}</span>
                    </span>
                    <span className="text-muted-foreground tabular-nums shrink-0 ml-2">
                      0 postulaciones
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="h-[160px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip
                      formatter={(val: number, name: string) => [
                        `${val} postulaciones (${categoriesApplied.find((c) => c.category === name)?.percentage ?? 0}%)`,
                        name,
                      ]}
                    />
                    <Pie
                      data={categoriesApplied}
                      dataKey="count"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      innerRadius={42}
                      outerRadius={68}
                      paddingAngle={3}
                    >
                      {categoriesApplied.map((entry, index) => (
                        <Cell
                          key={entry.category}
                          fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                          stroke="transparent"
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Clean Legend Breakdown */}
              <div className="space-y-1.5 border-t border-border/40 pt-3">
                {categoriesApplied.map((entry, index) => (
                  <div key={entry.category} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 truncate text-muted-foreground">
                      <span
                        className="size-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }}
                      />
                      <span className="truncate font-medium text-foreground">{entry.category}</span>
                    </span>
                    <span className="font-semibold text-foreground tabular-nums shrink-0 ml-2">
                      {entry.count} ({entry.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
