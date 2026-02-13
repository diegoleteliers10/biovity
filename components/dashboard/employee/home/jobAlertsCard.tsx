"use client"

import { IdeaIcon, Notification01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface JobAlertsCardProps {
  onCreateAlert: () => void
}

export function JobAlertsCard({ onCreateAlert }: JobAlertsCardProps) {
  return (
    <Card>
      <CardContent className="p-4 flex gap-4">
        <div className="space-y-4 mx-auto w-full">
          <div className="space-y-2">
            <label htmlFor="keywords" className="text-sm font-medium">
              Palabras clave
            </label>
            <Input
              id="keywords"
              placeholder="Ej: biotecnología, investigación, laboratorio..."
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium">
              Ubicación
            </label>
            <Input id="location" placeholder="Ciudad, país o remoto" className="text-sm" />
          </div>

          <Button className="w-full" onClick={onCreateAlert}>
            <HugeiconsIcon
              icon={Notification01Icon}
              size={24}
              strokeWidth={1.5}
              className="h-4 w-4 mr-2"
            />
            Crear Nueva Alerta
          </Button>
        </div>
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <HugeiconsIcon
              icon={IdeaIcon}
              size={24}
              strokeWidth={1.5}
              className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0"
            />
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Consejo:</span> Crea múltiples alertas con diferentes
              palabras clave para no perderte oportunidades.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
