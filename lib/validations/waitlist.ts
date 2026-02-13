/**
 * Waitlist validation schema
 * @see lib/validations/primitives.ts for base schemas
 */

import { z } from "zod"
import { emailSchema, waitlistRoleSchema } from "./primitives"

// =====================
// Waitlist Schemas
// =====================

/**
 * Waitlist API request schema
 * - Email address (validated and normalized)
 * - Role (professional or empresa)
 */
export const waitlistSchema = z.object({
  email: emailSchema,
  role: waitlistRoleSchema,
})

/**
 * Waitlist API response schema
 */
export const waitlistResponseSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
})

// =====================
// Type Exports
// =====================

/** Infer types from schemas for use in the codebase */
export type WaitlistInput = z.infer<typeof waitlistSchema>
export type WaitlistResponse = z.infer<typeof waitlistResponseSchema>

// =====================
// Validation Helpers
// =====================

/**
 * Validate waitlist API request
 * @param data - Raw request data
 * @returns Validation result with formatted errors
 */
export function validateWaitlistRequest(data: unknown) {
  const result = waitlistSchema.safeParse(data)

  if (!result.success) {
    const errors: Record<string, string> = {}
    result.error.issues.forEach((issue) => {
      const path = issue.path.join(".")
      errors[path] = issue.message
    })
    return { success: false, errors }
  }

  return { success: true, data: result.data }
}
