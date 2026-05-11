import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface JobLocationFieldProps {
  isRemote: boolean
  city: string
  country: string
  onRemoteChange: (checked: boolean) => void
  onCityChange: (value: string) => void
  onCountryChange: (value: string) => void
}

export function JobLocationField({
  isRemote,
  city,
  country,
  onRemoteChange,
  onCityChange,
  onCountryChange,
}: JobLocationFieldProps) {
  return (
    <Field>
      <FieldLabel>Ubicación</FieldLabel>
      <div className="space-y-3">
        <Checkbox
          checked={isRemote}
          onChange={(e) => onRemoteChange(e.target.checked)}
          label="Trabajo remoto"
        />
        {!isRemote && (
          <div className="grid grid-cols-2 gap-3">
            <Input
              value={city}
              onChange={(e) => onCityChange(e.target.value)}
              placeholder="Ciudad"
            />
            <Input
              value={country}
              onChange={(e) => onCountryChange(e.target.value)}
              placeholder="País"
            />
          </div>
        )}
      </div>
    </Field>
  )
}
