"use client"

import { File02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { memo } from "react"
import { dashboardRaisedCardClass } from "@/components/dashboard/shared/surface-classes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Application } from "@/lib/api/applications"

type RecentApplicationsCardProps = {
  applications?: Application[]
  onJobClick: (jobId: string) => void
  onViewAll?: () => void
  isLoading?: boolean
}

function formatApplicationDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric" })
}

function getStatusChipClass(status: string): { chip: string; label: string } {
  switch (status) {
    case "pendiente":
      return { chip: "bg-surface-container-highest text-muted-foreground", label: "Pendiente" }
    case "entrevista":
      return { chip: "bg-primary/10 text-primary", label: "Entrevista" }
    case "oferta":
      return { chip: "bg-accent/10 text-accent", label: "Oferta" }
    case "contratado":
      return { chip: "bg-secondary/10 text-secondary", label: "Contratado" }
    default:
      return { chip: "bg-destructive/10 text-destructive", label: "Rechazado" }
  }
}

export const RecentApplicationsCard = memo(function RecentApplicationsCard({
  applications = [],
  onJobClick,
  onViewAll,
  isLoading,
}: RecentApplicationsCardProps) {
  const handleJobClick = (jobId: string) => {
    onJobClick(jobId)
  }

  const handleKeyDown = (e: React.KeyboardEvent, jobId: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleJobClick(jobId)
    }
  }

  return (
    <Card className={`md:col-span-2 ${dashboardRaisedCardClass}`}>
      <CardHeader className="px-4 sm:px-5 pt-4 sm:pt-5 pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs leading-4 font-medium text-foreground">
            Aplicaciones Recientes
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-3 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground"
            onClick={onViewAll}
          >
            Ver todas
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-5 pb-4 sm:pb-5">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className="flex items-center justify-between rounded-lg bg-surface-container-low p-3"
              >
                <div className="space-y-2">
                  <div className="h-4 w-40 rounded-md bg-surface-container-highest/60 animate-pulse" />
                  <div className="h-3 w-24 rounded-md bg-surface-container-highest/60 animate-pulse" />
                </div>
                <div className="space-y-1.5 text-right">
                  <div className="h-3 w-20 rounded-md bg-surface-container-highest/60 animate-pulse" />
                  <div className="ml-auto h-5 w-16 rounded-md bg-surface-container-highest/60 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center text-center gap-2 py-8">
            <div className="size-10 rounded-full bg-surface-container-highest flex items-center justify-center text-muted-foreground">
              <HugeiconsIcon icon={File02Icon} size={20} />
            </div>
            <p className="text-sm font-medium text-foreground">Sin postulaciones todavía</p>
            <p className="text-xs text-muted-foreground max-w-[240px]">
              Cuando postules a una oferta, aparecerá aquí.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.slice(0, 5).map((app) => {
              const status = getStatusChipClass(app.status)
              return (
                <button
                  type="button"
                  key={app.id}
                  className="flex items-center justify-between w-full p-3 rounded-lg bg-surface-container-low hover:bg-surface-container-highest/40 cursor-pointer transition-colors duration-150 text-left"
                  onClick={() => handleJobClick(app.jobId)}
                  onKeyDown={(e) => handleKeyDown(e, app.jobId)}
                  aria-label={`Ver detalles del trabajo ${app.job?.title}`}
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <p className="text-sm font-medium leading-none text-foreground truncate text-left">
                      {app.job?.title ?? "Sin título"}
                    </p>
                  </div>
                  <div className="text-right space-y-1 shrink-0 ml-4">
                    <p className="text-xs leading-4 text-muted-foreground">
                      {formatApplicationDate(app.createdAt)}
                    </p>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${status.chip}`}
                    >
                      {status.label}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
})
