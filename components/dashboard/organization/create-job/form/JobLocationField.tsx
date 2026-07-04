import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export type WorkMode = "onsite" | "remote" | "hybrid"

const WORK_MODES = [
  { value: "onsite" as const, label: "Presencial" },
  { value: "remote" as const, label: "Remoto" },
  { value: "hybrid" as const, label: "Hibrido" },
]

interface JobLocationFieldProps {
  workMode: WorkMode
  city: string
  country: string
  onWorkModeChange: (mode: WorkMode) => void
  onCityChange: (value: string) => void
  onCountryChange: (value: string) => void
}

export function JobLocationField({
  workMode,
  city,
  country,
  onWorkModeChange,
  onCityChange,
  onCountryChange,
}: JobLocationFieldProps) {
  return (
    <Field>
      <FieldLabel>Ubicacion</FieldLabel>
      <div className="space-y-3">
        <div className="flex gap-4">
          {WORK_MODES.map((mode) => (
            <label key={mode.value} className="flex items-center gap-2 text-xs">
              <input
                type="radio"
                name="workMode"
                value={mode.value}
                checked={workMode === mode.value}
                onChange={() => onWorkModeChange(mode.value)}
                className="size-3.5 accent-foreground"
              />
              {mode.label}
            </label>
          ))}
        </div>
        {workMode !== "remote" && (
          <div className="grid grid-cols-2 gap-3">
            <Input
              value={city}
              onChange={(e) => onCityChange(e.target.value)}
              placeholder="Ciudad"
            />
            <Input
              value={country}
              onChange={(e) => onCountryChange(e.target.value)}
              placeholder="Pais"
            />
          </div>
        )}
      </div>
    </Field>
  )
}
