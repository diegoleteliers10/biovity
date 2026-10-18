"use client"

import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  FilterEditIcon,
  Location05Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useCallback, useReducer, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
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
  moneda: "CLP" | "USD"
  experiencia: string
}

type FilterFormAction =
  | { type: "SET_FIELD"; field: keyof FilterFormState; value: string }
  | { type: "RESET" }

function formatSalarioInputValue(value: number): string {
  return new Intl.NumberFormat("es-CL", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function parseSalarioInputValue(value: string): number {
  const cleaned = value.replace(/[$.\s]/g, "")
  return parseInt(cleaned, 10) || 0
}

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
        moneda: "CLP",
        experiencia: "",
      }
    default:
      return state
  }
}

function countActiveFilters(state: FilterFormState): number {
  return [
    Boolean(state.ubicacion),
    Boolean(state.modalidad),
    Boolean(state.formato),
    Boolean(state.salarioMin),
    Boolean(state.salarioMax),
    Boolean(state.experiencia),
  ].filter(Boolean).length
}

export function TrabajosSearchFilters({ filtros, onFiltrosChange }: TrabajosSearchFiltersProps) {
  const [filterState, dispatch] = useReducer(filterFormReducer, {
    query: filtros.query,
    ubicacion: filtros.ubicacion,
    modalidad: filtros.modalidad === "Modalidad" ? "" : filtros.modalidad,
    formato: filtros.formato === "Formato" ? "" : filtros.formato,
    salarioMin: filtros.salarioMin ? formatSalarioInputValue(filtros.salarioMin) : "",
    salarioMax: filtros.salarioMax ? formatSalarioInputValue(filtros.salarioMax) : "",
    moneda: filtros.moneda,
    experiencia: filtros.experiencia === "Experiencia" ? "" : filtros.experiencia,
  })

  const initialActiveCount = countActiveFilters(filterState)
  const [isExpanded, setIsExpanded] = useState(initialActiveCount > 0)

  const handleBuscar = useCallback(() => {
    onFiltrosChange({
      query: filterState.query,
      ubicacion: filterState.ubicacion,
      modalidad: filterState.modalidad as FiltrosTrabajos["modalidad"],
      formato: filterState.formato as FiltrosTrabajos["formato"],
      salarioMin: filterState.salarioMin ? parseSalarioInputValue(filterState.salarioMin) : null,
      salarioMax: filterState.salarioMax ? parseSalarioInputValue(filterState.salarioMax) : null,
      moneda: filterState.moneda,
      experiencia: filterState.experiencia as FiltrosTrabajos["experiencia"],
      categoria: filtros.categoria,
    })
  }, [filterState, filtros.categoria, onFiltrosChange])

  const handleLimpiar = useCallback(() => {
    dispatch({ type: "RESET" })
    onFiltrosChange({
      query: "",
      ubicacion: "",
      modalidad: "" as FiltrosTrabajos["modalidad"],
      formato: "" as FiltrosTrabajos["formato"],
      salarioMin: null,
      salarioMax: null,
      moneda: "CLP",
      experiencia: "" as FiltrosTrabajos["experiencia"],
      categoria: filtros.categoria,
    })
  }, [filtros.categoria, onFiltrosChange])

  const activeCount = countActiveFilters(filterState)

  return (
    <section className="bg-surface-container-lowest py-4">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="rounded-lg border-0 shadow-none bg-surface-container-low p-4 sm:p-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <HugeiconsIcon
                  icon={Search01Icon}
                  size={20}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <Input
                  type="text"
                  placeholder="Buscar por cargo, empresa, tecnología o palabras clave..."
                  className="h-11 w-full rounded-lg border-border bg-surface-container-lowest pl-10 pr-4 text-sm"
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

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsExpanded((prev) => !prev)}
                  className={cn(
                    "flex h-11 items-center gap-2 rounded-lg border-border bg-surface-container-lowest px-4 text-sm font-medium transition-colors hover:bg-surface-container-lowest/80",
                    isExpanded && "border-secondary text-secondary bg-secondary/10",
                    activeCount > 0 && !isExpanded && "border-secondary/60 text-secondary"
                  )}
                  aria-expanded={isExpanded}
                  aria-label="Abrir opciones de filtrado"
                >
                  <HugeiconsIcon icon={FilterEditIcon} className="size-4" />
                  <span>Filtros</span>
                  {activeCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="px-1.5 py-0 text-xs font-semibold bg-secondary text-secondary-foreground"
                    >
                      {activeCount}
                    </Badge>
                  )}
                  <HugeiconsIcon
                    icon={isExpanded ? ArrowUp01Icon : ArrowDown01Icon}
                    className="size-3.5 text-muted-foreground"
                  />
                </Button>

                <Button
                  type="button"
                  onClick={handleBuscar}
                  className="h-11 shrink-0 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Buscar
                </Button>
              </div>
            </div>

            {isExpanded && (
              <div className="space-y-4 pt-4 animate-in fade-in-50 duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="relative flex items-center">
                    <HugeiconsIcon
                      icon={Location05Icon}
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10"
                    />
                    <Input
                      type="text"
                      placeholder="Ciudad o Región"
                      className="pl-9 h-11 w-full bg-surface-container-lowest text-sm rounded-lg border-border"
                      value={filterState.ubicacion}
                      onChange={(e) =>
                        dispatch({ type: "SET_FIELD", field: "ubicacion", value: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleBuscar()
                      }}
                    />
                  </div>

                  <Select
                    value={filterState.modalidad}
                    onValueChange={(value) =>
                      dispatch({ type: "SET_FIELD", field: "modalidad", value })
                    }
                  >
                    <SelectTrigger className="w-full h-11 pl-3.5 pr-1 bg-surface-container-lowest text-sm rounded-lg border-border text-foreground">
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

                  <Select
                    value={filterState.formato}
                    onValueChange={(value) =>
                      dispatch({ type: "SET_FIELD", field: "formato", value })
                    }
                  >
                    <SelectTrigger className="w-full h-11 pl-3.5 pr-1 bg-surface-container-lowest text-sm rounded-lg border-border text-foreground">
                      <SelectValue placeholder="Tipo de Jornada" />
                    </SelectTrigger>
                    <SelectContent>
                      {FORMATOS_TRABAJOS.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder={`Sueldo mínimo (${filterState.moneda})`}
                    value={filterState.salarioMin}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9]/g, "")
                      const formatted = raw ? formatSalarioInputValue(parseInt(raw, 10)) : ""
                      dispatch({ type: "SET_FIELD", field: "salarioMin", value: formatted })
                    }}
                    className="h-11 rounded-lg border-border bg-surface-container-lowest px-3.5 text-sm tabular-nums placeholder:text-muted-foreground"
                    aria-label="Salario mínimo"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleBuscar()
                    }}
                  />

                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder={`Sueldo máximo (${filterState.moneda})`}
                    value={filterState.salarioMax}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9]/g, "")
                      const formatted = raw ? formatSalarioInputValue(parseInt(raw, 10)) : ""
                      dispatch({ type: "SET_FIELD", field: "salarioMax", value: formatted })
                    }}
                    className="h-11 rounded-lg border-border bg-surface-container-lowest px-3.5 text-sm tabular-nums placeholder:text-muted-foreground"
                    aria-label="Salario máximo"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleBuscar()
                    }}
                  />

                  <Select
                    value={filterState.moneda}
                    onValueChange={(value) =>
                      dispatch({
                        type: "SET_FIELD",
                        field: "moneda",
                        value: value as "CLP" | "USD",
                      })
                    }
                  >
                    <SelectTrigger className="w-full h-11 pl-3.5 pr-1 bg-surface-container-lowest text-sm rounded-lg border-border text-foreground">
                      <SelectValue placeholder="Moneda" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CLP">CLP (Peso chileno)</SelectItem>
                      <SelectItem value="USD">USD (Dólar americano)</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={filterState.experiencia}
                    onValueChange={(value) =>
                      dispatch({ type: "SET_FIELD", field: "experiencia", value })
                    }
                  >
                    <SelectTrigger className="w-full h-11 pl-3.5 pr-1 bg-surface-container-lowest text-sm rounded-lg border-border text-foreground">
                      <SelectValue placeholder="Nivel de Experiencia" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPERIENCIAS_TRABAJOS.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <Button
                    type="button"
                    onClick={handleLimpiar}
                    variant="ghost"
                    size="sm"
                    className="h-10 px-4 text-sm font-medium hover:bg-surface-container-lowest"
                  >
                    Limpiar filtros
                  </Button>
                  <Button
                    type="button"
                    onClick={handleBuscar}
                    className="h-10 px-5 text-sm rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 font-medium"
                  >
                    Aplicar filtros
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </section>
  )
}
