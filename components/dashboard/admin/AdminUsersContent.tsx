"use client"

import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useQueryStates } from "nuqs"
import { useCallback, useEffect, useRef, useState } from "react"
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
import { adminUsersParsers } from "@/lib/parsers/admin-users"

type AdminUser = {
  id: string
  email: string
  name: string
  type: string
  isActive: boolean
  createdAt: string
}

const SEARCH_DEBOUNCE_MS = 400

export function AdminUsersContent() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [urlState, setUrlState] = useQueryStates(adminUsersParsers, {
    history: "push",
    shallow: false,
  })
  const { page, search } = urlState

  const [inputSearch, setInputSearch] = useState(search)

  useEffect(() => {
    setInputSearch(search)
  }, [search])

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set("page", String(page))
      params.set("limit", "20")
      params.set("type", "professional")
      if (search.trim()) params.set("search", search.trim())

      const res = await fetch(`/api/admin/users?${params}`)
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        throw new Error((data as { error?: string })?.error ?? "Error al cargar usuarios")
      }
      setUsers(data.data ?? [])
      setTotal(data.total ?? 0)
    } catch (err) {
      console.error(err)
      setUsers([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleSearchChange = useCallback(
    (value: string) => {
      setInputSearch(value)
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
    setTogglingId(user.id)
    try {
      const result = await setUserActive(user.id, !user.isActive)
      if ("error" in result) {
        alert(result.error)
        return
      }
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isActive: result.isActive } : u))
      )
    } finally {
      setTogglingId(null)
    }
  }

  const totalPages = Math.ceil(total / 20)

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <p className="mt-1 text-muted-foreground">
          Profesionales registrados. Gestiona el estado de activación. Los inactivos no pueden
          iniciar sesión.
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        <Input
          placeholder="Buscar por email o nombre..."
          value={inputSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="max-w-sm"
          aria-label="Buscar usuarios"
        />
      </div>

      <div className="rounded-lg border">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-muted-foreground">
            Cargando...
          </div>
        ) : users.length === 0 ? (
          <div className="flex items-center justify-center p-12 text-muted-foreground">
            No hay usuarios
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>{user.name || "—"}</TableCell>
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
                      disabled={togglingId === user.id}
                      aria-label={user.isActive ? "Desactivar usuario" : "Activar usuario"}
                    >
                      {togglingId === user.id
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
            Página {page} de {totalPages} ({total} usuarios)
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
