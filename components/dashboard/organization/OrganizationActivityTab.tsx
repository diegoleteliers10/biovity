"use client"

import { Task01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useActivityLogs } from "@/lib/api/use-activity-logs"
import { formatFechaRelativa } from "@/lib/utils"

export function OrganizationActivityTab({ organizationId }: { organizationId: string }) {
  const { data: logs = [], isLoading, error } = useActivityLogs(organizationId)

  if (isLoading) {
    return (
      <div className="space-y-4 pt-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-lg border border-border/60 p-4 animate-pulse"
          >
            <div className="size-10 rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 rounded bg-muted" />
              <div className="h-3 w-60 rounded bg-muted" />
            </div>
            <div className="h-4 w-20 rounded bg-muted" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-center text-sm text-destructive">
        Error al cargar el historial de actividades.
      </div>
    )
  }

  return (
    <div className="pt-10 space-y-6">
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <HugeiconsIcon icon={Task01Icon} size={20} className="text-primary" />
            Registro de Actividad (Auditoría)
          </CardTitle>
          <CardDescription>
            Historial de las acciones realizadas por los administradores y reclutadores en esta
            organización.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {logs.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No hay actividades registradas en esta organización.
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
                  if (action.includes("job")) return "bg-blue-500/10 text-blue-600 border-blue-200"
                  if (action.includes("candidate") || action.includes("talent"))
                    return "bg-green-500/10 text-green-600 border-green-200"
                  if (action.includes("template"))
                    return "bg-purple-500/10 text-purple-600 border-purple-200"
                  if (action.includes("chat") || action.includes("message"))
                    return "bg-pink-500/10 text-pink-600 border-pink-200"
                  return "bg-slate-500/10 text-slate-600 border-slate-200"
                }

                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-4 p-4 hover:bg-muted/10 transition-colors"
                  >
                    <Avatar className="size-9 shrink-0">
                      {log.user?.avatar && (
                        <AvatarImage src={log.user.avatar} alt={log.user.name} />
                      )}
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
                          className={`text-[10px] uppercase font-mono tracking-wider px-1.5 py-0 ${getActionColor(log.action)}`}
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
        </CardContent>
      </Card>
    </div>
  )
}
