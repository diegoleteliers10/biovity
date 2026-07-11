"use client"

import { TagIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const CATEGORIES = [
  { value: "biotecnologia", label: "Biotecnologia" },
  { value: "bioquimica", label: "Bioquimica" },
  { value: "quimica", label: "Quimica" },
  { value: "ingenieria-quimica", label: "Ingenieria Quimica" },
  { value: "salud", label: "Salud" },
  { value: "farmacia", label: "Farmacia" },
  { value: "investigacion", label: "Investigacion" },
  { value: "medio-ambiente", label: "Medio Ambiente" },
  { value: "agronomia", label: "Agronomia" },
  { value: "nutricion", label: "Nutricion" },
  { value: "otro", label: "Otro" },
]

type Props = {
  value: string
  onChange: (value: string) => void
}

export function JobCategoryField({ value, onChange }: Props) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-medium">
        <HugeiconsIcon icon={TagIcon} className="size-3.5" />
        Categoria
      </label>
      <Select onValueChange={onChange} value={value}>
        <SelectTrigger className="h-9 text-sm">
          <SelectValue placeholder="Seleccionar categoria" />
        </SelectTrigger>
        <SelectContent>
          {CATEGORIES.map((cat) => (
            <SelectItem key={cat.value} value={cat.value}>
              {cat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
