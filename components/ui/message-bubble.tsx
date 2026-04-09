"use client"

import { Calendar04Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { MessageType } from "@/lib/api/messages"
import { useUser } from "@/lib/api/use-profile"
import { cn } from "@/lib/utils"

interface MessageBubbleProps {
  message: {
    id: string
    content: string
    senderId: string
    createdAt: string
    type: MessageType
    contentType: Record<string, unknown> | null
  }
  isOwn: boolean
  senderName: string
  senderInitials: string
  senderAvatar?: string | null
  formatTime: (iso: string) => string
  onEventAction?: (eventId: string, action: "accept" | "decline") => void
}

export function MessageBubble({
  message,
  isOwn,
  senderName,
  senderInitials,
  senderAvatar,
  formatTime,
  onEventAction,
}: MessageBubbleProps) {
  const renderContent = () => {
    switch (message.type) {
      case "event": {
        const event = message.contentType as {
          eventId: string
          title: string
          description?: string
          type: string
          startAt: string
          endAt?: string
          location?: string
          meetingUrl?: string
          status: string
          participantStatus: string
          candidateName: string
        } | null
        if (!event) return null
        return <EventMessageCard event={event} isOwn={isOwn} onAction={onEventAction} />
      }
      case "image": {
        const img = message.contentType as {
          url: string
          thumbnailUrl?: string
          alt?: string
        } | null
        return (
          <div className="space-y-2">
            {img?.url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={img.url}
                alt={img.alt ?? "Imagen"}
                className="max-w-[280px] rounded-lg object-cover"
              />
            )}
            {message.content && message.content !== "Imagen" && (
              <p className="break-words">{message.content}</p>
            )}
          </div>
        )
      }
      case "file": {
        const file = message.contentType as {
          url: string
          name: string
          size: number
          mimeType: string
        } | null
        return (
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={Calendar04Icon} size={16} className="shrink-0" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{file?.name ?? "Archivo"}</p>
              {file?.size && (
                <p className="text-xs opacity-70">{(file.size / 1024).toFixed(1)} KB</p>
              )}
            </div>
          </div>
        )
      }
      case "audio":
        return (
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={Calendar04Icon} size={16} className="shrink-0" />
            <p className="text-sm italic opacity-70">Audio</p>
          </div>
        )
      default:
        return <p className="break-words">{message.content}</p>
    }
  }

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
            {renderContent()}

            {/* Read receipt for own messages */}
            {isOwn && message.type === "text" && (
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

function EventMessageCard({
  event,
  isOwn,
  onAction,
}: {
  event: {
    eventId: string
    title: string
    description?: string
    type: string
    startAt: string
    endAt?: string
    location?: string
    meetingUrl?: string
    status: string
    participantStatus: string
    candidateName: string
  }
  isOwn: boolean
  onAction?: (eventId: string, action: "accept" | "decline") => void
}) {
  const formatEventDate = (iso: string) => {
    try {
      const d = new Date(iso)
      return d.toLocaleDateString("es-CL", {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return iso
    }
  }

  const typeLabels: Record<string, string> = {
    interview: "Entrevista",
    task_deadline: "Tarea",
    announcement: "Anuncio",
    onboarding: "Onboarding",
  }

  return (
    <div className="min-w-[260px] space-y-2">
      {/* Header */}
      <div className="flex items-center gap-2 text-xs">
        <HugeiconsIcon icon={Calendar04Icon} size={14} className="text-secondary" />
        <span className="font-medium text-secondary">
          {typeLabels[event.type] ?? "Evento"} programado
        </span>
      </div>

      {/* Title */}
      <p className="font-semibold leading-tight">{event.title}</p>

      {/* Details */}
      <div className="space-y-1 text-xs opacity-90">
        <div className="flex items-center gap-1">
          <HugeiconsIcon icon={Calendar04Icon} size={12} />
          <span>{formatEventDate(event.startAt)}</span>
        </div>
        {event.endAt && <p className="pl-5">— {formatEventDate(event.endAt)}</p>}
        {event.location && <p className="pl-5">{event.location}</p>}
        {event.meetingUrl && (
          <p className="pl-5 truncate">
            <a
              href={event.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {event.meetingUrl}
            </a>
          </p>
        )}
      </div>

      {/* Description */}
      {event.description && <p className="text-xs opacity-80">{event.description}</p>}

      {/* Action buttons - only show for non-owner */}
      {!isOwn &&
        event.participantStatus !== "accepted" &&
        event.participantStatus !== "declined" && (
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              onClick={() => onAction?.(event.eventId, "decline")}
            >
              No asistir
            </Button>
            <Button
              size="sm"
              className="h-7 text-xs"
              onClick={() => onAction?.(event.eventId, "accept")}
            >
              Asistir
            </Button>
          </div>
        )}

      {/* Status indicator */}
      {event.participantStatus === "accepted" && (
        <p className="text-xs text-green-600 font-medium">✓ Asistirás</p>
      )}
      {event.participantStatus === "declined" && (
        <p className="text-xs text-destructive font-medium">✗ No asistirás</p>
      )}
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
