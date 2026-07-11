"use client"

import { ArrowLeft01Icon, ArrowRight01Icon, Refresh01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useCallback, useEffect, useReducer, useRef } from "react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { cn, formatFechaRelativa } from "@/lib/utils"

type WaitlistEntry = {
  id: number
  email: string
  role: string
  createdAt: string
}

type State = {
  items: WaitlistEntry[]
  total: number
  loading: boolean
  error: string | null
  inputSearch: string
  roleFilter: string
  page: number
  selectedIds: Set<number>
  refreshNonce: number
}

type Action =
  | { type: "SET_ITEMS"; items: WaitlistEntry[]; total: number }
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_ERROR"; error: string }
  | { type: "SET_INPUT_SEARCH"; value: string }
  | { type: "SET_ROLE_FILTER"; value: string }
  | { type: "SET_PAGE"; page: number }
  | { type: "REMOVE_ITEM"; id: number }
  | { type: "RESTORE_ITEM"; item: WaitlistEntry }
  | { type: "TOGGLE_SELECTED"; id: number }
  | { type: "TOGGLE_SELECT_ALL"; ids: number[] }
  | { type: "CLEAR_SELECTED" }
  | { type: "REMOVE_ITEMS"; ids: number[] }
  | { type: "REFRESH" }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_ITEMS": {
      const preservedSelected = new Set<number>()
      for (const id of state.selectedIds) {
        if (action.items.some((i) => i.id === id)) preservedSelected.add(id)
      }
      return {
        ...state,
        items: action.items,
        total: action.total,
        error: null,
        selectedIds: preservedSelected,
      }
    }
    case "SET_LOADING":
      return { ...state, loading: action.loading }
    case "SET_ERROR":
      return { ...state, error: action.error }
    case "SET_INPUT_SEARCH":
      return { ...state, inputSearch: action.value }
    case "SET_ROLE_FILTER":
      return { ...state, roleFilter: action.value }
    case "SET_PAGE":
      return { ...state, page: action.page }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.id),
        total: state.total - 1,
        selectedIds: withoutId(state.selectedIds, action.id),
      }
    case "RESTORE_ITEM": {
      const items = [...state.items, action.item].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      return { ...state, items, total: state.total + 1 }
    }
    case "TOGGLE_SELECTED": {
      const next = new Set(state.selectedIds)
      if (next.has(action.id)) next.delete(action.id)
      else next.add(action.id)
      return { ...state, selectedIds: next }
    }
    case "TOGGLE_SELECT_ALL": {
      const allSelected = action.ids.every((id) => state.selectedIds.has(id))
      if (allSelected) {
        const next = new Set(state.selectedIds)
        for (const id of action.ids) next.delete(id)
        return { ...state, selectedIds: next }
      }
      const next = new Set(state.selectedIds)
      for (const id of action.ids) next.add(id)
      return { ...state, selectedIds: next }
    }
    case "CLEAR_SELECTED":
      return { ...state, selectedIds: new Set() }
    case "REMOVE_ITEMS":
      return {
        ...state,
        items: state.items.filter((i) => !action.ids.includes(i.id)),
        total: state.total - action.ids.length,
        selectedIds: new Set(),
      }
    case "REFRESH":
      return { ...state, refreshNonce: state.refreshNonce + 1 }
  }
}

function withoutId(set: Set<number>, id: number): Set<number> {
  const next = new Set(set)
  next.delete(id)
  return next
}

const INITIAL: State = {
  items: [],
  total: 0,
  loading: true,
  error: null,
  inputSearch: "",
  roleFilter: "",
  page: 1,
  selectedIds: new Set(),
  refreshNonce: 0,
}

const PAGE_SIZE = 20
const SEARCH_DEBOUNCE_MS = 400
const UNDO_TIMEOUT_MS = 5000

const ROLE_OPTIONS = [
  { value: "", label: "Todos los roles" },
  { value: "professional", label: "Profesionales" },
  { value: "organization", label: "Organizaciones" },
]

function useWaitlistFetch(
  page: number,
  search: string,
  role: string,
  refreshNonce: number,
  dispatch: React.Dispatch<Action>
) {
  const fetchEntries = useCallback(
    async (p: number, s: string, r: string) => {
      dispatch({ type: "SET_LOADING", loading: true })
      try {
        const params = new URLSearchParams()
        params.set("page", String(p))
        params.set("limit", String(PAGE_SIZE))
        if (s.trim()) params.set("search", s.trim())
        if (r) params.set("role", r)

        const res = await fetch(`/api/admin/waitlist?${params}`)
        const data = await res.json().catch(() => null)
        if (!res.ok) {
          throw new Error((data as { error?: string })?.error ?? "Error al cargar lista de espera")
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
    fetchEntries(page, search, role)
  }, [page, search, role, refreshNonce, fetchEntries])

  return fetchEntries
}

export function AdminWaitlistContent() {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const undoRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [state, dispatch] = useReducer(reducer, INITIAL)

  const fetchEntries = useWaitlistFetch(
    state.page,
    state.inputSearch,
    state.roleFilter,
    state.refreshNonce,
    dispatch
  )

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
      if (undoRef.current) clearTimeout(undoRef.current)
    }
  })

  const handleRoleFilterChange = useCallback((value: string) => {
    dispatch({ type: "SET_ROLE_FILTER", value })
    dispatch({ type: "SET_PAGE", page: 1 })
  }, [])

  const scheduleDelete = useCallback((entry: WaitlistEntry) => {
    dispatch({ type: "REMOVE_ITEM", id: entry.id })
    toast.success("Entrada eliminada", {
      duration: UNDO_TIMEOUT_MS,
      action: {
        label: "Deshacer",
        onClick: () => {
          dispatch({ type: "RESTORE_ITEM", item: entry })
          if (undoRef.current) {
            clearTimeout(undoRef.current)
            undoRef.current = null
          }
        },
      },
    })
    undoRef.current = setTimeout(async () => {
      undoRef.current = null
      try {
        await fetch(`/api/admin/waitlist/${entry.id}`, { method: "DELETE" })
      } catch {
        toast.error("Error al eliminar entrada")
      }
    }, UNDO_TIMEOUT_MS)
  }, [])

  const handleBulkDelete = useCallback(() => {
    const ids = Array.from(state.selectedIds)
    const itemsToDelete = state.items.filter((i) => ids.includes(i.id))
    dispatch({ type: "REMOVE_ITEMS", ids })

    toast.success(`${ids.length} entrada(s) eliminada(s)`, {
      duration: UNDO_TIMEOUT_MS,
      action: {
        label: "Deshacer",
        onClick: () => {
          for (const item of itemsToDelete) {
            dispatch({ type: "RESTORE_ITEM", item })
          }
          if (undoRef.current) {
            clearTimeout(undoRef.current)
            undoRef.current = null
          }
        },
      },
    })

    undoRef.current = setTimeout(async () => {
      undoRef.current = null
      await Promise.allSettled(
        ids.map((id) => fetch(`/api/admin/waitlist/${id}`, { method: "DELETE" }))
      )
    }, UNDO_TIMEOUT_MS)
  }, [state.selectedIds, state.items])

  const handleExportCSV = () => {
    const headers = "Email,Rol,Fecha"
    const escapeCsv = (s: string) => `"${s.replace(/"/g, '""')}"`
    const rows = state.items.map(
      (e) =>
        `${escapeCsv(e.email)},${escapeCsv(e.role)},${escapeCsv(new Date(e.createdAt).toLocaleDateString("es-CL"))}`
    )
    const csv = [headers, ...rows].join("\n")
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `waitlist-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const totalPages = Math.max(1, Math.ceil(state.total / PAGE_SIZE))
  const allVisibleIds = state.items.map((i) => i.id)
  const allSelected =
    allVisibleIds.length > 0 && allVisibleIds.every((id) => state.selectedIds.has(id))

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Lista de espera</h1>
          <p className="mt-1 text-muted-foreground">
            Personas y organizaciones registradas en la lista de espera.
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
          placeholder="Buscar por email..."
          value={state.inputSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="max-w-sm"
          aria-label="Buscar en lista de espera"
        />
        <select
          value={state.roleFilter}
          onChange={(e) => handleRoleFilterChange(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-xs"
          aria-label="Filtrar por rol"
        >
          {ROLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportCSV}
          disabled={state.items.length === 0}
        >
          Exportar CSV
        </Button>
      </div>

      {state.selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-secondary/30 bg-secondary/5 p-3">
          <span className="text-sm font-medium">{state.selectedIds.size} seleccionado(s)</span>
          <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
            Eliminar seleccionados
          </Button>
          <Button variant="ghost" size="sm" onClick={() => dispatch({ type: "CLEAR_SELECTED" })}>
            Cancelar
          </Button>
        </div>
      )}

      <div className="rounded-lg border">
        {state.loading ? (
          <div className="space-y-3 p-6">
            {[0, 1, 2, 3].map((n) => (
              <Skeleton key={n} className="h-10 w-full" />
            ))}
          </div>
        ) : state.error ? (
          <div className="flex flex-col items-center justify-center gap-2 p-12">
            <p className="text-destructive text-sm font-medium">Error al cargar lista de espera</p>
            <p className="text-muted-foreground text-xs">{state.error}</p>
            <Button variant="outline" size="sm" onClick={() => dispatch({ type: "REFRESH" })}>
              Reintentar
            </Button>
          </div>
        ) : state.items.length === 0 ? (
          <div className="flex items-center justify-center p-12 text-muted-foreground">
            {state.inputSearch.trim() || state.roleFilter
              ? "No se encontraron entradas con esos filtros"
              : "No hay entradas en la lista de espera"}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={() =>
                      dispatch({ type: "TOGGLE_SELECT_ALL", ids: allVisibleIds })
                    }
                    aria-label="Seleccionar todos"
                  />
                </TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.items.map((entry) => (
                <TableRow
                  key={entry.id}
                  className={cn(state.selectedIds.has(entry.id) && "bg-secondary/5")}
                >
                  <TableCell>
                    <Checkbox
                      checked={state.selectedIds.has(entry.id)}
                      onCheckedChange={() => dispatch({ type: "TOGGLE_SELECTED", id: entry.id })}
                      aria-label={`Seleccionar ${entry.email}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{entry.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {entry.role === "professional" ? "Profesional" : "Organizacion"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatFechaRelativa(entry.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => scheduleDelete(entry)}
                      aria-label={`Eliminar ${entry.email}`}
                    >
                      Eliminar
                    </Button>
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
            Pagina {state.page} de {totalPages} ({state.total} entradas)
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
