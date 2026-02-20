/**
 * Validation schemas entry point
 * Exports all validation schemas and helper functions
 *
 * @example
 * ```ts
 * import { userLoginSchema, validateForm } from '@/lib/validations'
 *
 * const result = validateForm(userLoginSchema, formData)
 * if (!result.success) {
 *   // Handle errors
 * }
 * ```
 */

// Authentication schemas
export * from "./auth"
// Contact schemas
export * from "./contact"
// Job schemas
export * from "./job"
// Primitive schemas
export * from "./primitives"
// Profile schemas
export * from "./profile"
// Waitlist schemas
export * from "./waitlist"
