"use client"

import { HelpCircleIcon, Notification01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

function DiscordIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 127.14 96.36" fill="currentColor" {...props}>
      <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.95,54.65,1,77.53a105.53,105.53,0,0,0,32,16.15,77.7,77.7,0,0,0,6.85-11.16,68.81,68.81,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.65-2a75.58,75.58,0,0,0,71,0c.85.69,1.74,1.37,2.65,2a68.42,68.42,0,0,1-10.85,5.18,77.7,77.7,0,0,0,6.85,11.16,105.53,105.53,0,0,0,32-16.15C129.66,49.07,123.63,26.23,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z" />
    </svg>
  )
}

function SlackIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" {...props}>
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
      <div className="space-y-6 pt-10">
        <div className="h-40 rounded-lg border border-border/60 bg-muted animate-pulse" />
        <div className="h-60 rounded-lg border border-border/60 bg-muted animate-pulse" />
      </div>
    )
  }

  if (userError || !user) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-center text-sm text-destructive pt-10">
        Error al cargar la configuración de notificaciones.
      </div>
    )
  }

  return (
    <div className="pt-10 space-y-6 max-w-2xl">
      {/* CARD 1: EMAIL NOTIFICATIONS */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <HugeiconsIcon icon={Notification01Icon} size={20} className="text-primary" />
            Notificaciones por Correo
          </CardTitle>
          <CardDescription>
            Elige qué alertas de actividad deseas recibir y con qué frecuencia en tu correo
            electrónico.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5 pr-4">
                <Label htmlFor="notify-applications" className="font-medium cursor-pointer">
                  Nuevas postulaciones
                </Label>
                <p className="text-xs text-muted-foreground">
                  Recibe un correo cuando un candidato postule a una de tus ofertas de trabajo.
                </p>
              </div>
              <Checkbox
                id="notify-applications"
                checked={prefs.newApplications}
                onCheckedChange={(checked) =>
                  setPrefs((prev) => ({ ...prev, newApplications: checked === true }))
                }
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5 pr-4">
                <Label htmlFor="notify-interviews" className="font-medium cursor-pointer">
                  Entrevistas y Eventos
                </Label>
                <p className="text-xs text-muted-foreground">
                  Alertas sobre confirmación de asistencia (RSVP), cancelaciones o actualizaciones
                  de entrevistas.
                </p>
              </div>
              <Checkbox
                id="notify-interviews"
                checked={prefs.interviews}
                onCheckedChange={(checked) =>
                  setPrefs((prev) => ({ ...prev, interviews: checked === true }))
                }
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5 pr-4">
                <Label htmlFor="notify-messages" className="font-medium cursor-pointer">
                  Mensajes de chat
                </Label>
                <p className="text-xs text-muted-foreground">
                  Notificar por correo si tienes mensajes no leídos en el chat después de estar
                  inactivo.
                </p>
              </div>
              <Checkbox
                id="notify-messages"
                checked={prefs.messages}
                onCheckedChange={(checked) =>
                  setPrefs((prev) => ({ ...prev, messages: checked === true }))
                }
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border/60">
            <div className="space-y-2">
              <Label className="font-semibold text-sm">
                Frecuencia de envío (Resumen / Digest)
              </Label>
              <Select
                value={prefs.digest}
                onValueChange={(val: "immediate" | "daily" | "never") =>
                  setPrefs((prev) => ({ ...prev, digest: val }))
                }
              >
                <SelectTrigger className="w-full sm:w-[240px]">
                  <SelectValue placeholder="Selecciona frecuencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Inmediato (Tiempo real)</SelectItem>
                  <SelectItem value="daily">Resumen Diario (Daily Digest)</SelectItem>
                  <SelectItem value="never">Nunca enviar correos</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                <HugeiconsIcon icon={HelpCircleIcon} size={14} className="text-muted-foreground" />
                El resumen diario consolida las alertas en un solo correo al final de cada jornada
                laboral.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border/60">
            <Button
              type="button"
              onClick={handleSavePrefs}
              disabled={updateUserMutation.isPending}
              id="save-notifications-btn"
            >
              {updateUserMutation.isPending ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* CARD 2: WEBHOOK INTEGRATIONS */}
      {user?.organizationId && (
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <SlackIcon className="size-5 text-[#E01E5A]" />
              Integración de Webhooks (Slack / Discord)
            </CardTitle>
            <CardDescription>
              Configura webhooks para notificar en tiempo real en tus canales corporativos cuando
              ocurran eventos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between py-2 border-b border-border/40 pb-4">
              <div className="space-y-0.5 pr-4">
                <Label htmlFor="webhooks-enabled" className="font-semibold text-sm cursor-pointer">
                  Activar Webhooks
                </Label>
                <p className="text-xs text-muted-foreground">
                  Habilita el envío automático de notificaciones a las URLs configuradas abajo.
                </p>
              </div>
              <Checkbox
                id="webhooks-enabled"
                checked={integrations.enabled}
                onCheckedChange={(checked) =>
                  setIntegrations((prev) => ({ ...prev, enabled: checked === true }))
                }
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="slack-webhook" className="flex items-center gap-2 font-medium">
                  <SlackIcon className="size-4 text-[#E01E5A]" />
                  Slack Incoming Webhook URL
                </Label>
                <Input
                  id="slack-webhook"
                  placeholder="https://hooks.slack.com/services/..."
                  value={integrations.slackWebhookUrl}
                  onChange={(e) =>
                    setIntegrations((prev) => ({ ...prev, slackWebhookUrl: e.target.value }))
                  }
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discord-webhook" className="flex items-center gap-2 font-medium">
                  <DiscordIcon className="size-4 text-[#5865F2]" />
                  Discord Webhook URL
                </Label>
                <Input
                  id="discord-webhook"
                  placeholder="https://discord.com/api/webhooks/..."
                  value={integrations.discordWebhookUrl}
                  onChange={(e) =>
                    setIntegrations((prev) => ({ ...prev, discordWebhookUrl: e.target.value }))
                  }
                  className="font-mono text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-border/60">
              <Button
                type="button"
                onClick={handleSaveIntegrations}
                disabled={updateOrgMutation.isPending}
                id="save-integrations-btn"
              >
                {updateOrgMutation.isPending ? "Guardando..." : "Guardar integraciones"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
