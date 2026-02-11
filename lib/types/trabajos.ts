export type ModalidadTrabajo = "remoto" | "hibrido" | "presencial"
export type FormatoTrabajo = "full-time" | "part-time" | "contrato"
export type NivelExperiencia = "junior" | "mid" | "senior"
export type TipoBeneficio = "salud" | "vacaciones" | "formacion" | "equipo" | "otro"

export interface Beneficio {
  tipo: TipoBeneficio
  label: string
}

export interface RangoSalarial {
  min: number
  max: number
  moneda: "CLP"
}

export interface Trabajo {
  id: string
  titulo: string
  empresa: string
  ubicacion: string
  modalidad: ModalidadTrabajo
  formato: FormatoTrabajo
  fechaPublicacion: Date
  rangoSalarial: RangoSalarial
  beneficios?: Beneficio[]
  descripcion: string
  requisitos: string[]
  responsabilidades: string[]
  categoria?: string
  experiencia?: NivelExperiencia
  slug: string
}

export interface FiltrosTrabajos {
  query: string
  ubicacion: string
  modalidad: "todas" | ModalidadTrabajo
  formato: "todas" | FormatoTrabajo
  salarioMin: number | null
  salarioMax: number | null
  experiencia: "todas" | NivelExperiencia
  categoria: string | null
}
