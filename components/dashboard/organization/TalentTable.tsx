"use client"

import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Calendar01Icon,
  Location01Icon,
  Mail01Icon,
  Sent02Icon,
  SmartPhone01Icon,
  StarIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRouter } from "next/navigation"
import { Avatar } from "@/components/base/avatar/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { useCreateOrFindChatMutation } from "@/lib/api/use-chats"
import type { User } from "@/lib/api/users"
import { formatUserLocation } from "@/lib/api/users"

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

function formatRelativeDate(dateStr: string): string {
  if (!dateStr) return "—"
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return "Hoy"
  if (diffDays === 1) return "Ayer"
  if (diffDays < 7) return `Hace ${diffDays} días`
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} sem.`
  if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} mes.`
  return `Hace ${Math.floor(diffDays / 365)} año/s`
}

interface TalentTableProps {
  users: User[]
  recruiterId: string | undefined
  createChatMutation: ReturnType<typeof useCreateOrFindChatMutation>
  onRowClick: (userId: string) => void
  currentPage: number
  totalPages: number
  total: number
  onPrevPage: () => void
  onNextPage: () => void
  // F8.8 — Bulk select
  selectedIds: Set<string>
  onSelectToggle: (userId: string) => void
  onSelectAll: () => void
  onDeselectAll: () => void
}

export function TalentTable({
  users,
  recruiterId,
  createChatMutation,
  onRowClick,
  currentPage,
  totalPages,
  total,
  onPrevPage,
  onNextPage,
  selectedIds,
  onSelectToggle,
  onSelectAll,
  onDeselectAll,
}: TalentTableProps) {
  const { push } = useRouter()

  const handleSendMessage = (professionalId: string) => (e: React.MouseEvent) => {
    e.stopPropagation()
    createChatMutation.mutate(professionalId, {
      onSuccess: (chat) => {
        if (chat?.id) {
          push(`/dashboard/messages?chat=${chat.id}`)
        }
      },
    })
  }

  const startItem = total === 0 ? 0 : (currentPage - 1) * 20 + 1
  const endItem = Math.min(currentPage * 20, total)

  const allSelected = users.length > 0 && users.every((u) => selectedIds.has(u.id))
  const someSelected = users.some((u) => selectedIds.has(u.id)) && !allSelected

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              {/* F8.8 — Select all */}
              <TableHead className="w-10">
                <Checkbox
                  id="select-all"
                  checked={allSelected ? true : someSelected ? "indeterminate" : false}
                  onCheckedChange={(checked) => {
                    if (checked) onSelectAll()
                    else onDeselectAll()
                  }}
                  aria-label="Seleccionar todos"
                />
              </TableHead>
              <TableHead className="w-[180px]">Nombre</TableHead>
              {/* F8.2 — Profession already showed as separate col */}
              <TableHead>Profesión</TableHead>
              {/* F8.2 — Skills column */}
              <TableHead className="hidden lg:table-cell">Habilidades</TableHead>
              <TableHead className="hidden md:table-cell">Ubicación</TableHead>
              {/* F8.2 — Last activity */}
              <TableHead className="hidden xl:table-cell">Actividad</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="w-[44px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const isSelected = selectedIds.has(user.id)
              // Derive skills from resume if available or from metadata
              const skillsRaw = (user as unknown as Record<string, unknown>).skills
              const skills: string[] = Array.isArray(skillsRaw)
                ? (skillsRaw as string[]).slice(0, 3)
                : []

              return (
                <TableRow
                  key={user.id}
                  className={`cursor-pointer active:scale-[0.99] transition-all duration-150 ${isSelected ? "bg-secondary/5" : ""}`}
                  onClick={() => onRowClick(user.id)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      onRowClick(user.id)
                    }
                  }}
                  role="button"
                  aria-label={`Ver perfil de ${user.name}`}
                  aria-selected={isSelected}
                >
                  {/* Checkbox */}
                  <TableCell
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectToggle(user.id)
                    }}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onSelectToggle(user.id)}
                      aria-label={`Seleccionar ${user.name}`}
                      id={`select-${user.id}`}
                    />
                  </TableCell>

                  {/* Nombre con hover card */}
                  <TableCell className="font-medium">
                    <HoverCard openDelay={100} closeDelay={200}>
                      <HoverCardTrigger asChild>
                        <span className="flex items-center gap-2 cursor-pointer">
                          <Avatar
                            src={user.avatar}
                            alt={user.name}
                            initials={getInitials(user.name)}
                            size="sm"
                            className="shrink-0"
                          />
                          <span className="min-w-0 truncate font-medium text-foreground hover:text-primary hover:underline transition-colors">
                            {user.name}
                          </span>
                        </span>
                      </HoverCardTrigger>
                      <HoverCardContent
                        side="right"
                        align="start"
                        sideOffset={10}
                        className="w-80 overflow-hidden rounded-xl border-0 bg-background p-0 shadow-xl ring-1 ring-border/50"
                      >
                        <div className="bg-muted/30 p-4">
                          <div className="flex items-center gap-4">
                            <Avatar
                              src={user.avatar}
                              alt={user.name}
                              initials={getInitials(user.name)}
                              size="xl"
                              className="ring-2 ring-background"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-semibold text-foreground">{user.name}</p>
                              {user.profession && (
                                <p className="mt-0.5 truncate text-muted-foreground text-sm">
                                  {user.profession}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-px px-4 py-3">
                          <a
                            href={`mailto:${user.email}`}
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                              <HugeiconsIcon icon={Mail01Icon} size={16} className="text-primary" />
                            </div>
                            <span className="min-w-0 truncate">{user.email}</span>
                          </a>
                          {user.phone && (
                            <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground text-sm">
                              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                                <HugeiconsIcon
                                  icon={SmartPhone01Icon}
                                  size={16}
                                  className="text-primary"
                                />
                              </div>
                              <span>{user.phone}</span>
                            </div>
                          )}
                          {formatUserLocation(user.location) && (
                            <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground text-sm">
                              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                                <HugeiconsIcon
                                  icon={Location01Icon}
                                  size={16}
                                  className="text-primary"
                                />
                              </div>
                              <span>{formatUserLocation(user.location)}</span>
                            </div>
                          )}
                        </div>
                        <div className="border-t border-border/50 px-4 py-3">
                          <Button
                            size="sm"
                            className="w-full gap-2"
                            onClick={handleSendMessage(user.id)}
                            disabled={!recruiterId || createChatMutation.isPending}
                            aria-label={`Enviar mensaje a ${user.name}`}
                          >
                            {createChatMutation.isPending &&
                            createChatMutation.variables === user.id ? (
                              <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            ) : (
                              <HugeiconsIcon icon={Sent02Icon} size={16} />
                            )}
                            {createChatMutation.isPending &&
                            createChatMutation.variables === user.id
                              ? "Enviando..."
                              : "Enviar mensaje"}
                          </Button>
                          <p className="mt-2 text-center text-muted-foreground text-xs">
                            Haz clic en la fila para ver el perfil completo
                          </p>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </TableCell>

                  {/* Profesión */}
                  <TableCell className="text-muted-foreground">
                    {user.profession ? (
                      <span className="flex items-center gap-1.5">
                        <HugeiconsIcon
                          icon={StarIcon}
                          size={12}
                          strokeWidth={1.5}
                          className="text-secondary shrink-0"
                        />
                        {user.profession}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </TableCell>

                  {/* F8.2 — Skills */}
                  <TableCell className="hidden lg:table-cell">
                    {skills.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {skills.map((s) => (
                          <Badge
                            key={s}
                            variant="outline"
                            className="text-[10px] px-1.5 py-0 h-5 font-normal"
                          >
                            {s}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground/40 text-xs">Sin datos</span>
                    )}
                  </TableCell>

                  {/* Ubicación */}
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {formatUserLocation(user.location) ? (
                      <span className="flex items-center gap-1.5">
                        <HugeiconsIcon
                          icon={Location01Icon}
                          size={12}
                          strokeWidth={1.5}
                          className="shrink-0"
                        />
                        {formatUserLocation(user.location)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </TableCell>

                  {/* F8.2 — Última actividad */}
                  <TableCell className="hidden xl:table-cell text-muted-foreground text-xs">
                    <span className="flex items-center gap-1.5">
                      <HugeiconsIcon
                        icon={Calendar01Icon}
                        size={12}
                        strokeWidth={1.5}
                        className="shrink-0"
                      />
                      {formatRelativeDate(user.updatedAt || user.createdAt)}
                    </span>
                  </TableCell>

                  {/* Email */}
                  <TableCell className="hidden truncate text-muted-foreground md:table-cell text-xs">
                    {user.email}
                  </TableCell>

                  {/* Acción rápida — enviar mensaje */}
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={handleSendMessage(user.id)}
                      disabled={!recruiterId || createChatMutation.isPending}
                      aria-label={`Mensaje a ${user.name}`}
                    >
                      <HugeiconsIcon icon={Sent02Icon} size={14} />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground lg:text-sm">
          Mostrando {startItem}–{endItem} de {total}
        </p>
        <div className="flex items-center justify-center gap-2 sm:justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrevPage}
            disabled={currentPage <= 1}
            aria-label="Página anterior"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
          </Button>
          <span className="tabular-nums text-muted-foreground text-sm">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={onNextPage}
            disabled={currentPage >= totalPages}
            aria-label="Página siguiente"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
          </Button>
        </div>
      </div>
    </>
  )
}
