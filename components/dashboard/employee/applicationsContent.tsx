"use client"

import {
  Calendar04Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  File02Icon,
  Message01Icon,
  Share05Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import * as m from "motion/react-m"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useApplicationsByCandidate } from "@/lib/api/use-applications"
import { authClient } from "@/lib/auth-client"

function formatDateApplied(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

const STAGES = [
  { id: "pendiente", label: "Pendiente", icon: File02Icon },
  { id: "entrevista", label: "Entrevista", icon: Message01Icon },
  { id: "oferta", label: "Oferta", icon: Calendar04Icon },
  { id: "contratado", label: "Contratado", icon: CheckmarkCircle02Icon },
  { id: "rechazado", label: "Rechazado", icon: Cancel01Icon },
]

const getCurrentStageIndex = (status: string): number => {
  const idx = STAGES.findIndex((x) => x.id === status.toLowerCase())
  return idx >= 0 ? idx : 0
}

export const ApplicationsContent = () => {
  const router = useRouter()
  const { useSession } = authClient
  const { data: session } = useSession()
  const userId = (session?.user as { id?: string })?.id
  const { data: applications = [], isLoading, error } = useApplicationsByCandidate(userId)

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-[28px] font-bold tracking-wide">Mis Postulaciones</h1>
          <p className="text-muted-foreground text-sm">
            Sigue el estado y progreso de tus aplicaciones.
          </p>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
          <p className="text-destructive text-sm">{error.message}</p>
        </div>
      ) : isLoading ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed py-12">
          <p className="text-muted-foreground text-sm">Cargando postulaciones...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed">
          <div className="flex flex-col items-center justify-center text-center gap-3 py-12">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <HugeiconsIcon
                icon={File02Icon}
                size={44}
                strokeWidth={1.5}
                className="h-11 w-11 text-muted-foreground"
              />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Aún no tienes aplicaciones.</p>
              <p className="text-xs text-muted-foreground">
                Busca empleos y postula para verlos aquí.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {applications.map((app) => {
            const jobTitle = app.job?.title ?? "Trabajo"
            const company = "Organización"
            const current = getCurrentStageIndex(app.status)

            return (
              <div key={app.id} className="relative">
                <Card className="relative overflow-hidden flex flex-col border-border/60 hover:border-border transition-colors duration-200 group">
                  <CardHeader className="pb-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 space-y-0.5">
                        <CardTitle className="text-[15px] md:text-base font-semibold leading-tight line-clamp-2">
                          {jobTitle}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground truncate">{company}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="rounded-md bg-muted hover:bg-muted/80 text-foreground hover:text-primary transition-colors duration-200"
                          title="Ver detalle del trabajo"
                          onClick={() => router.push(`/dashboard/job/${app.jobId}`)}
                        >
                          <HugeiconsIcon
                            icon={Share05Icon}
                            size={24}
                            strokeWidth={1.5}
                            className="h-4 w-4"
                          />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Aplicado: {formatDateApplied(app.createdAt)}</span>
                    </div>

                    {/* Timeline inline */}
                    <div className="mt-3 rounded-lg border border-border/60 bg-muted/20 p-3 font-mono">
                      <div className="flex items-center justify-between">
                        {STAGES.map((stage, idx) => {
                          const isPast = idx < current
                          const isCurrent = idx === current
                          const isNext = idx === current && idx < STAGES.length - 1
                          return (
                            <div key={stage.id} className="flex-1 flex items-center">
                              <div
                                className={`flex items-center gap-2 ${idx > 0 ? "pl-2" : ""}`}
                                aria-current={isCurrent}
                              >
                                <div
                                  className={`size-6 rounded-full flex items-center justify-center text-[10px] font-semibold
                                ${isPast ? "bg-primary text-primary-foreground" : isCurrent ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}
                                  title={stage.label}
                                >
                                  <HugeiconsIcon
                                    icon={stage.icon}
                                    size={24}
                                    strokeWidth={1.5}
                                    className="h-3.5 w-3.5"
                                  />
                                </div>
                                <span
                                  className={`text-xs ${isCurrent ? "text-primary font-medium" : "text-muted-foreground"}`}
                                >
                                  {stage.label}
                                </span>
                              </div>
                              {idx < STAGES.length - 1 && (
                                <div
                                  className={`relative mx-2 h-[2px] flex-1 rounded ${idx < current ? "bg-primary" : "bg-muted"}`}
                                >
                                  {isNext && (
                                    <m.div
                                      className="absolute inset-y-0 left-0 h-full rounded bg-primary"
                                      initial={{ width: "50%" }}
                                      animate={{ width: ["50%", "70%", "50%"] }}
                                      transition={{
                                        duration: 1.6,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        repeatDelay: 1.2,
                                      }}
                                    />
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ApplicationsContent
