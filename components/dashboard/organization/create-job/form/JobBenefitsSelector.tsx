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
  { tipo: "salud", title: "Seguro de salud y dental" },
  { tipo: "vacaciones", title: "Vacaciones pagadas" },
  { tipo: "formacion", title: "Presupuesto para formación" },
  { tipo: "equipo", title: "Equipo y trabajo híbrido" },
  { tipo: "bonos", title: "Bonos por desempeño" },
  { tipo: "horario", title: "Horario flexible" },
  { tipo: "teletrabajo", title: "Teletrabajo" },
  { tipo: "estacionamiento", title: "Estacionamiento" },
  { tipo: "gimnasio", title: "Gimnasio o wellness" },
  { tipo: "almuerzo", title: "Almuerzo o colación" },
  { tipo: "transporte", title: "Bono transporte" },
  { tipo: "otro", title: "Otros beneficios" },
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
        isItemEqualToValue={(a, b) => a.tipo === b.tipo && a.title === b.title}
      >
        <ComboboxChips ref={benefitsAnchorRef} className="w-full">
          <ComboboxValue>
            {(values: JobBenefitInput[]) => (
              <>
                {values.map((v) => (
                  <ComboboxChip key={v.tipo}>{v.title}</ComboboxChip>
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
                {opt.title}
              </ComboboxItem>
            ))}
          </ComboboxList>
          <ComboboxEmpty>Sin resultados</ComboboxEmpty>
        </ComboboxContent>
      </Combobox>
    </Field>
  )
}
