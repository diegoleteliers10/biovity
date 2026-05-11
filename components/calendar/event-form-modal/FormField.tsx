"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type FormFieldProps = {
  id: string
  label: string
  required?: boolean
  optional?: boolean
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: "text" | "textarea" | "date" | "time" | "url"
  rows?: number
  children?: React.ReactNode
}

export function FormField({
  id,
  label,
  required,
  optional,
  value,
  onChange,
  placeholder,
  type = "text",
  rows,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
        {optional && <span className="text-muted-foreground font-normal">(opcional)</span>}
      </label>
      {type === "textarea" ? (
        <Textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
        />
      ) : children ? (
        children
      ) : (
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  )
}
