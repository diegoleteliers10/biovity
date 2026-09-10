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

// Application schemas
export * from "./application"
// Authentication schemas
export * from "./auth"
// Contact schemas
export * from "./contact"
// Job alert schemas
export * from "./job-alert"
// Primitive schemas
export * from "./primitives"
// Profile schemas
export * from "./profile"
// Question schemas
export * from "./question"
// Salary submission schemas (Give-to-Get, mercado chileno)
export * from "./salary"
// Waitlist schemas
export * from "./waitlist"
