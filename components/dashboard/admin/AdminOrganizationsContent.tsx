"use client"

import { Result } from "better-result"
import {
  type AdminEntityColumn,
  AdminEntityTable,
} from "@/components/dashboard/admin/AdminEntityTable"
import { AdminOrganizationVerificationQueue } from "@/components/dashboard/admin/AdminOrganizationVerificationQueue"
import { AdminSystemBroadcastComposer } from "@/components/dashboard/admin/AdminSystemBroadcastComposer"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { adminOrganizationsParsers } from "@/lib/parsers/admin-organizations"
import { formatDateChilean } from "@/lib/utils"

function formatDate(iso: string): string {
  const result = Result.try(() => formatDateChilean(iso, "d MMM yyyy"))
  return result.isOk() ? result.value : iso
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
      <Badge
        variant={u.isActive ? "default" : "secondary"}
        className={
          u.isActive
            ? "dark:bg-secondary-container dark:text-on-secondary-container dark:border-secondary-soft/35"
            : undefined
        }
      >
        {u.isActive ? "Activo" : "Inactivo"}
      </Badge>
    ),
  },
]

export function AdminOrganizationsContent() {
  return (
    <div className="p-4 sm:p-6">
      <Tabs defaultValue="accounts" className="gap-4">
        <TabsList
          variant="line"
          className="h-10 w-full justify-start gap-2 rounded-none border-b border-border/40 p-0"
        >
          <TabsTrigger value="accounts" className="h-10 flex-none px-3 text-xs">
            Cuentas
          </TabsTrigger>
          <TabsTrigger value="verification" className="h-10 flex-none px-3 text-xs">
            Verificación
          </TabsTrigger>
          <TabsTrigger value="notices" className="h-10 flex-none px-3 text-xs">
            Avisos
          </TabsTrigger>
        </TabsList>
        <TabsContent value="accounts" className="mt-0">
          <AdminEntityTable
            className="p-0"
            columns={orgColumns}
            apiType="organization"
            title="Cuentas de organización"
            entityName="Organizacion"
            entityNamePlural="organizaciones"
            parsers={adminOrganizationsParsers}
            searchPlaceholder="Buscar por email o nombre..."
            searchLabel="Buscar organizaciones"
          />
        </TabsContent>
        <TabsContent value="verification" className="mt-0">
          <AdminOrganizationVerificationQueue />
        </TabsContent>
        <TabsContent value="notices" className="mt-0">
          <AdminSystemBroadcastComposer />
        </TabsContent>
      </Tabs>
    </div>
  )
}
