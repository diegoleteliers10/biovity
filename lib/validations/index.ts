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

// Primitive schemas
export * from "./primitives"

// Authentication schemas
export * from "./auth"

// Waitlist schemas
export * from "./waitlist"

// Profile schemas
export * from "./profile"

// Job schemas
export * from "./job"

// Contact schemas
export * from "./contact"
