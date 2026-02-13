/**
 * Authentication validation schemas for login and registration
 * @see lib/validations/primitives.ts for base schemas
 */

import { z } from "zod"
import {
  corporateEmailSchema,
  domainSchema,
  emailSchema,
  nameSchema,
  organizationPasswordSchema,
  urlSchema,
  userPasswordSchema,
} from "./primitives"

// =====================
// Login Schemas
// =====================

/**
 * User login form schema
 * - Email and password for individual users
 * - Optional remember me checkbox
 */
export const userLoginSchema = z.object({
  email: emailSchema,
  password: z
    .string({
      error: () => "La contraseña es requerida",
    })
    .min(1, "La contraseña es requerida"),
  rememberMe: z.boolean().optional().default(true),
})

/**
 * Organization login form schema
 * - Domain, email and password for organizations
 * - Optional remember me checkbox
 */
export const organizationLoginSchema = z.object({
  organizationDomain: domainSchema,
  email: corporateEmailSchema,
  password: z
    .string({
      error: () => "La contraseña es requerida",
    })
    .min(1, "La contraseña es requerida"),
  rememberMe: z.boolean().optional().default(true),
})

// =====================
// Registration Schemas
// =====================

/**
 * User registration form schema
 * - Name, email, password, profession
 * - Terms acceptance required
 */
export const userRegistrationSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: userPasswordSchema,
    confirmPassword: z.string({
      error: () => "Debes confirmar tu contraseña",
    }),
    profession: z
      .string({
        error: () => "La profesión debe ser un texto",
      })
      .min(1, "La profesión es requerida")
      .max(100, "La profesión es demasiado larga")
      .trim(),
    acceptTerms: z
      .boolean({
        error: () => ({ message: "Debes aceptar los términos y condiciones" }),
      })
      .refine((val) => val === true, {
        message: "Debes aceptar los términos y condiciones",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

/**
 * Organization registration form schema
 * - Contact info (name, email, password, position)
 * - Organization info (name, website)
 * - Terms acceptance required
 */
export const organizationRegistrationSchema = z
  .object({
    // Contact information
    contactName: nameSchema,
    contactEmail: corporateEmailSchema,
    contactPassword: organizationPasswordSchema,
    confirmPassword: z.string({
      error: () => "Debes confirmar tu contraseña",
    }),
    contactPosition: z
      .string({
        error: () => "El cargo debe ser un texto",
      })
      .min(1, "El cargo es requerido")
      .max(100, "El cargo es demasiado largo")
      .trim()
      .optional(),

    // Organization information
    organizationName: z
      .string({
        error: () => "El nombre de la organización debe ser un texto",
      })
      .min(2, "El nombre de la organización debe tener al menos 2 caracteres")
      .max(200, "El nombre de la organización es demasiado largo")
      .trim(),
    organizationWebsite: urlSchema,

    // Terms
    acceptTerms: z
      .boolean({
        error: () => ({ message: "Debes aceptar los términos y condiciones" }),
      })
      .refine((val) => val === true, {
        message: "Debes aceptar los términos y condiciones",
      }),
  })
  .refine((data) => data.contactPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

// =====================
// Password Reset Schemas
// =====================

/**
 * Password reset request schema (email only)
 */
export const passwordResetRequestSchema = z.object({
  email: emailSchema,
})

/**
 * Password reset confirmation schema
 * - New password and confirmation
 */
export const passwordResetConfirmSchema = z
  .object({
    password: userPasswordSchema,
    confirmPassword: z.string({
      error: () => "Debes confirmar tu contraseña",
    }),
    token: z.string({
      error: () => "El token de recuperación es requerido",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

// =====================
// Session Management
// =====================

/**
 * Session data schema for Better Auth session
 */
export const sessionSchema = z.object({
  user: z.object({
    id: z.string(),
    name: z.string().optional(),
    email: z.string().email(),
    image: z.string().url().optional(),
    type: z.enum(["persona", "organización"]),
    profession: z.string().optional(),
    location: z.string().optional(),
    title: z.string().optional(),
    organizationId: z.string().optional(),
  }),
  expiresAt: z.date().optional(),
})

// =====================
// Type Exports
// =====================

/** Infer types from schemas for use in the codebase */
export type UserLoginInput = z.infer<typeof userLoginSchema>
export type OrganizationLoginInput = z.infer<typeof organizationLoginSchema>
export type UserRegistrationInput = z.infer<typeof userRegistrationSchema>
export type OrganizationRegistrationInput = z.infer<typeof organizationRegistrationSchema>
export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestSchema>
export type PasswordResetConfirmInput = z.infer<typeof passwordResetConfirmSchema>
export type SessionData = z.infer<typeof sessionSchema>

// =====================
// Validation Helpers
// =====================

/**
 * Safe parse helper that returns formatted errors for form display
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Object with success boolean and formatted errors
 */
export function validateForm<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data)

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
