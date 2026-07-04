"use client"

import { FilterEditIcon, Location05Icon, Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useCallback, useEffect, useReducer, useState } from "react"
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/animate-ui/components/radix/sheet"
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
  moneda: "CLP" | "USD"
  experiencia: string
  categoria: string
}

type FilterFormAction =
  | { type: "SET_FIELD"; field: keyof FilterFormState; value: string }
  | { type: "RESET" }
  | { type: "SYNC_FROM_FILTROS"; payload: FiltrosTrabajos }

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
        categoria: "",
      }
    case "SYNC_FROM_FILTROS":
      return {
        query: action.payload.query,
        ubicacion: action.payload.ubicacion,
        modalidad: action.payload.modalidad === "Modalidad" ? "" : action.payload.modalidad,
        formato: action.payload.formato === "Formato" ? "" : action.payload.formato,
        salarioMin: action.payload.salarioMin ? formatSalarioInputValue(action.payload.salarioMin) : "",
        salarioMax: action.payload.salarioMax ? formatSalarioInputValue(action.payload.salarioMax) : "",
        moneda: action.payload.moneda,
        experiencia: action.payload.experiencia === "Experiencia" ? "" : action.payload.experiencia,
        categoria: action.payload.categoria || "",
      }
    default:
      return state
  }
}

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

function FiltersGrid({
  filterState,
  dispatch,
}: {
  filterState: FilterFormState
  dispatch: React.Dispatch<FilterFormAction>
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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

      <Select
        value={filterState.modalidad}
        onValueChange={(value) => dispatch({ type: "SET_FIELD", field: "modalidad", value })}
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

      <Input
        type="text"
        inputMode="numeric"
        placeholder={`Salario mínimo (${filterState.moneda})`}
        value={filterState.salarioMin}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^0-9]/g, "")
          const formatted = raw ? formatSalarioInputValue(parseInt(raw, 10)) : ""
          dispatch({ type: "SET_FIELD", field: "salarioMin", value: formatted })
        }}
        className="placeholder:text-muted-foreground bg-white"
        aria-label="Salario mínimo"
      />

      <Input
        type="text"
        inputMode="numeric"
        placeholder={`Salario máximo (${filterState.moneda})`}
        value={filterState.salarioMax}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^0-9]/g, "")
          const formatted = raw ? formatSalarioInputValue(parseInt(raw, 10)) : ""
          dispatch({ type: "SET_FIELD", field: "salarioMax", value: formatted })
        }}
        className="placeholder:text-muted-foreground bg-white"
        aria-label="Salario máximo"
      />

      <Select
        value={filterState.moneda}
        onValueChange={(value) =>
          dispatch({ type: "SET_FIELD", field: "moneda", value: value as "CLP" | "USD" })
        }
      >
        <SelectTrigger className={cn("w-full !h-9 bg-white")}>
          <SelectValue placeholder="Moneda" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="CLP">CLP (Peso chileno)</SelectItem>
          <SelectItem value="USD">USD (Dólar)</SelectItem>
        </SelectContent>
      </Select>

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
  )
}

function FiltersActions({
  handleAplicar,
  handleLimpiar,
  className = "",
}: {
  handleAplicar: () => void
  handleLimpiar: () => void
  className?: string
}) {
  return (
    <div className={cn("flex gap-3 justify-center", className)}>
      <Button onClick={handleAplicar} variant="secondary" size="lg" className="px-8">
        Aplicar filtros
      </Button>
      <Button onClick={handleLimpiar} variant="ghost" size="lg" className="px-8">
        Limpiar
      </Button>
    </div>
  )
}

function MobileFiltersSheet({
  filterState,
  dispatch,
  onAplicar,
  onLimpiar,
}: {
  filterState: FilterFormState
  dispatch: React.Dispatch<FilterFormAction>
  onAplicar: () => void
  onLimpiar: () => void
}) {
  const [open, setOpen] = useState(false)

  const handleAplicar = () => {
    onAplicar()
    setOpen(false)
  }

  const handleLimpiar = () => {
    onLimpiar()
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary" size="icon" className="h-12 w-12 shrink-0">
          <HugeiconsIcon icon={FilterEditIcon} className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full bg-[#f3f3f5] px-6 flex flex-col">
        <SheetHeader className="pb-6 shrink-0">
          <SheetTitle className="text-xl font-semibold tracking-tight">
            Filtros
          </SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto flex-1 -mx-6 px-6">
          <FiltersGrid filterState={filterState} dispatch={dispatch} />
        </div>
        <div className="pt-6 shrink-0">
          <FiltersActions
            handleAplicar={handleAplicar}
            handleLimpiar={handleLimpiar}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
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
    categoria: filtros.categoria || "",
  })

  useEffect(() => {
    dispatch({ type: "SYNC_FROM_FILTROS", payload: filtros })
  }, [filtros])

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
      moneda: "CLP",
      experiencia: "" as FiltrosTrabajos["experiencia"],
      categoria: null,
    })
  }, [onFiltrosChange])

  return (
    <section className="bg-white pt-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-[#f3f3f5] border border-border/15">
          <CardContent className="p-6">
            {/* Mobile: Search + Filter button */}
            <div className="flex gap-2 mb-0 md:hidden">
              <div className="relative flex-1">
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
              <MobileFiltersSheet
                filterState={filterState}
                dispatch={dispatch}
                onAplicar={handleBuscar}
                onLimpiar={handleLimpiar}
              />
            </div>

            {/* Desktop: Full layout */}
            <div className="hidden md:block">
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

              <FiltersGrid filterState={filterState} dispatch={dispatch} />
              <FiltersActions
                handleAplicar={handleBuscar}
                handleLimpiar={handleLimpiar}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}