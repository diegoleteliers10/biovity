"use client"

import { Location05Icon, Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useCallback, useReducer } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  CATEGORIAS_TRABAJOS,
  EXPERIENCIAS_TRABAJOS,
  FORMATOS_TRABAJOS,
  MODALIDADES_TRABAJOS,
} from "@/lib/data/trabajos-filtros-data"
import type { FiltrosTrabajos } from "@/lib/types/trabajos"
import { cn } from "@/lib/utils"

type TrabajosSearchFiltersProps = {
  filtros: FiltrosTrabajos
  onFiltrosChange: (filtros: FiltrosTrabajos) => void
}

type FilterFormState = {
  query: string
  ubicacion: string
  modalidad: string
  formato: string
  salarioMin: string
  salarioMax: string
  experiencia: string
  categoria: string
}

type FilterFormAction =
  | { type: "SET_FIELD"; field: keyof FilterFormState; value: string }
  | { type: "RESET" }

const filterFormReducer = (state: FilterFormState, action: FilterFormAction): FilterFormState => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value }
    case "RESET":
      return {
        query: "",
        ubicacion: "",
        modalidad: "",
        formato: "",
        salarioMin: "",
        salarioMax: "",
        experiencia: "",
        categoria: "",
      }
    default:
      return state
  }
}

export function TrabajosSearchFilters({ filtros, onFiltrosChange }: TrabajosSearchFiltersProps) {
  const [filterState, dispatch] = useReducer(filterFormReducer, {
    query: filtros.query,
    ubicacion: filtros.ubicacion,
    modalidad: filtros.modalidad,
    formato: filtros.formato,
    salarioMin: filtros.salarioMin?.toString() || "",
    salarioMax: filtros.salarioMax?.toString() || "",
    experiencia: filtros.experiencia,
    categoria: filtros.categoria || "",
  })

  const handleBuscar = useCallback(() => {
    onFiltrosChange({
      query: filterState.query,
      ubicacion: filterState.ubicacion,
      modalidad: filterState.modalidad as FiltrosTrabajos["modalidad"],
      formato: filterState.formato as FiltrosTrabajos["formato"],
      salarioMin: filterState.salarioMin
        ? Number(filterState.salarioMin.replace(/[^0-9]/g, ""))
        : null,
      salarioMax: filterState.salarioMax
        ? Number(filterState.salarioMax.replace(/[^0-9]/g, ""))
        : null,
      experiencia: filterState.experiencia as FiltrosTrabajos["experiencia"],
      categoria:
        filterState.categoria === "todas" || !filterState.categoria ? null : filterState.categoria,
    })
  }, [filterState, onFiltrosChange])

  const handleLimpiar = useCallback(() => {
    dispatch({ type: "RESET" })
    onFiltrosChange({
      query: "",
      ubicacion: "",
      modalidad: "" as FiltrosTrabajos["modalidad"],
      formato: "" as FiltrosTrabajos["formato"],
      salarioMin: null,
      salarioMax: null,
      experiencia: "" as FiltrosTrabajos["experiencia"],
      categoria: null,
    })
  }, [onFiltrosChange])

  return (
    <section className="pt-2 pb-32 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-[#f3f3f5] border border-border/15">
          <CardContent className="p-6">
            {/* Barra de búsqueda principal */}
            <div className="mb-6">
              <div className="relative">
                <HugeiconsIcon
                  icon={Search01Icon}
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <Input
                  type="text"
                  placeholder="Buscar por título, empresa o palabras clave"
                  className="pl-11 pr-4 py-2 w-full h-12 bg-white"
                  value={filterState.query}
                  onChange={(e) =>
                    dispatch({ type: "SET_FIELD", field: "query", value: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleBuscar()
                    }
                  }}
                />
              </div>
            </div>

            {/* Filtros en grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {/* Ubicación */}
              <div className="relative flex items-center">
                <HugeiconsIcon
                  icon={Location05Icon}
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10"
                />
                <Input
                  type="text"
                  placeholder="Ubicación"
                  className="pl-10 bg-white"
                  value={filterState.ubicacion}
                  onChange={(e) =>
                    dispatch({ type: "SET_FIELD", field: "ubicacion", value: e.target.value })
                  }
                />
              </div>

              {/* Modalidad */}
              <Select
                value={filterState.modalidad}
                onValueChange={(value) =>
                  dispatch({ type: "SET_FIELD", field: "modalidad", value })
                }
              >
                <SelectTrigger className={cn("w-full !h-9 bg-white")}>
                  <SelectValue placeholder="Modalidad" />
                </SelectTrigger>
                <SelectContent>
                  {MODALIDADES_TRABAJOS.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Formato */}
              <Select
                value={filterState.formato}
                onValueChange={(value) => dispatch({ type: "SET_FIELD", field: "formato", value })}
              >
                <SelectTrigger className={cn("w-full !h-9 bg-white")}>
                  <SelectValue placeholder="Formato" />
                </SelectTrigger>
                <SelectContent>
                  {FORMATOS_TRABAJOS.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Salario mínimo */}
              <Input
                type="text"
                inputMode="numeric"
                placeholder="Salario mínimo (CLP)"
                value={filterState.salarioMin}
                onChange={(e) =>
                  dispatch({ type: "SET_FIELD", field: "salarioMin", value: e.target.value })
                }
                className="placeholder:text-muted-foreground bg-white"
                aria-label="Salario mínimo en pesos chilenos"
              />

              {/* Salario máximo */}
              <Input
                type="text"
                inputMode="numeric"
                placeholder="Salario máximo (CLP)"
                value={filterState.salarioMax}
                onChange={(e) =>
                  dispatch({ type: "SET_FIELD", field: "salarioMax", value: e.target.value })
                }
                className="placeholder:text-muted-foreground bg-white"
                aria-label="Salario máximo en pesos chilenos"
              />

              {/* Experiencia */}
              <Select
                value={filterState.experiencia}
                onValueChange={(value) =>
                  dispatch({ type: "SET_FIELD", field: "experiencia", value })
                }
              >
                <SelectTrigger className={cn("w-full !h-9 bg-white")}>
                  <SelectValue placeholder="Experiencia" />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCIAS_TRABAJOS.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Categoría */}
              <Select
                value={filterState.categoria}
                onValueChange={(value) =>
                  dispatch({ type: "SET_FIELD", field: "categoria", value })
                }
              >
                <SelectTrigger className={cn("w-full !h-9 bg-white")}>
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIAS_TRABAJOS.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3 justify-center">
              <Button onClick={handleBuscar} variant="secondary" size="lg" className="px-8">
                Buscar
              </Button>
              <Button onClick={handleLimpiar} variant="ghost" size="lg" className="px-8">
                Limpiar filtros
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
