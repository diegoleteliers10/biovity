"use client"

import {
  ArrowLeft01Icon,
  Briefcase01Icon,
  Calendar03Icon,
  MoreHorizontalIcon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ChatHeaderProps {
  professionalName: string
  professionalInitials: string
  professionalAvatar?: string | null
  professionalProfession?: string | null
  onBack?: () => void
  showBackButton?: boolean
  onViewProfile?: () => void
  onSchedule?: () => void
  isTyping?: boolean
}

export function ChatHeader({
  professionalName,
  professionalInitials,
  professionalAvatar,
  professionalProfession,
  onBack,
  showBackButton = false,
  onViewProfile,
  onSchedule,
  isTyping,
}: ChatHeaderProps) {
  return (
    <div className="shrink-0 border-b border-border/40 bg-surface-container-lowest p-3 lg:p-4">
      <div className="flex items-start justify-between">
        <div className="flex flex-1 items-center gap-2 lg:gap-3">
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onBack}
              aria-label="Volver a conversaciones"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
            </Button>
          )}
          <Avatar className="size-10 lg:size-12">
            {professionalAvatar && <AvatarImage src={professionalAvatar} alt="" />}
            <AvatarFallback className="bg-secondary/10 text-sm font-semibold text-secondary">
              {professionalInitials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 space-y-0.5">
            <h2 className="text-sm lg:text-base font-semibold text-foreground truncate">
              {professionalName}
            </h2>
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <HugeiconsIcon icon={Briefcase01Icon} size={14} className="shrink-0" />
              <span className="truncate">{professionalProfession ?? "—"}</span>
            </div>
            {isTyping && (
              <p className="text-xs text-muted-foreground animate-pulse mt-0.5">escribiendo...</p>
            )}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Más opciones"
              className="text-muted-foreground hover:text-foreground"
            >
              <HugeiconsIcon icon={MoreHorizontalIcon} size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {onViewProfile && (
              <DropdownMenuItem onClick={onViewProfile} className="cursor-pointer">
                <HugeiconsIcon icon={UserIcon} size={16} strokeWidth={1.5} className="mr-2" />
                Ver perfil
              </DropdownMenuItem>
            )}
            {onSchedule && (
              <DropdownMenuItem onClick={onSchedule} className="cursor-pointer">
                <HugeiconsIcon icon={Calendar03Icon} size={16} strokeWidth={1.5} className="mr-2" />
                Agendar entrevista
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
