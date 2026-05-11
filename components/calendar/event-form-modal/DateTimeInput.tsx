"use client"

import { Calendar04Icon, Clock03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Input } from "@/components/ui/input"

type DateTimeInputProps = {
  startLabel: string
  endLabel?: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  onStartDateChange: (value: string) => void
  onStartTimeChange: (value: string) => void
  onEndDateChange: (value: string) => void
  onEndTimeChange: (value: string) => void
  requiredFields?: boolean
}

export function DateTimeInput({
  startLabel,
  endLabel,
  startDate,
  startTime,
  endDate,
  endTime,
  onStartDateChange,
  onStartTimeChange,
  onEndDateChange,
  onEndTimeChange,
  requiredFields,
}: DateTimeInputProps) {
  return (
    <>
      <div className="space-y-1.5">
        <label htmlFor="event-start-date" className="text-sm font-medium text-foreground">
          {startLabel} {requiredFields && <span className="text-destructive">*</span>}
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <HugeiconsIcon
              icon={Calendar04Icon}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="event-start-date"
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="pl-10"
              required={requiredFields}
            />
          </div>
          <div className="relative flex-1">
            <HugeiconsIcon
              icon={Clock03Icon}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="event-start-time"
              type="time"
              value={startTime}
              onChange={(e) => onStartTimeChange(e.target.value)}
              className="pl-10"
              required={requiredFields}
            />
          </div>
        </div>
      </div>

      {endLabel && (
        <div className="space-y-1.5">
          <label htmlFor="event-end-date" className="text-sm font-medium text-foreground">
            {endLabel} <span className="text-muted-foreground font-normal">(opcional)</span>
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <HugeiconsIcon
                icon={Calendar04Icon}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id="event-end-date"
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative flex-1">
              <HugeiconsIcon
                icon={Clock03Icon}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id="event-end-time"
                type="time"
                value={endTime}
                onChange={(e) => onEndTimeChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
