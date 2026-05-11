"use client"

import { MoreHorizontalIcon, Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useQueryState } from "nuqs"
import { NotificationBell } from "@/components/common/NotificationBell"
import { MobileMenuButton } from "@/components/dashboard/shared/MobileMenuButton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChatListItem } from "@/components/ui/message-bubble"
import { useDebounce } from "@/hooks/use-debounce"
import type { Chat } from "@/lib/api/chats"
import { cn } from "@/lib/utils"

type ChatListSidebarProps = {
  chats: Chat[]
  chatsLoading: boolean
  selectedChatId: string | null
  onSelectChat: (chat: Chat) => void
  formatTime: (iso: string) => string
}

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

  return (
    <div
      className={cn(
        "flex w-full lg:h-full lg:w-80 flex-col overflow-hidden border-r border-border max-h-dvh transition-all",
        "flex"
      )}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4 lg:mb-6 lg:hidden">
          <MobileMenuButton />
          <NotificationBell notifications={[]} />
        </div>

        <div className="mb-4 space-y-1 lg:mb-6">
          <div className="hidden lg:flex justify-end items-center gap-1">
            <Button variant="ghost" size="icon" className="size-9" aria-label="Mas opciones">
              <HugeiconsIcon icon={MoreHorizontalIcon} size={18} />
            </Button>
            <NotificationBell notifications={[]} />
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-semibold text-foreground">Mensajes</h1>
            <p className="mt-1 text-muted-foreground text-xs lg:text-sm">
              {chatsLoading ? "Cargando..." : `${chats.length} conversaciones`}
            </p>
          </div>
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
        {chats.map((chat) => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            isSelected={selectedChatId === chat.id}
            onSelect={() => onSelectChat(chat)}
            searchQuery={debouncedSearchQuery}
            contactType="recruiter"
            formatTime={formatTime}
          />
        ))}
      </div>
    </div>
  )
}
