"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"
import { AdminButton as Button } from "@/components/dashboard/admin/AdminButton"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
    <section className="space-y-5 rounded-xl border border-border/40 bg-surface-container-lowest p-5 shadow-none sm:p-6">
      <h2 className="text-xs leading-4 font-medium text-foreground">Enviar aviso</h2>
      <form className="grid max-w-5xl gap-x-6 gap-y-6 md:grid-cols-2" onSubmit={handleSubmit}>
        <div className="space-y-3">
          <label
            className="text-xs leading-4 font-medium text-foreground"
            htmlFor="broadcast-organization"
          >
            Empresa
          </label>
          <Select
            value={organizationId || "none"}
            onValueChange={(value) => setOrganizationId(value === "none" ? "" : value)}
            disabled={Boolean(requestId) || organizations.isLoading || pageItems.length === 0}
          >
            <SelectTrigger id="broadcast-organization" className="h-11 w-full">
              <SelectValue placeholder="Seleccionar empresa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Seleccionar empresa</SelectItem>
              {pageItems.map((organization) => {
                const location = [organization.address?.city, organization.address?.country]
                  .filter(Boolean)
                  .join(", ")
                return (
                  <SelectItem key={organization.id} value={organization.id}>
                    {location ? `${organization.name} · ${location}` : organization.name}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
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

        <div className="space-y-3">
          <label
            className="text-xs leading-4 font-medium text-foreground"
            htmlFor="broadcast-title"
          >
            Título
          </label>
          <Input
            id="broadcast-title"
            className="h-11"
            value={title}
            maxLength={160}
            onChange={(event) => setTitle(event.target.value)}
            required
            disabled={Boolean(requestId)}
          />
        </div>

        <div className="space-y-3 md:col-span-2">
          <label className="text-xs leading-4 font-medium text-foreground" htmlFor="broadcast-body">
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
              className="h-11"
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
