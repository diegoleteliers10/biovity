"use client"

import { ArrowDown01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { format } from "date-fns"
import * as React from "react"
import { TZDate } from "react-day-picker"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const USER_TZ = Intl.DateTimeFormat().resolvedOptions().timeZone

type DatePickerProps = {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  className?: string
  label?: string
  id?: string
}

export function DatePicker({ date, setDate, className, label, id }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const generatedId = React.useId()
  const triggerId = id ?? generatedId

  const selectedTZ = React.useMemo(() => (date ? TZDate.tz(USER_TZ, date) : undefined), [date])

  const handleSelect = React.useCallback(
    (selectedDate: Date | undefined) => {
      setDate(selectedDate)
      setOpen(false)
    },
    [setDate]
  )

  const trigger = (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id={triggerId}
          data-empty={!date}
          className={cn(
            "data-[empty=true]:text-muted-foreground w-[212px] justify-between text-left font-normal",
            className
          )}
        >
          {date ? format(date, "PPP") : <span>Seleccionar fecha</span>}
          <HugeiconsIcon icon={ArrowDown01Icon} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          timeZone={USER_TZ}
          selected={selectedTZ}
          defaultMonth={selectedTZ ?? TZDate.tz(USER_TZ)}
          captionLayout="dropdown"
          onSelect={handleSelect}
        />
      </PopoverContent>
    </Popover>
  )

  if (label) {
    return (
      <Field className="w-fit">
        <FieldLabel htmlFor={triggerId}>{label}</FieldLabel>
        {trigger}
      </Field>
    )
  }

  return trigger
}
