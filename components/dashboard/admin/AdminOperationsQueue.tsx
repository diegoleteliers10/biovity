"use client"

import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchJson } from "@/lib/result"
import { formatFechaRelativa } from "@/lib/utils"

type QueueType = "all" | "expired_job" | "application_follow_up" | "organization_without_active_jobs"
type QueueItem = {
  id: string
  kind: "expired_job" | "application_follow_up" | "organization_without_active_jobs"
  reason: "expired_job" | "missing_action" | "overdue_action" | "no_active_jobs"
  title: string
  organizationId: string
  organizationName: string
  candidateId: string | null
  candidateName: string | null
  applicationId: string | null
  status: string | null
  stageName: string | null
  nextAction: string | null
  targetDate: string | null
  expiresAt: string | null
  createdAt: string
}
type QueuePage = {
  data: QueueItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

const PAGE_SIZE = 20
const queueLabels: Record<QueueType, string> = {
  all: "Todos",
  expired_job: "Vacantes vencidas",
  application_follow_up: "Postulaciones",
  organization_without_active_jobs: "Sin vacantes activas",
}

export const buildOperationsQueueUrl = (input: {
  type: QueueType
  page: number
  limit: number
  search: string
}) => {
  const query = new URLSearchParams({
    type: input.type,
    page: String(input.page),
    limit: String(input.limit),
  })
  if (input.search.trim()) query.set("search", input.search.trim())
  return `/api/admin/operations-queue?${query}`
}

export function AdminOperationsQueue() {
  const [type, setType] = useState<QueueType>("all")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const result = useQuery({
    queryKey: ["admin-operations-queue", type, search, page],
    queryFn: async () => {
      return fetchJson<QueuePage>(buildOperationsQueueUrl({
        type,
        page,
        limit: PAGE_SIZE,
        search,
      }))
    },
  })
  const queue = result.data?.isOk() ? result.data.value : undefined
  const error = result.data?.isErr() ? result.data.error.message : undefined

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
      <header>
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Operaciones</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Revisa vacantes activas vencidas y postulaciones sin seguimiento.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <Input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value)
            setPage(1)
          }}
          placeholder="Buscar vacante, organización o candidato"
          aria-label="Buscar operaciones"
          className="h-10 max-w-sm"
        />
        <fieldset className="flex flex-wrap gap-2">
          <legend className="sr-only">Tipo de tarea</legend>
          {(Object.keys(queueLabels) as QueueType[]).map((item) => (
            <Button
              key={item}
              variant={type === item ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setType(item)
                setPage(1)
              }}
            >
              {queueLabels[item]}
            </Button>
          ))}
        </fieldset>
      </div>

      <p className="text-xs text-muted-foreground">
        Cola de solo lectura. Usa el ID para localizar la oferta o postulación en el espacio de la
        organización.
      </p>

      {queue && <p className="text-sm text-muted-foreground">{queue.total} tareas</p>}
      <div className="overflow-x-auto rounded-lg border">
        {result.isLoading ? (
          <div className="space-y-3 p-6">
            {[0, 1, 2].map((item) => (
              <Skeleton key={item} className="h-16 w-full" />
            ))}
          </div>
        ) : error ? (
          <p className="p-8 text-sm text-destructive">{error}</p>
        ) : queue?.data.length ? (
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b bg-muted/30 text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Caso</th>
                <th className="px-4 py-3 font-medium">Organización</th>
                <th className="px-4 py-3 font-medium">Motivo</th>
                <th className="px-4 py-3 font-medium">Fecha objetivo</th>
                <th className="px-4 py-3 font-medium">ID de registro</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {queue.data.map((item) => (
                <tr key={`${item.kind}-${item.id}`}>
                  <td className="px-4 py-4">
                    <p className="font-medium">{item.title}</p>
                    {item.candidateName && (
                      <p className="mt-1 text-xs text-muted-foreground">{item.candidateName}</p>
                    )}
                  </td>
                  <td className="px-4 py-4">{item.organizationName || "Sin organización"}</td>
                  <td className="px-4 py-4">
                    <Badge variant="secondary">
                      {item.reason === "expired_job"
                        ? "Vacante vencida"
                        : item.reason === "no_active_jobs"
                          ? "Sin vacantes activas"
                        : item.reason === "missing_action"
                          ? "Sin próxima acción"
                          : "Fecha de seguimiento vencida"}
                    </Badge>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.nextAction ||
                        item.stageName ||
                        (item.expiresAt
                          ? `Venció ${formatFechaRelativa(item.expiresAt)}`
                          : "Sin próxima acción")}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {item.targetDate || item.expiresAt || "Sin fecha"}
                  </td>
                  <td className="px-4 py-4 font-mono text-xs text-muted-foreground">
                    <span className="mr-2 font-sans">
                      {item.kind === "expired_job"
                        ? "Oferta"
                        : item.kind === "organization_without_active_jobs"
                          ? "Organización"
                          : "Postulación"}
                    </span>
                    {item.applicationId ?? item.id}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-10 text-center text-sm text-muted-foreground">
            No hay tareas para estos filtros.
          </p>
        )}
      </div>

      {queue && queue.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Página {queue.page} de {queue.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= queue.totalPages}
              onClick={() => setPage(page + 1)}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </main>
  )
}
