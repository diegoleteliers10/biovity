"use client"

import { AlarmClockIcon, Delete01Icon, Notification01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { formatJobAlertCriteria } from "@/lib/api/job-alerts"
import { useCreateJobAlert, useDeleteJobAlert, useJobAlerts } from "@/lib/api/use-job-alerts"
import { CATEGORIAS_TRABAJOS, PLACEHOLDER_CATEGORIA } from "@/lib/data/trabajos-filtros-data"
import { JOB_ALERT_FREQUENCIES, type JobAlertFrequency } from "@/lib/types/job-alert"
import { createJobAlertSchema } from "@/lib/validations/job-alert"
import { dashboardRaisedCardClass } from "../../shared/surface-classes"

const FREQUENCY_LABELS: Record<JobAlertFrequency, string> = {
  instantanea: "Instantánea",
  diaria: "Diaria",
  semanal: "Semanal",
}

const CATEGORY_OPTIONS = CATEGORIAS_TRABAJOS.filter(
  (option) => option.id !== PLACEHOLDER_CATEGORIA && option.id !== "todas"
)

const inputClass = "h-11 bg-surface-container-low border-border/40 text-sm rounded-lg"

const selectClass =
  "h-11 w-full appearance-none rounded-lg border border-border/40 bg-surface-container-low px-3.5 pr-9 text-sm text-foreground focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"

type JobAlertsCardProps = {
  userId?: string
}

export function JobAlertsCard({ userId }: JobAlertsCardProps) {
  const [keywords, setKeywords] = useState("")
  const [location, setLocation] = useState("")
  const [category, setCategory] = useState("")
  const [frequency, setFrequency] = useState<JobAlertFrequency>("instantanea")
  const [formError, setFormError] = useState<string | null>(null)

  const alertsQuery = useJobAlerts(userId)
  const createAlert = useCreateJobAlert()
  const deleteAlert = useDeleteJobAlert()

  const handleCreateAlert = () => {
    setFormError(null)
    if (!userId) {
      setFormError("No se pudo identificar tu sesión")
      return
    }

    const parsed = createJobAlertSchema.safeParse({
      userId,
      keywords: keywords || undefined,
      location: location || undefined,
      category: category || undefined,
      frequency,
    })

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Datos inválidos")
      return
    }

    createAlert.mutate(parsed.data, {
      onSuccess: () => {
        setKeywords("")
        setLocation("")
        setCategory("")
        setFrequency("instantanea")
      },
      onError: (error) => setFormError(error.message),
    })
  }

  const handleDeleteAlert = (id: string) => {
    if (!userId) return
    deleteAlert.mutate({ id, userId })
  }

  const alerts = alertsQuery.data ?? []

  return (
    <div className={`p-4 sm:p-5 ${dashboardRaisedCardClass}`}>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <span className="block text-xs leading-4 font-medium text-foreground">Crear alerta</span>

          <div className="space-y-1.5">
            <label
              htmlFor="alert-keywords"
              className="text-xs leading-4 font-medium text-foreground"
            >
              Palabras clave
            </label>
            <Input
              id="alert-keywords"
              value={keywords}
              onChange={(event) => setKeywords(event.target.value)}
              placeholder="Ej: biotecnología, laboratorio"
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="alert-location"
              className="text-xs leading-4 font-medium text-foreground"
            >
              Ubicación
            </label>
            <Input
              id="alert-location"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Ciudad, país o remoto"
              className={inputClass}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="alert-category"
                className="text-xs leading-4 font-medium text-foreground"
              >
                Categoría
              </label>
              <div className="relative">
                <select
                  id="alert-category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className={selectClass}
                  aria-label="Categoría de la alerta"
                >
                  <option value="">Todas</option>
                  {CATEGORY_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="alert-frequency"
                className="text-xs leading-4 font-medium text-foreground"
              >
                Frecuencia
              </label>
              <div className="relative">
                <select
                  id="alert-frequency"
                  value={frequency}
                  onChange={(event) => setFrequency(event.target.value as JobAlertFrequency)}
                  className={selectClass}
                  aria-label="Frecuencia de la alerta"
                >
                  {JOB_ALERT_FREQUENCIES.map((value) => (
                    <option key={value} value={value}>
                      {FREQUENCY_LABELS[value]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {formError ? <p className="text-xs text-destructive">{formError}</p> : null}

          <Button
            variant="secondary"
            className="h-11 w-full rounded-lg text-sm font-medium"
            onClick={handleCreateAlert}
            disabled={createAlert.isPending || !userId}
          >
            <HugeiconsIcon
              icon={Notification01Icon}
              size={16}
              strokeWidth={1.5}
              className="mr-2 size-4"
            />
            {createAlert.isPending ? "Creando..." : "Crear alerta"}
          </Button>
        </div>

        <div className="space-y-3">
          <span className="block text-xs leading-4 font-medium text-foreground">Mis alertas</span>

          {alertsQuery.isPending ? (
            <div className="space-y-2">
              {[0, 1, 2].map((n) => (
                <Skeleton
                  key={n}
                  className="h-12 w-full rounded-lg bg-surface-container-highest/60"
                />
              ))}
            </div>
          ) : alertsQuery.isError ? (
            <div className="flex items-center justify-between gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3">
              <span className="text-xs text-destructive">No se pudieron cargar tus alertas.</span>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => alertsQuery.refetch()}
              >
                Reintentar
              </Button>
            </div>
          ) : alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg bg-surface-container-low p-4 text-center">
              <div className="mb-2 flex size-9 items-center justify-center rounded-full bg-surface-container-highest text-muted-foreground">
                <HugeiconsIcon icon={AlarmClockIcon} size={18} strokeWidth={1.5} />
              </div>
              <p className="text-sm font-medium text-foreground">Sin alertas todavía</p>
              <p className="mt-0.5 max-w-[220px] text-xs text-muted-foreground">
                Crea tu primera alerta con el formulario para enterarte de nuevas ofertas.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {alerts.map((alert) => (
                <li
                  key={alert.id}
                  className="flex items-center justify-between gap-3 rounded-lg bg-surface-container-low p-3"
                >
                  <div className="min-w-0 space-y-1">
                    <p className="truncate text-sm text-foreground">
                      {formatJobAlertCriteria(alert) || "Alerta sin criterios"}
                    </p>
                    <span className="inline-flex items-center rounded-md bg-surface-container-highest px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      {FREQUENCY_LABELS[alert.frequency]}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-9 w-9 shrink-0 p-0 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDeleteAlert(alert.id)}
                    disabled={deleteAlert.isPending}
                    aria-label={`Eliminar alerta ${formatJobAlertCriteria(alert) || ""}`}
                  >
                    <HugeiconsIcon icon={Delete01Icon} size={16} strokeWidth={1.5} />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
