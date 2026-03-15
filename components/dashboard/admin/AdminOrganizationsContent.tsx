"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { setUserActive } from "@/lib/api/users"

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
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    return d.toLocaleDateString("es-CL", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  } catch {
    return iso
  }
}

export function AdminOrganizationsContent() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [appliedFilters, setAppliedFilters] = useState({ search: "" })
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const fetchOrganizations = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set("page", String(page))
      params.set("limit", "20")
      params.set("type", "organization")
      if (appliedFilters.search.trim()) params.set("search", appliedFilters.search.trim())

      const res = await fetch(`/api/admin/users?${params}`)
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        throw new Error((data as { error?: string })?.error ?? "Error al cargar organizaciones")
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
  }, [page, appliedFilters])

  useEffect(() => {
    fetchOrganizations()
  }, [fetchOrganizations])

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppliedFilters((prev) => ({ ...prev, search }))
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [search])

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
        <h1 className="text-2xl font-bold">Organizaciones</h1>
        <p className="mt-1 text-muted-foreground">
          Usuarios con tipo organización. Gestiona el estado de activación.
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        <Input
          placeholder="Buscar por email o nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
          aria-label="Buscar organizaciones"
        />
      </div>

      <div className="rounded-lg border">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-muted-foreground">
            Cargando...
          </div>
        ) : users.length === 0 ? (
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
              {users.map((user) => (
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
                      disabled={togglingId === user.id}
                      aria-label={user.isActive ? "Desactivar" : "Activar"}
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
            Página {page} de {totalPages} ({total} organizaciones)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
