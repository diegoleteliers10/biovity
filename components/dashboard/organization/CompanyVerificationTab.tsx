"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
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

export function CompanyVerificationTab({ organizationId }: { organizationId: string }) {
  const queryClient = useQueryClient()
  const [form, setForm] = useState<SubmitOrganizationVerificationInput>({
    legalName: "",
    countryCode: "CL",
    registrationNumber: "",
    registryUrl: "",
  })
  const query = useQuery({
    queryKey: ["organization-verification", organizationId],
    queryFn: () => getOrganizationVerification(organizationId),
  })
  const mutation = useMutation({
    mutationFn: (input: SubmitOrganizationVerificationInput) =>
      submitOrganizationVerification(organizationId, input),
    onSuccess: async (result) => {
      if (result.isOk()) {
        setForm({ legalName: "", countryCode: "CL", registrationNumber: "", registryUrl: "" })
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
  const profileFieldLabels: Record<string, string> = {
    name: "nombre",
    website: "sitio web",
    description: "descripción",
    industry: "industria",
    size: "tamaño",
    city: "ciudad",
    country: "país",
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-base font-semibold">Verificación de empresa</h2>
        {verification && (
          <Badge variant={verification.status === "verified" ? "default" : "secondary"}>
            {statusLabels[verification.status]}
          </Badge>
        )}
      </div>
      <p className="max-w-2xl text-sm text-muted-foreground">
        Puedes completar tu empresa y preparar ofertas mientras revisamos los datos legales. La
        publicación se activa cuando aprobamos la verificación.
      </p>
      {query.isLoading && <p className="text-sm text-muted-foreground">Cargando estado</p>}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      {latest?.reviewReason && latest.status === "rejected" && (
        <p className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm">
          Motivo de revisión: {latest.reviewReason}
        </p>
      )}
      {readiness && !readiness.ready && (
        <div className="max-w-2xl rounded-md border bg-muted/30 p-3 text-sm">
          <p>Completa estos datos para enviar la revisión legal:</p>
          <ul className="mt-2 list-inside list-disc">
            {!readiness.corporateEmailVerified && (
              <li>Confirma un correo con el dominio del sitio web</li>
            )}
            {readiness.missingProfileFields.map((field) => (
              <li key={field}>{profileFieldLabels[field] ?? field}</li>
            ))}
          </ul>
        </div>
      )}
      {verification?.status === "verified" ? (
        <p className="text-sm">
          Empresa aprobada el{" "}
          {latest?.reviewedAt ? new Date(latest.reviewedAt).toLocaleDateString("es-CL") : ""}.
        </p>
      ) : verification?.status === "pending" ? (
        <p className="text-sm">
          La solicitud está en revisión. Revisa esta pestaña para ver la decisión y su motivo.
        </p>
      ) : readiness?.ready ? (
        <form
          className="grid max-w-2xl gap-4 sm:grid-cols-2"
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
              onChange={(event) => setForm({ ...form, registrationNumber: event.target.value })}
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
            <Button type="submit" disabled={mutation.isPending || query.isLoading}>
              {mutation.isPending ? "Enviando" : "Enviar a revisión"}
            </Button>
          </div>
        </form>
      ) : null}
    </section>
  )
}
