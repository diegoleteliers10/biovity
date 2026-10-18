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
import { useUser } from "@/lib/api/use-profile"
import type { UserNotificationPreferences } from "@/lib/api/users"
import { FieldLabel, SECTION_LABEL_CLASS, SettingRow } from "./SettingsUi"

type NotificationPreferencesTabProps = {
  userId: string
}

const DEFAULT_PREFS: NotificationPreferencesInput = {
  digest: "immediate",
  channels: { email: true, in_app: true },
  events: {
    application: true,
    interview: true,
    message: true,
    job_alert: true,
    system: true,
  },
}

const EVENT_OPTIONS: { key: keyof NotificationPreferencesInput["events"]; label: string }[] = [
  { key: "application", label: "Postulaciones y ofertas" },
  { key: "interview", label: "Entrevistas y eventos" },
  { key: "message", label: "Mensajes" },
  { key: "job_alert", label: "Alertas de ofertas" },
  { key: "system", label: "Notificaciones del sistema" },
]

export function NotificationPreferencesTab({ userId }: NotificationPreferencesTabProps) {
  const { data: user, isLoading, error } = useUser(userId)

  if (isLoading) {
    return <div className="h-64 rounded-lg bg-surface-container-highest/60 animate-pulse" />
  }

  if (error || !user) {
    return (
      <div className="rounded-xl border border-destructive/50 bg-destructive/5 p-4 text-center text-sm text-destructive shadow-none">
        Error al cargar las preferencias de notificación.
      </div>
    )
  }

  return (
    <NotificationPreferencesForm key={user.id} initialPreferences={user.notificationPreferences} />
  )
}

function NotificationPreferencesForm({
  initialPreferences,
}: {
  initialPreferences: UserNotificationPreferences | null
}) {
  const [prefs, setPrefs] = useState<NotificationPreferencesInput>(() => ({
    digest: initialPreferences?.digest ?? DEFAULT_PREFS.digest,
    channels: {
      email: initialPreferences?.channels?.email ?? DEFAULT_PREFS.channels.email,
      in_app: initialPreferences?.channels?.in_app ?? DEFAULT_PREFS.channels.in_app,
    },
    events: {
      application: initialPreferences?.events?.application ?? DEFAULT_PREFS.events.application,
      interview: initialPreferences?.events?.interview ?? DEFAULT_PREFS.events.interview,
      message: initialPreferences?.events?.message ?? DEFAULT_PREFS.events.message,
      job_alert: initialPreferences?.events?.job_alert ?? DEFAULT_PREFS.events.job_alert,
      system: initialPreferences?.events?.system ?? DEFAULT_PREFS.events.system,
    },
  }))
  const updateMutation = useUpdateNotificationPreferences()

  const handleSave = () => {
    updateMutation.mutate(prefs, {
      onSuccess: () => toast.success("Preferencias de notificación guardadas"),
      onError: () => toast.error("Error al guardar preferencias"),
    })
  }

  return (
    <div className="space-y-10">
      <div className="max-w-[380px] space-y-2">
        <FieldLabel htmlFor="pref-digest">Frecuencia de resumen (digest)</FieldLabel>
        <Select
          value={prefs.digest}
          onValueChange={(digest: NotificationPreferencesInput["digest"]) =>
            setPrefs((previous) => ({ ...previous, digest }))
          }
        >
          <SelectTrigger id="pref-digest" className="h-9 w-full">
            <SelectValue placeholder="Selecciona frecuencia" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="immediate">Inmediato</SelectItem>
            <SelectItem value="none">Sin resumen</SelectItem>
            <SelectItem value="daily">Resumen diario</SelectItem>
            <SelectItem value="weekly">Resumen semanal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <section className="space-y-4 border-t border-border pt-10">
        <h3 className={SECTION_LABEL_CLASS}>Canales de notificación</h3>
        <div className="divide-y divide-border/70">
          <SettingRow
            title="En la plataforma (in-app)"
            switchId="channel-inapp"
            checked={prefs.channels.in_app}
            onCheckedChange={(in_app) =>
              setPrefs((previous) => ({ ...previous, channels: { ...previous.channels, in_app } }))
            }
          />
          <SettingRow
            title="Correo electrónico"
            switchId="channel-email"
            checked={prefs.channels.email}
            onCheckedChange={(email) =>
              setPrefs((previous) => ({ ...previous, channels: { ...previous.channels, email } }))
            }
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
              onCheckedChange={(checked) =>
                setPrefs((previous) => ({
                  ...previous,
                  events: { ...previous.events, [key]: checked },
                }))
              }
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
