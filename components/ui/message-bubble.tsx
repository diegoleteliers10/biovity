"use client"

import {
  Calendar04Icon,
  CheckmarkCircle02Icon,
  Download04Icon,
  Edit01Icon,
  File02Icon,
  Pdf01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { MessageType } from "@/lib/api/messages"
import { useUser } from "@/lib/api/use-profile"
import { cn } from "@/lib/utils"

type MessageBubbleProps = {
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
  onEditEvent?: (eventId: string) => void
}

export function MessageBubble({
  message,
  isOwn,
  senderName,
  senderInitials,
  senderAvatar,
  formatTime,
  onEventAction,
  onEditEvent,
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
            <MessageContent
              message={message}
              isOwn={isOwn}
              onEventAction={onEventAction}
              onEditEvent={onEditEvent}
            />

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

function MessageContent({
  message,
  isOwn,
  onEventAction,
  onEditEvent,
}: {
  message: MessageBubbleProps["message"]
  isOwn: boolean
  onEventAction?: (eventId: string, action: "accept" | "decline") => void
  onEditEvent?: (eventId: string) => void
}) {
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
      return (
        <EventMessageCard
          event={event}
          isOwn={isOwn}
          onAction={onEventAction}
          onEdit={onEditEvent}
        />
      )
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
            <a href={img.url} target="_blank" rel="noopener noreferrer">
              {/* eslint-disable react-doctor/nextjs-no-img-element -- attachment images use blob URLs that need native img */}
              <img
                src={img.url}
                alt={img.alt ?? "Imagen"}
                className="max-w-[280px] rounded-lg object-cover transition-opacity hover:opacity-90"
              />
            </a>
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
      if (!file?.url) {
        return <p className="break-words">{message.content}</p>
      }
      const isPdf = file.mimeType === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
      const sizeLabel = file.size ? `${(file.size / 1024).toFixed(1)} KB` : null
      return (
        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="-mx-1 flex min-w-[220px] items-center gap-3 rounded-lg px-1 py-0.5 transition-colors hover:bg-black/5"
        >
          <span className="shrink-0 rounded-md bg-black/10 p-1.5">
            <HugeiconsIcon icon={isPdf ? Pdf01Icon : File02Icon} size={20} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium">{file.name}</span>
            <span className="block text-xs opacity-70">
              {isPdf ? "PDF" : "Archivo"}
              {sizeLabel ? ` · ${sizeLabel}` : ""}
            </span>
          </span>
          <HugeiconsIcon icon={Download04Icon} size={16} className="shrink-0 opacity-60" />
        </a>
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

function EventMessageCard({
  event,
  isOwn,
  onAction,
  onEdit,
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
  onEdit?: (eventId: string) => void
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
        {event.endAt && <p className="pl-5">– {formatEventDate(event.endAt)}</p>}
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

      {/* Edit button for creator */}
      {isOwn && onEdit && (
        <div className="flex gap-2 pt-2 border-t border-current/10 mt-2">
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs flex items-center gap-1 hover:bg-current/10 text-inherit font-medium px-2"
            onClick={() => onEdit(event.eventId)}
          >
            <HugeiconsIcon icon={Edit01Icon} className="size-3.5" />
            Editar Evento
          </Button>
        </div>
      )}
    </div>
  )
}

type ChatListItemProps = {
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
    const matchesLastMessage = chat.lastMessage?.toLowerCase().includes(query)
    if (!matchesName && !matchesLastMessage) return null
  }

  const unreadCount =
    contactType === "professional"
      ? (chat.unreadCountRecruiter ?? 0)
      : (chat.unreadCountProfessional ?? 0)

  return (
    <button
      type="button"
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect()
        }
      }}
      className={cn(
        "cursor-pointer border-b border-border p-4 transition-all text-left w-full",
        "hover:bg-muted/30 focus-visible:bg-muted/50 active:scale-[0.98]",
        isSelected && "bg-muted/50"
      )}
    >
      <div className="flex items-start gap-3">
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
    </button>
  )
}
