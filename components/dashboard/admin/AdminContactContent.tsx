"use client"

import { ArrowLeft01Icon, ArrowRight01Icon, Refresh01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useCallback, useEffect, useReducer, useRef } from "react"
import { toast } from "sonner"
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

type ContactMessage = {
  id: number
  nombre: string
  apellido: string
  email: string
  telefono: string | null
  empresa: string
  mensaje: string
  isRead: boolean
  createdAt: string
}

type State = {
  items: ContactMessage[]
  total: number
  loading: boolean
  error: string | null
  deletingId: number | null
  togglingReadId: number | null
  inputSearch: string
  page: number
  selectedIds: Set<number>
  refreshNonce: number
}

type Action =
  | { type: "SET_ITEMS"; items: ContactMessage[]; total: number }
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_ERROR"; error: string }
  | { type: "SET_INPUT_SEARCH"; value: string }
  | { type: "SET_PAGE"; page: number }
  | { type: "SET_DELETING_ID"; id: number | null }
  | { type: "SET_TOGGLING_READ_ID"; id: number | null }
  | { type: "REMOVE_ITEM"; id: number }
  | { type: "RESTORE_ITEM"; item: ContactMessage }
  | { type: "UPDATE_ITEM_READ"; id: number; isRead: boolean }
  | { type: "TOGGLE_SELECTED"; id: number }
  | { type: "TOGGLE_SELECT_ALL"; ids: number[] }
  | { type: "CLEAR_SELECTED" }
  | { type: "REMOVE_ITEMS"; ids: number[] }
  | { type: "REFRESH" }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_ITEMS": {
      const nonDeletedIds = new Set(state.items.map((i) => i.id))
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
    case "SET_PAGE":
      return { ...state, page: action.page }
    case "SET_DELETING_ID":
      return { ...state, deletingId: action.id }
    case "SET_TOGGLING_READ_ID":
      return { ...state, togglingReadId: action.id }
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
    case "UPDATE_ITEM_READ":
      return {
        ...state,
        items: state.items.map((i) => (i.id === action.id ? { ...i, isRead: action.isRead } : i)),
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
  deletingId: null,
  togglingReadId: null,
  inputSearch: "",
  page: 1,
  selectedIds: new Set(),
  refreshNonce: 0,
}

const PAGE_SIZE = 20
const SEARCH_DEBOUNCE_MS = 400
const UNDO_TIMEOUT_MS = 5000

function useContactFetch(
  page: number,
  search: string,
  refreshNonce: number,
  dispatch: React.Dispatch<Action>
) {
  const fetchMessages = useCallback(
    async (p: number, s: string) => {
      dispatch({ type: "SET_LOADING", loading: true })
      try {
        const params = new URLSearchParams()
        params.set("page", String(p))
        params.set("limit", String(PAGE_SIZE))
        if (s.trim()) params.set("search", s.trim())

        const res = await fetch(`/api/admin/contact?${params}`)
        const data = await res.json().catch(() => null)
        if (!res.ok) {
          throw new Error((data as { error?: string })?.error ?? "Error al cargar mensajes")
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
    fetchMessages(page, search)
  }, [page, search, refreshNonce, fetchMessages])

  return fetchMessages
}

export function AdminContactContent() {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const undoRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [state, dispatch] = useReducer(reducer, INITIAL)

  const fetchMessages = useContactFetch(state.page, state.inputSearch, state.refreshNonce, dispatch)

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

  const scheduleDelete = useCallback((msg: ContactMessage) => {
    dispatch({ type: "REMOVE_ITEM", id: msg.id })
    toast.success("Mensaje eliminado", {
      duration: UNDO_TIMEOUT_MS,
      action: {
        label: "Deshacer",
        onClick: () => {
          dispatch({ type: "RESTORE_ITEM", item: msg })
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
        await fetch(`/api/admin/contact/${msg.id}`, { method: "DELETE" })
      } catch {
        toast.error("Error al eliminar mensaje")
      }
    }, UNDO_TIMEOUT_MS)
  }, [])

  const handleBulkDelete = useCallback(() => {
    const ids = Array.from(state.selectedIds)
    const itemsToDelete = state.items.filter((i) => ids.includes(i.id))
    dispatch({ type: "REMOVE_ITEMS", ids })

    toast.success(`${ids.length} mensaje(s) eliminado(s)`, {
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
        ids.map((id) => fetch(`/api/admin/contact/${id}`, { method: "DELETE" }))
      )
    }, UNDO_TIMEOUT_MS)
  }, [state.selectedIds, state.items])

  const handleToggleRead = useCallback(async (id: number, isRead: boolean) => {
    dispatch({ type: "SET_TOGGLING_READ_ID", id })
    try {
      const res = await fetch(`/api/admin/contact/${id}/read`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead }),
      })
      if (!res.ok) {
        toast.error("Error al actualizar")
        return
      }
      dispatch({ type: "UPDATE_ITEM_READ", id, isRead })
    } catch {
      toast.error("Error al actualizar mensaje")
    } finally {
      dispatch({ type: "SET_TOGGLING_READ_ID", id: null })
    }
  }, [])

  const handleExportCSV = () => {
    const headers = "Nombre,Apellido,Email,Telefono,Empresa,Mensaje,Leido,Fecha"
    const escapeCsv = (s: string) => `"${s.replace(/"/g, '""')}"`
    const rows = state.items.map(
      (m) =>
        `${escapeCsv(m.nombre)},${escapeCsv(m.apellido)},${escapeCsv(m.email)},${escapeCsv(m.telefono ?? "")},${escapeCsv(m.empresa)},${escapeCsv(m.mensaje)},${m.isRead ? "Si" : "No"},${escapeCsv(new Date(m.createdAt).toLocaleDateString("es-CL"))}`
    )
    const csv = [headers, ...rows].join("\n")
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `contactos-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const totalPages = Math.max(1, Math.ceil(state.total / PAGE_SIZE))
  const allVisibleIds = state.items.map((i) => i.id)
  const allSelected =
    allVisibleIds.length > 0 && allVisibleIds.every((id) => state.selectedIds.has(id))
  const unreadCount = state.items.filter((i) => !i.isRead).length

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Mensajes de contacto</h1>
          <p className="mt-1 text-muted-foreground">
            Solicitudes de contacto recibidas desde el formulario de ventas.
            {unreadCount > 0 && (
              <span className="ml-1 font-medium text-secondary">{unreadCount} sin leer</span>
            )}
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
          placeholder="Buscar por email, nombre o empresa..."
          value={state.inputSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="max-w-sm"
          aria-label="Buscar mensajes"
        />
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
            <p className="text-destructive text-sm font-medium">Error al cargar mensajes</p>
            <p className="text-muted-foreground text-xs">{state.error}</p>
            <Button variant="outline" size="sm" onClick={() => dispatch({ type: "REFRESH" })}>
              Reintentar
            </Button>
          </div>
        ) : state.items.length === 0 ? (
          <div className="flex items-center justify-center p-12 text-muted-foreground">
            {state.inputSearch.trim()
              ? "No se encontraron mensajes con ese criterio"
              : "No hay mensajes de contacto"}
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
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Mensaje</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.items.map((msg) => (
                <TableRow
                  key={msg.id}
                  className={cn(
                    state.selectedIds.has(msg.id) && "bg-secondary/5",
                    !msg.isRead && "font-medium"
                  )}
                >
                  <TableCell>
                    <Checkbox
                      checked={state.selectedIds.has(msg.id)}
                      onCheckedChange={() => dispatch({ type: "TOGGLE_SELECTED", id: msg.id })}
                      aria-label={`Seleccionar ${msg.nombre}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {!msg.isRead && (
                      <span className="mr-1.5 inline-block size-2 rounded-full bg-secondary align-middle" />
                    )}
                    {msg.nombre} {msg.apellido}
                  </TableCell>
                  <TableCell>{msg.email}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1">
                      {msg.empresa}
                      {msg.telefono && (
                        <span className="text-xs text-muted-foreground">({msg.telefono})</span>
                      )}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="truncate text-sm font-normal" title={msg.mensaje}>
                      {msg.mensaje}
                    </p>
                  </TableCell>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => handleToggleRead(msg.id, !msg.isRead)}
                      disabled={state.togglingReadId === msg.id}
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors",
                        msg.isRead
                          ? "bg-muted text-muted-foreground"
                          : "bg-secondary/10 text-secondary hover:bg-secondary/20"
                      )}
                    >
                      {state.togglingReadId === msg.id ? "..." : msg.isRead ? "Leido" : "No leido"}
                    </button>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatFechaRelativa(msg.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => scheduleDelete(msg)}
                      aria-label={`Eliminar mensaje de ${msg.nombre} ${msg.apellido}`}
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
            Pagina {state.page} de {totalPages} ({state.total} mensajes)
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
