import type { FiltroOption } from "@/lib/types/trabajos-filtros"

/** Placeholder value for "no selection" - must match FiltrosTrabajos sentinel */
export const PLACEHOLDER_MODALIDAD = "Modalidad"
export const PLACEHOLDER_FORMATO = "Formato"
export const PLACEHOLDER_EXPERIENCIA = "Experiencia"
export const PLACEHOLDER_CATEGORIA = "Categoría"

export const MODALIDADES_TRABAJOS: FiltroOption[] = [
  { id: PLACEHOLDER_MODALIDAD, label: PLACEHOLDER_MODALIDAD },
  { id: "todas", label: "Todas" },
  { id: "remoto", label: "Remoto" },
  { id: "hibrido", label: "Híbrido" },
  { id: "presencial", label: "Presencial" },
]

export const FORMATOS_TRABAJOS: FiltroOption[] = [
  { id: PLACEHOLDER_FORMATO, label: PLACEHOLDER_FORMATO },
  { id: "todas", label: "Todas" },
  { id: "full-time", label: "Full Time" },
  { id: "part-time", label: "Part Time" },
  { id: "contrato", label: "Contrato" },
]

export const EXPERIENCIAS_TRABAJOS: FiltroOption[] = [
  { id: PLACEHOLDER_EXPERIENCIA, label: PLACEHOLDER_EXPERIENCIA },
  { id: "todas", label: "Todas" },
  { id: "junior", label: "Junior" },
  { id: "mid", label: "Semi Senior" },
  { id: "senior", label: "Senior" },
]

export const CATEGORIAS_TRABAJOS: FiltroOption[] = [
  { id: PLACEHOLDER_CATEGORIA, label: PLACEHOLDER_CATEGORIA },
  { id: "todas", label: "Todas" },
  { id: "biotecnologia", label: "Biotecnología" },
  { id: "bioquimica", label: "Bioquímica" },
  { id: "quimica", label: "Química" },
  { id: "ingenieria-quimica", label: "Ingeniería Química" },
  { id: "alimentos", label: "Ingeniería en Alimentos" },
]
