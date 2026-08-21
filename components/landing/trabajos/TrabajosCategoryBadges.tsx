"use client"

import { useQueryStates } from "nuqs"
import { trabajosParsers } from "@/lib/parsers/trabajos"
import { cn } from "@/lib/utils"

export const TRABAJOS_CATEGORIAS = [
  { id: "biotecnologia", label: "Biotecnología" },
  { id: "bioquimica", label: "Bioquímica" },
  { id: "quimica", label: "Química" },
  { id: "ingenieria-quimica", label: "Ingeniería Química" },
  { id: "farmacia", label: "Farmacia" },
  { id: "salud", label: "Salud" },
  { id: "investigacion", label: "Investigación" },
] as const

export function TrabajosCategoryBadges() {
  const [urlState, setUrlState] = useQueryStates(trabajosParsers)

  const handleSelectCategoria = (catId: string) => {
    const isSelected = urlState.categoria === catId
    setUrlState({ categoria: isSelected ? null : catId })
  }

  return (
    <nav className="flex flex-wrap gap-2 pt-1" aria-label="Categorías de empleo">
      {TRABAJOS_CATEGORIAS.map((cat) => {
        const isSelected = urlState.categoria === cat.id
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleSelectCategoria(cat.id)}
            className={cn(
              "inline-flex items-center rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer",
              isSelected
                ? "bg-secondary text-secondary-foreground border border-secondary shadow-xs font-semibold"
                : "border border-border bg-surface-container-lowest text-muted-foreground hover:border-secondary/50 hover:text-foreground hover:bg-surface-container-low"
            )}
            aria-pressed={isSelected}
          >
            {cat.label}
          </button>
        )
      })}
    </nav>
  )
}
