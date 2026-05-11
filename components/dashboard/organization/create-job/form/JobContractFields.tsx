import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const EMPLOYMENT_TYPES = [
  { value: "Full-time", label: "Tiempo completo" },
  { value: "Part-time", label: "Medio tiempo" },
  { value: "Contrato", label: "Contrato" },
  { value: "Practica", label: "Práctica" },
] as const

const EXPERIENCE_LEVELS = [
  { value: "Entrante", label: "Entrante" },
  { value: "Junior", label: "Junior" },
  { value: "Mid-Senior", label: "Semi Senior" },
  { value: "Senior", label: "Senior" },
  { value: "Ejecutivo", label: "Ejecutivo" },
] as const

interface JobContractFieldsProps {
  employmentType: string
  experienceLevel: string
  onEmploymentTypeChange: (value: string) => void
  onExperienceLevelChange: (value: string) => void
}

export function JobContractFields({
  employmentType,
  experienceLevel,
  onEmploymentTypeChange,
  onExperienceLevelChange,
}: JobContractFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Field>
        <FieldLabel>Tipo de contrato *</FieldLabel>
        <Select value={employmentType} onValueChange={onEmploymentTypeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccionar" />
          </SelectTrigger>
          <SelectContent>
            {EMPLOYMENT_TYPES.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field>
        <FieldLabel>Nivel de experiencia *</FieldLabel>
        <Select value={experienceLevel} onValueChange={onExperienceLevelChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccionar" />
          </SelectTrigger>
          <SelectContent>
            {EXPERIENCE_LEVELS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    </div>
  )
}

export { EMPLOYMENT_TYPES, EXPERIENCE_LEVELS }
