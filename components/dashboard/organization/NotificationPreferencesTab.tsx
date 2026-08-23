"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
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
import { FieldHelp, FieldLabel, SECTION_LABEL_CLASS, SettingRow } from "./SettingsUi"

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

const EVENT_OPTIONS: { key: keyof NotificationPreferencesInput["events"]; label: string }[] = [
  { key: "application", label: "Nuevas postulaciones" },
  { key: "interview", label: "Entrevistas y eventos" },
  { key: "message", label: "Mensajes" },
  { key: "job_alert", label: "Alertas de ofertas" },
  { key: "system", label: "Notificaciones del sistema" },
]

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
    <div className="space-y-10">
      <div className="max-w-[380px] space-y-2">
        <FieldLabel htmlFor="pref-digest">Frecuencia de resumen (digest)</FieldLabel>
        <Select value={prefs.digest} onValueChange={setDigest}>
          <SelectTrigger id="pref-digest" className="h-9 w-full">
            <SelectValue placeholder="Selecciona frecuencia" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Sin resumen</SelectItem>
            <SelectItem value="daily">Resumen diario</SelectItem>
            <SelectItem value="weekly">Resumen semanal</SelectItem>
          </SelectContent>
        </Select>
        <FieldHelp>Recibe un resumen periódico de todas las notificaciones.</FieldHelp>
      </div>

      <section className="space-y-4 border-t border-border pt-10">
        <h3 className={SECTION_LABEL_CLASS}>Canales de notificación</h3>
        <div className="divide-y divide-border/70">
          <SettingRow
            title="Correo electrónico"
            switchId="channel-email"
            checked={prefs.channels.email}
            onCheckedChange={() => toggleChannel("email")}
          />
          <SettingRow
            title="En la plataforma (in-app)"
            switchId="channel-inapp"
            checked={prefs.channels.inApp}
            onCheckedChange={() => toggleChannel("inApp")}
          />
        </div>
      </section>

      <section className="space-y-4 border-t border-border pt-10">
        <h3 className={SECTION_LABEL_CLASS}>Eventos</h3>
        <div className="divide-y divide-border/70">
          {EVENT_OPTIONS.map(({ key, label }) => (
            <SettingRow
              key={key}
              title={label}
              switchId={`event-${key}`}
              checked={prefs.events[key]}
              onCheckedChange={() => toggleEvent(key)}
            />
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="h-9 rounded-lg px-4 bg-secondary text-secondary-foreground hover:bg-secondary/90 text-xs font-medium shadow-none transition-colors"
          >
            {updateMutation.isPending ? "Guardando..." : "Guardar preferencias"}
          </Button>
        </div>
      </section>
    </div>
  )
}
