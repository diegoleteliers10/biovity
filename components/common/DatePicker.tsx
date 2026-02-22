"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "@/lib/utils"
import { ArrowDown01Icon } from "@hugeicons/core-free-icons"

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
          selected={date}
          defaultMonth={date ?? new Date()}
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
