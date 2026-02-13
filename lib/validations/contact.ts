/**
 * Contact form validation schemas
 * @see lib/validations/primitives.ts for base schemas
 */

import { z } from "zod"
import {
  corporateEmailSchema,
  emailSchema,
  messageSchema,
  nameSchema,
  phoneSchema,
} from "./primitives"

// =====================
// Organization Contact Schema
// =====================

/**
 * Organization contact form schema
 * - Used in the landing page "Contacta con ventas" form
 */
export const organizationContactSchema = z.object({
  // Personal info
  nombre: nameSchema,
  apellido: z
    .string({
      error: () => "El apellido debe ser un texto",
    })
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(100, "El apellido es demasiado largo")
    .trim(),
  email: corporateEmailSchema,
  telefono: phoneSchema,

  // Organization info
  empresa: z
    .string({
      error: () => "El nombre de la empresa debe ser un texto",
    })
    .min(2, "El nombre de la empresa debe tener al menos 2 caracteres")
    .max(200, "El nombre de la empresa es demasiado largo")
    .trim(),

  // Message
  mensaje: messageSchema,
})

// =====================
// General Contact Schema
// =====================

/**
 * General contact form schema
 * - Simpler version for general inquiries
 */
export const generalContactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: z
    .string({
      error: () => "El asunto debe ser un texto",
    })
    .min(5, "El asunto debe tener al menos 5 caracteres")
    .max(200, "El asunto es demasiado largo")
    .trim(),
  message: messageSchema,
})

// =====================
// Support Contact Schema
// =====================

/**
 * Support contact form schema
 * - For technical support requests
 */
export const supportContactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  issueType: z.enum(["login", "profile", "jobs", "applications", "billing", "other"], {
    error: () => ({ message: "El tipo de problema no es válido" }),
  }),
  description: messageSchema,
  attachments: z
    .array(
      z
        .instanceof(File, {
          message: "El adjunto debe ser un archivo",
        })
        .refine((file) => {
          return (
            file.type === "image/jpeg" ||
            file.type === "image/jpg" ||
            file.type === "image/png" ||
            file.type === "application/pdf"
          )
        }, "Solo se permiten imágenes (JPG, PNG) y PDF")
        .refine((file) => {
          return file.size <= 5 * 1024 * 1024 // 5MB
        }, "El archivo es demasiado grande (máximo 5MB)")
    )
    .max(5, "Máximo 5 archivos adjuntos")
    .optional(),
})

// =====================
// Type Exports
// =====================

/** Infer types from schemas for use in the codebase */
export type OrganizationContactInput = z.infer<typeof organizationContactSchema>
export type GeneralContactInput = z.infer<typeof generalContactSchema>
export type SupportContactInput = z.infer<typeof supportContactSchema>

// =====================
// Validation Helpers
// =====================

/**
 * Validate organization contact form
 * @param data - Contact form data to validate
 * @returns Validation result with formatted errors
 */
export function validateOrganizationContact(data: unknown) {
  const result = organizationContactSchema.safeParse(data)

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

/**
 * Validate general contact form
 * @param data - Contact form data to validate
 * @returns Validation result with formatted errors
 */
export function validateGeneralContact(data: unknown) {
  const result = generalContactSchema.safeParse(data)

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

/**
 * Validate support contact form
 * @param data - Contact form data to validate
 * @returns Validation result with formatted errors
 */
export function validateSupportContact(data: unknown) {
  const result = supportContactSchema.safeParse(data)

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
