import type { FiltroOption } from "@/lib/types/trabajos-filtros"

export const MODALIDADES_TRABAJOS: FiltroOption[] = [
  { id: "todas", label: "Todas" },
  { id: "remoto", label: "Remoto" },
  { id: "hibrido", label: "Híbrido" },
  { id: "presencial", label: "Presencial" },
]

export const FORMATOS_TRABAJOS: FiltroOption[] = [
  { id: "todas", label: "Todas" },
  { id: "full-time", label: "Full Time" },
  { id: "part-time", label: "Part Time" },
  { id: "contrato", label: "Contrato" },
]

export const EXPERIENCIAS_TRABAJOS: FiltroOption[] = [
  { id: "todas", label: "Todas" },
  { id: "junior", label: "Junior" },
  { id: "mid", label: "Semi Senior" },
  { id: "senior", label: "Senior" },
]

export const CATEGORIAS_TRABAJOS: FiltroOption[] = [
  { id: "todas", label: "Todas" },
  { id: "biotecnologia", label: "Biotecnología" },
  { id: "bioquimica", label: "Bioquímica" },
  { id: "quimica", label: "Química" },
  { id: "ingenieria-quimica", label: "Ingeniería Química" },
  { id: "alimentos", label: "Ingeniería en Alimentos" },
]
