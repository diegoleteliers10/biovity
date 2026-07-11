"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useCallback, useState } from "react"
import {
  type AdminEntityColumn,
  AdminEntityTable,
} from "@/components/dashboard/admin/AdminEntityTable"
import { UserDetailSheet } from "@/components/dashboard/admin/UserDetailSheet"
import { Badge } from "@/components/ui/badge"
import { adminUsersParsers } from "@/lib/parsers/admin-users"
import type { AdminUser } from "@/lib/types/admin"

const IS_ACTIVE_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "true", label: "Activos" },
  { value: "false", label: "Inactivos" },
]

const usersColumns: AdminEntityColumn[] = [
  { key: "email", header: "Email", render: (u) => <span className="font-medium">{u.email}</span> },
  { key: "name", header: "Nombre", render: (u) => u.name || "—" },
  {
    key: "type",
    header: "Tipo",
    render: (u) => (
      <Badge variant="outline" className="capitalize">
        {u.type === "professional" ? "Profesional" : u.type}
      </Badge>
    ),
  },
  {
    key: "isActive",
    header: "Estado",
    render: (u) => (
      <Badge variant={u.isActive ? "default" : "secondary"}>
        {u.isActive ? "Activo" : "Inactivo"}
      </Badge>
    ),
  },
]

export function AdminUsersContent() {
  const [isActiveFilter, setIsActiveFilter] = useState("")
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const queryClient = useQueryClient()

  const handleUserUpdated = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["admin-stats"] })
  }, [queryClient])

  const filterSelect = (
    <select
      value={isActiveFilter}
      onChange={(e) => setIsActiveFilter(e.target.value)}
      className="h-9 rounded-md border border-input bg-background px-3 text-xs"
      aria-label="Filtrar por estado"
    >
      {IS_ACTIVE_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )

  const extraSearchParams: Record<string, string> = {}
  if (isActiveFilter) extraSearchParams.isActive = isActiveFilter

  return (
    <>
      <AdminEntityTable
        columns={usersColumns}
        apiType="professional"
        title="Usuarios"
        description="Profesionales registrados. Gestiona el estado de activacion. Los inactivos no pueden iniciar sesion."
        entityName="Usuario"
        entityNamePlural="usuarios"
        parsers={adminUsersParsers}
        searchPlaceholder="Buscar por email o nombre..."
        searchLabel="Buscar usuarios"
        filters={filterSelect}
        extraSearchParams={extraSearchParams}
        onRowClick={setSelectedUser}
      />
      <UserDetailSheet
        key={selectedUser?.id ?? "none"}
        user={selectedUser}
        open={selectedUser !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedUser(null)
        }}
        onUserUpdated={handleUserUpdated}
      />
    </>
  )
}
