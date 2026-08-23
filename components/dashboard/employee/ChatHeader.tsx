"use client"

import { ArrowLeft01Icon, Briefcase01Icon, MoreHorizontalIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { User } from "@/lib/api/users"

type ChatHeaderProps = {
  recruiter: User | null | undefined
  recruiterName: string
  recruiterInitials: string
  onBackToList: () => void
  isTyping?: boolean
}

export function ChatHeader({
  recruiter,
  recruiterName,
  recruiterInitials,
  onBackToList,
  isTyping,
}: ChatHeaderProps) {
  return (
    <div className="shrink-0 border-b border-border/40 bg-surface-container-lowest p-3 lg:p-4">
      <div className="flex items-start justify-between">
        <div className="flex flex-1 items-center gap-2 lg:gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onBackToList}
            aria-label="Volver a conversaciones"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
          </Button>
          <Avatar className="size-10 lg:size-12">
            {recruiter?.avatar && <AvatarImage src={recruiter.avatar} alt="" />}
            <AvatarFallback className="bg-secondary/10 text-sm font-semibold text-secondary">
              {recruiterInitials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 space-y-0.5">
            <h2 className="text-sm lg:text-base font-semibold text-foreground truncate">
              {recruiterName}
            </h2>
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <HugeiconsIcon icon={Briefcase01Icon} size={14} className="shrink-0" />
              <span className="truncate">{recruiter?.profession ?? "—"}</span>
            </div>
            {isTyping && (
              <p className="text-xs text-muted-foreground animate-pulse mt-0.5">escribiendo...</p>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          type="button"
          aria-label="Más opciones"
          className="text-muted-foreground hover:text-foreground"
        >
          <HugeiconsIcon icon={MoreHorizontalIcon} size={20} />
        </Button>
      </div>
    </div>
  )
}
