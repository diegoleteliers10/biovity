"use client"

import { ArchiveIcon, BubbleChatIcon, PinIcon, Search01Icon } from "@hugeicons/core-free-icons"
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
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Mensajes
            </h1>
            <p className="mt-1 text-muted-foreground text-xs">
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
              "px-3 py-1 text-xs font-medium rounded-md transition-colors duration-150 cursor-pointer",
              archiveFilter === "all"
                ? "bg-surface-container-highest text-foreground"
                : "text-muted-foreground hover:bg-surface-container-highest/40"
            )}
          >
            Todos
          </button>
          <button
            type="button"
            onClick={() => setArchiveFilter("archived")}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-md transition-colors duration-150 flex items-center gap-1 cursor-pointer",
              archiveFilter === "archived"
                ? "bg-surface-container-highest text-foreground"
                : "text-muted-foreground hover:bg-surface-container-highest/40"
            )}
          >
            <HugeiconsIcon icon={ArchiveIcon} size={12} />
            Archivados
          </button>
        </div>

        <div className="relative mb-4 lg:mb-6">
          <HugeiconsIcon
            icon={Search01Icon}
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <Input
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 rounded-lg border-border/40 bg-surface-container-low pl-9 pr-3 text-sm transition-colors focus-visible:bg-surface-container-lowest"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chatsLoading ? (
          <div className="space-y-2 p-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="flex items-center gap-3">
                <div className="size-12 shrink-0 rounded-full bg-surface-container-highest/60 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-2/3 rounded-md bg-surface-container-highest/60 animate-pulse" />
                  <div className="h-3 w-1/2 rounded-md bg-surface-container-highest/60 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedChats.length === 0 ? (
          <div className="flex flex-col items-center text-center gap-2 px-4 py-8">
            <div className="size-10 rounded-full bg-surface-container-highest flex items-center justify-center text-muted-foreground">
              <HugeiconsIcon icon={BubbleChatIcon} size={20} />
            </div>
            <p className="text-sm font-medium text-foreground">
              {archiveFilter === "archived" ? "Sin archivados" : "Sin conversaciones"}
            </p>
            <p className="text-xs text-muted-foreground max-w-[240px]">
              {archiveFilter === "archived"
                ? "Las conversaciones que archives aparecerán aquí."
                : "Cuando escribas a una empresa, la conversación aparecerá aquí."}
            </p>
          </div>
        ) : (
          sortedChats.map((chat) => (
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
                    togglePinMutation.mutate({ chatId: chat.id, role: "professional" })
                  }}
                  className={cn(
                    "size-7 flex items-center justify-center rounded-md transition-colors duration-150",
                    chat.isPinned
                      ? "text-secondary bg-secondary/10"
                      : "text-muted-foreground hover:bg-surface-container-highest/40"
                  )}
                  aria-label={chat.isPinned ? "Desfijar" : "Fijar"}
                >
                  <HugeiconsIcon icon={PinIcon} size={14} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleArchiveMutation.mutate({ chatId: chat.id, role: "professional" })
                  }}
                  className={cn(
                    "size-7 flex items-center justify-center rounded-md transition-colors duration-150",
                    chat.isArchived
                      ? "text-secondary bg-secondary/10"
                      : "text-muted-foreground hover:bg-surface-container-highest/40"
                  )}
                  aria-label={chat.isArchived ? "Desarchivar" : "Archivar"}
                >
                  <HugeiconsIcon icon={ArchiveIcon} size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
