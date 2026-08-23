"use client"

import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  FileAddIcon,
  Globe02Icon,
  Search01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRouter } from "next/navigation"
import { dashboardTonalCardClass } from "@/components/dashboard/shared/surface-classes"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useOnboarding } from "@/hooks/use-onboarding"
import type { OnboardingStep } from "@/lib/validations/onboarding"

const STEPS: {
  id: OnboardingStep
  label: string
  description: string
  icon: typeof UserIcon
  href: string
}[] = [
  {
    id: "complete_profile",
    label: "Completar perfil",
    description: "Agrega info de tu organizacion",
    icon: UserIcon,
    href: "/dashboard/profile",
  },
  {
    id: "create_offer",
    label: "Crear tu primera oferta",
    description: "Publica una vacante",
    icon: FileAddIcon,
    href: "/dashboard/ofertas",
  },
  {
    id: "publish_offer",
    label: "Publicar una oferta",
    description: "Activa una oferta para recibir postulaciones",
    icon: Globe02Icon,
    href: "/dashboard/ofertas",
  },
  {
    id: "view_talent",
    label: "Explorar talento",
    description: "Busca candidatos en el pool de talento",
    icon: Search01Icon,
    href: "/dashboard/talent",
  },
]

export function OnboardingChecklist() {
  const { steps, isComplete, dismiss } = useOnboarding()
  const { push } = useRouter()

  if (isComplete) return null

  const completedCount = steps.length

  return (
    <Card className={dashboardTonalCardClass}>
      <CardContent className="p-5 sm:p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-xs leading-4 font-medium text-foreground">Bienvenido a Biovity</h3>
            <p className="text-xs text-muted-foreground text-pretty">
              Completa estos pasos para empezar a recibir candidatos
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs tabular-nums text-muted-foreground">
              {completedCount}/{STEPS.length}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="size-6"
              onClick={() => dismiss.mutate()}
              aria-label="Cerrar checklist"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={14} />
            </Button>
          </div>
        </div>

        <div className="relative mb-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-secondary transition-all duration-500"
            style={{ width: `${(completedCount / STEPS.length) * 100}%` }}
          />
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {STEPS.map((step) => {
            const done = steps.includes(step.id)
            return (
              <button
                key={step.id}
                type="button"
                disabled={done}
                onClick={() => push(step.href)}
                className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors duration-150 ${
                  done
                    ? "cursor-default border-secondary/20 bg-secondary/5 opacity-80"
                    : "cursor-pointer border-border/30 bg-surface-container-lowest hover:border-secondary/30 hover:bg-secondary/5"
                }`}
              >
                <div
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
                    done ? "bg-secondary/10" : "bg-primary/10"
                  }`}
                >
                  {done ? (
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      size={16}
                      className="text-secondary"
                    />
                  ) : (
                    <HugeiconsIcon icon={step.icon} size={16} className="text-primary" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-foreground">{step.label}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{step.description}</p>
                </div>
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
