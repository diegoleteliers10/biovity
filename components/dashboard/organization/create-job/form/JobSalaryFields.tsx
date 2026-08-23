import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface JobSalaryFieldsProps {
  salaryMin: string
  salaryMax: string
  onSalaryMinChange: (value: string) => void
  onSalaryMaxChange: (value: string) => void
  error?: string
}

export function JobSalaryFields({
  salaryMin,
  salaryMax,
  onSalaryMinChange,
  onSalaryMaxChange,
  error,
}: JobSalaryFieldsProps) {
  return (
    <Field>
      <FieldLabel>
        Sueldo mensual (CLP) <span className="text-destructive font-medium ml-0.5">*</span>
      </FieldLabel>
      <div className="flex gap-2 items-center">
        <Input
          type="number"
          value={salaryMin}
          onChange={(e) => onSalaryMinChange(e.target.value)}
          placeholder="Ej: 1.200.000"
          min={0}
          required
        />
        <span className="text-muted-foreground text-xs shrink-0">mínimo</span>
      </div>
      <div className="flex gap-2 items-center mt-2">
        <Input
          type="number"
          value={salaryMax}
          onChange={(e) => onSalaryMaxChange(e.target.value)}
          placeholder="Opcional"
          min={0}
        />
        <span className="text-muted-foreground text-xs shrink-0">máximo</span>
      </div>
      <p className="text-muted-foreground text-xs mt-1">
        Publicar el sueldo aumenta la cantidad de postulantes.
      </p>
      {error && <FieldError>{error}</FieldError>}
    </Field>
  )
}
