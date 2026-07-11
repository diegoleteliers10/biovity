"use client"

import { ArchiveIcon, PinIcon, Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useQueryState } from "nuqs"
import { useMemo, useState } from "react"
import { ConnectedNotificationBell } from "@/components/common/ConnectedNotificationBell"
import { MobileMenuButton } from "@/components/dashboard/shared/MobileMenuButton"
import { Input } from "@/components/ui/input"
import { ChatListItem } from "@/components/ui/message-bubble"
import { useDebounce } from "@/hooks/use-debounce"
import type { Chat } from "@/lib/api/chats"
import { useToggleArchiveChatMutation, useTogglePinChatMutation } from "@/lib/api/use-pin-chat"
import { cn } from "@/lib/utils"

type ChatListSidebarProps = {
  chats: Chat[]
  chatsLoading: boolean
  selectedChatId: string | null
  onSelectChat: (chat: Chat) => void
  formatTime: (iso: string) => string
}

type ArchiveFilter = "all" | "archived"

export function ChatListSidebar({
  chats,
  chatsLoading,
  selectedChatId,
  onSelectChat,
  formatTime,
}: ChatListSidebarProps) {
  const [searchQuery, setSearchQuery] = useQueryState("q", {
    defaultValue: "",
  })
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  const [archiveFilter, setArchiveFilter] = useState<ArchiveFilter>("all")

  const togglePinMutation = useTogglePinChatMutation()
  const toggleArchiveMutation = useToggleArchiveChatMutation()

  const sortedChats = useMemo(() => {
    const filtered =
      archiveFilter === "archived"
        ? chats.filter((c) => c.isArchived)
        : chats.filter((c) => !c.isArchived)

    return [...filtered].sort((a, b) => {
      const aPinned = a.isPinned ? 1 : 0
      const bPinned = b.isPinned ? 1 : 0
      if (aPinned !== bPinned) return bPinned - aPinned
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
  }, [chats, archiveFilter])

  return (
    <div className="flex w-full h-full min-h-0 flex-col overflow-hidden transition-all">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4 lg:mb-6 lg:hidden">
          <MobileMenuButton />
          <ConnectedNotificationBell />
        </div>

        <div className="mb-4 space-y-1 lg:mb-6">
          <div className="hidden lg:flex justify-end items-center gap-1">
            <ConnectedNotificationBell />
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-semibold text-foreground">Mensajes</h1>
            <p className="mt-1 text-muted-foreground text-xs lg:text-sm">
              {chatsLoading ? "Cargando..." : `${chats.length} conversaciones`}
            </p>
          </div>
        </div>

        {/* Archive filter tabs */}
        <div className="flex items-center gap-1 mb-3">
          <button
            type="button"
            onClick={() => setArchiveFilter("all")}
            className={cn(
              "px-3 py-1 text-xs rounded-md transition-colors",
              archiveFilter === "all"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            Todos
          </button>
          <button
            type="button"
            onClick={() => setArchiveFilter("archived")}
            className={cn(
              "px-3 py-1 text-xs rounded-md transition-colors flex items-center gap-1",
              archiveFilter === "archived"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <HugeiconsIcon icon={ArchiveIcon} size={12} />
            Archivados
          </button>
        </div>

        <div className="relative mb-4 lg:mb-6">
          <HugeiconsIcon
            icon={Search01Icon}
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 border-muted bg-muted/50 pl-10 transition-colors focus:bg-background"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sortedChats.map((chat) => (
          <div key={chat.id} className="relative group">
            <ChatListItem
              chat={chat}
              isSelected={selectedChatId === chat.id}
              onSelect={() => onSelectChat(chat)}
              searchQuery={debouncedSearchQuery}
              contactType="recruiter"
              formatTime={formatTime}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  togglePinMutation.mutate(chat.id)
                }}
                className={cn(
                  "size-7 flex items-center justify-center rounded-md transition-colors",
                  chat.isPinned
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:bg-muted"
                )}
                aria-label={chat.isPinned ? "Desfijar" : "Fijar"}
              >
                <HugeiconsIcon icon={PinIcon} size={14} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleArchiveMutation.mutate(chat.id)
                }}
                className={cn(
                  "size-7 flex items-center justify-center rounded-md transition-colors",
                  chat.isArchived
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:bg-muted"
                )}
                aria-label={chat.isArchived ? "Desarchivar" : "Archivar"}
              >
                <HugeiconsIcon icon={ArchiveIcon} size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
