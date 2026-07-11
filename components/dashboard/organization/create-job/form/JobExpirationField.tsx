"use client"

import { Calendar03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Input } from "@/components/ui/input"

type Props = {
  value: string
  onChange: (value: string) => void
}

export function JobExpirationField({ value, onChange }: Props) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-medium">
        <HugeiconsIcon icon={Calendar03Icon} className="size-3.5" />
        Expiracion
      </label>
      <Input
        type="date"
        className="h-9 text-sm"
        min={new Date().toISOString().slice(0, 10)}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
