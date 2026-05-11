"use client"

import { Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Input } from "@/components/ui/input"

interface TalentSearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function TalentSearchBar({ value, onChange }: TalentSearchBarProps) {
  return (
    <div className="relative w-full sm:w-72">
      <HugeiconsIcon
        icon={Search01Icon}
        size={18}
        className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        type="search"
        placeholder="Buscar por nombre o email..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9"
        aria-label="Buscar profesionales"
      />
    </div>
  )
}
