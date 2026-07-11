"use client"

import {
  type AdminEntityColumn,
  AdminEntityTable,
} from "@/components/dashboard/admin/AdminEntityTable"
import { Badge } from "@/components/ui/badge"
import { adminOrganizationsParsers } from "@/lib/parsers/admin-organizations"
import { formatDateChilean } from "@/lib/utils"

function formatDate(iso: string): string {
  try {
    return formatDateChilean(iso, "d MMM yyyy")
  } catch {
    return iso
  }
}

const orgColumns: AdminEntityColumn[] = [
  { key: "email", header: "Email", render: (u) => <span className="font-medium">{u.email}</span> },
  { key: "name", header: "Nombre", render: (u) => u.name || "—" },
  {
    key: "createdAt",
    header: "Registrado",
    render: (u) => formatDate(u.createdAt),
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

export function AdminOrganizationsContent() {
  return (
    <AdminEntityTable
      columns={orgColumns}
      apiType="organization"
      title="Organizaciones"
      description="Usuarios con tipo organizacion. Gestiona el estado de activacion."
      entityName="Organizacion"
      entityNamePlural="organizaciones"
      parsers={adminOrganizationsParsers}
      searchPlaceholder="Buscar por email o nombre..."
      searchLabel="Buscar organizaciones"
    />
  )
}
