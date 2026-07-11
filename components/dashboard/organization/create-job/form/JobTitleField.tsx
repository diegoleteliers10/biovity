import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface JobTitleFieldProps {
  value: string
  onChange: (value: string) => void
  error?: string
}

export function JobTitleField({ value, onChange, error }: JobTitleFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor="job-title">Título *</FieldLabel>
      <Input
        id="job-title"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ej: Desarrollador Full Stack Senior"
        required
      />
      {error && <FieldError>{error}</FieldError>}
    </Field>
  )
}
