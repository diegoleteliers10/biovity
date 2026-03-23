"use client"

import {
  Building02Icon,
  File02Icon,
  FileAddIcon,
  User02Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import type { AdminStats } from "@/app/api/admin/stats/route"
import { MetricCard } from "@/components/dashboard/employee/home/metricCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { Metric } from "@/lib/types/dashboard"

type AdminUser = {
  id: string
  email: string
  name: string
  type: string
  isActive: boolean
  createdAt: string
}

async function fetchStats(): Promise<AdminStats> {
  const res = await fetch("/api/admin/stats")
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error((data as { error?: string })?.error ?? "Error al cargar estadísticas")
  }
  return data
}

async function fetchRecentUsers(): Promise<AdminUser[]> {
  const res = await fetch("/api/admin/users?limit=5&page=1")
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error((data as { error?: string })?.error ?? "Error al cargar usuarios")
  }
  return data.data ?? []
}

import { formatDateChilean } from "@/lib/utils"

function formatDate(iso: string): string {
  try {
    return formatDateChilean(iso, "d MMM yyyy")
  } catch {
    return iso
  }
}

export function AdminHomeContent() {
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: fetchStats,
  })

  const { data: recentUsers, isLoading: usersLoading } = useQuery({
    queryKey: ["admin-recent-users"],
    queryFn: fetchRecentUsers,
  })

  const metrics: Metric[] = stats
    ? [
        {
          title: "Usuarios totales",
          value: stats.users.total,
          subtitle: `${stats.users.professionals} profesionales · ${stats.users.organizations} organizaciones`,
          icon: User02Icon,
        },
        {
          title: "Usuarios activos",
          value: stats.users.active,
          subtitle: stats.users.inactive > 0 ? `${stats.users.inactive} inactivos` : undefined,
          icon: UserGroupIcon,
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
          title: "Ofertas (API)",
          value: stats.platform.jobs ?? "—",
          subtitle: stats.platform.apiHealthy ? "API conectada" : "API no disponible",
          icon: FileAddIcon,
        },
        {
          title: "Organizaciones (API)",
          value: stats.platform.organizations ?? "—",
          subtitle: stats.platform.apiHealthy ? undefined : "API no disponible",
          icon: Building02Icon,
        },
        {
          title: "Postulaciones (API)",
          value: stats.platform.applications ?? "—",
          subtitle: stats.platform.apiHealthy ? undefined : "API no disponible",
          icon: File02Icon,
        },
      ]
    : []

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Panel de administración</h1>
        <p className="mt-1 text-muted-foreground">
          Resumen de la plataforma Biovity: usuarios, lista de espera y métricas de la API externa.
        </p>
      </div>

      {statsError && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {(statsError as Error).message}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statsLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
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

      {stats && stats.users.recentCount > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Nuevos registros (últimos 7 días)</CardTitle>
            <p className="text-xs text-muted-foreground">
              {stats.users.recentCount} usuario
              {stats.users.recentCount !== 1 ? "s" : ""} registrado
              {stats.users.recentCount !== 1 ? "s" : ""}
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
            {usersLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : recentUsers && recentUsers.length > 0 ? (
              <ul className="space-y-2">
                {recentUsers.map((u) => (
                  <li
                    key={u.id}
                    className="flex flex-col gap-1 rounded-md border px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{u.name || u.email}</p>
                      <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                      <span>{u.type === "professional" ? "Prof." : "Org."}</span>
                      <span
                        className={`rounded px-1.5 py-0.5 ${
                          u.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {u.isActive ? "Activo" : "Inactivo"}
                      </span>
                      <span>{formatDate(u.createdAt)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No hay usuarios registrados.</p>
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
            {stats?.platform.apiHealthy && (
              <p className="text-xs text-muted-foreground">
                La API externa está operativa. Jobs, organizaciones y postulaciones se gestionan
                desde el backend.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
