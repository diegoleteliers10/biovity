"use client"

import { Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useQueryState } from "nuqs"
import { NotificationBell } from "@/components/common/NotificationBell"
import { MobileMenuButton } from "@/components/dashboard/shared/MobileMenuButton"
import { ChatListItem } from "@/components/ui/message-bubble"
import { useDebounce } from "@/hooks/use-debounce"
import type { Chat } from "@/lib/api/chats"
import { cn } from "@/lib/utils"

interface ChatListPanelProps {
  chats: Chat[]
  selectedChatId: string | null
  onSelectChat: (chatId: string) => void
  formatTime: (iso: string) => string
}

export function ChatListPanel({
  chats,
  selectedChatId,
  onSelectChat,
  formatTime,
}: ChatListPanelProps) {
  const [searchQuery, setSearchQuery] = useQueryState("q", {
    defaultValue: "",
  })
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  return (
    <div
      className={cn(
        "flex w-full lg:h-full lg:w-80 flex-col overflow-hidden border-r border-border max-h-dvh transition-all",
        "max-lg:hidden"
      )}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4 lg:mb-6 lg:hidden">
          <MobileMenuButton />
          <NotificationBell notifications={[]} showAgentTrigger />
        </div>

        <div className="mb-4 space-y-1 lg:mb-6">
          <div className="hidden lg:flex justify-end">
            <NotificationBell notifications={[]} showAgentTrigger />
          </div>
          <h1 className="text-xl lg:text-2xl font-semibold text-foreground">Mensajes</h1>
        </div>
        <div className="relative">
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
            onSelect={() => onSelectChat(chat.id)}
            searchQuery={debouncedSearchQuery}
            contactType="professional"
            formatTime={formatTime}
          />
        ))}
      </div>
    </div>
  )
}

import { Input } from "@/components/ui/input"
