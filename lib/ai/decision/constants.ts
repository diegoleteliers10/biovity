export const JEV_MODEL_VERSION = "jev-1.13.0"
export const JEV_RUBRIC_VERSION = 2
export const JEV_SCORE_CONCURRENCY = 3
export const JEV_MAX_ASSESSMENTS_PER_INVOCATION = 24
export const JEV_DAILY_ANALYSIS_LIMIT = 100
export const JEV_MAX_APPLICATIONS_PER_REQUEST = 100
export const JEV_MAX_ATTEMPTS = 3
export const JEV_LEASE_SECONDS = 120
export const JEV_TIMEOUT_MS = 20_000
export const JEV_EXPLANATION_PROMPT_VERSION = 1
export const JEV_EXPLANATION_TIMEOUT_MS = 30_000
export const JEV_PROFILE_SNAPSHOT_RETENTION_DAYS = 30

export const JEV_SCORE_CRITERIA = [
  "No coincide con los requisitos de la oferta",
  "Coincide con pocos requisitos relevantes",
  "Coincide con algunos requisitos importantes",
  "Cumple la mayoría de los requisitos relevantes",
  "Cumple casi todos los requisitos relevantes",
  "Coincide de forma muy alta con los requisitos de la oferta",
] as const

export const JEV_MINIMUM_DATA_SUFFICIENCY = 0.5

export const JEV_MAX_CV_TEXT_LENGTH = 20_000
