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
    <nav className="mt-6 flex flex-wrap gap-2" aria-label="Categorías de empleo">
      {TRABAJOS_CATEGORIAS.map((cat) => {
        const isSelected = urlState.categoria === cat.id
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleSelectCategoria(cat.id)}
            className={cn(
              "inline-flex items-center rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all cursor-pointer",
              isSelected
                ? "bg-primary text-primary-foreground border border-primary shadow-xs font-semibold"
                : "border border-border/60 bg-surface-container-lowest text-muted-foreground hover:border-accent/40 hover:text-accent"
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
