"use client"

import { Briefcase01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useQueryStates } from "nuqs"
import { useMemo } from "react"
import type { Job } from "@/lib/api/jobs"
import { formatJobLocation } from "@/lib/api/jobs"
import { useJobsSearch } from "@/lib/api/use-jobs"
import { trabajosParsers } from "@/lib/parsers/trabajos"
import type { FiltrosTrabajos, Trabajo } from "@/lib/types/trabajos"
import { TrabajosList } from "./TrabajosList"
import { TrabajosSearchFilters } from "./TrabajosSearchFilters"

function urlStateToFiltros(state: {
  q: string
  ubicacion: string
  modalidad: string
  formato: string
  salarioMin: number | null
  salarioMax: number | null
  moneda: "CLP" | "USD"
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
    moneda: state.moneda ?? "CLP",
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
    moneda: filtros.moneda,
    experiencia: toExperiencia(filtros.experiencia),
    categoria: filtros.categoria,
  }
}

function normalizeEmploymentType(type: string): "remoto" | "hibrido" | "presencial" {
  const normalized = type.toLowerCase()
  if (normalized.includes("remote") || normalized.includes("remoto")) return "remoto"
  if (
    normalized.includes("hybrid") ||
    normalized.includes("híbrido") ||
    normalized.includes("hibrido")
  )
    return "hibrido"
  if (
    normalized.includes("presencial") ||
    normalized.includes("onsite") ||
    normalized.includes("on-site")
  )
    return "presencial"
  return "presencial"
}

function normalizeFormato(type: string): "full-time" | "part-time" | "contrato" | "practica" {
  const normalized = type.toLowerCase()
  if (normalized.includes("full") || normalized.includes("tiempo completo")) return "full-time"
  if (normalized.includes("part") || normalized.includes("medio")) return "part-time"
  if (normalized.includes("contract") || normalized.includes("contrato")) return "contrato"
  if (normalized.includes("practica") || normalized.includes("práctica")) return "practica"
  return "full-time"
}

function jobToTrabajo(job: Job): Trabajo {
  const locationStr = formatJobLocation(job.location)

  const tipoToLabel: Record<string, string> = {
    salud: "Salud",
    vacaciones: "Vacaciones",
    formacion: "Formación",
    equipo: "Equipo",
    otro: "Otro",
  }

  return {
    id: job.id,
    titulo: job.title,
    empresa: job.organization?.name ?? "Empresa",
    ubicacion: locationStr || job.location?.city || "Chile",
    modalidad: normalizeEmploymentType(job.employmentType),
    formato: normalizeFormato(job.employmentType),
    fechaPublicacion: new Date(job.createdAt),
    rangoSalarial: {
      min: job.salary?.min ?? 0,
      max: job.salary?.max ?? 0,
      moneda: (job.salary?.currency as "CLP" | "USD") ?? "CLP",
    },
    beneficios:
      job.benefits?.map((b) => ({
        tipo: (b.tipo as TipoBeneficio) || "otro",
        label: b.title || tipoToLabel[b.tipo || "otro"] || "Otro",
      })) ?? [],
    descripcion: job.description,
    requisitos: [],
    responsabilidades: [],
    categoria: job.category,
    experiencia: undefined,
    slug: job.id,
  }
}

type TipoBeneficio = "salud" | "vacaciones" | "formacion" | "equipo" | "otro"

export function TrabajosPageContent() {
  const [urlState, setUrlState] = useQueryStates(trabajosParsers, {
    history: "push",
    shallow: false,
  })

  const filtros = useMemo(() => urlStateToFiltros(urlState), [urlState])

  const { data: jobsResult, isLoading, isError, error } = useJobsSearch({ search: urlState.q || undefined, category: filtros.categoria ?? undefined })

  const jobs = jobsResult?.data

  const apiTrabajos = useMemo(() => {
    if (!jobs) return []
    return jobs.map(jobToTrabajo)
  }, [jobs])

  const handleFiltrosChange = (newFiltros: FiltrosTrabajos) => {
    setUrlState(filtrosToUrlState(newFiltros))
  }

  const trabajosFiltrados = useMemo(() => {
    return apiTrabajos.filter((trabajo) => {
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

      if (trabajo.rangoSalarial.moneda !== filtros.moneda) {
        return false
      }

      if (filtros.salarioMin !== null) {
        if (trabajo.rangoSalarial.min < filtros.salarioMin) {
          return false
        }
      }
      if (filtros.salarioMax !== null) {
        if (trabajo.rangoSalarial.max > filtros.salarioMax) {
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
  }, [apiTrabajos, filtros])

  return (
    <>
      <TrabajosSearchFilters filtros={filtros} onFiltrosChange={handleFiltrosChange} />
      {isLoading && (
        <section className="bg-white pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center py-12">
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="animate-spin">
                  <HugeiconsIcon icon={Briefcase01Icon} size={24} />
                </div>
                <span>Cargando ofertas…</span>
              </div>
            </div>
          </div>
        </section>
      )}
      {isError && (
        <section className="bg-white pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <p className="text-lg text-destructive font-medium">
                Error al cargar las ofertas laborales
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {error instanceof Error ? error.message : "Intenta nuevamente más tarde"}
              </p>
            </div>
          </div>
        </section>
      )}
      {!isLoading && !isError && apiTrabajos.length === 0 && (
        <section className="bg-white pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <p className="text-lg text-foreground font-medium">
                No hay ofertas publicadas actualmente
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Vuelve pronto, estamos trabajando para traer nuevas oportunidades.
              </p>
            </div>
          </div>
        </section>
      )}
      {!isLoading && !isError && apiTrabajos.length > 0 && (
        <TrabajosList trabajos={trabajosFiltrados} />
      )}
    </>
  )
}
