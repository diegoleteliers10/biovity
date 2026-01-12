"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Calendar04Icon, File02Icon, IdeaIcon, Message01Icon, Share05Icon, CheckmarkCircle02Icon, Cancel01Icon } from "@hugeicons/core-free-icons"
import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DATA } from "@/lib/data/data-test"
import { motion } from "motion/react"

type ApplicationItem = {
  jobTitle: string
  company: string
  dateApplied: string
  status: string
  statusColor: string
}

const STAGES = [
  { id: "pendiente", label: "Pendiente", icon: File02Icon },
  { id: "entrevista", label: "Entrevista", icon: Message01Icon },
  { id: "oferta", label: "Oferta", icon: Calendar04Icon },
  { id: "contratado", label: "Contratado", icon: CheckmarkCircle02Icon },
  { id: "rechazado", label: "Rechazado", icon: Cancel01Icon },
]

const getCurrentStageIndex = (status: string) => {
  const s = status.toLowerCase()
  if (s.includes("contrat") || s.includes("hired")) return STAGES.findIndex((x) => x.id === "contratado")
  if (s.includes("reject") || s.includes("no seleccionado") || s.includes("rechaz")) return STAGES.findIndex((x) => x.id === "rechazado")
  if (s.includes("offer") || s.includes("oferta")) return STAGES.findIndex((x) => x.id === "oferta")
  if (s.includes("interview") || s.includes("entrevista")) return STAGES.findIndex((x) => x.id === "entrevista")
  // Under review, applied, submitted -> pendiente
  return STAGES.findIndex((x) => x.id === "pendiente")
}

export const ApplicationsContent = () => {
  const router = useRouter()
  const applications: ApplicationItem[] = useMemo(() => DATA.recentApplications as unknown as ApplicationItem[], [])
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-[28px] font-bold tracking-wide">Mis Postulaciones</h1>
          <p className="text-muted-foreground text-sm">Sigue el estado y progreso de tus aplicaciones.</p>
        </div>
      </div>

      {applications.length === 0 ? (
        <div
          className="flex flex-1 items-center justify-center rounded-lg border border-dashed"
        >
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
              <p className="text-xs text-muted-foreground">Busca empleos y postula para verlos aquí.</p>
            </div>
          </div>
        </div>
      ) : (
      <div className="grid grid-cols-1 gap-4">
        {applications.map((app) => {
          const key = `${app.company}-${app.jobTitle}`
          const current = getCurrentStageIndex(app.status)

          return (
            <div key={key} className="relative">
              <Card
                className="relative overflow-hidden flex flex-col border-border/60 hover:border-border transition-colors duration-200 group"
              >
                <CardHeader className="pb-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-0.5">
                      <CardTitle className="text-[15px] md:text-base font-semibold leading-tight line-clamp-2">
                        {app.jobTitle}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground truncate">{app.company}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="rounded-md bg-muted hover:bg-muted/80 text-foreground hover:text-primary transition-colors duration-200"
                        title="Compartir detalle"
                        onClick={() => {
                          const slug = app.jobTitle
                            .toLowerCase()
                            .replace(/[^\p{L}\p{N}]+/gu, "-")
                            .replace(/^-+|-+$/g, "")
                          router.push(`/dashboard/employee/job/${slug}`)
                        }}
                      >
                        <HugeiconsIcon icon={Share05Icon} size={24} strokeWidth={1.5} className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Aplicado: {app.dateApplied}</span>
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
                            <div className={`flex items-center gap-2 ${idx > 0 ? 'pl-2' : ''}`} aria-current={isCurrent}>
                              <div
                                className={`size-6 rounded-full flex items-center justify-center text-[10px] font-semibold
                                ${isPast ? 'bg-primary text-primary-foreground' : isCurrent ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}
                                title={stage.label}
                              >
                                <HugeiconsIcon icon={stage.icon} size={24} strokeWidth={1.5} className="h-3.5 w-3.5" />
                              </div>
                              <span className={`text-xs ${isCurrent ? 'text-primary font-medium' : 'text-muted-foreground'}`}>{stage.label}</span>
                            </div>
                            {idx < STAGES.length - 1 && (
                              <div className={`relative mx-2 h-[2px] flex-1 rounded ${idx < current ? 'bg-primary' : 'bg-muted'}`}>
                                {isNext && (
                                  <motion.div
                                    className="absolute inset-y-0 left-0 h-full rounded bg-primary"
                                    initial={{ width: '50%' }}
                                    animate={{ width: ['50%', '70%', '50%'] }}
                                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.2 }}
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


