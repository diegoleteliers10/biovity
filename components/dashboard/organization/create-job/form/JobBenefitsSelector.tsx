import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import { Field, FieldLabel } from "@/components/ui/field"
import type { JobBenefitInput } from "@/lib/api/jobs"

const BENEFIT_OPTIONS: JobBenefitInput[] = [
  { tipo: "salud", label: "Seguro de salud y dental" },
  { tipo: "vacaciones", label: "Vacaciones pagadas" },
  { tipo: "formacion", label: "Presupuesto para formación" },
  { tipo: "equipo", label: "Equipo y trabajo híbrido" },
  { tipo: "bonos", label: "Bonos por desempeño" },
  { tipo: "horario", label: "Horario flexible" },
  { tipo: "teletrabajo", label: "Teletrabajo" },
  { tipo: "estacionamiento", label: "Estacionamiento" },
  { tipo: "gimnasio", label: "Gimnasio o wellness" },
  { tipo: "almuerzo", label: "Almuerzo o colación" },
  { tipo: "transporte", label: "Bono transporte" },
  { tipo: "otro", label: "Otros beneficios" },
]

export { BENEFIT_OPTIONS }

interface JobBenefitsSelectorProps {
  benefits: JobBenefitInput[]
  onBenefitsChange: (benefits: JobBenefitInput[]) => void
}

export function JobBenefitsSelector({ benefits, onBenefitsChange }: JobBenefitsSelectorProps) {
  const benefitsAnchorRef = useComboboxAnchor()

  return (
    <Field>
      <FieldLabel>Beneficios</FieldLabel>
      <Combobox
        multiple
        value={benefits}
        onValueChange={(v) => onBenefitsChange((v as JobBenefitInput[]) ?? [])}
        items={BENEFIT_OPTIONS}
        isItemEqualToValue={(a, b) => a.tipo === b.tipo && a.label === b.label}
      >
        <ComboboxChips ref={benefitsAnchorRef} className="w-full">
          <ComboboxValue>
            {(values: JobBenefitInput[]) => (
              <>
                {values.map((v) => (
                  <ComboboxChip key={v.tipo}>{v.label}</ComboboxChip>
                ))}
                <ComboboxChipsInput placeholder="Seleccionar beneficios..." />
              </>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={benefitsAnchorRef} className="w-(--anchor-width)">
          <ComboboxList>
            {BENEFIT_OPTIONS.map((opt) => (
              <ComboboxItem key={opt.tipo} value={opt}>
                {opt.label}
              </ComboboxItem>
            ))}
          </ComboboxList>
          <ComboboxEmpty>Sin resultados</ComboboxEmpty>
        </ComboboxContent>
      </Combobox>
    </Field>
  )
}
