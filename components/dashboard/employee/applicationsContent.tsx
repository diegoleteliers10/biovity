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
import { useRouter } from "next/navigation"
import { NotificationBell } from "@/components/common/NotificationBell"
import { MobileMenuButton } from "@/components/dashboard/shared/MobileMenuButton"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { Application } from "@/lib/api/applications"
import { useApplicationsByCandidate } from "@/lib/api/use-applications"
import { useOrganization } from "@/lib/api/use-organization"
import { authClient } from "@/lib/auth-client"

import { formatDateChilean } from "@/lib/utils"

function formatDateApplied(isoDate: string): string {
  return formatDateChilean(isoDate, "d MMM yyyy")
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
  const _router = useRouter()
  const { useSession } = authClient
  const { data: session } = useSession()
  const userId = (session?.user as { id?: string })?.id
  const { data: applications = [], isLoading, error } = useApplicationsByCandidate(userId)

  const isPending = !userId || isLoading || applications === undefined

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Top row: menu on mobile */}
      <div className="flex items-center justify-between lg:hidden">
        <MobileMenuButton />
      </div>

      <div className="space-y-1">
        <div className="hidden lg:flex justify-end">
          <NotificationBell notifications={[]} />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-[28px] font-semibold tracking-wide">Mis Postulaciones</h1>
          <p className="text-muted-foreground text-sm">
            Sigue el estado y progreso de tus aplicaciones.
          </p>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
          <p className="text-destructive text-sm">{error.message}</p>
        </div>
      ) : isPending ? (
        <div className="grid grid-cols-1 gap-8">
          {[0, 1, 2].map((n) => (
            <Card
              key={n}
              className="relative overflow-hidden flex flex-col border border-border/80 bg-white"
            >
              <CardHeader className="p-6 pb-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 space-y-2 flex-1">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="size-10 rounded-full shrink-0" />
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-2">
                <Skeleton className="size-32 mb-5" />
                <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-message-hide pb-2 -mx-2 px-2 mt-2">
                  {STAGES.map((stage, stageIdx) => {
                    return (
                      <div
                        key={`stage-${stage.id}`}
                        className="flex items-center gap-2 sm:gap-3 shrink-0"
                      >
                        <Skeleton className="h-7 w-20 rounded-full" />
                        {stageIdx < STAGES.length - 1 && (
                          <Skeleton className="h-[1.5px] w-4 rounded-full" />
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed">
          <div className="flex flex-col items-center justify-center text-center gap-3 py-12">
            <div className="flex size-20 items-center justify-center rounded-full bg-muted">
              <HugeiconsIcon
                icon={File02Icon}
                size={44}
                strokeWidth={1.5}
                className="size-11 text-muted-foreground"
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
        <div className="grid grid-cols-1 gap-8">
          {applications.map((app) => (
            <ApplicationCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  )
}

function ApplicationCard({ app }: { app: Application }) {
  const { push } = useRouter()
  const jobTitle = app.job?.title ?? "Trabajo"
  const { data: org } = useOrganization(app.job?.organizationId)
  const company = org?.name ?? "Organización"
  const current = getCurrentStageIndex(app.status)

  return (
    <Card className="relative overflow-hidden flex flex-col border border-border/80 bg-white active:scale-[0.99] transition-all duration-150">
      <CardHeader className="p-6 pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-1">
            <CardTitle className="text-base font-semibold leading-tight line-clamp-2 text-foreground">
              {jobTitle}
            </CardTitle>
            <p className="text-sm font-medium text-muted-foreground truncate">{company}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="size-10 rounded-full bg-muted hover:bg-secondary hover:text-secondary-foreground active:scale-90 transition-all duration-150"
              title="Ver detalle del trabajo"
              onClick={() => push(`/dashboard/job/${app.jobId}`)}
            >
              <HugeiconsIcon icon={Share05Icon} size={20} strokeWidth={1.5} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-2">
        <div className="flex items-center justify-between text-[13px] font-medium text-muted-foreground mb-5">
          <span>Aplicado el {formatDateApplied(app.createdAt)}</span>
        </div>

        {/* Timeline minimalist */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-message-hide pb-2 -mx-2 px-2 mt-2">
          {STAGES.map((stage, idx) => {
            const isPast = idx < current
            const isCurrent = idx === current

            return (
              <div
                key={stage.id}
                className="flex items-center gap-2 sm:gap-3 shrink-0"
                aria-current={isCurrent}
              >
                <div
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[13px] transition-all duration-300 ${
                    isPast
                      ? "bg-secondary/10 text-secondary font-medium"
                      : isCurrent
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "bg-transparent text-muted-foreground/50 font-medium"
                  }`}
                >
                  <HugeiconsIcon
                    icon={stage.icon}
                    size={18}
                    strokeWidth={isCurrent || isPast ? 2 : 1.5}
                  />
                  <span className="whitespace-nowrap">{stage.label}</span>
                </div>
                {idx < STAGES.length - 1 && (
                  <div className="w-3 sm:w-4 h-[1.5px] bg-border rounded-full shrink-0" />
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default ApplicationsContent
