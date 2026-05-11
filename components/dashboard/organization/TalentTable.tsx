"use client"

import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Location01Icon,
  Mail01Icon,
  Sent02Icon,
  SmartPhone01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRouter } from "next/navigation"
import { Avatar } from "@/components/base/avatar/avatar"
import { Button } from "@/components/ui/button"
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

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Nombre</TableHead>
              <TableHead>Profesión</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                className="cursor-pointer active:scale-[0.99] transition-all duration-150"
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
              >
                <TableCell className="font-medium">
                  <HoverCard openDelay={100} closeDelay={200}>
                    <HoverCardTrigger asChild>
                      <span className="inline-block cursor-pointer font-medium text-foreground transition-colors hover:text-primary hover:underline">
                        {user.name}
                      </span>
                    </HoverCardTrigger>
                    <HoverCardContent
                      side="bottom"
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
                          {createChatMutation.isPending && createChatMutation.variables === user.id
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
                <TableCell className="text-muted-foreground">{user.profession ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">
                  {formatUserLocation(user.location) || "—"}
                </TableCell>
                <TableCell className="hidden truncate text-muted-foreground md:table-cell">
                  {user.email}
                </TableCell>
              </TableRow>
            ))}
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
