"use client"

import { Location05Icon, Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useCallback, useState } from "react"
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

interface TrabajosSearchFiltersProps {
  filtros: FiltrosTrabajos
  onFiltrosChange: (filtros: FiltrosTrabajos) => void
}

export function TrabajosSearchFilters({ filtros, onFiltrosChange }: TrabajosSearchFiltersProps) {
  const [query, setQuery] = useState(filtros.query)
  const [ubicacion, setUbicacion] = useState(filtros.ubicacion)
  const [modalidad, setModalidad] = useState(filtros.modalidad)
  const [formato, setFormato] = useState(filtros.formato)
  const [salarioMin, setSalarioMin] = useState(filtros.salarioMin?.toString() || "")
  const [salarioMax, setSalarioMax] = useState(filtros.salarioMax?.toString() || "")
  const [experiencia, setExperiencia] = useState(filtros.experiencia)
  const [categoria, setCategoria] = useState(filtros.categoria || "todas")

  const handleBuscar = useCallback(() => {
    onFiltrosChange({
      query,
      ubicacion,
      modalidad: modalidad as FiltrosTrabajos["modalidad"],
      formato: formato as FiltrosTrabajos["formato"],
      salarioMin: salarioMin ? Number(salarioMin.replace(/[^0-9]/g, "")) : null,
      salarioMax: salarioMax ? Number(salarioMax.replace(/[^0-9]/g, "")) : null,
      experiencia: experiencia as FiltrosTrabajos["experiencia"],
      categoria: categoria === "todas" ? null : categoria,
    })
  }, [
    query,
    ubicacion,
    modalidad,
    formato,
    salarioMin,
    salarioMax,
    experiencia,
    categoria,
    onFiltrosChange,
  ])

  const handleLimpiar = useCallback(() => {
    setQuery("")
    setUbicacion("")
    setModalidad("todas")
    setFormato("todas")
    setSalarioMin("")
    setSalarioMax("")
    setExperiencia("todas")
    setCategoria("todas")
    onFiltrosChange({
      query: "",
      ubicacion: "",
      modalidad: "todas",
      formato: "todas",
      salarioMin: null,
      salarioMax: null,
      experiencia: "todas",
      categoria: null,
    })
  }, [onFiltrosChange])

  return (
    <section className="pt-2 pb-32 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-lg border-0">
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
                  className="pl-11 pr-4 py-2 w-full h-12"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
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
                  className="pl-10"
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                />
              </div>

              {/* Modalidad */}
              <Select
                value={modalidad}
                onValueChange={(value) => setModalidad(value as FiltrosTrabajos["modalidad"])}
              >
                <SelectTrigger className={cn("w-full !h-9")}>
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
                value={formato}
                onValueChange={(value) => setFormato(value as FiltrosTrabajos["formato"])}
              >
                <SelectTrigger className={cn("w-full !h-9")}>
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
                value={salarioMin}
                onChange={(e) => setSalarioMin(e.target.value)}
              />

              {/* Salario máximo */}
              <Input
                type="text"
                inputMode="numeric"
                placeholder="Salario máximo (CLP)"
                value={salarioMax}
                onChange={(e) => setSalarioMax(e.target.value)}
              />

              {/* Experiencia */}
              <Select
                value={experiencia}
                onValueChange={(value) => setExperiencia(value as FiltrosTrabajos["experiencia"])}
              >
                <SelectTrigger className={cn("w-full !h-9")}>
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
              <Select value={categoria} onValueChange={(value) => setCategoria(value)}>
                <SelectTrigger className={cn("w-full !h-9")}>
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
              <Button
                onClick={handleBuscar}
                size="lg"
                className="px-8 bg-gray-900 hover:bg-gray-800 text-white"
              >
                Buscar
              </Button>
              <Button onClick={handleLimpiar} variant="outline" size="lg" className="px-8">
                Limpiar filtros
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
