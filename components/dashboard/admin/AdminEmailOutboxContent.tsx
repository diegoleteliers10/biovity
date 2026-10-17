"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
        <div className="flex flex-wrap gap-3 text-sm">
          <Badge variant="secondary">Pendientes: {response.counts.pending}</Badge>
          <Badge variant="secondary">En proceso: {response.counts.processing}</Badge>
          <Badge variant={response.counts.dead ? "destructive" : "secondary"}>
            Fallidos: {response.counts.dead}
          </Badge>
          <Badge variant="secondary">Omitidos por preferencias: {response.counts.suppressed}</Badge>
          <Badge variant={response.counts.legacyOfferResponse ? "destructive" : "secondary"}>
            Respuestas antiguas sin preferencia: {response.counts.legacyOfferResponse}
          </Badge>
        </div>
      )}

      {query.isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((item) => (
            <Skeleton key={item} className="h-20 w-full" />
          ))}
        </div>
      ) : error ? (
        <p className="rounded-lg border p-8 text-sm text-destructive">{error}</p>
      ) : response?.data.length ? (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b bg-muted/30 text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Correo</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Intentos</th>
                <th className="px-4 py-3 font-medium">Error</th>
                <th className="px-4 py-3 font-medium">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {response.data.map((email) => (
                <tr key={email.id} className="align-top">
                  <td className="px-4 py-4">
                    <p className="font-medium">{email.subject}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {email.type} · {email.recipient} · {formatFechaRelativa(email.createdAt)}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant="destructive">Requiere atención</Badge>
                  </td>
                  <td className="px-4 py-4">{email.attempts}</td>
                  <td className="max-w-sm whitespace-pre-wrap px-4 py-4 text-xs text-muted-foreground">
                    {email.lastError || "Sin detalle"}
                  </td>
                  <td className="px-4 py-4">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={retry.isPending || new Date(email.expiresAt) <= new Date()}
                      onClick={() => retry.mutate(email.id)}
                    >
                      Reintentar
                    </Button>
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
        <p className="rounded-lg border p-10 text-center text-sm text-muted-foreground">
          No hay correos que requieran atención.
        </p>
      )}
    </main>
  )
}
