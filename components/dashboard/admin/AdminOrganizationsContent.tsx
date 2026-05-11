"use client"

import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Result } from "better-result"
import { useQueryStates } from "nuqs"
import { useCallback, useEffect, useReducer, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { setUserActive } from "@/lib/api/users"
import { adminOrganizationsParsers } from "@/lib/parsers/admin-organizations"
import { getResultErrorMessage } from "@/lib/result"
import { formatDateChilean } from "@/lib/utils"

type AdminUser = {
  id: string
  email: string
  name: string
  type: string
  isActive: boolean
  createdAt: string
}

function formatDate(iso: string): string {
  try {
    return formatDateChilean(iso, "d MMM yyyy")
  } catch {
    return iso
  }
}

type OrgsState = {
  users: AdminUser[]
  total: number
  loading: boolean
  togglingId: string | null
  inputSearch: string
}

type OrgsAction =
  | { type: "SET_USERS"; users: AdminUser[]; total: number }
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_TOGGLING_ID"; id: string | null }
  | { type: "SET_INPUT_SEARCH"; value: string }
  | { type: "UPDATE_USER"; id: string; isActive: boolean }
  | { type: "CLEAR_USERS" }

const orgsReducer = (state: OrgsState, action: OrgsAction): OrgsState => {
  switch (action.type) {
    case "SET_USERS":
      return { ...state, users: action.users, total: action.total }
    case "SET_LOADING":
      return { ...state, loading: action.loading }
    case "SET_TOGGLING_ID":
      return { ...state, togglingId: action.id }
    case "SET_INPUT_SEARCH":
      return { ...state, inputSearch: action.value }
    case "UPDATE_USER":
      return {
        ...state,
        users: state.users.map((u) =>
          u.id === action.id ? { ...u, isActive: action.isActive } : u
        ),
      }
    case "CLEAR_USERS":
      return { ...state, users: [], total: 0 }
  }
}

const initialOrgsState: OrgsState = {
  users: [],
  total: 0,
  loading: true,
  togglingId: null,
  inputSearch: "",
}

const SEARCH_DEBOUNCE_MS = 400

export function AdminOrganizationsContent() {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [urlState, setUrlState] = useQueryStates(adminOrganizationsParsers, {
    history: "push",
    shallow: false,
  })
  const { page, search } = urlState

  const [state, dispatch] = useReducer(orgsReducer, initialOrgsState)

  const fetchOrganizations = useCallback(async () => {
    dispatch({ type: "SET_LOADING", loading: true })
    try {
      const params = new URLSearchParams()
      params.set("page", String(page))
      params.set("limit", "20")
      params.set("type", "organization")
      if (search.trim()) params.set("search", search.trim())

      const res = await fetch(`/api/admin/users?${params}`)
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        throw new Error((data as { error?: string })?.error ?? "Error al cargar organizaciones")
      }
      dispatch({ type: "SET_USERS", users: data.data ?? [], total: data.total ?? 0 })
    } catch (err) {
      console.error(err)
      dispatch({ type: "CLEAR_USERS" })
    } finally {
      dispatch({ type: "SET_LOADING", loading: false })
    }
  }, [page, search])

  useEffect(() => {
    fetchOrganizations()
  }, [fetchOrganizations])

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

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  const handleToggleActive = async (user: AdminUser) => {
    dispatch({ type: "SET_TOGGLING_ID", id: user.id })
    try {
      const result = await setUserActive(user.id, !user.isActive)
      if (!Result.isOk(result)) {
        alert(getResultErrorMessage(result.error))
        return
      }
      dispatch({ type: "UPDATE_USER", id: user.id, isActive: result.value.isActive })
    } finally {
      dispatch({ type: "SET_TOGGLING_ID", id: null })
    }
  }

  const totalPages = Math.ceil(state.total / 20)

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Organizaciones</h1>
        <p className="mt-1 text-muted-foreground">
          Usuarios con tipo organización. Gestiona el estado de activación.
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        <Input
          placeholder="Buscar por email o nombre..."
          value={state.inputSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="max-w-sm"
          aria-label="Buscar organizaciones"
        />
      </div>

      <div className="rounded-lg border">
        {state.loading ? (
          <div className="flex items-center justify-center p-12 text-muted-foreground">
            Cargando…
          </div>
        ) : state.users.length === 0 ? (
          <div className="flex items-center justify-center p-12 text-muted-foreground">
            No hay organizaciones
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Registrado</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>{user.name || "—"}</TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? "default" : "secondary"}>
                      {user.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(user)}
                      disabled={state.togglingId === user.id}
                      aria-label={user.isActive ? "Desactivar" : "Activar"}
                    >
                      {state.togglingId === user.id
                        ? "Actualizando..."
                        : user.isActive
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

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Página {page} de {totalPages} ({state.total} organizaciones)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUrlState({ page: Math.max(1, page - 1) })}
              disabled={page <= 1}
              aria-label="Página anterior"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUrlState({ page: Math.min(totalPages, page + 1) })}
              disabled={page >= totalPages}
              aria-label="Página siguiente"
            >
              <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
