"use client"

import { AlertCircleIcon, ArrowRight01Icon, File02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRouter } from "next/navigation"
import { useMemo } from "react"
import { dashboardRaisedCardClass } from "@/components/dashboard/shared/surface-classes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useApplicationsByOrganization } from "@/lib/api/use-applications"
import { useDashboardSession } from "../DashboardSessionContext"

export function AccionRequeridaWidget() {
  const { push } = useRouter()
  const session = useDashboardSession()
  const organizationId = session?.user?.organizationId ?? undefined

  const { data: appsResponse, isPending } = useApplicationsByOrganization(organizationId, {
    limit: 100,
  })

  const pendingApps = useMemo(() => {
    if (!appsResponse?.data) return []
    const now = Date.now()
    const fiveDays = 5 * 24 * 60 * 60 * 1000

    const grouped = new Map<string, { count: number; firstDate: string; title: string }>()

    for (const app of appsResponse.data) {
      if (app.status !== "pendiente") continue
      const createdAt = new Date(app.createdAt).getTime()
      if (now - createdAt < fiveDays) continue

      const jobId = app.job?.id ?? app.jobId
      const existing = grouped.get(jobId)
      const dateStr = app.createdAt

      if (existing) {
        existing.count++
        if (dateStr < existing.firstDate) existing.firstDate = dateStr
      } else {
        grouped.set(jobId, {
          count: 1,
          firstDate: dateStr,
          title: app.job?.title ?? "Sin título",
        })
      }
    }

    return Array.from(grouped.entries()).map(([jobId, data]) => ({
      jobId,
      ...data,
      daysSince: Math.floor((now - new Date(data.firstDate).getTime()) / (24 * 60 * 60 * 1000)),
    }))
  }, [appsResponse])

  if (isPending) {
    return (
      <Card className={dashboardRaisedCardClass}>
        <CardHeader className="px-4 sm:px-5 pt-4 sm:pt-5 pb-0">
          <Skeleton className="h-5 w-36" />
        </CardHeader>
        <CardContent className="px-4 sm:px-5 pb-4 sm:pb-5">
          <Skeleton className="h-20 w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={dashboardRaisedCardClass}>
      <CardHeader className="px-4 sm:px-5 pt-4 sm:pt-5 pb-0">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={AlertCircleIcon} size={20} className="text-destructive" />
          <CardTitle>Acción Requerida</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-5 pb-4 sm:pb-5">
        {pendingApps.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-4 text-center">
            <div className="size-10 rounded-full bg-surface-container-highest flex items-center justify-center text-muted-foreground">
              <HugeiconsIcon icon={File02Icon} size={20} />
            </div>
            <p className="text-sm font-medium text-foreground">Todo al día</p>
            <p className="text-xs text-muted-foreground text-pretty">
              No hay postulaciones pendientes con más de 5 días sin revisar.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingApps.map((item) => (
              <div
                key={item.jobId}
                className="flex items-center justify-between rounded-lg bg-surface-container-low p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.count} postulación{item.count > 1 ? "es" : ""} pendiente
                    {item.count > 1 ? "s" : ""} · {item.daysSince} día
                    {item.daysSince !== 1 ? "s" : ""} sin cambios
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    push(`/dashboard/applications?jobId=${item.jobId}&status=pendiente`)
                  }
                  className="shrink-0"
                >
                  <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="mr-1" />
                  Ver
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
