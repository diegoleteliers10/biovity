"use client"

import {
  Analytics01Icon,
  Calendar03Icon,
  File02Icon,
  FileAddIcon,
  User02Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import { useState } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { NotificationBell } from "@/components/common/NotificationBell"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useOrganization } from "@/lib/api/use-organization"
import { useOrganizationMetrics } from "@/lib/api/use-organization-dashboard"
import { authClient } from "@/lib/auth-client"
import type { MetricsPeriod } from "@/lib/types/organization-metrics"

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
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <HugeiconsIcon
          icon={Icon}
          size={24}
          strokeWidth={1.5}
          className="h-4 w-4 text-muted-foreground"
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
  const { useSession } = authClient
  const { data } = useSession()
  const organizationId = (data?.user as { organizationId?: string } | undefined)?.organizationId

  const [period, setPeriod] = useState<MetricsPeriod>("month")
  const { data: metrics, isPending, isError } = useOrganizationMetrics(organizationId, period)

  const totalViews = metrics?.topJobs.reduce((sum, job) => sum + job.views, 0) ?? 0

  const chartData = metrics?.recentTrend.map((item) => ({
    date: new Date(item.date).toLocaleDateString("es-CL", { day: "numeric", month: "short" }),
    aplicaciones: item.applications,
    entrevistas: item.interviews,
  }))

  if (isError) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="text-sm text-destructive bg-destructive/10 p-4 rounded-lg">
          Error al cargar métricas. Intenta nuevamente.
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-[28px] font-bold tracking-wide">Métricas</h1>
          <p className="text-muted-foreground text-sm">
            Analiza el rendimiento de tus ofertas y candidatos.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <NotificationBell notifications={[]} />
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isPending ? (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <KpiCard
              title="Ofertas activas"
              value={metrics?.dashboard.activeJobs ?? 0}
              subtitle={
                period === "week" ? "esta semana" : period === "year" ? "este año" : "este mes"
              }
              icon={FileAddIcon}
            />
            <KpiCard
              title="Aplicaciones recibidas"
              value={metrics?.pipeline.totalApplications ?? 0}
              subtitle={
                period === "week" ? "esta semana" : period === "year" ? "este año" : "este mes"
              }
              icon={File02Icon}
              trend={`${(metrics?.dashboard.applicationsTrend ?? 0 > 0) ? "+" : ""}${metrics?.dashboard.applicationsTrend ?? 0}%`}
              trendPositive={(metrics?.dashboard.applicationsTrend ?? 0) >= 0}
            />
            <KpiCard
              title="Entrevistas"
              value={metrics?.dashboard.interviewsThisPeriod ?? 0}
              subtitle={
                period === "week" ? "esta semana" : period === "year" ? "este año" : "este mes"
              }
              icon={Calendar03Icon}
              trend={`${(metrics?.dashboard.interviewsTrend ?? 0 > 0) ? "+" : ""}${metrics?.dashboard.interviewsTrend ?? 0}%`}
              trendPositive={(metrics?.dashboard.interviewsTrend ?? 0) >= 0}
            />
            <KpiCard
              title="Vistas de ofertas"
              value={totalViews}
              subtitle={
                period === "week" ? "esta semana" : period === "year" ? "este año" : "este mes"
              }
              icon={ViewIcon}
            />
          </>
        )}
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
                            width: `${metrics ? (count / metrics.pipeline.totalApplications) * 100 : 0}%`,
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

      <Card>
        <CardHeader>
          <CardTitle>Top ofertas con más postulaciones</CardTitle>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-48" />
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
    </div>
  )
}
