"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { Result } from "better-result"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  type AdminLegacyChatSummary,
  assignAdminChatOrganization,
  getAdminLegacyChat,
  getAdminLegacyChats,
  getAdminVerifiedOrganizations,
} from "@/lib/api/admin-chats"

const PAGE_SIZE = 20
const ORGANIZATION_PAGE_SIZE = 50

function formatDate(value: string | null | undefined) {
  if (!value) return "Sin fecha"
  return new Date(value).toLocaleString("es-CL")
}

async function requireValue<T>(result: Result<T, unknown>): Promise<T> {
  if (result.isErr()) return Promise.reject(result.error)
  return result.value
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Error inesperado"
}

function ChatRow({
  chat,
  selected,
  onSelect,
}: {
  chat: AdminLegacyChatSummary
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`w-full rounded-md border p-3 text-left ${selected ? "border-primary bg-primary/5" : "border-border"}`}
    >
      <span className="block font-medium">
        {chat.recruiter.name} · {chat.professional.name}
      </span>
      <span className="mt-1 block text-sm text-muted-foreground">
        {chat.recruiter.email} · {chat.professional.email}
      </span>
      <span className="mt-1 block text-xs text-muted-foreground">
        Actualizado {formatDate(chat.updatedAt ?? chat.createdAt)}
      </span>
    </button>
  )
}

export function AdminLegacyChatsContent() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [organizationSearch, setOrganizationSearch] = useState("")
  const [organizationPage, setOrganizationPage] = useState(1)
  const [organizationId, setOrganizationId] = useState("")

  const chatsQuery = useQuery({
    queryKey: ["admin-legacy-chats", page],
    queryFn: async () => requireValue(await getAdminLegacyChats({ page, limit: PAGE_SIZE })),
  })
  const detailQuery = useQuery({
    queryKey: ["admin-legacy-chat", selectedChatId],
    queryFn: async () => {
      if (!selectedChatId) return null
      return requireValue(await getAdminLegacyChat(selectedChatId))
    },
    enabled: selectedChatId !== null,
  })
  const organizationsQuery = useQuery({
    queryKey: ["admin-verified-chat-organizations", organizationPage, organizationSearch],
    queryFn: async () =>
      requireValue(
        await getAdminVerifiedOrganizations({
          page: organizationPage,
          limit: ORGANIZATION_PAGE_SIZE,
          search: organizationSearch,
        })
      ),
  })
  const assignmentMutation = useMutation({
    mutationFn: async () => {
      if (!selectedChatId || !organizationId) {
        return Promise.reject(new Error("Selecciona un chat y una organización"))
      }
      return requireValue(await assignAdminChatOrganization(selectedChatId, organizationId))
    },
    onSuccess: async () => {
      toast.success("Organización asignada al chat")
      setSelectedChatId(null)
      setOrganizationId("")
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-legacy-chats"] }),
        queryClient.invalidateQueries({ queryKey: ["admin-legacy-chat"] }),
      ])
    },
    onError: (error: unknown) => toast.error(getErrorMessage(error)),
  })

  const totalPages = Math.max(1, chatsQuery.data?.totalPages ?? 1)
  const organizationTotalPages = Math.max(1, organizationsQuery.data?.totalPages ?? 1)
  const detail = detailQuery.data

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Revisión de chats
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Revisa participantes e historial antes de asignar una organización verificada.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Chats sin organización ({chatsQuery.data?.total ?? 0})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {chatsQuery.isPending && <p role="status">Cargando chats…</p>}
            {chatsQuery.isError && <p role="alert">{getErrorMessage(chatsQuery.error)}</p>}
            {!chatsQuery.isPending && chatsQuery.data?.data.length === 0 && (
              <p>No hay chats pendientes de revisión.</p>
            )}
            {chatsQuery.data?.data.map((chat) => (
              <ChatRow
                key={chat.id}
                chat={chat}
                selected={selectedChatId === chat.id}
                onSelect={() => setSelectedChatId(chat.id)}
              />
            ))}
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm text-muted-foreground">
                Página {page} de {totalPages}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Participantes e historial</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {!selectedChatId && <p>Selecciona un chat para revisar su historial.</p>}
            {detailQuery.isPending && <p role="status">Cargando historial…</p>}
            {detailQuery.isError && <p role="alert">{getErrorMessage(detailQuery.error)}</p>}
            {detail && (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <h2 className="font-medium">Reclutador</h2>
                    <p>{detail.recruiter.name}</p>
                    <p className="text-sm text-muted-foreground">{detail.recruiter.email}</p>
                  </div>
                  <div>
                    <h2 className="font-medium">Profesional</h2>
                    <p>{detail.professional.name}</p>
                    <p className="text-sm text-muted-foreground">{detail.professional.email}</p>
                  </div>
                </div>

                <div>
                  <h2 className="mb-2 font-medium">Mensajes</h2>
                  <ol className="max-h-80 space-y-3 overflow-y-auto rounded-md border p-3">
                    {detail.messages.map((message) => (
                      <li key={message.id} className="border-b pb-3 last:border-b-0">
                        <p className="text-sm font-medium">
                          {message.senderName} · {formatDate(message.createdAt)}
                        </p>
                        <p className="mt-1 whitespace-pre-wrap text-sm">{message.content}</p>
                      </li>
                    ))}
                    {detail.messages.length === 0 && <li>No hay mensajes en este chat.</li>}
                  </ol>
                </div>

                <div className="space-y-3 border-t pt-4">
                  <label
                    className="block text-sm font-medium"
                    htmlFor="verified-organization-search"
                  >
                    Organización verificada
                  </label>
                  <Input
                    id="verified-organization-search"
                    value={organizationSearch}
                    onChange={(event) => {
                      setOrganizationSearch(event.target.value)
                      setOrganizationPage(1)
                      setOrganizationId("")
                    }}
                    placeholder="Buscar por nombre"
                  />
                  <select
                    aria-label="Seleccionar organización verificada"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    value={organizationId}
                    onChange={(event) => setOrganizationId(event.target.value)}
                  >
                    <option value="">Selecciona una organización</option>
                    {organizationsQuery.data?.data.map((organization) => (
                      <option key={organization.id} value={organization.id}>
                        {organization.name}
                      </option>
                    ))}
                  </select>
                  {organizationsQuery.isError && (
                    <p role="alert">{getErrorMessage(organizationsQuery.error)}</p>
                  )}
                  {organizationsQuery.data?.data.length === 0 && (
                    <p>No hay organizaciones verificadas con ese nombre.</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Página {organizationPage} de {organizationTotalPages}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        disabled={organizationPage <= 1}
                        onClick={() => setOrganizationPage(organizationPage - 1)}
                      >
                        Anterior
                      </Button>
                      <Button
                        variant="outline"
                        disabled={organizationPage >= organizationTotalPages}
                        onClick={() => setOrganizationPage(organizationPage + 1)}
                      >
                        Siguiente
                      </Button>
                    </div>
                  </div>
                  <Button
                    disabled={!organizationId || assignmentMutation.isPending}
                    onClick={() => assignmentMutation.mutate()}
                  >
                    Asignar organización
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Si el historial no demuestra la relación, deja el chat sin asignar.
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
