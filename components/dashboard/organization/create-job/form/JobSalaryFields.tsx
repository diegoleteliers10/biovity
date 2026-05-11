import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface JobSalaryFieldsProps {
  salaryMin: string
  salaryMax: string
  onSalaryMinChange: (value: string) => void
  onSalaryMaxChange: (value: string) => void
}

export function JobSalaryFields({
  salaryMin,
  salaryMax,
  onSalaryMinChange,
  onSalaryMaxChange,
}: JobSalaryFieldsProps) {
  return (
    <Field>
      <FieldLabel>Salario (opcional)</FieldLabel>
      <div className="flex gap-2 items-center">
        <Input
          type="number"
          value={salaryMin}
          onChange={(e) => onSalaryMinChange(e.target.value)}
          placeholder="Mín"
          min={0}
        />
        <span className="text-muted-foreground">–</span>
        <Input
          type="number"
          value={salaryMax}
          onChange={(e) => onSalaryMaxChange(e.target.value)}
          placeholder="Máx"
          min={0}
        />
        <span className="text-muted-foreground text-xs shrink-0">CLP/mes</span>
      </div>
    </Field>
  )
}
