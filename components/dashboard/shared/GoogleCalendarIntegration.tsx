"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { fetchJson } from "@/lib/result"

type CalendarScope = { kind: "personal" } | { kind: "organization"; organizationId: string }

type CalendarStatus =
  | { connected: false }
  | {
      connected: true
      accountEmail: string
      calendarId: string
      connectedAt: string
    }

type CalendarConnectionResult = { authorizationUrl: string }
type CalendarSyncResult = { processed: number }

function getCalendarPath(scope: CalendarScope): string {
  return scope.kind === "personal"
    ? "/api/v1/google-calendar/personal"
    : `/api/v1/google-calendar/organizations/${encodeURIComponent(scope.organizationId)}`
}

function getErrorMessage(error: { message: string }): string {
  return error.message
}

export function GoogleCalendarIntegration({ scope }: { scope: CalendarScope }) {
  const queryClient = useQueryClient()
  const searchParams = useSearchParams()
  const callbackStatus = searchParams.get("googleCalendar")
  const path = getCalendarPath(scope)
  const queryKey = [
    "google-calendar",
    scope.kind,
    scope.kind === "organization" ? scope.organizationId : "self",
  ]

  const statusQuery = useQuery({
    queryKey,
    queryFn: () => fetchJson<CalendarStatus>(path),
    refetchOnWindowFocus: false,
  })

  const connect = useMutation({
    mutationFn: () => fetchJson<CalendarConnectionResult>(`${path}/connect`, { method: "POST" }),
    onSuccess: (result) => {
      if (result.isErr()) {
        toast.error(getErrorMessage(result.error))
        return
      }
      window.location.assign(result.value.authorizationUrl)
    },
  })

  const disconnect = useMutation({
    mutationFn: () => fetchJson<{ disconnected: true }>(path, { method: "DELETE" }),
    onSuccess: (result) => {
      if (result.isErr()) {
        toast.error(getErrorMessage(result.error))
        return
      }
      toast.success("Google Calendar desconectado")
      void queryClient.invalidateQueries({ queryKey })
    },
  })

  const sync = useMutation({
    mutationFn: () => fetchJson<CalendarSyncResult>(`${path}/sync`, { method: "POST" }),
    onSuccess: (result) => {
      if (result.isErr()) {
        toast.error(getErrorMessage(result.error))
        return
      }
      toast.success(`${result.value.processed} eventos procesados`)
      void queryClient.invalidateQueries({ queryKey })
    },
  })

  const queryResult = statusQuery.data
  const status = queryResult?.isOk() ? queryResult.value : null
  const error = queryResult?.isErr() ? queryResult.error.message : null
  const ownerLabel =
    scope.kind === "personal"
      ? "tu calendario personal"
      : "el calendario compartido de la organización"

  return (
    <section className="rounded-xl border border-border/40 bg-surface-container-lowest p-4 sm:p-5 shadow-none">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-1">
          <h3 className="text-sm font-semibold text-foreground">Google Calendar</h3>
          {statusQuery.isLoading ? (
            <p className="text-xs text-muted-foreground">Cargando conexión...</p>
          ) : error ? (
            <p role="alert" className="text-xs text-destructive">
              {error}
            </p>
          ) : status?.connected ? (
            <p className="text-xs text-muted-foreground">Conectado como {status.accountEmail}</p>
          ) : (
            <p className="text-xs text-muted-foreground">Sin conectar</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {status?.connected ? (
            <>
              <Button
                type="button"
                variant="outline"
                className="h-9 rounded-lg border-border/40 bg-surface-container-lowest text-xs shadow-none"
                disabled={sync.isPending}
                onClick={() => sync.mutate()}
              >
                {sync.isPending ? "Sincronizando..." : "Sincronizar próximos eventos"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="h-9 rounded-lg text-xs text-muted-foreground"
                disabled={disconnect.isPending}
                onClick={() => disconnect.mutate()}
              >
                Desconectar
              </Button>
            </>
          ) : (
            <Button
              type="button"
              className="h-9 rounded-lg bg-primary px-4 text-xs text-primary-foreground hover:bg-primary/90"
              disabled={statusQuery.isLoading || connect.isPending}
              onClick={() => connect.mutate()}
            >
              {connect.isPending ? "Conectando..." : "Conectar Google Calendar"}
            </Button>
          )}
        </div>
      </div>
      {(callbackStatus === "failed" || callbackStatus === "invalid_state") && (
        <p role="alert" className="mt-3 text-xs text-destructive">
          Google no pudo conectar el calendario. Inicia la conexión otra vez.
        </p>
      )}
      <p className="mt-3 text-xs text-muted-foreground">
        Los eventos de Biovity se guardan en {ownerLabel}. Los cambios hechos directamente en Google
        no se importan. Al desconectar, los eventos ya copiados permanecen en Google.
      </p>
    </section>
  )
}
