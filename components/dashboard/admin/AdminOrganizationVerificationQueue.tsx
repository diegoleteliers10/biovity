"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  listOrganizationVerificationRequests,
  reviewOrganizationVerification,
} from "@/lib/api/organizations"
import { formatFechaRelativa } from "@/lib/utils"

export function AdminOrganizationVerificationQueue() {
  const queryClient = useQueryClient()
  const [reasons, setReasons] = useState<Record<string, string>>({})
  const query = useQuery({
    queryKey: ["admin-organization-verification"],
    queryFn: listOrganizationVerificationRequests,
  })
  const mutation = useMutation({
    mutationFn: (input: { id: string; decision: "approved" | "rejected"; reason: string }) =>
      reviewOrganizationVerification(input.id, {
        decision: input.decision,
        reason: input.reason,
      }),
    onSuccess: async (result) => {
      if (result.isOk()) {
        await queryClient.invalidateQueries({ queryKey: ["admin-organization-verification"] })
      }
    },
  })
  const requests = query.data?.isOk() ? query.data.value : []
  const error = query.data?.isErr()
    ? query.data.error.message
    : mutation.data?.isErr()
      ? mutation.data.error.message
      : undefined

  return (
    <section className="space-y-4 rounded-xl border p-5">
      <header>
        <h2 className="text-lg font-semibold">Verificación de empresas</h2>
        <p className="text-sm text-muted-foreground">
          Revisa la razón social y el registro público antes de aprobar.
        </p>
      </header>
      {query.isLoading && <p className="text-sm text-muted-foreground">Cargando solicitudes</p>}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      {requests.length === 0 && !query.isLoading ? (
        <p className="text-sm text-muted-foreground">No hay solicitudes pendientes.</p>
      ) : (
        <ul className="divide-y">
          {requests.map((request) => {
            const reason = reasons[request.id] ?? ""
            return (
              <li key={request.id} className="grid gap-3 py-4 md:grid-cols-[1fr_280px]">
                <div className="min-w-0 space-y-1 text-sm">
                  <p className="font-medium">
                    {request.organizationName} · {request.legalName}
                  </p>
                  <time
                    className="block text-xs text-muted-foreground"
                    dateTime={request.createdAt}
                  >
                    Recibida {formatFechaRelativa(request.createdAt)}
                  </time>
                  <p className="text-muted-foreground">
                    {request.countryCode} · {request.registrationNumber}
                  </p>
                  <a
                    className="break-all text-primary underline"
                    href={request.registryUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Abrir registro oficial
                  </a>
                  <p className="text-xs text-muted-foreground">Sitio: {request.website}</p>
                  <p className="text-xs text-muted-foreground">
                    Correo corporativo: {request.ownerEmail ?? "Sin correo"} ·{" "}
                    {request.readiness?.corporateEmailVerified ? "confirmado" : "pendiente"}
                  </p>
                  {request.readiness && !request.readiness.profileComplete && (
                    <p className="text-xs text-destructive">
                      Perfil incompleto: {request.readiness.missingProfileFields.join(", ")}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Input
                    aria-label={`Motivo de revisión para ${request.organizationName}`}
                    value={reason}
                    onChange={(event) =>
                      setReasons({ ...reasons, [request.id]: event.target.value })
                    }
                    placeholder="Motivo o nota de aprobación"
                    maxLength={2000}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      disabled={!reason.trim() || mutation.isPending || !request.readiness?.ready}
                      onClick={() =>
                        mutation.mutate({
                          id: request.id,
                          decision: "approved",
                          reason: reason.trim(),
                        })
                      }
                    >
                      Aprobar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!reason.trim() || mutation.isPending}
                      onClick={() =>
                        mutation.mutate({
                          id: request.id,
                          decision: "rejected",
                          reason: reason.trim(),
                        })
                      }
                    >
                      Rechazar
                    </Button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
