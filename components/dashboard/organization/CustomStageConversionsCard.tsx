"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useCustomStageApplications } from "@/lib/api/use-organization-dashboard"
import type { CustomStageConversion, MetricsPeriod } from "@/lib/types/organization-metrics"

type Props = {
  organizationId: string | undefined
  period: MetricsPeriod
  startDate?: string
  endDate?: string
  stages: CustomStageConversion[]
  isPending: boolean
}

const statusLabels: Record<string, string> = {
  pendiente: "Pendiente",
  entrevista: "Entrevista",
  oferta: "Oferta",
  contratado: "Contratado",
  rechazado: "Rechazado",
  desistido: "Desistido",
}

export function CustomStageConversionsCard({
  organizationId,
  period,
  startDate,
  endDate,
  stages,
  isPending,
}: Props) {
  const [selectedStage, setSelectedStage] = useState<CustomStageConversion | null>(null)
  const [page, setPage] = useState(1)
  const applicationsQuery = useCustomStageApplications(
    organizationId,
    selectedStage?.jobId,
    selectedStage?.stageId,
    period,
    startDate,
    endDate,
    page
  )
  const applications = applicationsQuery.data?.isOk() ? applicationsQuery.data.value : undefined
  const queryError = applicationsQuery.isError || applicationsQuery.data?.isErr() === true
  const totalPages = Math.max(1, Math.ceil((applications?.total ?? 0) / 20))

  return (
    <>
      <Card className="gap-0 py-4">
        <CardHeader className="pb-3">
          <CardTitle>Conversiones por etapa personalizada</CardTitle>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : stages.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No hay ingresos a etapas personalizadas en este período.
            </p>
          ) : (
            <div className="divide-y divide-border/60">
              {stages.map((stage) => (
                <button
                  key={`${stage.jobId}-${stage.stageId}`}
                  type="button"
                  onClick={() => {
                    setPage(1)
                    setSelectedStage(stage)
                  }}
                  className="grid w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 py-2.5 text-left hover:bg-surface-container-low"
                  aria-haspopup="dialog"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-medium text-foreground">
                      {stage.stageName}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {stage.jobTitle}
                    </span>
                  </span>
                  <span className="text-right text-xs tabular-nums text-muted-foreground">
                    {stage.advancedApplications}/{stage.enteredApplications}
                  </span>
                  <span className="min-w-10 text-right text-xs font-semibold tabular-nums text-foreground">
                    {stage.conversionRate}%
                  </span>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={selectedStage !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedStage(null)
        }}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{selectedStage?.stageName}</DialogTitle>
            <p className="text-xs text-muted-foreground">{selectedStage?.jobTitle}</p>
          </DialogHeader>
          {applicationsQuery.isPending ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : queryError ? (
            <p role="alert" className="text-xs text-destructive">
              No se pudieron cargar las postulaciones.
            </p>
          ) : applications?.rows.length ? (
            <div className="space-y-2">
              {applications.rows.map((application) => (
                <div
                  key={application.applicationId}
                  className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 rounded-md border border-border/60 p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-foreground">{application.applicantName}</p>
                    <p className="text-xs text-muted-foreground">
                      {application.stageNameAtEntry ?? selectedStage?.stageName} ·{" "}
                      {new Date(application.firstEnteredAt).toLocaleDateString("es-CL", {
                        timeZone: "America/Santiago",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-foreground">
                      {application.advanced ? "Avanzó" : "Aún no avanzó"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {statusLabels[application.currentStatus] ?? application.currentStatus}
                    </p>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-muted-foreground">
                  {applications.total} postulaciones · página {applications.page} de {totalPages}
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page <= 1}
                    onClick={() => setPage((current) => current - 1)}
                  >
                    Anterior
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page >= totalPages}
                    onClick={() => setPage((current) => current + 1)}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No hay postulaciones en esta cohorte.</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
