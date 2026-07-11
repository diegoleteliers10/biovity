"use client"

import { useId } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useOrganizationMetrics } from "@/lib/api/use-organization-dashboard"
import { useDashboardSession } from "../DashboardSessionContext"

const statusLabels: Record<string, string> = {
  pendiente: "Pendiente",
  entrevista: "Entrevista",
  oferta: "Oferta",
  rechazado: "Rechazado",
  contratado: "Contratado",
}

const statusBarColors: Record<string, string> = {
  pendiente: "bg-secondary",
  entrevista: "bg-primary",
  oferta: "bg-accent",
  rechazado: "bg-destructive",
  contratado: "bg-green-500",
}

export function PipelineResumenCard() {
  const session = useDashboardSession()
  const organizationId = session?.user?.organizationId ?? undefined
  const skeletonId = useId()

  const { data: metrics, isPending } = useOrganizationMetrics(organizationId)

  if (isPending) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-36" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={`${skeletonId}-bar-${i}`} className="space-y-1">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-8" />
              </div>
              <Skeleton className="h-4 w-full rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (!metrics) return null

  const { byStatus } = metrics.pipeline
  const total = metrics.pipeline.totalApplications
  const conversionRate = metrics.pipeline.conversionRate
  const stages = ["pendiente", "entrevista", "oferta", "contratado"]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Pipeline Resumen</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stages.map((status) => {
          const count = byStatus[status as keyof typeof byStatus] ?? 0
          const percentage = total > 0 ? Math.round((count / total) * 100) : 0
          return (
            <div key={status} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-muted-foreground">
                  {statusLabels[status] ?? status}
                </span>
                <span className="font-semibold">
                  {count} ({percentage}%)
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${statusBarColors[status] ?? "bg-muted-foreground"}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
        <div className="border-t border-border/60 pt-3 text-center">
          <span className="text-xs text-muted-foreground">
            Tasa de conversión:{" "}
            <span className="font-semibold text-foreground">{conversionRate}%</span>
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
