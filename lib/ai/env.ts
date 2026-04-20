import { z } from "zod"

const EnvSchema = z.object({
  OPENROUTER_API_KEY: z.string().min(1, "OPENROUTER_API_KEY is required"),
  AI_RATE_LIMIT_RPM: z.coerce.number().default(10),
  AI_RATE_LIMIT_UNAUTHENTICATED_RPM: z.coerce.number().default(3),
  AI_MAX_INPUT_LENGTH: z.coerce.number().default(2000),
  AI_MAX_STEPS_DEFAULT: z.coerce.number().default(5),
  AI_MAX_TOKENS_DEFAULT: z.coerce.number().default(1000),
  AI_MAX_STEPS_EXTENDED: z.coerce.number().default(10),
  AI_MAX_TOKENS_EXTENDED: z.coerce.number().default(3000),
})

const parsed = EnvSchema.safeParse(process.env)

if (!parsed.success) {
  const errors = parsed.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")
  throw new Error(`[AI Config] Missing or invalid env vars: ${errors}`)
}

export const env = parsed.data

export const AI_LIMITS = {
  DEFAULT_MAX_STEPS: env.AI_MAX_STEPS_DEFAULT,
  DEFAULT_MAX_TOKENS: env.AI_MAX_TOKENS_DEFAULT,
  EXTENDED_MAX_STEPS: env.AI_MAX_STEPS_EXTENDED,
  EXTENDED_MAX_TOKENS: env.AI_MAX_TOKENS_EXTENDED,
} as const

export const RATE_LIMITS = {
  AUTHENTICATED_RPM: env.AI_RATE_LIMIT_RPM,
  UNAUTHENTICATED_RPM: env.AI_RATE_LIMIT_UNAUTHENTICATED_RPM,
} as const

export const MAX_INPUT_LENGTH = env.AI_MAX_INPUT_LENGTH
