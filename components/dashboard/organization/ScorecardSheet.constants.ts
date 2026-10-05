export const DECISIONS = [
  { value: "positive", label: "Avanzar" },
  { value: "neutral", label: "Con dudas" },
  { value: "negative", label: "Descartar" },
] as const
export const CONTEXTS = [
  { value: "cv_review", label: "Revisión de CV" },
  { value: "initial_interview", label: "Entrevista inicial" },
  { value: "technical_interview", label: "Entrevista técnica" },
  { value: "final_review", label: "Revisión final" },
] as const
export const CRITERIA = [
  { key: "technical", label: "Competencias y experiencia" },
  { key: "cultural", label: "Colaboración" },
  { key: "expectations", label: "Condiciones y disponibilidad" },
] as const
export const STAGES = [
  { value: "pendiente", label: "Pendiente" },
  { value: "entrevista", label: "Entrevista" },
  { value: "oferta", label: "Oferta" },
  { value: "contratado", label: "Contratado" },
  { value: "rechazado", label: "Rechazado" },
] as const

export const QUICK_TAGS = [
  "Experiencia relevante",
  "Excelente comunicación",
  "Disponibilidad inmediata",
  "Formación destacada",
  "Pretensión salarial alta",
  "Falta experiencia específica",
  "Requiere relocalización",
] as const
