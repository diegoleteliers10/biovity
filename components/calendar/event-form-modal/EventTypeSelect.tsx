"use client"

import type { EventType } from "@/lib/types/events"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type EventTypeSelectProps = {
  value: EventType
  onChange: (value: EventType) => void
  EVENT_TYPES: { value: EventType; label: string }[]
}

export function EventTypeSelect({ value, onChange, EVENT_TYPES }: EventTypeSelectProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor="event-type" className="text-sm font-medium text-foreground">
        Tipo de evento
      </label>
      <Select value={value} onValueChange={(nextValue) => onChange(nextValue as EventType)}>
        <SelectTrigger id="event-type" className="h-10 w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {EVENT_TYPES.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
