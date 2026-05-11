"use client"

import type { EventType } from "@/lib/types/events"

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
      <select
        id="event-type"
        value={value}
        onChange={(e) => onChange(e.target.value as EventType)}
        className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {EVENT_TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>
    </div>
  )
}
