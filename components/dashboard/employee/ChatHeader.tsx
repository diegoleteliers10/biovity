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
}

export function ChatHeader({
  recruiter,
  recruiterName,
  recruiterInitials,
  onBackToList,
}: ChatHeaderProps) {
  return (
    <div className="shrink-0 border-b border-border bg-background p-3 lg:p-4">
      <div className="flex items-start justify-between">
        <div className="flex flex-1 items-center gap-2 lg:gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="size-8 lg:hidden"
            onClick={onBackToList}
            aria-label="Volver a conversaciones"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
          </Button>
          <Avatar className="size-10 lg:size-12">
            {recruiter?.avatar && <AvatarImage src={recruiter.avatar} alt="" />}
            <AvatarFallback className="bg-muted text-sm font-semibold text-muted-foreground">
              {recruiterInitials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 space-y-0.5 lg:space-y-1">
            <h2 className="text-base lg:text-lg font-semibold text-foreground text-balance truncate">
              {recruiterName}
            </h2>
            <div className="flex items-center gap-1 text-muted-foreground text-xs lg:text-sm">
              <HugeiconsIcon icon={Briefcase01Icon} size={12} className="shrink-0 lg:size-14" />
              <span className="truncate">{recruiter?.profession ?? "—"}</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="size-8" aria-label="Más opciones">
          <HugeiconsIcon icon={MoreHorizontalIcon} size={18} />
        </Button>
      </div>
    </div>
  )
}
