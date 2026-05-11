"use client"

import { NotificationBell } from "@/components/common/NotificationBell"
import { TalentSearchBar } from "./TalentSearchBar"

interface TalentPageHeaderProps {
  searchValue: string
  onSearchChange: (value: string) => void
}

export function TalentPageHeader({ searchValue, onSearchChange }: TalentPageHeaderProps) {
  return (
    <div className="space-y-1">
      <div className="hidden lg:flex justify-end">
        <NotificationBell notifications={[]} showAgentTrigger />
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between flex-1">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-[28px] font-semibold tracking-wide">Explorar Talento</h1>
          <p className="text-pretty text-muted-foreground text-sm">
            Busca y revisa perfiles de profesionales en la plataforma.
          </p>
        </div>
        <TalentSearchBar value={searchValue} onChange={onSearchChange} />
      </div>
    </div>
  )
}
