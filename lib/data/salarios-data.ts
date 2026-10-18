import { INDUSTRY_OPTIONS } from "@/lib/data/industries"
import type { ExperienceLevelChile, OptionItem, RegionChile } from "@/lib/types/salarios"

// ============================================================================
// Mercado chileno: opciones para filtros y formulario Give-to-Get
// ============================================================================

export const REGIONES_CHILE: OptionItem<RegionChile>[] = [
  { value: "ARICA_Y_PARINACOTA", label: "Arica y Parinacota" },
  { value: "TARAPACA", label: "Tarapacá" },
  { value: "ANTOFAGASTA", label: "Antofagasta" },
  { value: "ATACAMA", label: "Atacama" },
  { value: "COQUIMBO", label: "Coquimbo" },
  { value: "VALPARAISO", label: "Valparaíso" },
  { value: "METROPOLITANA", label: "Metropolitana de Santiago" },
  { value: "OHIGGINS", label: "Libertador Gral. B. O'Higgins" },
  { value: "MAULE", label: "Maule" },
  { value: "NUBLE", label: "Ñuble" },
  { value: "BIOBIO", label: "Biobío" },
  { value: "ARAUCANIA", label: "La Araucanía" },
  { value: "LOS_RIOS", label: "Los Ríos" },
  { value: "LOS_LAGOS", label: "Los Lagos" },
  { value: "AYSEN", label: "Aysén del Gral. C. Ibáñez del Campo" },
  { value: "MAGALLANES", label: "Magallanes y de la Antártica Chilena" },
]

export const CARRERAS_STEM_CHILE: OptionItem[] = [
  { value: "bioinformatica", label: "Bioinformática" },
  { value: "ing_biotecnologia", label: "Ingeniería en Biotecnología" },
  { value: "quimica_farmacia", label: "Química y Farmacia" },
  { value: "ing_civil_quimica", label: "Ingeniería Civil Química" },
  { value: "ing_alimentos", label: "Ingeniería en Alimentos" },
  { value: "tec_medica", label: "Tecnología Médica" },
  { value: "bioquimica", label: "Bioquímica" },
  { value: "ing_ambiental", label: "Ingeniería Ambiental" },
  { value: "agronomia", label: "Agronomía" },
  { value: "medicina", label: "Medicina" },
  { value: "veterinaria", label: "Medicina Veterinaria" },
  { value: "acuicultura", label: "Acuicultura e Ingeniería Acuícola" },
]

export const INDUSTRIAS_CHILE: OptionItem[] = INDUSTRY_OPTIONS.map((industry) => ({
  value: industry,
  label: industry,
}))

export const NIVELES_EXPERIENCIA_CHILE: OptionItem<ExperienceLevelChile>[] = [
  { value: "JUNIOR", label: "Junior (0-2 años)" },
  { value: "MID", label: "Mid (3-5 años)" },
  { value: "SENIOR", label: "Senior (6-8 años)" },
  { value: "LEAD", label: "Specialist / Jefatura (10+ años)" },
]

export const NIVELES_EDUCACION_CHILE: OptionItem[] = [
  { value: "LICENCIATURA", label: "Licenciatura / Título Profesional" },
  { value: "MAGISTER", label: "Magíster (incluye Becas ANID)" },
  { value: "DOCTORADO", label: "Doctorado (incluye Becas Chile)" },
  { value: "POSTDOC", label: "Postdoctorado" },
]

export const MODALIDADES_TRABAJO_CHILE: OptionItem[] = [
  { value: "PRESENCIAL", label: "Presencial" },
  { value: "HIBRIDO", label: "Híbrido" },
  { value: "REMOTO", label: "Remoto (local)" },
]

export const BENEFICIOS_CHILE: OptionItem[] = [
  {
    value: "SEGURO_MEDICO_COMPLEMENTARIO",
    label: "Seguro de salud complementario (Bice/Consorcio/MetLife)",
  },
  { value: "BONO_FAENA", label: "Bono de desempeño / faena" },
  { value: "CAPACITACION_PAGADA", label: "Capacitaciones pagadas" },
  { value: "ASIGNACION_COLACION_MOVILIZACION", label: "Asignación de colación y movilización" },
  { value: "DIAS_LIBRES_EXTRA", label: "Días libres extra" },
]

export const HABILIDADES_CIENCIA_CHILE = [
  "Normativas ISP / GMP / GLP",
  "Bioinformática / Data Science (Python, R)",
  "Inglés fluido (C1/C2)",
  "Postgrados (magíster / doctorado)",
  "SERNAGEOMIN / normativa minera / ISO 9001-14001",
  "Inglés técnico / bilingüe",
]
