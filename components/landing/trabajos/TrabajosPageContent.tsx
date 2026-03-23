"use client"

import { useQueryStates } from "nuqs"
import { useMemo } from "react"
import { TRABAJOS_MOCK } from "@/lib/data/trabajos-data"
import { trabajosParsers } from "@/lib/parsers/trabajos"
import type { FiltrosTrabajos } from "@/lib/types/trabajos"
import { TrabajosHero } from "./TrabajosHero"
import { TrabajosList } from "./TrabajosList"
import { TrabajosSearchFilters } from "./TrabajosSearchFilters"

function urlStateToFiltros(state: {
  q: string
  ubicacion: string
  modalidad: string
  formato: string
  salarioMin: number | null
  salarioMax: number | null
  experiencia: string
  categoria: string | null
}): FiltrosTrabajos {
  const toModalidad = (v: string): FiltrosTrabajos["modalidad"] => {
    if (!v || v === "todas") return "Modalidad"
    return v as FiltrosTrabajos["modalidad"]
  }
  const toFormato = (v: string): FiltrosTrabajos["formato"] => {
    if (!v || v === "todas") return "Formato"
    return v as FiltrosTrabajos["formato"]
  }
  const toExperiencia = (v: string): FiltrosTrabajos["experiencia"] => {
    if (!v || v === "todas") return "Experiencia"
    return v as FiltrosTrabajos["experiencia"]
  }
  return {
    query: state.q,
    ubicacion: state.ubicacion,
    modalidad: toModalidad(state.modalidad),
    formato: toFormato(state.formato),
    salarioMin: state.salarioMin,
    salarioMax: state.salarioMax,
    experiencia: toExperiencia(state.experiencia),
    categoria: state.categoria && state.categoria !== "todas" ? state.categoria : null,
  }
}

function filtrosToUrlState(filtros: FiltrosTrabajos) {
  const toModalidad = (v: FiltrosTrabajos["modalidad"]): string => {
    if (v === "Modalidad") return ""
    return v
  }
  const toFormato = (v: FiltrosTrabajos["formato"]): string => {
    if (v === "Formato") return ""
    return v
  }
  const toExperiencia = (v: FiltrosTrabajos["experiencia"]): string => {
    if (v === "Experiencia") return ""
    return v
  }
  return {
    q: filtros.query,
    ubicacion: filtros.ubicacion,
    modalidad: toModalidad(filtros.modalidad),
    formato: toFormato(filtros.formato),
    salarioMin: filtros.salarioMin,
    salarioMax: filtros.salarioMax,
    experiencia: toExperiencia(filtros.experiencia),
    categoria: filtros.categoria,
  }
}

export function TrabajosPageContent() {
  const [urlState, setUrlState] = useQueryStates(trabajosParsers, {
    history: "push",
    shallow: false,
  })

  const filtros = useMemo(() => urlStateToFiltros(urlState), [urlState])

  const handleFiltrosChange = (newFiltros: FiltrosTrabajos) => {
    setUrlState(filtrosToUrlState(newFiltros))
  }

  const trabajosFiltrados = useMemo(() => {
    return TRABAJOS_MOCK.filter((trabajo) => {
      if (filtros.query) {
        const queryLower = filtros.query.toLowerCase()
        if (
          !trabajo.titulo.toLowerCase().includes(queryLower) &&
          !trabajo.empresa.toLowerCase().includes(queryLower)
        ) {
          return false
        }
      }

      if (filtros.ubicacion) {
        if (!trabajo.ubicacion.toLowerCase().includes(filtros.ubicacion.toLowerCase())) {
          return false
        }
      }

      if (filtros.modalidad !== "Modalidad") {
        if (trabajo.modalidad !== filtros.modalidad) {
          return false
        }
      }

      if (filtros.formato !== "Formato") {
        if (trabajo.formato !== filtros.formato) {
          return false
        }
      }

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

      if (filtros.experiencia !== "Experiencia") {
        if (trabajo.experiencia !== filtros.experiencia) {
          return false
        }
      }

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
      <TrabajosSearchFilters filtros={filtros} onFiltrosChange={handleFiltrosChange} />
      <TrabajosList trabajos={trabajosFiltrados} />
    </>
  )
}
