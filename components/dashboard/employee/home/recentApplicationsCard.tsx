"use client"

import { memo } from "react"
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

function getStatusStyles(status: string): {
  bg: string
  text: string
  border: string
  label: string
} {
  switch (status) {
    case "pendiente":
      return {
        bg: "bg-tertiary/10",
        text: "text-tertiary",
        border: "border-tertiary/20",
        label: "Pendiente",
      }
    case "entrevista":
      return {
        bg: "bg-primary/10",
        text: "text-primary",
        border: "border-primary/20",
        label: "Entrevista",
      }
    case "oferta":
      return {
        bg: "bg-accent/10",
        text: "text-accent",
        border: "border-accent/20",
        label: "Oferta",
      }
    case "contratado":
      return {
        bg: "bg-secondary/10",
        text: "text-secondary",
        border: "border-secondary/20",
        label: "Contratado",
      }
    default:
      return {
        bg: "bg-destructive/10",
        text: "text-destructive",
        border: "border-destructive/20",
        label: "Rechazado",
      }
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
    <Card className="md:col-span-2 border border-border/80 bg-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground">Aplicaciones Recientes</CardTitle>
          <Button variant="ghost" size="sm" onClick={onViewAll}>
            Ver Todo
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/60 animate-pulse"
              >
                <div className="space-y-2">
                  <div className="size-40 rounded bg-muted" />
                  <div className="h-3 w-24 rounded bg-muted" />
                </div>
                <div className="space-y-1 text-right">
                  <div className="h-3 w-20 rounded bg-muted" />
                  <div className="h-5 w-16 rounded-full bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No tienes postulaciones recientes
          </p>
        ) : (
          <div className="space-y-3">
            {applications.slice(0, 5).map((app) => {
              const status = getStatusStyles(app.status)
              return (
                <button
                  type="button"
                  key={app.id}
                  className="flex items-center justify-between w-full p-3 rounded-lg bg-muted/30 hover:bg-muted/50 active:scale-[0.99] cursor-pointer transition-all duration-150 border border-border/60 hover:border-border/80"
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
                    <p className="text-xs text-muted-foreground">
                      {formatApplicationDate(app.createdAt)}
                    </p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${status.bg} ${status.text} ${status.border}`}
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
