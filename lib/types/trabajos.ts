export type ModalidadTrabajo = "remoto" | "hibrido" | "presencial"
export type FormatoTrabajo = "full-time" | "part-time" | "contrato" | "practica"
export type NivelExperiencia = "junior" | "mid" | "senior"
export type TipoBeneficio = "salud" | "vacaciones" | "formacion" | "equipo" | "otro"

export type Beneficio = {
  tipo: TipoBeneficio
  label: string
}

export type RangoSalarial = {
  min: number
  max: number
  moneda: "CLP" | "USD"
}

export type Trabajo = {
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

export type MonedaSalario = "CLP" | "USD"

export type FiltrosTrabajos = {
  query: string
  ubicacion: string
  modalidad: "Modalidad" | ModalidadTrabajo
  formato: "Formato" | FormatoTrabajo
  salarioMin: number | null
  salarioMax: number | null
  moneda: MonedaSalario
  experiencia: "Experiencia" | NivelExperiencia
  categoria: string | null
}
