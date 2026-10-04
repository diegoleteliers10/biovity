import { noul, score } from "@typesafe-ai/sdk"
import { JEV_SCORE_CRITERIA } from "./constants"

export const JEV_QUESTIONS = {
  compatibility: score(
    "¿Qué tan bien coincide la experiencia profesional documentada de esta persona con los requisitos explícitos de la oferta? Considera solo la información del estado. No infieras datos que no aparecen.",
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
    "¿El perfil contiene información profesional suficiente para comparar sus antecedentes con los requisitos de esta oferta?"
  ),
} as const
