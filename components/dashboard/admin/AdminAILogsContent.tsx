"use client"

import {
  AlertCircleIcon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Refresh01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useCallback, useEffect, useReducer, useRef } from "react"
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
import { useMountEffect } from "@/hooks/use-mount-effect"
import { formatFechaRelativa } from "@/lib/utils"

type AILogEntry = {
  id: string
  userId: string
  endpoint: string
  inputHash: string
  outputSummary: string | null
  toolsCalled: unknown[]
  flagged: boolean
  durationMs: number | null
  timestamp: string
  metadata: unknown | null
}

type State = {
  items: AILogEntry[]
  total: number
  loading: boolean
  error: string | null
  inputSearch: string
  flaggedFilter: string
  page: number
}

type Action =
  | { type: "SET_ITEMS"; items: AILogEntry[]; total: number }
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_ERROR"; error: string }
  | { type: "SET_INPUT_SEARCH"; value: string }
  | { type: "SET_FLAGGED_FILTER"; value: string }
  | { type: "SET_PAGE"; page: number }
  | { type: "REFRESH" }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_ITEMS":
      return { ...state, items: action.items, total: action.total, error: null }
    case "SET_LOADING":
      return { ...state, loading: action.loading }
    case "SET_ERROR":
      return { ...state, error: action.error }
    case "SET_INPUT_SEARCH":
      return { ...state, inputSearch: action.value }
    case "SET_FLAGGED_FILTER":
      return { ...state, flaggedFilter: action.value }
    case "SET_PAGE":
      return { ...state, page: action.page }
    case "REFRESH":
      return { ...state, page: 1 }
  }
}

const INITIAL: State = {
  items: [],
  total: 0,
  loading: true,
  error: null,
  inputSearch: "",
  flaggedFilter: "",
  page: 1,
}

const PAGE_SIZE = 20
const SEARCH_DEBOUNCE_MS = 400

const FLAGGED_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "true", label: "Marcados" },
  { value: "false", label: "No marcados" },
]

function useAILogsFetch(
  page: number,
  search: string,
  flagged: string,
  dispatch: React.Dispatch<Action>
) {
  const fetchLogs = useCallback(
    async (p: number, s: string, f: string) => {
      dispatch({ type: "SET_LOADING", loading: true })
      try {
        const params = new URLSearchParams()
        params.set("page", String(p))
        params.set("limit", String(PAGE_SIZE))
        if (s.trim()) params.set("search", s.trim())
        if (f) params.set("flagged", f)

        const res = await fetch(`/api/admin/ai-logs?${params}`)
        const data = await res.json().catch(() => null)
        if (!res.ok) {
          throw new Error((data as { error?: string })?.error ?? "Error al cargar logs de AI")
        }
        dispatch({ type: "SET_ITEMS", items: data.data ?? [], total: data.total ?? 0 })
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error desconocido"
        dispatch({ type: "SET_ERROR", error: msg })
      } finally {
        dispatch({ type: "SET_LOADING", loading: false })
      }
    },
    [dispatch]
  )

  useEffect(() => {
    fetchLogs(page, search, flagged)
  }, [page, search, flagged, fetchLogs])

  return fetchLogs
}

export function AdminAILogsContent() {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [state, dispatch] = useReducer(reducer, INITIAL)

  const fetchLogs = useAILogsFetch(state.page, state.inputSearch, state.flaggedFilter, dispatch)

  const handleSearchChange = useCallback((value: string) => {
    dispatch({ type: "SET_INPUT_SEARCH", value })
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      dispatch({ type: "SET_PAGE", page: 1 })
      debounceRef.current = null
    }, SEARCH_DEBOUNCE_MS)
  }, [])

  useMountEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  })

  const handleFlaggedFilterChange = useCallback((value: string) => {
    dispatch({ type: "SET_FLAGGED_FILTER", value })
    dispatch({ type: "SET_PAGE", page: 1 })
  }, [])

  function formatDuration(ms: number | null): string {
    if (ms == null) return "—"
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  const totalPages = Math.max(1, Math.ceil(state.total / PAGE_SIZE))

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Logs de AI</h1>
          <p className="mt-1 text-muted-foreground">
            Registro de interacciones con inteligencia artificial para auditoria y deteccion de
            abuso.
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch({ type: "REFRESH" })}
          disabled={state.loading}
          aria-label="Refrescar"
        >
          <HugeiconsIcon icon={Refresh01Icon} size={18} />
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Buscar por usuario o endpoint..."
          value={state.inputSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="max-w-sm"
          aria-label="Buscar logs de AI"
        />
        <select
          value={state.flaggedFilter}
          onChange={(e) => handleFlaggedFilterChange(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-xs"
          aria-label="Filtrar por flagged"
        >
          {FLAGGED_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-lg border">
        {state.loading ? (
          <div className="space-y-3 p-6">
            {[0, 1, 2, 3].map((n) => (
              <Skeleton key={n} className="h-10 w-full" />
            ))}
          </div>
        ) : state.error ? (
          <div className="flex flex-col items-center justify-center gap-2 p-12">
            <p className="text-destructive text-sm font-medium">Error al cargar logs de AI</p>
            <p className="text-muted-foreground text-xs">{state.error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchLogs(state.page, state.inputSearch, state.flaggedFilter)}
            >
              Reintentar
            </Button>
          </div>
        ) : state.items.length === 0 ? (
          <div className="flex items-center justify-center p-12 text-muted-foreground">
            {state.inputSearch.trim() || state.flaggedFilter
              ? "No se encontraron logs con esos filtros"
              : "No hay interacciones de AI registradas"}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Endpoint</TableHead>
                <TableHead>Duracion</TableHead>
                <TableHead>Flags</TableHead>
                <TableHead>Output</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.items.map((log) => (
                <TableRow key={log.id} className={log.flagged ? "bg-destructive/5" : undefined}>
                  <TableCell className="font-mono text-xs max-w-[120px]">
                    <span className="truncate block" title={log.userId}>
                      {log.userId.slice(0, 12)}...
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[160px]">
                    <span className="truncate block text-xs font-mono" title={log.endpoint}>
                      {log.endpoint}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs">{formatDuration(log.durationMs)}</TableCell>
                  <TableCell>
                    {log.flagged ? (
                      <Badge variant="destructive" className="gap-1 text-[10px]">
                        <HugeiconsIcon icon={AlertCircleIcon} size={10} />
                        Flagged
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <span className="truncate block text-xs" title={log.outputSummary ?? undefined}>
                      {log.outputSummary ?? "—"}
                    </span>
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

      {state.total > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Pagina {state.page} de {totalPages} ({state.total} logs)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch({ type: "SET_PAGE", page: Math.max(1, state.page - 1) })}
              disabled={state.page <= 1}
              aria-label="Pagina anterior"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                dispatch({ type: "SET_PAGE", page: Math.min(totalPages, state.page + 1) })
              }
              disabled={state.page >= totalPages}
              aria-label="Pagina siguiente"
            >
              <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
