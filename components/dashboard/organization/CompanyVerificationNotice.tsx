"use client"

import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { getOrganizationVerification } from "@/lib/api/organizations"

export function CompanyVerificationNotice({ organizationId }: { organizationId: string }) {
  const query = useQuery({
    queryKey: ["organization-verification", organizationId],
    queryFn: () => getOrganizationVerification(organizationId),
  })
  const result = query.data?.isOk() ? query.data.value : undefined
  if (!result || result.status === "verified") return null

  const message =
    result.status === "pending"
      ? "La empresa está en revisión. Las ofertas y acciones de selección se habilitarán después de la aprobación."
      : result.status === "rejected"
        ? "La verificación requiere cambios. Actualiza los datos para volver a solicitarla."
        : result.status === "suspended"
          ? "La verificación de la empresa está suspendida. Contacta a soporte."
          : "Verifica la empresa para publicar ofertas y gestionar procesos de selección."

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:bg-amber-950/30 dark:text-amber-100 sm:px-6">
      <p>{message}</p>
      <Link
        className="font-medium underline underline-offset-4"
        href="/dashboard/profile?tab=verification"
      >
        Verificación de empresa
      </Link>
    </div>
  )
}
