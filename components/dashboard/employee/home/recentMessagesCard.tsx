"use client"

import { Message01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRouter } from "next/navigation"
import { memo } from "react"
import { dashboardRaisedCardClass } from "@/components/dashboard/shared/surface-classes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Chat } from "@/lib/api/chats"

type EnrichedChat = Chat & {
  lastMessageFromRecruiter?: string | null
  lastMessageFromRecruiterAt?: string
  isLoading?: boolean
}

type LegacyMessage = {
  sender: string
  time: string
  preview: string
}

type RecentMessagesCardProps = {
  chats?: EnrichedChat[]
  messages?: LegacyMessage[]
  onViewAll?: () => void
  isLoading?: boolean
  namesMap?: Record<string, string>
  participantIdKey?: "recruiterId" | "professionalId"
  defaultName?: string
}

function formatMessageTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Ahora"
  if (diffMins < 60) return `Hace ${diffMins}m`
  if (diffHours < 24) return `Hace ${diffHours}h`
  if (diffDays < 7) return `Hace ${diffDays}d`

  return date.toLocaleDateString("es-CL", { day: "numeric", month: "short" })
}

export const RecentMessagesCard = memo(function RecentMessagesCard({
  chats = [],
  messages,
  onViewAll,
  isLoading,
  namesMap = {},
  participantIdKey = "recruiterId",
  defaultName = "Usuario",
}: RecentMessagesCardProps) {
  const router = useRouter()
  const hasLegacyMessages = messages && messages.length > 0
  const displayChats = chats.length > 0 ? chats : []

  const handleChatClick = (chatId: string) => {
    router.push(`/dashboard/messages?chat=${chatId}`)
  }

  return (
    <Card className={dashboardRaisedCardClass}>
      <CardHeader className="px-4 sm:px-5 pt-4 sm:pt-5 pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs leading-4 font-medium text-foreground">
            Mensajes Recientes
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-3 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground"
            onClick={onViewAll}
          >
            Ver todas
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-5 pb-4 sm:pb-5">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-12 bg-surface-container-highest/50 animate-pulse rounded-lg"
              />
            ))}
          </div>
        ) : hasLegacyMessages ? (
          <div className="space-y-4">
            {messages?.slice(0, 5).map((msg) => (
              <div key={msg.sender + msg.time} className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground truncate">{msg.sender}</p>
                  <p className="text-xs text-muted-foreground shrink-0">{msg.time}</p>
                </div>
                <p className="text-xs text-muted-foreground truncate">{msg.preview}</p>
              </div>
            ))}
          </div>
        ) : displayChats.length === 0 ? (
          <div className="flex flex-col items-center text-center gap-2 py-8">
            <div className="size-10 rounded-full bg-surface-container-highest flex items-center justify-center text-muted-foreground">
              <HugeiconsIcon icon={Message01Icon} size={20} />
            </div>
            <p className="text-sm font-medium text-foreground">Sin mensajes todavía</p>
            <p className="text-xs text-muted-foreground max-w-[240px]">
              Cuando un candidato te escriba, la conversación aparecerá aquí.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayChats.slice(0, 5).map((chat) => {
              const isItemLoading = chat.isLoading
              const hasRecruiterMessage = Boolean(chat.lastMessageFromRecruiter)
              const participantId = chat[participantIdKey] as string
              const participantName = namesMap[participantId] ?? defaultName

              return (
                <button
                  type="button"
                  key={chat.id}
                  className="gap-1 cursor-pointer hover:bg-surface-container-highest/40 rounded-lg -mx-2 p-2 transition-colors duration-150 w-full text-left"
                  onClick={() => handleChatClick(chat.id)}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") && handleChatClick(chat.id)
                  }
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground truncate">
                      {participantName}
                    </p>
                    <p className="text-xs text-muted-foreground shrink-0">
                      {isItemLoading
                        ? "..."
                        : formatMessageTime(chat.lastMessageFromRecruiterAt ?? chat.updatedAt)}
                    </p>
                  </div>
                  <p className="text-xs truncate">
                    {isItemLoading ? (
                      <span className="text-muted-foreground/50 animate-pulse">
                        Cargando mensaje…
                      </span>
                    ) : hasRecruiterMessage ? (
                      <span className="text-muted-foreground">{chat.lastMessageFromRecruiter}</span>
                    ) : (
                      <span className="text-secondary italic">Esperando respuesta…</span>
                    )}
                  </p>
                </button>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
})
