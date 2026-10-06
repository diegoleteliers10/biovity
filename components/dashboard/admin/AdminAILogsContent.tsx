"use client"

import { useQuery } from "@tanstack/react-query"
import { Result } from "better-result"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { aiLogsResponseSchema } from "@/lib/admin/ai-logs-schema"
import { ApiError, NetworkError, ParseError } from "@/lib/errors"
import { formatFechaRelativa } from "@/lib/utils"

async function fetchLogs(params: URLSearchParams) {
  return Result.gen(async function* () {
    const response = yield* Result.await(
      Result.tryPromise({
        try: () => fetch(`/api/admin/ai-logs?${params}`),
        catch: (cause) =>
          new NetworkError({ message: "No se pudo cargar los logs. Reintenta.", cause }),
      })
    )
    if (!response.ok)
      return Result.err(
        new ApiError({ status: response.status, message: "No se pudo cargar los logs. Reintenta." })
      )
    const body = yield* Result.await(
      Result.tryPromise({
        try: async () => {
          const body: unknown = await response.json()
          return body
        },
        catch: (cause) => new ParseError({ message: "La respuesta de logs es inválida.", cause }),
      })
    )
    const parsed = aiLogsResponseSchema.safeParse(body)
    return parsed.success
      ? Result.ok(parsed.data)
      : Result.err(
          new ParseError({ message: "La respuesta de logs es inválida.", cause: parsed.error })
        )
  })
}

function duration(ms: number | null) {
  if (ms === null) return "Sin datos"
  return ms < 1000 ? `${ms} ms` : `${(ms / 1000).toFixed(1)} s`
}

function statusLabel(status: string | null) {
  switch (status) {
    case "ready":
      return "Completado"
    case "insufficient":
      return "Datos insuficientes"
    case "failed":
      return "Fallido"
    case "blocked":
      return "Bloqueado"
    case "aborted":
      return "Cancelado"
    default:
      return "Sin datos"
  }
}

function actorType(type: string | null) {
  switch (type) {
    case "professional":
      return "Profesional"
    case "organization":
      return "Organización"
    case "admin":
      return "Administrador"
    default:
      return type ?? "Sin datos"
  }
}

export function AdminAILogsContent() {
  const [inputSearch, setInputSearch] = useState("")
  const [filters, setFilters] = useState({ search: "", flagged: "", page: 1 })
  const params = new URLSearchParams({ page: String(filters.page), limit: "20" })
  if (filters.search) params.set("search", filters.search)
  if (filters.flagged) params.set("flagged", filters.flagged)
  const query = useQuery({
    queryKey: ["admin-ai-logs", params.toString()],
    queryFn: () => fetchLogs(params),
    retry: false,
  })
  const result = query.data
  const data = result?.isOk() ? result.value : null
  const error = result?.isErr()
    ? result.error.message
    : query.isError
      ? "No se pudo cargar los logs. Reintenta."
      : null
  const pages = Math.max(1, data?.totalPages ?? 1)

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Logs de AI</h1>
        <Button variant="outline" onClick={() => query.refetch()} disabled={query.isFetching}>
          Actualizar
        </Button>
      </div>
      <form
        className="flex flex-wrap items-center gap-3"
        onSubmit={(event) => {
          event.preventDefault()
          setFilters({ ...filters, search: inputSearch.trim(), page: 1 })
        }}
      >
        <Input
          placeholder="Nombre, email, ID u operación"
          value={inputSearch}
          onChange={(event) => setInputSearch(event.target.value)}
          className="max-w-sm h-11"
          aria-label="Buscar logs de AI"
        />
        <Button type="submit" variant="outline">
          Buscar
        </Button>
        <select
          value={filters.flagged}
          onChange={(event) => setFilters({ ...filters, flagged: event.target.value, page: 1 })}
          className="h-11 rounded-lg border border-border/40 bg-surface-container-low px-3 text-sm"
          aria-label="Filtrar marcas"
        >
          <option value="">Todos</option>
          <option value="true">Marcados</option>
          <option value="false">No marcados</option>
        </select>
      </form>
      <div className="rounded-lg border overflow-x-auto">
        {query.isPending ? (
          <div className="space-y-3 p-6">
            {[0, 1, 2, 3].map((key) => (
              <Skeleton key={key} className="h-10 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 p-12">
            <p className="text-destructive text-sm">{error}</p>
            <Button variant="outline" onClick={() => query.refetch()}>
              Reintentar
            </Button>
          </div>
        ) : !data?.data.length ? (
          <div className="p-12 text-center text-muted-foreground">
            No hay interacciones con estos filtros
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Operación</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Proveedor</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Tokens de entrada</TableHead>
                <TableHead>Tokens de salida</TableHead>
                <TableHead>Duración</TableHead>
                <TableHead>Herramientas ejecutadas</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((log) => (
                <TableRow key={log.id} className={log.flagged ? "bg-destructive/5" : undefined}>
                  <TableCell>
                    <span className="block font-medium">
                      {log.userName || "Usuario no disponible"}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {log.userEmail || log.userId}
                    </span>
                  </TableCell>
                  <TableCell>{actorType(log.userType)}</TableCell>
                  <TableCell className="font-mono text-xs">{log.endpoint}</TableCell>
                  <TableCell>
                    {statusLabel(log.status)}
                    {log.errorCode && (
                      <span className="block text-xs text-muted-foreground">{log.errorCode}</span>
                    )}
                  </TableCell>
                  <TableCell>{log.provider ?? "Sin datos"}</TableCell>
                  <TableCell>{log.modelId ?? "Sin datos"}</TableCell>
                  <TableCell>{log.inputTokens ?? "Sin datos"}</TableCell>
                  <TableCell>{log.outputTokens ?? "Sin datos"}</TableCell>
                  <TableCell className="whitespace-nowrap">{duration(log.durationMs)}</TableCell>
                  <TableCell>
                    {log.toolsCalled === null
                      ? "Sin datos"
                      : log.toolsCalled.join(", ") || "Ninguna"}
                  </TableCell>
                  <TableCell>
                    {log.flagged ? <Badge variant="destructive">Marcado</Badge> : "Sin marca"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatFechaRelativa(log.timestamp)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      {data && data.total > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Página {filters.page} de {pages} ({data.total} logs)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={filters.page <= 1 || query.isFetching}
              onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              disabled={filters.page >= pages || query.isFetching}
              onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
