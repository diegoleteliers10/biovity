"use client"

import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from "@/lib/api/use-profile"
import { cn } from "@/lib/utils"

interface MessageBubbleProps {
  message: {
    id: string
    content: string
    senderId: string
    createdAt: string
  }
  isOwn: boolean
  senderName: string
  senderInitials: string
  senderAvatar?: string | null
  formatTime: (iso: string) => string
}

export function MessageBubble({
  message,
  isOwn,
  senderName,
  senderInitials,
  senderAvatar,
  formatTime,
}: MessageBubbleProps) {
  return (
    <div className={cn("flex w-full", isOwn ? "justify-end" : "justify-start")}>
      <div className={cn("flex max-w-[75%] gap-2", isOwn ? "flex-row-reverse" : "flex-row")}>
        {/* Avatar */}
        <Avatar className="size-8 shrink-0 mt-1">
          {senderAvatar && <AvatarImage src={senderAvatar} alt="" />}
          <AvatarFallback className="bg-secondary/10 text-secondary text-xs font-semibold">
            {senderInitials}
          </AvatarFallback>
        </Avatar>

        {/* Message content */}
        <div className={cn("flex flex-col gap-1", isOwn ? "items-end" : "items-start")}>
          {/* Sender name + time */}
          <div
            className={cn(
              "flex items-center gap-2 text-xs text-muted-foreground",
              isOwn ? "flex-row-reverse" : "flex-row"
            )}
          >
            <span className="font-medium">{isOwn ? "Tú" : senderName}</span>
            <span className="opacity-70">{formatTime(message.createdAt)}</span>
          </div>

          {/* Bubble */}
          <div
            className={cn(
              "relative rounded-2xl px-4 py-2.5",
              "text-sm leading-relaxed",
              isOwn
                ? "bg-secondary text-secondary-foreground rounded-tr-sm"
                : "bg-muted text-foreground rounded-tl-sm"
            )}
          >
            <p className="break-words">{message.content}</p>

            {/* Read receipt for own messages */}
            {isOwn && (
              <div className="mt-1 flex justify-end">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={12} className="opacity-60" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface ChatListItemProps {
  chat: {
    id: string
    professionalId?: string
    recruiterId?: string
    lastMessage?: string | null
    updatedAt: string
    unreadCountProfessional?: number
    unreadCountRecruiter?: number
  }
  isSelected: boolean
  onSelect: () => void
  searchQuery?: string
  /** Pass 'professional' if this list is for recruiters viewing professionals, 'recruiter' otherwise */
  contactType: "professional" | "recruiter"
  isOnline?: boolean
  formatTime: (iso: string) => string
}

export function ChatListItem({
  chat,
  isSelected,
  onSelect,
  searchQuery,
  contactType,
  isOnline,
  formatTime,
}: ChatListItemProps) {
  const contactId = contactType === "professional" ? chat.professionalId : chat.recruiterId
  const { data: contact } = useUser(contactId)

  const contactName =
    contact?.name ?? (contactType === "professional" ? "Profesional" : "Reclutador")
  const initials = contactName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  // Filter by search
  if (searchQuery) {
    const query = searchQuery.toLowerCase()
    const matchesName = contactName.toLowerCase().includes(query)
    if (!matchesName) return null
  }

  const unreadCount = chat.unreadCountProfessional ?? chat.unreadCountRecruiter ?? 0

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect()
        }
      }}
      className={cn(
        "cursor-pointer border-b border-border p-4 transition-colors",
        "hover:bg-muted/30 focus-visible:bg-muted/50",
        isSelected && "bg-muted/50"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Avatar with online indicator */}
        <div className="relative shrink-0">
          <Avatar className="size-12">
            {contact?.avatar && <AvatarImage src={contact.avatar} alt="" />}
            <AvatarFallback className="bg-secondary/10 text-secondary text-sm font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          {isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5 size-3 bg-green-500 rounded-full border-2 border-background" />
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center justify-between gap-2">
            <h3 className="truncate text-sm font-semibold text-foreground">{contactName}</h3>
            <span className="shrink-0 text-xs text-muted-foreground">
              {formatTime(chat.updatedAt)}
            </span>
          </div>
          <p className="truncate text-sm text-muted-foreground">{chat.lastMessage ?? "—"}</p>
          {unreadCount > 0 && (
            <span className="mt-1.5 inline-flex size-5 min-w-5 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
