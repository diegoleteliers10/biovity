"use client"

import { useState, useMemo } from "react"
import { TrabajosHero } from "./TrabajosHero"
import { TrabajosSearchFilters } from "./TrabajosSearchFilters"
import { TrabajosList } from "./TrabajosList"
import { TRABAJOS_MOCK } from "@/lib/data/trabajos-data"
import type { FiltrosTrabajos } from "@/lib/types/trabajos"

const initialFiltros: FiltrosTrabajos = {
  query: "",
  ubicacion: "",
  modalidad: "todas",
  formato: "todas",
  salarioMin: null,
  salarioMax: null,
  experiencia: "todas",
  categoria: null,
}

export function TrabajosPageContent() {
  const [filtros, setFiltros] = useState<FiltrosTrabajos>(initialFiltros)

  const trabajosFiltrados = useMemo(() => {
    return TRABAJOS_MOCK.filter((trabajo) => {
      // Filtro por query (título o empresa)
      if (filtros.query) {
        const queryLower = filtros.query.toLowerCase()
        if (
          !trabajo.titulo.toLowerCase().includes(queryLower) &&
          !trabajo.empresa.toLowerCase().includes(queryLower)
        ) {
          return false
        }
      }

      // Filtro por ubicación
      if (filtros.ubicacion) {
        if (!trabajo.ubicacion.toLowerCase().includes(filtros.ubicacion.toLowerCase())) {
          return false
        }
      }

      // Filtro por modalidad
      if (filtros.modalidad !== "todas") {
        if (trabajo.modalidad !== filtros.modalidad) {
          return false
        }
      }

      // Filtro por formato
      if (filtros.formato !== "todas") {
        if (trabajo.formato !== filtros.formato) {
          return false
        }
      }

      // Filtro por rango salarial
      if (filtros.salarioMin !== null) {
        if (trabajo.rangoSalarial.max < filtros.salarioMin) {
          return false
        }
      }
      if (filtros.salarioMax !== null) {
        if (trabajo.rangoSalarial.min > filtros.salarioMax) {
          return false
        }
      }

      // Filtro por experiencia
      if (filtros.experiencia !== "todas") {
        if (trabajo.experiencia !== filtros.experiencia) {
          return false
        }
      }

      // Filtro por categoría
      if (filtros.categoria) {
        if (trabajo.categoria !== filtros.categoria) {
          return false
        }
      }

      return true
    })
  }, [filtros])

  return (
    <>
      <TrabajosHero />
      <TrabajosSearchFilters filtros={filtros} onFiltrosChange={setFiltros} />
      <TrabajosList trabajos={trabajosFiltrados} />
    </>
  )
}
