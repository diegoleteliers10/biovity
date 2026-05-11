"use client"

import { IdeaIcon, Notification01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type JobAlertsCardProps = {
  onCreateAlert: () => void
}

export function JobAlertsCard({ onCreateAlert }: JobAlertsCardProps) {
  return (
    <Card className="border border-border/80 bg-white">
      <CardContent className="p-4 flex gap-4">
        <div className="space-y-4 mx-auto w-full">
          <div className="space-y-2">
            <label htmlFor="keywords" className="text-sm font-medium text-foreground">
              Palabras clave
            </label>
            <Input
              id="keywords"
              placeholder="Ej: biotecnología, investigación, laboratorio..."
              className="text-sm bg-white"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium text-foreground">
              Ubicación
            </label>
            <Input id="location" placeholder="Ciudad, país o remoto" className="text-sm bg-white" />
          </div>

          <Button variant="secondary" className="w-full" onClick={onCreateAlert}>
            <HugeiconsIcon
              icon={Notification01Icon}
              size={24}
              strokeWidth={1.5}
              className="size-4 mr-2"
            />
            Crear Nueva Alerta
          </Button>
        </div>
        <div className="bg-muted/30 rounded-lg p-4 border border-border/80">
          <div className="flex items-start gap-3">
            <HugeiconsIcon
              icon={IdeaIcon}
              size={24}
              strokeWidth={1.5}
              className="size-4 text-accent mt-0.5 shrink-0"
            />
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Consejo:</span> Crea múltiples alertas
              con diferentes palabras clave para no perderte oportunidades.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
