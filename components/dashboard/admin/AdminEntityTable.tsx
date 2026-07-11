"use client"

import { ArrowLeft01Icon, ArrowRight01Icon, Refresh01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Result } from "better-result"
import { type ParserBuilder, useQueryStates } from "nuqs"
import { useCallback, useEffect, useReducer, useRef, useState } from "react"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/dashboard/admin/ConfirmDialog"
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
import { setUserActive } from "@/lib/api/users"
import { getResultErrorMessage } from "@/lib/result"
import type { AdminUser } from "@/lib/types/admin"
import { formatDateChilean } from "@/lib/utils"

type EntityState = {
  items: AdminUser[]
  total: number
  loading: boolean
  error: string | null
  togglingId: string | null
  inputSearch: string
  selectedIds: Set<string>
  refreshNonce: number
}

type EntityAction =
  | { type: "SET_ITEMS"; items: AdminUser[]; total: number }
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_TOGGLING_ID"; id: string | null }
  | { type: "SET_INPUT_SEARCH"; value: string }
  | { type: "UPDATE_ITEM"; id: string; isActive: boolean }
  | { type: "SET_ERROR"; error: string }
  | { type: "CLEAR_ITEMS" }
  | { type: "TOGGLE_SELECTED"; id: string }
  | { type: "TOGGLE_SELECT_ALL"; ids: string[] }
  | { type: "CLEAR_SELECTED" }
  | { type: "BULK_UPDATE"; ids: string[]; isActive: boolean }
  | { type: "REFRESH" }

function entityReducer(state: EntityState, action: EntityAction): EntityState {
  switch (action.type) {
    case "SET_ITEMS": {
      const preserved = new Set<string>()
      for (const id of state.selectedIds) {
        if (action.items.some((i) => i.id === id)) preserved.add(id)
      }
      return {
        ...state,
        items: action.items,
        total: action.total,
        error: null,
        selectedIds: preserved,
      }
    }
    case "SET_LOADING":
      return { ...state, loading: action.loading }
    case "SET_TOGGLING_ID":
      return { ...state, togglingId: action.id }
    case "SET_INPUT_SEARCH":
      return { ...state, inputSearch: action.value }
    case "UPDATE_ITEM":
      return {
        ...state,
        items: state.items.map((u) =>
          u.id === action.id ? { ...u, isActive: action.isActive } : u
        ),
      }
    case "SET_ERROR":
      return { ...state, error: action.error }
    case "CLEAR_ITEMS":
      return { ...state, items: [], total: 0 }
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
    case "BULK_UPDATE":
      return {
        ...state,
        items: state.items.map((u) =>
          action.ids.includes(u.id) ? { ...u, isActive: action.isActive } : u
        ),
        selectedIds: new Set(),
      }
    case "REFRESH":
      return { ...state, refreshNonce: state.refreshNonce + 1 }
  }
}

function createInitialState(): EntityState {
  return {
    items: [],
    total: 0,
    loading: true,
    error: null,
    togglingId: null,
    inputSearch: "",
    selectedIds: new Set(),
    refreshNonce: 0,
  }
}

const SEARCH_DEBOUNCE_MS = 400
const PAGE_SIZE = 20

function formatDate(iso: string): string {
  try {
    return formatDateChilean(iso, "d MMM yyyy")
  } catch {
    return iso
  }
}

function useEntityFetch(
  safePage: number,
  safeSearch: string,
  apiType: "professional" | "organization",
  entityNamePlural: string,
  extraSearchParams: Record<string, string> | undefined,
  refreshNonce: number,
  dispatch: React.Dispatch<EntityAction>
) {
  const fetchItems = useCallback(async () => {
    dispatch({ type: "SET_LOADING", loading: true })
    try {
      const params = new URLSearchParams()
      params.set("page", String(safePage))
      params.set("limit", String(PAGE_SIZE))
      params.set("type", apiType)
      if (safeSearch.trim()) params.set("search", safeSearch.trim())
      if (extraSearchParams) {
        for (const [key, value] of Object.entries(extraSearchParams)) {
          if (value) params.set(key, value)
        }
      }

      const res = await fetch(`/api/admin/users?${params}`)
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        throw new Error(
          (data as { error?: string })?.error ?? `Error al cargar ${entityNamePlural}`
        )
      }
      dispatch({
        type: "SET_ITEMS",
        items: data.data ?? [],
        total: data.total ?? 0,
      })
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : `Error desconocido al cargar ${entityNamePlural}`
      console.error(msg)
      dispatch({ type: "SET_ERROR", error: msg })
      dispatch({ type: "CLEAR_ITEMS" })
    } finally {
      dispatch({ type: "SET_LOADING", loading: false })
    }
  }, [safePage, safeSearch, apiType, entityNamePlural, extraSearchParams, dispatch])

  useEffect(() => {
    fetchItems()
  }, [fetchItems, refreshNonce])

  return fetchItems
}

export type AdminEntityColumn = {
  key: string
  header: string
  render: (item: AdminUser) => React.ReactNode
  className?: string
}

type AdminEntityTableProps = {
  columns: AdminEntityColumn[]
  apiType: "professional" | "organization"
  title: string
  description: string
  entityName: string
  entityNamePlural: string
  parsers: {
    page: ParserBuilder<number>
    search: ParserBuilder<string>
  }
  searchPlaceholder: string
  searchLabel: string
  filters?: React.ReactNode
  extraActions?: React.ReactNode
  extraSearchParams?: Record<string, string>
  onRowClick?: (item: AdminUser) => void
}

export function AdminEntityTable({
  columns,
  apiType,
  title,
  description,
  entityName,
  entityNamePlural,
  parsers,
  searchPlaceholder,
  searchLabel,
  filters,
  extraActions,
  extraSearchParams,
  onRowClick,
}: AdminEntityTableProps) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [urlState, setUrlState] = useQueryStates(parsers, {
    history: "push",
    shallow: false,
  })
  const safePage = urlState.page ?? 1
  const safeSearch = urlState.search ?? ""

  const [state, dispatch] = useReducer(entityReducer, undefined, createInitialState)

  const fetchItems = useEntityFetch(
    safePage,
    safeSearch,
    apiType,
    entityNamePlural,
    extraSearchParams,
    state.refreshNonce,
    dispatch
  )

  const handleSearchChange = useCallback(
    (value: string) => {
      dispatch({ type: "SET_INPUT_SEARCH", value })
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        setUrlState({ search: value, page: 1 })
        debounceRef.current = null
      }, SEARCH_DEBOUNCE_MS)
    },
    [setUrlState]
  )

  useMountEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  })

  const [confirmToggleItem, setConfirmToggleItem] = useState<AdminUser | null>(null)
  const [confirmBulkDeactivate, setConfirmBulkDeactivate] = useState(false)

  const handleToggleActive = async (item: AdminUser) => {
    dispatch({ type: "SET_TOGGLING_ID", id: item.id })
    try {
      const result = await setUserActive(item.id, !item.isActive)
      if (!Result.isOk(result)) {
        toast.error(getResultErrorMessage(result.error))
        return
      }
      dispatch({ type: "UPDATE_ITEM", id: item.id, isActive: result.value.isActive })
      toast.success(result.value.isActive ? `${entityName} activado` : `${entityName} desactivado`)
    } finally {
      dispatch({ type: "SET_TOGGLING_ID", id: null })
      setConfirmToggleItem(null)
    }
  }

  const handleBulkToggle = async (isActive: boolean) => {
    const ids = Array.from(state.selectedIds)
    dispatch({ type: "BULK_UPDATE", ids, isActive })
    setConfirmBulkDeactivate(false)
    const results = await Promise.allSettled(ids.map((id) => setUserActive(id, isActive)))
    const failed = results.filter((r) => r.status === "rejected").length
    if (failed > 0) {
      toast.error(`${failed} de ${ids.length} fallaron al actualizar`)
      dispatch({ type: "REFRESH" })
    } else {
      toast.success(`${ids.length} ${entityNamePlural} ${isActive ? "activados" : "desactivados"}`)
    }
  }

  const handleToggleClick = (item: AdminUser) => {
    if (item.isActive) {
      setConfirmToggleItem(item)
    } else {
      handleToggleActive(item)
    }
  }

  const totalPages = Math.max(1, Math.ceil(state.total / PAGE_SIZE))

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="mt-1 text-muted-foreground">{description}</p>
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

      <div className="flex flex-wrap gap-4">
        <Input
          placeholder={searchPlaceholder}
          value={state.inputSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="max-w-sm"
          aria-label={searchLabel}
        />
        {filters}
        {extraActions && <div className="ml-auto">{extraActions}</div>}
      </div>

      {state.selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-secondary/30 bg-secondary/5 p-3">
          <span className="text-sm font-medium">{state.selectedIds.size} seleccionado(s)</span>
          <Button variant="outline" size="sm" onClick={() => handleBulkToggle(true)}>
            Activar
          </Button>
          <Button variant="outline" size="sm" onClick={() => setConfirmBulkDeactivate(true)}>
            Desactivar
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
            <p className="text-destructive text-sm font-medium">
              Error al cargar {entityNamePlural}
            </p>
            <p className="text-muted-foreground text-xs">{state.error}</p>
            <Button variant="outline" size="sm" onClick={fetchItems}>
              Reintentar
            </Button>
          </div>
        ) : state.items.length === 0 ? (
          <div className="flex items-center justify-center p-12 text-muted-foreground">
            No hay {entityNamePlural}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={
                      state.items.length > 0 &&
                      state.items.every((i) => state.selectedIds.has(i.id))
                    }
                    onCheckedChange={() =>
                      dispatch({
                        type: "TOGGLE_SELECT_ALL",
                        ids: state.items.map((i) => i.id),
                      })
                    }
                    aria-label="Seleccionar todos"
                  />
                </TableHead>
                {columns.map((col) => (
                  <TableHead key={col.key} className={col.className}>
                    {col.header}
                  </TableHead>
                ))}
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.items.map((item) => (
                <TableRow
                  key={item.id}
                  className={
                    onRowClick
                      ? `cursor-pointer hover:bg-muted/30 ${state.selectedIds.has(item.id) ? "bg-secondary/5" : ""}`
                      : state.selectedIds.has(item.id)
                        ? "bg-secondary/5"
                        : undefined
                  }
                  onClick={
                    onRowClick
                      ? (e) => {
                          if ((e.target as HTMLElement).closest("button")) return
                          onRowClick(item)
                        }
                      : undefined
                  }
                >
                  <TableCell>
                    <Checkbox
                      checked={state.selectedIds.has(item.id)}
                      onCheckedChange={() => dispatch({ type: "TOGGLE_SELECTED", id: item.id })}
                      aria-label={`Seleccionar ${item.email}`}
                    />
                  </TableCell>
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      {col.render(item)}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleClick(item)}
                      disabled={state.togglingId === item.id}
                      aria-label={item.isActive ? "Desactivar" : "Activar"}
                    >
                      {state.togglingId === item.id
                        ? "Actualizando..."
                        : item.isActive
                          ? "Desactivar"
                          : "Activar"}
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
            Pagina {safePage} de {totalPages} ({state.total} {entityNamePlural})
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUrlState({ page: Math.max(1, safePage - 1) })}
              disabled={safePage <= 1}
              aria-label="Pagina anterior"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUrlState({ page: Math.min(totalPages, safePage + 1) })}
              disabled={safePage >= totalPages}
              aria-label="Pagina siguiente"
            >
              <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
            </Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmToggleItem !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmToggleItem(null)
        }}
        onConfirm={() => {
          if (confirmToggleItem) handleToggleActive(confirmToggleItem)
        }}
        isPending={state.togglingId !== null}
        title={`Desactivar ${entityName.toLowerCase()}`}
        description={`Este ${entityName.toLowerCase()} no podra iniciar sesion mientras este inactivo. Puedes reactivarlo en cualquier momento.`}
        confirmLabel="Desactivar"
      />

      <ConfirmDialog
        open={confirmBulkDeactivate}
        onOpenChange={setConfirmBulkDeactivate}
        onConfirm={() => handleBulkToggle(false)}
        isPending={false}
        title={`Desactivar ${state.selectedIds.size} ${entityNamePlural}`}
        description="Los usuarios seleccionados no podran iniciar sesion mientras esten inactivos. Puedes reactivarlos en cualquier momento."
        confirmLabel="Desactivar todos"
      />
    </div>
  )
}
