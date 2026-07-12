"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  type NotificationPreferencesInput,
  useUpdateNotificationPreferences,
} from "@/lib/api/use-notification-preferences"

type NotificationPreferencesTabProps = {
  userId: string
}

const DEFAULT_PREFS: NotificationPreferencesInput = {
  digest: "none",
  channels: { email: true, inApp: true },
  events: {
    application: true,
    interview: true,
    message: true,
    job_alert: true,
    system: true,
  },
}

export function NotificationPreferencesTab({ userId: _userId }: NotificationPreferencesTabProps) {
  const [prefs, setPrefs] = useState<NotificationPreferencesInput>(DEFAULT_PREFS)
  const updateMutation = useUpdateNotificationPreferences()

  const handleSave = () => {
    updateMutation.mutate(prefs, {
      onSuccess: () => {
        toast.success("Preferencias de notificación guardadas")
      },
      onError: () => {
        toast.error("Error al guardar preferencias")
      },
    })
  }

  const setDigest = (digest: NotificationPreferencesInput["digest"]) => {
    setPrefs((prev) => ({ ...prev, digest }))
  }

  const toggleChannel = (channel: "email" | "inApp") => {
    setPrefs((prev) => ({
      ...prev,
      channels: { ...prev.channels, [channel]: !prev.channels[channel] },
    }))
  }

  const toggleEvent = (event: keyof NotificationPreferencesInput["events"]) => {
    setPrefs((prev) => ({
      ...prev,
      events: { ...prev.events, [event]: !prev.events[event] },
    }))
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <Label className="font-semibold text-sm">Frecuencia de resumen (digest)</Label>
        <Select value={prefs.digest} onValueChange={setDigest}>
          <SelectTrigger className="w-full sm:w-[240px]">
            <SelectValue placeholder="Selecciona frecuencia" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Sin resumen</SelectItem>
            <SelectItem value="daily">Resumen diario</SelectItem>
            <SelectItem value="weekly">Resumen semanal</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          Recibe un resumen periódico de todas las notificaciones.
        </p>
      </div>

      <div className="space-y-4 pt-4 border-t border-border/60">
        <Label className="font-semibold text-sm">Canales de notificación</Label>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="channel-email" className="font-medium cursor-pointer">
              Correo electrónico
            </Label>
            <Checkbox
              id="channel-email"
              checked={prefs.channels.email}
              onCheckedChange={() => toggleChannel("email")}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="channel-inapp" className="font-medium cursor-pointer">
              En la plataforma (in-app)
            </Label>
            <Checkbox
              id="channel-inapp"
              checked={prefs.channels.inApp}
              onCheckedChange={() => toggleChannel("inApp")}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-border/60">
        <Label className="font-semibold text-sm">Eventos</Label>
        <div className="space-y-3">
          {[
            { key: "application" as const, label: "Nuevas postulaciones" },
            { key: "interview" as const, label: "Entrevistas y eventos" },
            { key: "message" as const, label: "Mensajes" },
            { key: "job_alert" as const, label: "Alertas de ofertas" },
            { key: "system" as const, label: "Notificaciones del sistema" },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <Label htmlFor={`event-${key}`} className="font-medium cursor-pointer">
                {label}
              </Label>
              <Checkbox
                id={`event-${key}`}
                checked={prefs.events[key]}
                onCheckedChange={() => toggleEvent(key)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-border/60">
        <Button type="button" onClick={handleSave} disabled={updateMutation.isPending}>
          {updateMutation.isPending ? "Guardando..." : "Guardar preferencias"}
        </Button>
      </div>
    </div>
  )
}
