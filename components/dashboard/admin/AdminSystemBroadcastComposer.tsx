"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fetchJson } from "@/lib/result"

type OrganizationOption = {
  id: string
  name: string
  address?: { city?: string; country?: string }
}

type OrganizationsPage = {
  data: OrganizationOption[]
  totalPages: number
}

type BroadcastResponse = {
  queued: number
  status: "queued" | "replayed"
}

type BroadcastInput = {
  organizationId: string
  title: string
  body: string
  requestId: string
}

export function AdminSystemBroadcastComposer() {
  const [organizationPage, setOrganizationPage] = useState(1)
  const [organizationId, setOrganizationId] = useState("")
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [requestId, setRequestId] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const organizations = useQuery({
    queryKey: ["admin-broadcast-organizations", organizationPage],
    queryFn: async () => {
      const result = await fetchJson<OrganizationsPage>(
        `/api/admin/organizations?page=${organizationPage}`
      )
      return result.isOk() ? result.value : Promise.reject(result.error)
    },
  })

  const broadcast = useMutation({
    mutationFn: (input: BroadcastInput) =>
      fetchJson<BroadcastResponse>("/api/admin/notifications/system/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }),
    onSuccess: (result) => {
      if (result.isErr()) {
        setSubmitError(result.error.message)
        toast.error(result.error.message)
        return
      }
      toast.success(`Aviso agregado a la cola para ${result.value.queued} personas`)
      setTitle("")
      setBody("")
      setRequestId(null)
      setSubmitError(null)
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "No se pudo enviar el aviso."
      setSubmitError(message)
      toast.error(message)
    },
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!organizationId || !title.trim() || !body.trim() || broadcast.isPending) return

    const stableRequestId = requestId ?? crypto.randomUUID()
    setRequestId(stableRequestId)
    setSubmitError(null)
    broadcast.mutate({
      organizationId,
      title: title.trim(),
      body: body.trim(),
      requestId: stableRequestId,
    })
  }

  const pageCount = Math.max(1, organizations.data?.totalPages ?? 1)
  const pageItems = organizations.data?.data ?? []

  return (
    <section className="space-y-4 rounded-lg border border-border/40 bg-surface-container-lowest p-4 sm:p-6">
      <h2 className="text-sm font-medium">Enviar aviso a una empresa</h2>
      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-xs font-medium" htmlFor="broadcast-organization">
            Empresa
          </label>
          <select
            id="broadcast-organization"
            className="h-11 w-full rounded-lg border border-border/40 bg-background px-3 text-sm"
            value={organizationId}
            onChange={(event) => setOrganizationId(event.target.value)}
            required
            disabled={Boolean(requestId) || organizations.isLoading || pageItems.length === 0}
          >
            <option value="">Seleccionar empresa</option>
            {pageItems.map((organization) => {
              const location = [organization.address?.city, organization.address?.country]
                .filter(Boolean)
                .join(", ")
              return (
                <option key={organization.id} value={organization.id}>
                  {location ? `${organization.name} · ${location}` : organization.name}
                </option>
              )
            })}
          </select>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={Boolean(requestId) || organizationPage <= 1 || organizations.isLoading}
              onClick={() => {
                setOrganizationId("")
                setOrganizationPage((page) => page - 1)
              }}
            >
              Anterior
            </Button>
            <span>
              {organizations.isLoading
                ? "Cargando empresas"
                : `Página ${organizationPage} de ${pageCount}`}
            </span>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={
                Boolean(requestId) || organizationPage >= pageCount || organizations.isLoading
              }
              onClick={() => {
                setOrganizationId("")
                setOrganizationPage((page) => page + 1)
              }}
            >
              Siguiente
            </Button>
          </div>
          {organizations.isError && (
            <p className="text-xs text-destructive">No se pudo cargar la lista de empresas.</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium" htmlFor="broadcast-title">
            Título
          </label>
          <Input
            id="broadcast-title"
            value={title}
            maxLength={160}
            onChange={(event) => setTitle(event.target.value)}
            required
            disabled={Boolean(requestId)}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-medium" htmlFor="broadcast-body">
            Mensaje
          </label>
          <textarea
            id="broadcast-body"
            className="min-h-28 w-full rounded-lg border border-border/40 bg-background px-3 py-2 text-sm"
            value={body}
            maxLength={2000}
            onChange={(event) => setBody(event.target.value)}
            required
            disabled={Boolean(requestId)}
          />
        </div>

        <div className="md:col-span-2">
          <div className="flex flex-wrap gap-2">
            <Button
              type="submit"
              disabled={!organizationId || !title.trim() || !body.trim() || broadcast.isPending}
            >
              {broadcast.isPending
                ? "Enviando…"
                : requestId
                  ? "Reintentar aviso"
                  : "Agregar aviso a la cola"}
            </Button>
            {requestId && !broadcast.isPending && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setRequestId(null)
                  setSubmitError(null)
                }}
              >
                Cancelar reintento
              </Button>
            )}
          </div>
          {submitError && <p className="mt-2 text-xs text-destructive">{submitError}</p>}
        </div>
      </form>
    </section>
  )
}
