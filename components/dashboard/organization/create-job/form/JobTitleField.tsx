import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface JobTitleFieldProps {
  value: string
  onChange: (value: string) => void
}

export function JobTitleField({ value, onChange }: JobTitleFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor="job-title">
        Título <span className="text-destructive font-medium ml-0.5">*</span>
      </FieldLabel>
      <Input
        id="job-title"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ej: Desarrollador Full Stack Senior"
        required
      />
    </Field>
  )
}
