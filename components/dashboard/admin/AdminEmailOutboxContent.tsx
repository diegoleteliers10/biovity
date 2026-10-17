"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"
import { AdminButton as Button } from "@/components/dashboard/admin/AdminButton"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchJson } from "@/lib/result"
import { formatFechaRelativa } from "@/lib/utils"

type DeadEmail = {
  id: string
  type: string
  recipient: string
  subject: string
  attempts: number
  lastError: string | null
  createdAt: string
  expiresAt: string
}

export function AdminEmailOutboxContent() {
  const [page, setPage] = useState(1)
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: ["admin-email-outbox-dead", page],
    queryFn: () =>
      fetchJson<{
        data: DeadEmail[]
        counts: {
          pending: number
          processing: number
          dead: number
          suppressed: number
          legacyOfferResponse: number
        }
        pagination: {
          page: number
          pageSize: number
          totalItems: number
          totalPages: number
        }
      }>(`/api/admin/email-outbox?page=${page}`),
    staleTime: 15_000,
  })
  const retry = useMutation({
    mutationFn: (id: string) =>
      fetchJson<{ success: boolean }>(`/api/admin/email-outbox/${id}/retry`, { method: "POST" }),
    onSuccess: (result) => {
      if (result.isErr()) {
        toast.error(result.error.message)
        return
      }
      toast.success("El correo volvió a la cola")
      void queryClient.invalidateQueries({ queryKey: ["admin-email-outbox-dead"] })
    },
  })
  const response = query.data?.isOk() ? query.data.value : undefined
  const error = query.data?.isErr() ? query.data.error.message : undefined

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
      <header>
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Correos fallidos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          La cola reintenta cada cinco minutos. Puedes reintentar un correo antes de su vencimiento.
        </p>
      </header>

      {response && (
        <section
          className="rounded-xl bg-surface-container-low p-4 sm:p-5"
          aria-label="Estado de correos"
        >
          <dl className="grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-3 lg:grid-cols-5">
            <div className="space-y-1">
              <dt className="text-xs leading-4 font-medium text-muted-foreground">Pendientes</dt>
              <dd className="text-2xl font-bold tabular-nums text-foreground">
                {response.counts.pending}
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs leading-4 font-medium text-muted-foreground">En proceso</dt>
              <dd className="text-2xl font-bold tabular-nums text-foreground">
                {response.counts.processing}
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs leading-4 font-medium text-muted-foreground">Fallidos</dt>
              <dd
                className={`text-2xl font-bold tabular-nums ${response.counts.dead ? "text-destructive" : "text-foreground"}`}
              >
                {response.counts.dead}
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs leading-4 font-medium text-muted-foreground">
                Omitidos por preferencias
              </dt>
              <dd className="text-2xl font-bold tabular-nums text-foreground">
                {response.counts.suppressed}
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs leading-4 font-medium text-muted-foreground">
                Respuestas antiguas sin preferencia
              </dt>
              <dd
                className={`text-2xl font-bold tabular-nums ${response.counts.legacyOfferResponse ? "text-destructive" : "text-foreground"}`}
              >
                {response.counts.legacyOfferResponse}
              </dd>
            </div>
          </dl>
        </section>
      )}

      {query.isLoading ? (
        <div
          className="rounded-xl bg-surface-container-low p-5"
          role="status"
          aria-label="Cargando correos"
        >
          <span className="sr-only">Cargando correos</span>
          <div className="space-y-3">
            {[0, 1, 2].map((item) => (
              <Skeleton key={item} className="h-12 w-full" />
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="space-y-3 rounded-xl bg-destructive/5 p-5" role="alert">
          <p className="text-sm font-medium text-destructive">
            No se pudo cargar la cola de correos.
          </p>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button variant="outline" onClick={() => query.refetch()} disabled={query.isFetching}>
            Reintentar carga
          </Button>
        </div>
      ) : response?.data.length ? (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead className="border-b bg-muted/30 text-xs font-mono font-medium uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="min-w-64 px-4 py-3 font-medium">Correo</th>
                <th className="min-w-40 px-4 py-3 font-medium">Estado</th>
                <th className="min-w-24 px-4 py-3 font-medium">Intentos</th>
                <th className="min-w-56 px-4 py-3 font-medium">Último error</th>
                <th className="min-w-40 px-4 py-3 font-medium">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {response.data.map((email) => (
                <tr key={email.id} className="align-top">
                  <td className="max-w-80 px-4 py-4">
                    <p className="font-medium">{email.subject}</p>
                    <p className="mt-1 break-all text-xs text-muted-foreground">
                      {email.recipient}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {email.type} · {formatFechaRelativa(email.createdAt)}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive">
                      Fallido
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 tabular-nums">{email.attempts}</td>
                  <td className="max-w-72 px-4 py-4 text-xs">
                    {email.lastError ? (
                      <details>
                        <summary className="line-clamp-2 cursor-pointer text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/40">
                          {email.lastError}
                        </summary>
                        <code className="mt-2 block max-h-40 overflow-y-auto break-all rounded-lg bg-surface-container-low p-3 text-[11px] text-muted-foreground">
                          {email.lastError}
                        </code>
                      </details>
                    ) : (
                      <span className="text-muted-foreground">Sin detalle</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {new Date(email.expiresAt) <= new Date() ? (
                      <p className="text-xs text-muted-foreground">Plazo de reintento vencido</p>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">
                          Vence {formatFechaRelativa(email.expiresAt)}
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={retry.isPending}
                          onClick={() => retry.mutate(email.id)}
                        >
                          Reintentar
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <nav
            className="flex items-center justify-between border-t px-4 py-3"
            aria-label="Paginación"
          >
            <p className="text-xs text-muted-foreground">
              Página {response.pagination.page} de {response.pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={response.pagination.page <= 1}
                onClick={() => setPage(response.pagination.page - 1)}
              >
                Anterior
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={response.pagination.page >= response.pagination.totalPages}
                onClick={() => setPage(response.pagination.page + 1)}
              >
                Siguiente
              </Button>
            </div>
          </nav>
        </div>
      ) : (
        <p className="rounded-xl bg-surface-container-low p-8 text-center text-base font-medium text-foreground">
          No hay correos que requieran atención.
        </p>
      )}
    </main>
  )
}
