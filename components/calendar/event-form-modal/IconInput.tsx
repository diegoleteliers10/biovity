"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Input } from "@/components/ui/input"

type IconInputProps = {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: "text" | "url"
}

export function IconInput({
  id,
  label,
  icon,
  value,
  onChange,
  placeholder,
  type = "text",
}: IconInputProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <HugeiconsIcon
          icon={icon}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-10"
        />
      </div>
    </div>
  )
}
