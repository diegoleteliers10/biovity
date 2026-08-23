"use client"

import {
  ArrowDown01Icon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  Mail01Icon,
  UserMultiple02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { dashboardRaisedCardClass } from "@/components/dashboard/shared/surface-classes"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type FunnelStageItem = {
  id: string
  stepNumber: number
  label: string
  count: number
  rateOfTotal: number
  icon: typeof UserMultiple02Icon
  colorClass: string
  barBgClass: string
  badgeClass: string
  subtext: string
}

type ConversionFunnelCardProps = {
  isPending: boolean
  totalApps: number
  reachedPendiente: number
  reachedEntrevista: number
  reachedOferta: number
  reachedContratado: number
  ratePendiente: number
  rateEntrevista: number
  rateOferta: number
  rateContratado: number
}

export function ConversionFunnelCard({
  isPending,
  totalApps,
  reachedPendiente,
  reachedEntrevista,
  reachedOferta,
  reachedContratado,
  ratePendiente,
  rateEntrevista,
  rateOferta,
  rateContratado,
}: ConversionFunnelCardProps) {
  if (isPending) {
    return (
      <Card className={dashboardRaisedCardClass}>
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4 py-2">
          <Skeleton className="h-14 w-full rounded-lg" />
          <Skeleton className="h-6 w-32 mx-auto" />
          <Skeleton className="h-14 w-full rounded-lg" />
          <Skeleton className="h-6 w-32 mx-auto" />
          <Skeleton className="h-14 w-full rounded-lg" />
          <Skeleton className="h-6 w-32 mx-auto" />
          <Skeleton className="h-14 w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  const stages: FunnelStageItem[] = [
    {
      id: "postulados",
      stepNumber: 1,
      label: "Postulados",
      count: reachedPendiente,
      rateOfTotal: ratePendiente,
      icon: UserMultiple02Icon,
      colorClass: "text-slate-700 dark:text-slate-300",
      barBgClass: "bg-slate-500/80 dark:bg-slate-400/80",
      badgeClass:
        "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
      subtext: "Base inicial de postulaciones",
    },
    {
      id: "entrevista",
      stepNumber: 2,
      label: "Entrevistados",
      count: reachedEntrevista,
      rateOfTotal: rateEntrevista,
      icon: Calendar03Icon,
      colorClass: "text-primary",
      barBgClass: "bg-primary",
      badgeClass: "bg-primary/10 text-primary border-primary/20",
      subtext: "Avanzaron a entrevista",
    },
    {
      id: "oferta",
      stepNumber: 3,
      label: "Ofertas Enviadas",
      count: reachedOferta,
      rateOfTotal: rateOferta,
      icon: Mail01Icon,
      colorClass: "text-amber-600 dark:text-amber-400",
      barBgClass: "bg-amber-500",
      badgeClass: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
      subtext: "Recibieron propuesta formal",
    },
    {
      id: "contratado",
      stepNumber: 4,
      label: "Contratados",
      count: reachedContratado,
      rateOfTotal: rateContratado,
      icon: CheckmarkCircle02Icon,
      colorClass: "text-emerald-600 dark:text-emerald-400",
      barBgClass: "bg-emerald-500",
      badgeClass: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
      subtext: "Contratación finalizada",
    },
  ]

  // Calculate step-to-step transitions and drop-offs
  const transitions = [
    {
      from: "Postulados",
      to: "Entrevista",
      passRate: totalApps > 0 ? Math.round((reachedEntrevista / totalApps) * 100) : 0,
      dropCount: totalApps - reachedEntrevista,
      dropRate: totalApps > 0 ? Math.round(((totalApps - reachedEntrevista) / totalApps) * 100) : 0,
    },
    {
      from: "Entrevista",
      to: "Oferta",
      passRate: reachedEntrevista > 0 ? Math.round((reachedOferta / reachedEntrevista) * 100) : 0,
      dropCount: reachedEntrevista - reachedOferta,
      dropRate:
        reachedEntrevista > 0
          ? Math.round(((reachedEntrevista - reachedOferta) / reachedEntrevista) * 100)
          : 0,
    },
    {
      from: "Oferta",
      to: "Contratado",
      passRate: reachedOferta > 0 ? Math.round((reachedContratado / reachedOferta) * 100) : 0,
      dropCount: reachedOferta - reachedContratado,
      dropRate:
        reachedOferta > 0
          ? Math.round(((reachedOferta - reachedContratado) / reachedOferta) * 100)
          : 0,
    },
  ]

  // Identify highest drop-off transition
  const maxDropTransition = transitions.reduce(
    (max, t) => (t.dropRate > max.dropRate && totalApps > 0 ? t : max),
    transitions[0]
  )

  return (
    <Card className={dashboardRaisedCardClass}>
      <CardHeader>
        <CardTitle>Funnel de Conversión (Drop-off)</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {totalApps === 0 ? (
          <p className="text-sm text-muted-foreground">
            No hay postulaciones registradas en este período.
          </p>
        ) : (
          <>
            <div className="space-y-2">
              {stages.map((stage, idx) => {
                const isLast = idx === stages.length - 1
                const transition = transitions[idx]

                return (
                  <div key={stage.id} className="space-y-2">
                    {/* Stage Card */}
                    <div className="group relative rounded-xl border border-border/60 bg-card/60 p-3 hover:border-border hover:bg-muted/20 transition-colors">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        {/* Stage Info */}
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="flex items-center justify-center size-6 rounded-full bg-muted text-[11px] font-bold text-foreground shrink-0">
                            {stage.stepNumber}
                          </span>
                          <div className="flex items-center gap-1.5 min-w-0">
                            <HugeiconsIcon
                              icon={stage.icon}
                              size={15}
                              className={`shrink-0 ${stage.colorClass}`}
                            />
                            <span className="text-xs font-semibold text-foreground truncate">
                              {stage.label}
                            </span>
                          </div>
                        </div>

                        {/* Stage Counts & Percentage */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-sm font-bold tabular-nums text-foreground">
                            {stage.count}
                            <span className="text-[11px] font-normal text-muted-foreground ml-1">
                              {stage.count === 1 ? "candidato" : "candidatos"}
                            </span>
                          </span>
                          <Badge
                            variant="outline"
                            className={`text-[10px] px-1.5 py-0 h-5 font-semibold ${stage.badgeClass}`}
                          >
                            {stage.rateOfTotal}%
                          </Badge>
                        </div>
                      </div>

                      {/* Progress Track */}
                      <div className="w-full h-3 bg-muted/40 rounded-full overflow-hidden p-0.5 border border-border/40">
                        <div
                          className={`h-full rounded-full ${stage.barBgClass} transition-all duration-500 ease-out`}
                          style={{
                            width: `${Math.max(stage.rateOfTotal, stage.count > 0 ? 4 : 0)}%`,
                          }}
                        />
                      </div>

                      <div className="flex justify-between items-center mt-1.5 text-[10px] text-muted-foreground">
                        <span>{stage.subtext}</span>
                        <span>{stage.rateOfTotal}% del total de postulantes</span>
                      </div>
                    </div>

                    {/* Drop-off Bridge Connector (Between Stages) */}
                    {!isLast && transition && (
                      <div className="flex items-center justify-between px-4 py-0.5">
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
                          <div className="flex items-center justify-center size-4 rounded-full bg-muted/70 text-muted-foreground">
                            <HugeiconsIcon icon={ArrowDown01Icon} size={10} />
                          </div>
                          <span>
                            Pasa:{" "}
                            <strong className="text-foreground">{transition.passRate}%</strong>
                          </span>
                        </div>

                        {transition.dropCount > 0 ? (
                          <div className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-destructive/10 text-destructive border border-destructive/20 font-medium">
                            <span>Drop-off: -{transition.dropRate}%</span>
                            <span className="opacity-75">(-{transition.dropCount})</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-medium">
                            <span>100% avance</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Bottom Funnel Summary Pill Grid */}
            <div className="mt-3 pt-3 border-t border-border/50 grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="rounded-lg bg-muted/30 p-2 border border-border/30">
                <span className="text-[10px] text-muted-foreground block">Total Postulantes</span>
                <span className="text-xs font-bold text-foreground tabular-nums">{totalApps}</span>
              </div>
              <div className="rounded-lg bg-muted/30 p-2 border border-border/30">
                <span className="text-[10px] text-muted-foreground block">
                  Tasa de Contratación
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {rateContratado}% ({reachedContratado})
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1 rounded-lg bg-muted/30 p-2 border border-border/30">
                <span className="text-[10px] text-muted-foreground block">Mayor Drop-off</span>
                <span className="text-xs font-bold text-destructive truncate block">
                  {maxDropTransition.dropRate > 0
                    ? `${maxDropTransition.from} → ${maxDropTransition.to} (${maxDropTransition.dropRate}%)`
                    : "Sin caída"}
                </span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
