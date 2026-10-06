import { z } from "zod"

export const aiLogSchema = z.object({
  id: z.string(),
  userId: z.string(),
  userName: z.string().nullable(),
  userEmail: z.string().nullable(),
  userType: z.string().nullable(),
  endpoint: z.string(),
  status: z.enum(["ready", "insufficient", "failed", "blocked", "aborted"]).nullable(),
  errorCode: z.string().nullable(),
  provider: z.string().nullable(),
  modelId: z.string().nullable(),
  inputTokens: z.number().nonnegative().nullable(),
  outputTokens: z.number().nonnegative().nullable(),
  durationMs: z.number().nonnegative().nullable(),
  toolsCalled: z.array(z.string()).nullable(),
  flagged: z.boolean(),
  timestamp: z.string(),
})
export const aiLogsResponseSchema = z.object({
  data: z.array(aiLogSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
})
export const aiLogsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(100000).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  search: z.string().trim().max(200).default(""),
  flagged: z.enum(["true", "false"]).optional(),
  endpoint: z.string().trim().max(200).default(""),
})
export const aiLogMetadataSchema = z.object({
  auditVersion: z.literal(2).optional().catch(undefined),
  engine: z.string().trim().min(1).max(200).optional().catch(undefined),
  errorCode: z
    .enum([
      "provider_error",
      "persistence_error",
      "lease_lost",
      "provider_balance",
      "provider_rate_limit",
      "provider_auth",
      "provider_timeout",
      "explanation_failed",
      "invalid_explanation_format",
      "unsupported_evidence",
      "explanation_persistence_failed",
      "explanation_lease_lost",
    ])
    .optional()
    .catch(undefined),
  status: aiLogSchema.shape.status.optional().catch(undefined),
  provider: z.string().trim().min(1).optional().catch(undefined),
  modelId: z.string().trim().min(1).optional().catch(undefined),
  model: z.string().trim().min(1).optional().catch(undefined),
  inputTokens: z.number().int().nonnegative().optional().catch(undefined),
  outputTokens: z.number().int().nonnegative().optional().catch(undefined),
  durationScope: z.literal("complete").optional().catch(undefined),
  toolsScope: z.literal("executed").optional().catch(undefined),
})
