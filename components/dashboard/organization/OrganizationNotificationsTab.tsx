"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { OrganizationIntegrations } from "@/lib/api/organizations"
import { useOrganization, useUpdateOrganizationMutation } from "@/lib/api/use-organization"
import { useUpdateUserMutation, useUser } from "@/lib/api/use-profile"
import type { UserNotificationPreferences } from "@/lib/api/users"
import { cn } from "@/lib/utils"
import { FieldHelp, FieldLabel, SECTION_LABEL_CLASS, SettingRow } from "./SettingsUi"

function DiscordIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 127.14 96.36" fill="currentColor" {...props}>
      <title>Discord</title>
      <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.95,54.65,1,77.53a105.53,105.53,0,0,0,32,16.15,77.7,77.7,0,0,0,6.85-11.16,68.81,68.81,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.65-2a75.58,75.58,0,0,0,71,0c.85.69,1.74,1.37,2.65,2a68.42,68.42,0,0,1-10.85,5.18,77.7,77.7,0,0,0,6.85,11.16,105.53,105.53,0,0,0,32-16.15C129.66,49.07,123.63,26.23,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z" />
    </svg>
  )
}

function SlackIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" {...props}>
      <title>Slack</title>
      <path d="M22.5,47.5 C22.5,53.02 18.02,57.5 12.5,57.5 C6.98,57.5 2.5,53.02 2.5,47.5 C2.5,41.98 6.98,37.5 12.5,37.5 L22.5,37.5 L22.5,47.5 Z" />
      <path d="M27.5,47.5 C27.5,41.98 31.98,37.5 37.5,37.5 C43.02,37.5 47.5,41.98 47.5,47.5 L47.5,87.5 C47.5,93.02 43.02,97.5 37.5,97.5 C31.98,97.5 27.5,93.02 27.5,87.5 L27.5,47.5 Z" />
      <path d="M52.5,22.5 C46.98,22.5 42.5,18.02 42.5,12.5 C42.5,6.98 46.98,2.5 52.5,2.5 C58.02,2.5 62.5,6.98 62.5,12.5 L62.5,22.5 L52.5,22.5 Z" />
      <path d="M52.5,27.5 C58.02,27.5 62.5,31.98 62.5,37.5 C62.5,43.02 58.02,47.5 52.5,47.5 L12.5,47.5 C6.98,47.5 2.5,43.02 2.5,37.5 C2.5,31.98 6.98,27.5 12.5,27.5 L52.5,27.5 Z" />
      <path d="M77.5,52.5 C77.5,46.98 81.98,42.5 87.5,42.5 C93.02,42.5 97.5,46.98 97.5,52.5 C97.5,58.02 93.02,62.5 87.5,62.5 L77.5,62.5 L77.5,52.5 Z" />
      <path d="M72.5,52.5 C72.5,58.02 68.02,62.5 62.5,62.5 C56.98,62.5 52.5,58.02 52.5,52.5 L52.5,12.5 C52.5,6.98 56.98,2.5 62.5,2.5 C68.02,2.5 72.5,6.98 72.5,12.5 L72.5,52.5 Z" />
      <path d="M47.5,77.5 C53.02,77.5 57.5,81.98 57.5,87.5 C57.5,93.02 53.02,97.5 47.5,97.5 C41.98,97.5 37.5,93.02 37.5,87.5 L37.5,77.5 L47.5,77.5 Z" />
      <path d="M47.5,72.5 C41.98,72.5 37.5,68.02 37.5,62.5 C37.5,56.98 41.98,52.5 47.5,52.5 L87.5,52.5 C93.02,52.5 97.5,56.98 97.5,62.5 C97.5,68.02 93.02,72.5 87.5,72.5 L47.5,72.5 Z" />
    </svg>
  )
}

export function OrganizationNotificationsTab({ userId }: { userId: string }) {
  const { data: user, isLoading: userLoading, error: userError } = useUser(userId)
  const { data: org, isLoading: orgLoading } = useOrganization(user?.organizationId ?? undefined)

  const updateUserMutation = useUpdateUserMutation(userId)
  const updateOrgMutation = useUpdateOrganizationMutation(user?.organizationId ?? "")

  const [prefs, setPrefs] = useState<UserNotificationPreferences>(() => ({
    digest: user?.notificationPreferences?.digest ?? "immediate",
    newApplications: user?.notificationPreferences?.newApplications ?? true,
    interviews: user?.notificationPreferences?.interviews ?? true,
    messages: user?.notificationPreferences?.messages ?? true,
  }))

  const [integrations, setIntegrations] = useState<OrganizationIntegrations>(() => ({
    slackWebhookUrl: org?.integrations?.slackWebhookUrl ?? "",
    discordWebhookUrl: org?.integrations?.discordWebhookUrl ?? "",
    enabled: org?.integrations?.enabled ?? false,
  }))

  const handleSavePrefs = () => {
    updateUserMutation.mutate(
      {
        notificationPreferences: prefs,
      },
      {
        onSuccess: () => {
          toast.success("Preferencias de notificación actualizadas correctamente")
        },
        onError: () => {
          toast.error("Ocurrió un error al guardar las preferencias")
        },
      }
    )
  }

  const handleSaveIntegrations = () => {
    updateOrgMutation.mutate(
      {
        integrations,
      },
      {
        onSuccess: () => {
          toast.success("Integraciones de webhooks guardadas correctamente")
        },
        onError: () => {
          toast.error("Ocurrió un error al guardar las integraciones")
        },
      }
    )
  }

  const isLoading = userLoading || orgLoading

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-40 rounded-lg border border-border/60 bg-muted animate-pulse" />
        <div className="h-60 rounded-lg border border-border/60 bg-muted animate-pulse" />
      </div>
    )
  }

  if (userError || !user) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-center text-sm text-destructive">
        Error al cargar la configuración de notificaciones.
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {/* SECCIÓN 1: NOTIFICACIONES POR CORREO */}
      <section className="space-y-4">
        <h3 className={SECTION_LABEL_CLASS}>Notificaciones por correo</h3>
        <p className="max-w-[60ch] text-sm leading-6 text-muted-foreground text-pretty">
          Elige qué alertas de actividad deseas recibir y con qué frecuencia en tu correo
          electrónico.
        </p>
        <div className="divide-y divide-border/70">
          <SettingRow
            title="Nuevas postulaciones"
            desc="Recibe un correo cuando un candidato postule a una de tus ofertas."
            switchId="notify-applications"
            checked={prefs.newApplications}
            onCheckedChange={(checked) =>
              setPrefs((prev) => ({ ...prev, newApplications: checked }))
            }
          />
          <SettingRow
            title="Entrevistas y eventos"
            desc="Alertas sobre confirmación de asistencia, cancelaciones o actualizaciones de entrevistas."
            switchId="notify-interviews"
            checked={prefs.interviews}
            onCheckedChange={(checked) => setPrefs((prev) => ({ ...prev, interviews: checked }))}
          />
          <SettingRow
            title="Mensajes de chat"
            desc="Notifica por correo si tienes mensajes sin leer después de un período de inactividad."
            switchId="notify-messages"
            checked={prefs.messages}
            onCheckedChange={(checked) => setPrefs((prev) => ({ ...prev, messages: checked }))}
          />
        </div>

        <div className="mt-4 max-w-[380px] space-y-2">
          <FieldLabel htmlFor="notif-freq">Frecuencia de envío (resumen)</FieldLabel>
          <Select
            value={prefs.digest}
            onValueChange={(val: "immediate" | "daily" | "never") =>
              setPrefs((prev) => ({ ...prev, digest: val }))
            }
          >
            <SelectTrigger id="notif-freq" className="w-full">
              <SelectValue placeholder="Selecciona frecuencia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediate">Inmediato (tiempo real)</SelectItem>
              <SelectItem value="daily">Resumen diario</SelectItem>
              <SelectItem value="never">Nunca enviar correos</SelectItem>
            </SelectContent>
          </Select>
          <FieldHelp>
            El resumen diario consolida las alertas en un solo correo al final de cada jornada
            laboral.
          </FieldHelp>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={handleSavePrefs}
            disabled={updateUserMutation.isPending}
            id="save-notifications-btn"
          >
            {updateUserMutation.isPending ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </section>

      {/* SECCIÓN 2: INTEGRACIONES DE WEBHOOKS */}
      {user?.organizationId && (
        <section className="space-y-4 border-t border-border pt-10">
          <h3 className={SECTION_LABEL_CLASS}>Integración de webhooks (Slack / Discord)</h3>
          <p className="max-w-[60ch] text-sm leading-6 text-muted-foreground text-pretty">
            Configura webhooks para notificar en tiempo real en tus canales corporativos cuando
            ocurran eventos.
          </p>
          <div className="divide-y divide-border/70">
            <SettingRow
              title="Activar webhooks"
              desc="Habilita el envío automático de notificaciones a las URLs configuradas abajo."
              switchId="webhooks-enabled"
              checked={integrations.enabled}
              onCheckedChange={(checked) =>
                setIntegrations((prev) => ({ ...prev, enabled: checked }))
              }
            />
          </div>

          <div
            className={cn(
              "mt-4 flex flex-col gap-4 transition-opacity",
              !integrations.enabled && "pointer-events-none opacity-60"
            )}
          >
            <div className="max-w-[380px] space-y-2">
              <FieldLabel htmlFor="slack-webhook">
                <span className="flex items-center gap-2">
                  <SlackIcon className="size-4 text-[#E01E5A]" />
                  Slack incoming webhook URL
                </span>
              </FieldLabel>
              <Input
                id="slack-webhook"
                placeholder="https://hooks.slack.com/services/..."
                value={integrations.slackWebhookUrl}
                onChange={(e) =>
                  setIntegrations((prev) => ({ ...prev, slackWebhookUrl: e.target.value }))
                }
                disabled={!integrations.enabled}
                className="font-mono text-xs"
              />
            </div>
            <div className="max-w-[380px] space-y-2">
              <FieldLabel htmlFor="discord-webhook">
                <span className="flex items-center gap-2">
                  <DiscordIcon className="size-4 text-[#5865F2]" />
                  Discord webhook URL
                </span>
              </FieldLabel>
              <Input
                id="discord-webhook"
                placeholder="https://discord.com/api/webhooks/..."
                value={integrations.discordWebhookUrl}
                onChange={(e) =>
                  setIntegrations((prev) => ({ ...prev, discordWebhookUrl: e.target.value }))
                }
                disabled={!integrations.enabled}
                className="font-mono text-xs"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={handleSaveIntegrations}
              disabled={updateOrgMutation.isPending}
              id="save-integrations-btn"
            >
              {updateOrgMutation.isPending ? "Guardando..." : "Guardar integraciones"}
            </Button>
          </div>
        </section>
      )}
    </div>
  )
}
