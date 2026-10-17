"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  getOrganizationVerification,
  type SubmitOrganizationVerificationInput,
  submitOrganizationVerification,
} from "@/lib/api/organizations"

const statusLabels = {
  unverified: "Sin verificar",
  pending: "En revisión",
  verified: "Verificada",
  rejected: "Requiere cambios",
  suspended: "Suspendida",
} as const

const profileFieldLabels: Record<string, string> = {
  name: "Nombre de la empresa",
  website: "Sitio web",
  description: "Descripción",
  industry: "Industria",
  size: "Tamaño de la empresa",
  city: "Ciudad",
  country: "País",
}

const initialForm: SubmitOrganizationVerificationInput = {
  legalName: "",
  countryCode: "CL",
  registrationNumber: "",
  registryUrl: "",
}

export function CompanyVerificationTab({ organizationId }: { organizationId: string }) {
  const queryClient = useQueryClient()
  const [form, setForm] = useState<SubmitOrganizationVerificationInput>(initialForm)
  const query = useQuery({
    queryKey: ["organization-verification", organizationId],
    queryFn: () => getOrganizationVerification(organizationId),
  })
  const mutation = useMutation({
    mutationFn: (input: SubmitOrganizationVerificationInput) =>
      submitOrganizationVerification(organizationId, input),
    onSuccess: async (result) => {
      if (result.isOk()) {
        setForm(initialForm)
        await queryClient.invalidateQueries({
          queryKey: ["organization-verification", organizationId],
        })
      }
    },
  })
  const verification = query.data?.isOk() ? query.data.value : undefined
  const error = query.data?.isErr()
    ? query.data.error.message
    : mutation.data?.isErr()
      ? mutation.data.error.message
      : undefined
  const latest = verification?.latestRequest
  const readiness = verification?.readiness

  return (
    <section className="max-w-4xl space-y-6">
      <header className="flex flex-wrap items-center gap-3">
        <h2 className="text-base font-semibold">Verificación de empresa</h2>
        {verification && (
          <Badge variant={verification.status === "verified" ? "default" : "secondary"}>
            {statusLabels[verification.status]}
          </Badge>
        )}
      </header>

      {query.isLoading && <p className="text-sm text-muted-foreground">Cargando estado…</p>}

      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4"
        >
          <p className="text-sm text-destructive">{error}</p>
          {query.data?.isErr() && (
            <Button type="button" variant="outline" size="sm" onClick={() => query.refetch()}>
              Reintentar
            </Button>
          )}
        </div>
      )}

      {verification?.status === "verified" && (
        <section className="rounded-xl border border-border/40 bg-surface-container-low p-5 shadow-none">
          <p className="text-sm font-medium">Empresa verificada</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {latest?.reviewedAt
              ? `Aprobada el ${new Date(latest.reviewedAt).toLocaleDateString("es-CL")}.`
              : "La empresa puede publicar ofertas."}
          </p>
        </section>
      )}

      {verification?.status === "pending" && (
        <section className="rounded-xl border border-border/40 bg-surface-container-low p-5 shadow-none">
          <p className="text-sm font-medium">Solicitud en revisión</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Enviada el{" "}
            {latest?.createdAt ? new Date(latest.createdAt).toLocaleDateString("es-CL") : ""}. Te
            avisaremos cuando el equipo resuelva la revisión.
          </p>
          {latest?.legalName && <p className="mt-3 text-sm">Razón social: {latest.legalName}</p>}
        </section>
      )}

      {verification?.status === "suspended" && (
        <section className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
          <p className="text-sm font-medium text-destructive">Verificación suspendida</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Contacta al equipo de Biovity para revisar el estado de la empresa.
          </p>
        </section>
      )}

      {verification?.status === "rejected" && latest?.reviewReason && (
        <section className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-xs leading-4 font-medium text-foreground">Cambios solicitados</p>
          <p className="mt-1 text-sm text-muted-foreground">{latest.reviewReason}</p>
        </section>
      )}

      {readiness &&
        verification?.status !== "verified" &&
        verification?.status !== "pending" &&
        verification?.status !== "suspended" && (
          <>
            <section className="rounded-xl border border-border/40 bg-surface-container-low p-5 shadow-none">
              <h3 className="text-xs leading-4 font-medium text-foreground">
                Requisitos del perfil
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className={
                      readiness.corporateEmailVerified ? "text-secondary" : "text-muted-foreground"
                    }
                  >
                    {readiness.corporateEmailVerified ? "✓" : "○"}
                  </span>
                  <span className="sr-only">
                    {readiness.corporateEmailVerified ? "Verificado" : "Pendiente"}
                  </span>
                  <span>
                    Correo corporativo verificado con el mismo dominio del sitio web
                    {!readiness.corporateEmailVerified && (
                      <span className="mt-1 block text-xs text-muted-foreground">
                        Verifica el correo de la cuenta y confirma que coincida con el sitio web.
                      </span>
                    )}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className={
                      readiness.profileComplete ? "text-secondary" : "text-muted-foreground"
                    }
                  >
                    {readiness.profileComplete ? "✓" : "○"}
                  </span>
                  <span className="sr-only">
                    {readiness.profileComplete ? "Completo" : "Pendiente"}
                  </span>
                  <span>
                    Perfil de empresa completo
                    {readiness.missingProfileFields.length > 0 && (
                      <span className="mt-1 block text-xs text-muted-foreground">
                        Faltan:{" "}
                        {readiness.missingProfileFields
                          .map((field) => profileFieldLabels[field] ?? field)
                          .join(", ")}
                        .
                      </span>
                    )}
                  </span>
                </li>
              </ul>
              {!readiness.ready && (
                <Button asChild variant="outline" size="sm" className="mt-5">
                  <Link href="/dashboard/profile?tab=profile">Completar perfil</Link>
                </Button>
              )}
            </section>

            {readiness.ready ? (
              <section className="space-y-4">
                <div>
                  <h3 className="text-xs leading-4 font-medium text-foreground">
                    Enviar revisión legal
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Ingresa los datos legales y un enlace HTTPS al registro público oficial.
                  </p>
                </div>
                <form
                  className="grid max-w-3xl gap-4 sm:grid-cols-2"
                  onSubmit={(event) => {
                    event.preventDefault()
                    mutation.mutate(form)
                  }}
                >
                  <label htmlFor="verification-legal-name" className="grid gap-1.5 text-sm">
                    Razón social
                    <Input
                      id="verification-legal-name"
                      required
                      maxLength={200}
                      value={form.legalName}
                      onChange={(event) => setForm({ ...form, legalName: event.target.value })}
                    />
                  </label>
                  <label htmlFor="verification-country" className="grid gap-1.5 text-sm">
                    País (código ISO)
                    <Input
                      id="verification-country"
                      required
                      minLength={2}
                      maxLength={2}
                      value={form.countryCode}
                      onChange={(event) =>
                        setForm({ ...form, countryCode: event.target.value.toUpperCase() })
                      }
                    />
                  </label>
                  <label htmlFor="verification-registration" className="grid gap-1.5 text-sm">
                    Identificador tributario o registro
                    <Input
                      id="verification-registration"
                      required
                      maxLength={100}
                      value={form.registrationNumber}
                      onChange={(event) =>
                        setForm({ ...form, registrationNumber: event.target.value })
                      }
                    />
                  </label>
                  <label htmlFor="verification-registry" className="grid gap-1.5 text-sm">
                    Enlace a registro público oficial
                    <Input
                      id="verification-registry"
                      required
                      type="url"
                      pattern="https://.*"
                      value={form.registryUrl}
                      onChange={(event) => setForm({ ...form, registryUrl: event.target.value })}
                    />
                  </label>
                  <div className="sm:col-span-2">
                    <Button type="submit" disabled={mutation.isPending}>
                      {mutation.isPending ? "Enviando…" : "Enviar a revisión"}
                    </Button>
                  </div>
                </form>
              </section>
            ) : (
              <p className="text-sm text-muted-foreground">
                Cuando completes ambos requisitos, podrás enviar la información legal para revisión.
              </p>
            )}
          </>
        )}
    </section>
  )
}
