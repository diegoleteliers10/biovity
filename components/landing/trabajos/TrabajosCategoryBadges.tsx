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
  const [urlState, setUrlState] = useQueryStates(trabajosParsers, {
    history: "push",
    shallow: true,
    scroll: false,
    throttleMs: 300,
  })

  const handleSelectCategoria = (catId: string) => {
    const isSelected = urlState.categoria === catId
    setUrlState({ categoria: isSelected ? null : catId, pagina: 1 })
  }

  return (
    <nav className="flex flex-wrap gap-2 pt-5" aria-label="Categorías de empleo">
      {TRABAJOS_CATEGORIAS.map((cat) => {
        const isSelected = urlState.categoria === cat.id
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleSelectCategoria(cat.id)}
            className={cn(
              "inline-flex h-11 items-center gap-2 rounded-lg border px-3.5 text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isSelected
                ? "border-secondary bg-secondary text-secondary-foreground"
                : "border-border/60 bg-surface-container-low text-muted-foreground hover:border-secondary/50 hover:bg-surface-container-highest hover:text-foreground"
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
