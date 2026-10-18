"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { AdminButton as Button } from "@/components/dashboard/admin/AdminButton"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
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
    <section className="space-y-3 rounded-xl border border-border/40 bg-surface-container-lowest p-4 shadow-none sm:p-5">
      <header className="flex items-center justify-between gap-3">
        <h2 className="text-xs leading-4 font-medium text-foreground">Solicitudes pendientes</h2>
        <Button
          size="sm"
          variant="outline"
          onClick={() => query.refetch()}
          disabled={query.isFetching}
        >
          Actualizar
        </Button>
      </header>
      {query.isLoading && (
        <div className="space-y-3" aria-label="Cargando solicitudes">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      )}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      {requests.length === 0 && !query.isLoading && !error ? (
        <p className="text-sm text-muted-foreground">No hay solicitudes pendientes.</p>
      ) : (
        requests.length > 0 && (
          <ul className="divide-y divide-border/40">
            {requests.map((request) => {
              const reason = reasons[request.id] ?? ""
              return (
                <li key={request.id} className="grid gap-4 py-4 md:grid-cols-[minmax(0,1fr)_320px]">
                  <div className="min-w-0 space-y-1 text-sm">
                    <p className="font-medium text-foreground">
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
                      className="break-all text-secondary underline underline-offset-2"
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
                      className="h-11"
                      value={reason}
                      onChange={(event) =>
                        setReasons({ ...reasons, [request.id]: event.target.value })
                      }
                      placeholder="Motivo o nota de aprobación"
                      maxLength={2000}
                    />
                    <div className="flex flex-wrap gap-2">
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
        )
      )}
    </section>
  )
}
