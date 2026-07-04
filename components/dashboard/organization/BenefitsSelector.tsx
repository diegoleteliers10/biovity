"use client"

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

interface BenefitsSelectorProps {
  value: JobBenefitInput[]
  onChange: (value: JobBenefitInput[]) => void
}

export function BenefitsSelector({ value, onChange }: BenefitsSelectorProps) {
  const benefitsAnchorRef = useComboboxAnchor()

  return (
    <Combobox
      multiple
      value={value}
      onValueChange={(v) => onChange((v as JobBenefitInput[]) ?? [])}
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
  )
}
