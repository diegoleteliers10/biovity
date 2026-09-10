import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type OrdenTrabajos = "recientes" | "antiguos" | "titulo-az" | "titulo-za"

const OPCIONES: { value: OrdenTrabajos; label: string }[] = [
  { value: "recientes", label: "Más recientes" },
  { value: "antiguos", label: "Más antiguos" },
  { value: "titulo-az", label: "Título A–Z" },
  { value: "titulo-za", label: "Título Z–A" },
]

export function SortSelect({
  value,
  onChange,
}: {
  value: OrdenTrabajos
  onChange: (value: OrdenTrabajos) => void
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as OrdenTrabajos)}>
      <SelectTrigger
        aria-label="Ordenar ofertas"
        className="w-44 h-10 px-3 bg-surface-container-lowest text-sm rounded-lg border-border text-foreground"
      >
        <SelectValue placeholder="Ordenar" />
      </SelectTrigger>
      <SelectContent>
        {OPCIONES.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
