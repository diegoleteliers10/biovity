"use client"

import { useRouter } from "next/navigation"
import { memo } from "react"
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
    <Card className="border border-border/80 bg-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground">Mensajes Recientes</CardTitle>
          <Button variant="ghost" size="sm" onClick={onViewAll}>
            Ver Todo
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="animate-pulse space-y-2">
                <div className="h-4 w-32 rounded bg-muted" />
                <div className="h-3 w-48 rounded bg-muted" />
              </div>
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
          <p className="text-sm text-muted-foreground text-center py-4">
            No tienes mensajes recientes
          </p>
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
                  className="gap-1 cursor-pointer hover:bg-muted/30 rounded-lg -mx-2 p-2 transition-all duration-150 active:scale-[0.98] w-full text-left"
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
