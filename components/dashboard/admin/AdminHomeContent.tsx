"use client"

import {
  Building02Icon,
  File02Icon,
  FileAddIcon,
  Mail01Icon,
  RadarIcon,
  TradeDownIcon,
  TradeUpIcon,
  User02Icon,
  UserGroupIcon,
  UserListIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useState } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

type AdminStats = {
  users: {
    total: number
    professionals: number
    organizations: number
    active: number
    inactive: number
    recentCount: number
    recentTrend: number
  }
  waitlist: {
    total: number
    professionals: number
    organizations: number
  }
  platform: {
    activeJobs: number
    totalApplications: number
    totalOrganizations: number
  }
}

import { MetricCard } from "@/components/dashboard/employee/home/metricCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { Metric } from "@/lib/types/dashboard"
import { formatFechaRelativa } from "@/lib/utils"

async function fetchStats(): Promise<AdminStats> {
  const res = await fetch("/api/admin/stats")
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error((data as { error?: string })?.error ?? "Error al cargar estadísticas")
  }
  return data
}

async function fetchRegistrationsTrend(period: 30 | 90): Promise<RegistrationsTrendResponse> {
  const res = await fetch(`/api/admin/analytics/registrations?period=${period}`)
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error((data as { error?: string })?.error ?? "Error al cargar trend")
  }
  return data
}

async function fetchRecentUsers(): Promise<RecentUsersResponse> {
  const res = await fetch("/api/admin/users?type=professional&limit=5&page=1")
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error((data as { error?: string })?.error ?? "Error al cargar usuarios recientes")
  }
  return data
}

async function fetchTopJobs(limit: number): Promise<TopJobsResponse> {
  const res = await fetch(`/api/admin/analytics/top-jobs?limit=${limit}`)
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error((data as { error?: string })?.error ?? "Error al cargar top jobs")
  }
  return data
}

interface RegistrationsTrendResponse {
  data: Array<{ date: string; professionals: number; organizations: number }>
  totals: { professionals: number; organizations: number }
}

interface TopJobsResponse {
  data: Array<{
    jobId: string
    title: string
    organizationName: string
    applications: number
    views: number
    applicationRate: number
  }>
}

interface RecentUsersResponse {
  data: Array<{
    id: string
    email: string
    name: string
    createdAt: string
  }>
  total: number
}

export function TrendBadge({ value }: { value: number }) {
  const positive = value >= 0
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-medium ${
        positive ? "text-secondary" : "text-destructive"
      }`}
    >
      <HugeiconsIcon icon={positive ? TradeUpIcon : TradeDownIcon} size={12} strokeWidth={2} />
      {positive ? "+" : ""}
      {value}%
    </span>
  )
}

const BAR_COLORS = ["#10b981", "#3b82f6"]

export function AdminHomeContent() {
  const [period, setPeriod] = useState<30 | 90>(30)

  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: fetchStats,
  })

  const {
    data: trend,
    isLoading: trendLoading,
    isError: trendError,
    refetch: refetchTrend,
  } = useQuery({
    queryKey: ["admin-registrations-trend", period],
    queryFn: () => fetchRegistrationsTrend(period),
  })

  const {
    data: topJobs,
    isLoading: topJobsLoading,
    isError: topJobsError,
    refetch: refetchTopJobs,
  } = useQuery({
    queryKey: ["admin-top-jobs"],
    queryFn: () => fetchTopJobs(10),
  })

  const { data: recentUsers, isLoading: recentUsersLoading } = useQuery({
    queryKey: ["admin-recent-users"],
    queryFn: fetchRecentUsers,
    refetchInterval: 60_000,
  })

  const hasErrors = statsError || trendError || topJobsError

  const metrics: Metric[] = stats
    ? [
        {
          title: "Usuarios totales",
          value: stats.users.total,
          subtitle: `${stats.users.professionals} prof. · ${stats.users.organizations} org.`,
          icon: User02Icon,
          href: "/dashboard/users",
        },
        {
          title: "Usuarios activos",
          value: stats.users.active,
          subtitle: stats.users.inactive > 0 ? `${stats.users.inactive} inactivos` : undefined,
          icon: UserGroupIcon,
          href: "/dashboard/users",
        },
        {
          title: "Nuevos (7d)",
          value: stats.users.recentCount,
          subtitle: stats.users.recentTrend !== 0 ? `vs período anterior` : undefined,
          icon: User02Icon,
          trend: `${stats.users.recentTrend >= 0 ? "+" : ""}${stats.users.recentTrend}%`,
          trendPositive: stats.users.recentTrend >= 0,
          href: "/dashboard/users",
        },
        {
          title: "Lista de espera",
          value: stats.waitlist.total,
          subtitle:
            stats.waitlist.total > 0
              ? `${stats.waitlist.professionals} prof. · ${stats.waitlist.organizations} org.`
              : undefined,
          icon: File02Icon,
        },
        {
          title: "Jobs activos",
          value: stats.platform.activeJobs,
          subtitle: undefined,
          icon: FileAddIcon,
          href: "/dashboard",
        },
        {
          title: "Postulaciones",
          value: stats.platform.totalApplications,
          subtitle: undefined,
          icon: File02Icon,
          href: "/dashboard",
        },
      ]
    : []

  const chartData = trend?.data.map((d) => ({
    date: d.date.slice(5),
    professionals: d.professionals,
    organizations: d.organizations,
  }))

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Panel de administración</h1>
        <p className="mt-1 text-muted-foreground">
          Resumen de la plataforma Biovity: usuarios, lista de espera y metricas de la plataforma.
        </p>
      </div>

      {hasErrors && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
          <p className="text-destructive text-sm font-medium">
            Error al cargar datos del dashboard
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            Algunas secciones pueden estar incompletas. Intenta recargar.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => {
              refetchStats()
              refetchTrend()
              refetchTopJobs()
            }}
          >
            Reintentar
          </Button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statsLoading
          ? [0, 1, 2, 3, 4, 5].map((n) => (
              <Card key={n}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))
          : metrics.map((metric) => <MetricCard key={metric.title} metric={metric} />)}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base">Registros</CardTitle>
              <p className="text-xs text-muted-foreground">
                {trend?.totals.professionals ?? 0} prof. · {trend?.totals.organizations ?? 0} org.
                en {period === 30 ? "30 días" : "90 días"}
              </p>
            </div>
            <div className="flex gap-1" role="radiogroup" aria-label="Periodo del grafico">
              <Button
                variant={period === 30 ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setPeriod(30)}
                aria-pressed={period === 30}
              >
                30d
              </Button>
              <Button
                variant={period === 90 ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setPeriod(90)}
                aria-pressed={period === 90}
              >
                90d
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {trendLoading ? (
              <Skeleton className="h-52 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={208}>
                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    interval={period === 30 ? 6 : 17}
                  />
                  <YAxis
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8 }}
                    labelStyle={{ fontWeight: 600 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="professionals"
                    stackId="1"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.7}
                    name="Profesionales"
                  />
                  <Area
                    type="monotone"
                    dataKey="organizations"
                    stackId="2"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.7}
                    name="Organizaciones"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Top Jobs</CardTitle>
            <p className="text-xs text-muted-foreground">Jobs más aplicados en la plataforma</p>
          </CardHeader>
          <CardContent>
            {topJobsLoading ? (
              <div className="space-y-2">
                {[0, 1, 2, 3, 4].map((n) => (
                  <Skeleton key={n} className="h-10 w-full" />
                ))}
              </div>
            ) : topJobs && topJobs.data.length > 0 ? (
              <ResponsiveContainer width="100%" height={208}>
                <BarChart
                  data={topJobs.data}
                  layout="vertical"
                  margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                    horizontal={false}
                  />
                  <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis
                    dataKey="title"
                    type="category"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    width={120}
                    interval={0}
                  />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8 }}
                    labelStyle={{ fontWeight: 600 }}
                    formatter={(value, name) => [`${value} postulaciones`, name]}
                  />
                  <Bar
                    dataKey="applications"
                    name="Postulaciones"
                    fill="#10b981"
                    radius={[0, 4, 4, 0]}
                  >
                    {topJobs.data.map((_, index) => (
                      <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground">No hay datos disponibles.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {stats && stats.users.recentCount > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Nuevos registros (últimos 7 días)</CardTitle>
            <p className="text-xs text-muted-foreground">
              {stats.users.recentCount} usuario
              {stats.users.recentCount !== 1 ? "s" : ""} registrado
              {stats.users.recentCount !== 1 ? "s" : ""}
              {stats.users.recentTrend !== 0 && (
                <>
                  {" "}
                  <TrendBadge value={stats.users.recentTrend} />
                  {" vs período anterior"}
                </>
              )}
            </p>
          </CardHeader>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Usuarios recientes</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/users">Ver todos</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentUsersLoading ? (
              <div className="space-y-3">
                {[0, 1, 2].map((n) => (
                  <Skeleton key={n} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              (() => {
                const userList = recentUsers?.data
                if (userList?.length) {
                  return (
                    <div className="space-y-2">
                      {userList.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center gap-3 rounded-lg border border-border/50 p-2.5 transition-colors hover:bg-muted/30"
                        >
                          <div className="flex size-8 items-center justify-center rounded-full bg-secondary/10 text-xs font-semibold text-secondary">
                            {user.name?.charAt(0)?.toUpperCase() ?? "?"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {user.name || "Sin nombre"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          </div>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                            {formatFechaRelativa(user.createdAt)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )
                }
                return (
                  <p className="text-sm text-muted-foreground">
                    Total: {stats?.users.total ?? "—"} usuarios ({stats?.users.active ?? "—"}{" "}
                    activos)
                  </p>
                )
              })()
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Acciones rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/dashboard/users" className="flex items-center gap-2">
                <HugeiconsIcon icon={User02Icon} size={20} strokeWidth={1.5} />
                Gestionar usuarios
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/dashboard/organizations" className="flex items-center gap-2">
                <HugeiconsIcon icon={Building02Icon} size={20} strokeWidth={1.5} />
                Gestionar organizaciones
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/dashboard/contact" className="flex items-center gap-2">
                <HugeiconsIcon icon={Mail01Icon} size={20} strokeWidth={1.5} />
                Ver mensajes de contacto
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/dashboard/waitlist" className="flex items-center gap-2">
                <HugeiconsIcon icon={UserListIcon} size={20} strokeWidth={1.5} />
                Lista de espera
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/dashboard/ai-logs" className="flex items-center gap-2">
                <HugeiconsIcon icon={RadarIcon} size={20} strokeWidth={1.5} />
                Logs de AI
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
