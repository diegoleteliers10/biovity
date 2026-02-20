/**
 * Primitive Zod schemas for reusable validation
 * @see https://zod.dev for more information
 */

import { z } from "zod"

// =====================
// Email Validation
// =====================

/**
 * Email schema with RFC 5322 compliant validation
 * - Maximum 254 characters (RFC 5322 limit)
 * - Must contain @ and domain with TLD
 * - Trimmed and lowercased automatically
 */
export const emailSchema = z
  .string({
    error: () => "El correo electrónico debe ser un texto",
  })
  .min(1, "El correo electrónico es requerido")
  .max(254, "El correo electrónico es demasiado largo")
  .trim()
  .toLowerCase()
  .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), "El correo electrónico no es válido")

/**
 * Corporate email schema - same as email but can be used for
 * organization-specific validation
 */
export const corporateEmailSchema = emailSchema

// =====================
// Password Validation
// =====================

/**
 * User password schema
 * - Minimum 6 characters (Better Auth default)
 * - Maximum 128 characters
 */
export const userPasswordSchema = z
  .string({
    error: () => "La contraseña debe ser un texto",
  })
  .min(6, "La contraseña debe tener al menos 6 caracteres")
  .max(128, "La contraseña es demasiado larga")

/**
 * Organization password schema
 * - Minimum 8 characters (more strict for org accounts)
 * - Maximum 128 characters
 */
export const organizationPasswordSchema = z
  .string({
    error: () => "La contraseña debe ser un texto",
  })
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .max(128, "La contraseña es demasiado larga")

// =====================
// Name Validation
// =====================

/**
 * Name schema for person names
 * - Minimum 2 characters
 * - Maximum 100 characters
 * - Only letters, spaces, accents, and common name characters
 */
export const nameSchema = z
  .string({
    error: () => "El nombre debe ser un texto",
  })
  .min(2, "El nombre debe tener al menos 2 caracteres")
  .max(100, "El nombre es demasiado largo")
  .trim()
  .refine(
    (val) => /^[\p{L}\s'-]+$/u.test(val),
    "El nombre solo puede contener letras, espacios, guiones y apóstrofes"
  )

// =====================
// URL Validation
// =====================

/**
 * URL schema for website/organization URLs
 * - Must start with http:// or https://
 * - Valid URL format
 */
export const urlSchema = z
  .string({
    error: () => "La URL debe ser un texto",
  })
  .min(1, "La URL es requerida")
  .max(2048, "La URL es demasiado larga")
  .trim()
  .refine((val) => /^https?:\/\/.+/i.test(val), "La URL debe comenzar con http:// o https://")
  .refine((val) => {
    try {
      new URL(val)
      return true
    } catch {
      return false
    }
  }, "La URL no es válida")

/**
 * Organization domain schema (without protocol)
 * - Domain name format only
 * - Used for organization login
 */
export const domainSchema = z
  .string({
    error: () => "El dominio debe ser un texto",
  })
  .min(1, "El dominio es requerido")
  .max(253, "El dominio es demasiado largo")
  .trim()
  .toLowerCase()
  .refine(
    (val) =>
      /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/.test(val),
    "El dominio no es válido (ejemplo: tuorganizacion.com)"
  )

// =====================
// Phone Validation
// =====================

/**
 * Phone number schema (international format)
 * - Optional field
 * - Common phone formats accepted
 */
export const phoneSchema = z
  .string({
    error: () => "El teléfono debe ser un texto",
  })
  .max(50, "El número de teléfono es demasiado largo")
  .trim()
  .optional()
  .refine((val) => {
    if (!val) return true
    // Accept common phone formats
    return /^[\d\s+()-]{8,20}$/.test(val)
  }, "El número de teléfono no es válido")

// =====================
// Location Validation
// =====================

/**
 * Location schema for user location
 * - Optional field
 * - Format: "Ciudad, País" or similar
 */
export const locationSchema = z
  .string({
    error: () => "La ubicación debe ser un texto",
  })
  .min(2, "La ubicación debe tener al menos 2 caracteres")
  .max(200, "La ubicación es demasiado larga")
  .trim()
  .optional()

// =====================
// Text/Content Validation
// =====================

/**
 * Short text schema for fields like profession, position, etc.
 */
export const shortTextSchema = z
  .string({
    error: () => "Este campo debe ser un texto",
  })
  .min(1, "Este campo es requerido")
  .max(100, "Este campo es demasiado largo")
  .trim()

/**
 * Optional short text schema
 */
export const optionalShortTextSchema = shortTextSchema.optional()

/**
 * Bio/description schema for longer text content
 */
export const bioSchema = z
  .string({
    error: () => "La biografía debe ser un texto",
  })
  .max(2000, "La biografía es demasiado larga")
  .trim()
  .optional()

/**
 * Message schema for contact forms, messages, etc.
 */
export const messageSchema = z
  .string({
    error: () => "El mensaje debe ser un texto",
  })
  .min(10, "El mensaje debe tener al menos 10 caracteres")
  .max(5000, "El mensaje es demasiado largo")
  .trim()

// =====================
// Role/Type Enums
// =====================

/**
 * User type enum for Better Auth
 */
export const userTypeSchema = z.enum(["persona", "organización"], {
  error: () => ({ message: "El tipo de usuario debe ser 'persona' u 'organización'" }),
})

/**
 * Waitlist role enum
 */
export const waitlistRoleSchema = z.enum(["professional", "empresa"], {
  error: () => ({ message: "El rol debe ser 'professional' o 'empresa'" }),
})

/**
 * Job type enum for job postings
 */
export const jobTypeSchema = z.enum(["any", "full-time", "part-time", "contract", "internship"], {
  error: () => ({ message: "El tipo de empleo no es válido" }),
})

/**
 * Experience level enum for job postings
 */
export const experienceLevelSchema = z.enum(["any", "junior", "mid", "senior"], {
  error: () => ({ message: "El nivel de experiencia no es válido" }),
})

// =====================
// Array Schemas
// =====================

/**
 * Skills schema - array of skill strings
 */
export const skillsSchema = z
  .array(
    z
      .string()
      .min(1, "La habilidad no puede estar vacía")
      .max(50, "La habilidad es demasiado larga")
      .trim()
  )
  .min(1, "Debe tener al menos una habilidad")
  .max(20, "Demasiadas habilidades (máximo 20)")
  .optional()

// =====================
// Type Exports
// =====================

/** Infer types from schemas for use in the codebase */
export type Email = z.infer<typeof emailSchema>
export type UserPassword = z.infer<typeof userPasswordSchema>
export type OrganizationPassword = z.infer<typeof organizationPasswordSchema>
export type Name = z.infer<typeof nameSchema>
export type URL = z.infer<typeof urlSchema>
export type Domain = z.infer<typeof domainSchema>
export type Phone = z.infer<typeof phoneSchema>
export type Location = z.infer<typeof locationSchema>
export type ShortText = z.infer<typeof shortTextSchema>
export type Bio = z.infer<typeof bioSchema>
export type Message = z.infer<typeof messageSchema>
export type UserType = z.infer<typeof userTypeSchema>
export type WaitlistRole = z.infer<typeof waitlistRoleSchema>
export type JobType = z.infer<typeof jobTypeSchema>
export type ExperienceLevel = z.infer<typeof experienceLevelSchema>
export type Skills = z.infer<typeof skillsSchema>
