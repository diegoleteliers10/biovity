"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  type ContactInquiry,
  type ContactInquiryEvent,
  type ContactInquiryStatus,
  getAllContactInquiries,
  getContactInquiries,
  getContactInquiryEvents,
  getContactInquiryOperators,
  updateContactInquiry,
  updateContactInquiryRead,
} from "@/lib/api/admin-contact-inquiries"
import { formatFechaRelativa } from "@/lib/utils"

const PAGE_SIZE = 20
const STATUS_OPTIONS: { value: ContactInquiryStatus | "all"; label: string }[] = [
  { value: "open", label: "Abiertas" },
  { value: "in_progress", label: "En curso" },
  { value: "resolved", label: "Resueltas" },
  { value: "all", label: "Todos los estados" },
]

export function ContactInquiryQueue() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<ContactInquiryStatus | "all">("open")
  const [assigneeId, setAssigneeId] = useState("all")
  const [overdue, setOverdue] = useState(false)
  const [page, setPage] = useState(1)
  const filters = { page, limit: PAGE_SIZE, search, status, assigneeId, overdue }
  const inquiriesQuery = useQuery({
    queryKey: ["admin-contact-inquiries", filters],
    queryFn: () => getContactInquiries(filters),
    staleTime: 15_000,
  })
  const operatorsQuery = useQuery({
    queryKey: ["admin-contact-inquiry-operators"],
    queryFn: getContactInquiryOperators,
    staleTime: 60_000,
  })
  const updateMutation = useMutation({
    mutationFn: (input: { id: number; update: Parameters<typeof updateContactInquiry>[1] }) =>
      updateContactInquiry(input.id, input.update),
    onSuccess: (result) => {
      if (result.isErr()) {
        toast.error("No se pudo guardar el seguimiento")
        return
      }
      toast.success("Seguimiento guardado")
      void queryClient.invalidateQueries({ queryKey: ["admin-contact-inquiries"] })
    },
  })
  const readMutation = useMutation({
    mutationFn: (input: { id: number; isRead: boolean }) =>
      updateContactInquiryRead(input.id, input.isRead),
    onSuccess: (result) => {
      if (result.isErr()) {
        toast.error("No se pudo actualizar la consulta")
        return
      }
      void queryClient.invalidateQueries({ queryKey: ["admin-contact-inquiries"] })
    },
  })

  const pageResult = inquiriesQuery.data
  const inquiries = pageResult?.isOk() ? pageResult.value : undefined
  const operatorsResult = operatorsQuery.data
  const operators = operatorsResult?.isOk() ? operatorsResult.value : []
  const error = pageResult?.isErr() ? pageResult.error.message : null

  function updateFilter<T>(setValue: (value: T) => void, value: T) {
    setPage(1)
    setValue(value)
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Consultas de contacto
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Asigna cada consulta, fija una fecha de seguimiento y registra el resultado.
            </p>
          </div>
          <Button variant="outline" onClick={() => void exportInquiries(filters)}>
            Exportar CSV
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Input
          value={search}
          onChange={(event) => updateFilter(setSearch, event.target.value)}
          placeholder="Buscar persona, correo o empresa"
          aria-label="Buscar consultas"
          className="h-10 max-w-sm"
        />
        <select
          value={status}
          onChange={(event) =>
            updateFilter(setStatus, event.target.value as ContactInquiryStatus | "all")
          }
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          aria-label="Filtrar por estado"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          value={assigneeId}
          onChange={(event) => updateFilter(setAssigneeId, event.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          aria-label="Filtrar por responsable"
        >
          <option value="all">Todo el equipo</option>
          <option value="unassigned">Sin responsable</option>
          {operators.map((operator) => (
            <option key={operator.id} value={operator.id}>
              {operator.name || operator.email}
            </option>
          ))}
        </select>
        <label className="flex h-10 items-center gap-2 rounded-md border px-3 text-sm">
          <input
            type="checkbox"
            checked={overdue}
            onChange={(event) => updateFilter(setOverdue, event.target.checked)}
          />
          Seguimiento vencido
        </label>
      </div>

      {inquiries && (
        <p className="text-sm text-muted-foreground">
          {inquiries.total} consulta{inquiries.total === 1 ? "" : "s"}
        </p>
      )}

      <div className="overflow-x-auto rounded-lg border">
        {inquiriesQuery.isLoading ? (
          <div className="space-y-3 p-6">
            {[0, 1, 2].map((item) => (
              <Skeleton key={item} className="h-16 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-sm text-destructive">{error}</div>
        ) : inquiries?.data.length ? (
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="border-b bg-muted/30 text-xs text-muted-foreground">
              <tr>
                <th className="px-3 py-3 font-medium">Consulta</th>
                <th className="px-3 py-3 font-medium">Mensaje</th>
                <th className="px-3 py-3 font-medium">Estado y seguimiento</th>
                <th className="px-3 py-3 font-medium">Historial</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {inquiries.data.map((inquiry) => (
                <ContactInquiryRow
                  key={`${inquiry.id}-${inquiry.updatedAt}`}
                  inquiry={inquiry}
                  operators={operators}
                  onSave={(update) => updateMutation.mutate({ id: inquiry.id, update })}
                  onToggleRead={(isRead) => readMutation.mutate({ id: inquiry.id, isRead })}
                  saving={updateMutation.isPending}
                />
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No hay consultas para estos filtros.
          </div>
        )}
      </div>

      {inquiries && inquiries.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Página {inquiries.page} de {inquiries.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= inquiries.totalPages}
              onClick={() => setPage((current) => Math.min(inquiries.totalPages, current + 1))}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

async function exportInquiries(filters: Parameters<typeof getAllContactInquiries>[0]) {
  const result = await getAllContactInquiries(filters)
  if (result.isErr()) {
    toast.error("No se pudo exportar la lista")
    return
  }
  const columns: (keyof ContactInquiry)[] = [
    "nombre",
    "apellido",
    "email",
    "telefono",
    "empresa",
    "mensaje",
    "status",
    "assigneeName",
    "followUpAt",
    "resolutionNote",
    "createdAt",
  ]
  const csvCell = (value: unknown) => {
    const text = String(value ?? "")
    const safe = /^\s*[=+@-]/.test(text) ? `'${text}` : text
    return `"${safe.replaceAll('"', '""')}"`
  }
  const csv = [
    columns.map(csvCell).join(","),
    ...result.value.map((inquiry) => columns.map((column) => csvCell(inquiry[column])).join(",")),
  ].join("\r\n")
  const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }))
  const link = document.createElement("a")
  link.href = url
  link.download = `consultas-contacto-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

function ContactInquiryRow({
  inquiry,
  operators,
  onSave,
  onToggleRead,
  saving,
}: {
  inquiry: ContactInquiry
  operators: { id: string; name: string; email: string }[]
  onSave: (update: Parameters<typeof updateContactInquiry>[1]) => void
  onToggleRead: (isRead: boolean) => void
  saving: boolean
}) {
  const [status, setStatus] = useState(inquiry.status)
  const [assignedAdminId, setAssignedAdminId] = useState(inquiry.assignedAdminId ?? "")
  const [followUpAt, setFollowUpAt] = useState(inquiry.followUpAt ?? "")
  const [resolutionNote, setResolutionNote] = useState(inquiry.resolutionNote ?? "")
  const isDirty =
    status !== inquiry.status ||
    assignedAdminId !== (inquiry.assignedAdminId ?? "") ||
    followUpAt !== (inquiry.followUpAt ?? "") ||
    resolutionNote !== (inquiry.resolutionNote ?? "")

  return (
    <tr className="align-top">
      <td className="max-w-56 px-3 py-4">
        <p className="font-medium">
          {inquiry.nombre} {inquiry.apellido}
        </p>
        <a
          className="text-xs text-primary underline-offset-4 hover:underline"
          href={`mailto:${inquiry.email}`}
        >
          {inquiry.email}
        </a>
        <p className="mt-1 text-xs text-muted-foreground">{inquiry.empresa}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          {formatFechaRelativa(inquiry.createdAt)}
          {!inquiry.isRead ? " · Sin leer" : ""}
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="mt-1 h-7 px-2 text-xs"
          onClick={() => onToggleRead(!inquiry.isRead)}
        >
          Marcar como {inquiry.isRead ? "no leída" : "leída"}
        </Button>
      </td>
      <td className="max-w-sm px-3 py-4">
        <details>
          <summary className="cursor-pointer truncate font-medium">{inquiry.mensaje}</summary>
          <p className="mt-2 whitespace-pre-wrap text-xs text-muted-foreground">
            {inquiry.mensaje}
          </p>
          {inquiry.telefono && <p className="mt-2 text-xs">Teléfono: {inquiry.telefono}</p>}
        </details>
      </td>
      <td className="min-w-[430px] space-y-2 px-3 py-4">
        <div className="grid grid-cols-2 gap-2">
          <label className="space-y-1 text-xs text-muted-foreground">
            Estado
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as ContactInquiryStatus)}
              className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm text-foreground"
            >
              <option value="open">Abierta</option>
              <option value="in_progress">En curso</option>
              <option value="resolved">Resuelta</option>
            </select>
          </label>
          <label className="space-y-1 text-xs text-muted-foreground">
            Responsable
            <select
              value={assignedAdminId}
              onChange={(event) => setAssignedAdminId(event.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm text-foreground"
            >
              <option value="">Sin responsable</option>
              {operators.map((operator) => (
                <option key={operator.id} value={operator.id}>
                  {operator.name || operator.email}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label
          htmlFor={`contact-follow-up-${inquiry.id}`}
          className="block space-y-1 text-xs text-muted-foreground"
        >
          Próxima fecha de seguimiento
          <Input
            id={`contact-follow-up-${inquiry.id}`}
            type="date"
            value={followUpAt}
            onChange={(event) => setFollowUpAt(event.target.value)}
            className="h-9"
          />
        </label>
        <label
          htmlFor={`contact-resolution-note-${inquiry.id}`}
          className="block space-y-1 text-xs text-muted-foreground"
        >
          Resultado o nota interna
          <Input
            id={`contact-resolution-note-${inquiry.id}`}
            value={resolutionNote}
            onChange={(event) => setResolutionNote(event.target.value)}
            maxLength={4000}
            placeholder="Registra el resultado del contacto"
            className="h-9"
          />
        </label>
        <Button
          size="sm"
          disabled={!isDirty || saving || (status === "resolved" && !resolutionNote.trim())}
          onClick={() =>
            onSave({
              status,
              assignedAdminId: assignedAdminId || null,
              followUpAt: followUpAt || null,
              resolutionNote: resolutionNote.trim() || null,
            })
          }
        >
          Guardar cambios
        </Button>
      </td>
      <td className="w-48 px-3 py-4">
        <ContactInquiryHistory inquiryId={inquiry.id} />
      </td>
    </tr>
  )
}

function ContactInquiryHistory({ inquiryId }: { inquiryId: number }) {
  const [open, setOpen] = useState(false)
  const eventsQuery = useQuery({
    queryKey: ["admin-contact-inquiry-events", inquiryId],
    queryFn: () => getContactInquiryEvents(inquiryId),
    enabled: open,
  })
  const result = eventsQuery.data
  const events = result?.isOk() ? result.value : []

  return (
    <details open={open} onToggle={(event) => setOpen(event.currentTarget.open)}>
      <summary className="cursor-pointer text-xs font-medium">Ver historial</summary>
      {eventsQuery.isLoading ? (
        <p className="mt-2 text-xs text-muted-foreground">Cargando...</p>
      ) : result?.isErr() ? (
        <p className="mt-2 text-xs text-destructive">No se pudo cargar el historial.</p>
      ) : events.length === 0 ? (
        <p className="mt-2 text-xs text-muted-foreground">Sin cambios registrados.</p>
      ) : (
        <ol className="mt-2 space-y-2">
          {events.map((item) => (
            <li key={item.id} className="border-l pl-2 text-xs">
              <p>{eventSummary(item)}</p>
              <p className="text-muted-foreground">
                {item.actorName ?? "Administrador"} · {formatFechaRelativa(item.createdAt)}
              </p>
              {item.note && <p className="mt-1 text-muted-foreground">{item.note}</p>}
            </li>
          ))}
        </ol>
      )}
    </details>
  )
}

function eventSummary(event: ContactInquiryEvent) {
  const labels: Record<string, string> = {
    open: "Abierta",
    in_progress: "En curso",
    resolved: "Resuelta",
  }
  if (event.previousStatus !== event.newStatus && event.newStatus)
    return `Estado: ${labels[event.previousStatus ?? "open"]} → ${labels[event.newStatus]}`
  if (event.previousAssignedAdminId !== event.newAssignedAdminId) return "Responsable actualizado"
  if (event.previousFollowUpAt !== event.newFollowUpAt) return "Fecha de seguimiento actualizada"
  return "Nota registrada"
}
