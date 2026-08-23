"use client"

import { Task01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useActivityLogs } from "@/lib/api/use-activity-logs"
import { formatFechaRelativa } from "@/lib/utils"

const SKELETON_KEYS = ["a", "b", "c", "d"] as const

export function OrganizationActivityTab({ organizationId }: { organizationId: string }) {
  const { data: logs = [], isLoading, error } = useActivityLogs(organizationId)

  if (isLoading) {
    return (
      <div className="space-y-4 pt-10">
        {SKELETON_KEYS.map((key) => (
          <div
            key={key}
            className="flex items-center gap-4 rounded-lg bg-surface-container-highest/60 p-4 animate-pulse"
          >
            <div className="size-10 rounded-full bg-surface-container-highest/60" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 rounded-md bg-surface-container-highest/60" />
              <div className="h-3 w-60 rounded-md bg-surface-container-highest/60" />
            </div>
            <div className="h-4 w-20 rounded-md bg-surface-container-highest/60" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/50 bg-destructive/5 p-4 text-center text-sm text-destructive shadow-none">
        Error al cargar el historial de actividades.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {logs.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-border/40 bg-surface-container-low px-6 py-6 text-center shadow-none">
          <span className="grid size-10 place-items-center rounded-full bg-surface-container-highest text-muted-foreground">
            <HugeiconsIcon icon={Task01Icon} size={20} strokeWidth={1.8} aria-hidden />
          </span>
          <p className="text-sm font-medium text-foreground">Sin actividad registrada</p>
          <p className="text-xs text-muted-foreground">
            Las acciones de tu equipo aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border/60">
          {logs.map((log) => {
            const userInitials = log.user?.name
              ? log.user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              : "U"

            const getActionColor = (action: string) => {
              if (action.includes("job")) return "bg-primary/10 text-primary"
              if (action.includes("candidate") || action.includes("talent"))
                return "bg-secondary/10 text-secondary"
              if (action.includes("template"))
                return "bg-surface-container-highest text-muted-foreground"
              if (action.includes("chat") || action.includes("message"))
                return "bg-surface-container-highest text-foreground"
              return "bg-surface-container-highest text-muted-foreground"
            }

            return (
              <div key={log.id} className="flex items-start gap-4 p-4">
                <Avatar className="size-9 shrink-0">
                  {log.user?.avatar && <AvatarImage src={log.user.avatar} alt={log.user.name} />}
                  <AvatarFallback className="bg-secondary/10 text-secondary text-xs font-semibold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-foreground">
                      {log.user?.name ?? "Usuario Desconocido"}
                    </span>
                    <span className="text-xs text-muted-foreground">({log.user?.email})</span>
                    <Badge
                      variant="outline"
                      className={`rounded-md text-xs font-medium px-2 py-0.5 ${getActionColor(log.action)}`}
                    >
                      {log.action}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground text-pretty">{log.description}</p>
                </div>

                <span className="text-xs text-muted-foreground shrink-0 mt-0.5">
                  {formatFechaRelativa(log.createdAt)}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
