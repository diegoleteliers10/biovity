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
      <label
        htmlFor="job-expiration"
        className="flex items-center gap-1.5 text-xs leading-4 font-medium"
      >
        <HugeiconsIcon icon={Calendar03Icon} className="size-3.5" />
        Expiración
      </label>
      <Input
        id="job-expiration"
        type="date"
        className="h-9"
        min={new Date().toISOString().slice(0, 10)}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
