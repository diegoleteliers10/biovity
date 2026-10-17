"use client"

import { AlarmClockIcon, Delete01Icon, Notification01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { dashboardRaisedCardClass } from "@/components/dashboard/shared/surface-classes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatJobAlertCriteria } from "@/lib/api/job-alerts"
import { CATEGORIAS_TRABAJOS, PLACEHOLDER_CATEGORIA } from "@/lib/data/trabajos-filtros-data"
import type { JobAlert, JobAlertFrequency } from "@/lib/types/job-alert"

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
  "h-11 w-full rounded-lg border-border/40 bg-surface-container-low px-3.5 pr-1 text-sm text-foreground focus-visible:border-secondary focus-visible:ring-secondary/20"

/**
 * Demo counterpart of components/dashboard/employee/home/jobAlertsCard.tsx.
 * Same markup; the form is fully typeable and delete works locally, while
 * "Crear alerta" routes visitors to registration (alerts need an account).
 */
export function DemoJobAlertsCard({ initialAlerts }: { initialAlerts: JobAlert[] }) {
  const { push } = useRouter()
  const [alerts, setAlerts] = useState(initialAlerts)
  const [keywords, setKeywords] = useState("")
  const [location, setLocation] = useState("")
  const [category, setCategory] = useState("")
  const [frequency, setFrequency] = useState<JobAlertFrequency>("instantanea")

  const handleCreateAlert = () => {
    if (!keywords.trim() && !location.trim() && !category) {
      toast.info("Ingresa al menos un criterio para tu alerta (demo).")
      return
    }
    toast.info("Las alertas se activan al crear tu cuenta gratis.", {
      description: "Guardamos tus criterios y te avisamos cuando publiquen una oferta compatible.",
      action: {
        label: "Crear cuenta",
        onClick: () => push("/register"),
      },
    })
  }

  const handleDeleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }

  return (
    <div className={`p-4 sm:p-5 ${dashboardRaisedCardClass}`}>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <span className="block text-xs leading-4 font-medium text-foreground">Crear alerta</span>

          <div className="space-y-1.5">
            <label
              htmlFor="demo-alert-keywords"
              className="text-xs leading-4 font-medium text-foreground"
            >
              Palabras clave
            </label>
            <Input
              id="demo-alert-keywords"
              value={keywords}
              onChange={(event) => setKeywords(event.target.value)}
              placeholder="Ej: biotecnología, laboratorio"
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="demo-alert-location"
              className="text-xs leading-4 font-medium text-foreground"
            >
              Ubicación
            </label>
            <Input
              id="demo-alert-location"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Ciudad, país o remoto"
              className={inputClass}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="demo-alert-category"
                className="text-xs leading-4 font-medium text-foreground"
              >
                Categoría
              </label>
              <Select
                value={category || "all-categories"}
                onValueChange={(value) => setCategory(value === "all-categories" ? "" : value)}
              >
                <SelectTrigger
                  id="demo-alert-category"
                  className={selectClass}
                  aria-label="Categoría de la alerta (demo)"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-categories">Todas</SelectItem>
                  {CATEGORY_OPTIONS.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="demo-alert-frequency"
                className="text-xs leading-4 font-medium text-foreground"
              >
                Frecuencia
              </label>
              <Select
                value={frequency}
                onValueChange={(value) => setFrequency(value as JobAlertFrequency)}
              >
                <SelectTrigger
                  id="demo-alert-frequency"
                  className={selectClass}
                  aria-label="Frecuencia de la alerta (demo)"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(FREQUENCY_LABELS) as JobAlertFrequency[]).map((value) => (
                    <SelectItem key={value} value={value}>
                      {FREQUENCY_LABELS[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            variant="secondary"
            className="h-11 w-full rounded-lg text-sm font-medium"
            onClick={handleCreateAlert}
          >
            <HugeiconsIcon
              icon={Notification01Icon}
              size={16}
              strokeWidth={1.5}
              className="mr-2 size-4"
            />
            Crear alerta
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          <span className="block text-xs leading-4 font-medium text-foreground">Mis alertas</span>

          {alerts.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center bg-transparent p-4 text-center">
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
                    aria-label={`Eliminar alerta ${formatJobAlertCriteria(alert) || ""} (demo)`}
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
