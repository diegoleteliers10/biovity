/**
 * Contact form validation schemas
 * @see lib/validations/primitives.ts for base schemas
 */

import { z } from "zod"
import {
  corporateEmailSchema,
  messageSchema,
  nameSchema,
  phoneSchema,
} from "./primitives"

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

/** Infer types from schemas for use in the codebase */
export type OrganizationContactInput = z.infer<typeof organizationContactSchema>

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
