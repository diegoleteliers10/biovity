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
  { value: "biotecnologia", label: "Biotecnología" },
  { value: "bioquimica", label: "Bioquímica" },
  { value: "quimica", label: "Química" },
  { value: "ingenieria-quimica", label: "Ingeniería Química" },
  { value: "salud", label: "Salud" },
  { value: "farmacia", label: "Farmacia" },
  { value: "investigacion", label: "Investigación" },
  { value: "medio-ambiente", label: "Medio Ambiente" },
  { value: "agronomia", label: "Agronomía" },
  { value: "nutricion", label: "Nutrición" },
  { value: "otro", label: "Otro" },
]

type Props = {
  value: string
  onChange: (value: string) => void
}

export function JobCategoryField({ value, onChange }: Props) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor="job-category"
        className="flex items-center gap-1.5 text-xs leading-4 font-medium"
      >
        <HugeiconsIcon icon={TagIcon} className="size-3.5" />
        Categoría
      </label>
      <Select onValueChange={onChange} value={value}>
        <SelectTrigger id="job-category" className="h-9">
          <SelectValue placeholder="Seleccionar categoría" />
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
