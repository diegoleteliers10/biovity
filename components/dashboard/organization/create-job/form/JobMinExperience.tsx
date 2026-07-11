import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface JobMinExperienceProps {
  value: number
  onChange: (value: number) => void
}

export function JobMinExperience({ value, onChange }: JobMinExperienceProps) {
  return (
    <Field>
      <FieldLabel>Anos de experiencia minima</FieldLabel>
      <Input
        type="number"
        min={0}
        max={30}
        value={value || ""}
        onChange={(e) => {
          const n = Number(e.target.value)
          onChange(Number.isNaN(n) ? 0 : Math.max(0, Math.min(30, n)))
        }}
        placeholder="0"
      />
    </Field>
  )
}
