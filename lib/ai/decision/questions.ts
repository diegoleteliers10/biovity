import { noul, score } from "@typesafe-ai/sdk"
import { JEV_SCORE_CRITERIA } from "./constants"

export const JEV_QUESTIONS = {
  compatibility: score(
    "¿Qué tan bien coincide la experiencia profesional documentada de esta persona con los requisitos explícitos de la oferta? Usa el resumen, el texto del CV y los antecedentes estructurados del candidato como fuentes complementarias. Considera solo la información del estado. No infieras datos que no aparecen.",
    JEV_SCORE_CRITERIA
  ),
  skills: noul(
    "¿El perfil documenta experiencia con las habilidades obligatorias de la oferta? Responde según la información explícita disponible."
  ),
  experience: noul(
    "¿La experiencia documentada cumple el nivel o los años mínimos indicados en la oferta? No infieras años que no aparecen."
  ),
  education: noul(
    "¿La formación académica documentada es pertinente para las funciones y requisitos de la oferta?"
  ),
  sufficientData: noul(
    "¿El resumen, el texto del CV o los antecedentes estructurados contienen información profesional suficiente para comparar al candidato con la oferta? Tener datos suficientes no significa cumplir los requisitos. Un CV con antecedentes relevantes permite evaluar aunque las listas del perfil estén vacías. La falta de una habilidad o formación requerida afecta compatibilidad, no suficiencia de datos."
  ),
} as const
