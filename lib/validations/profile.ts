/**
 * Profile validation schemas for user profile management
 * @see lib/validations/primitives.ts for base schemas
 */

import { z } from "zod"
import {
  bioSchema,
  emailSchema,
  locationSchema,
  nameSchema,
  optionalShortTextSchema,
  phoneSchema,
  skillsSchema,
} from "./primitives"

// =====================
// Profile Schemas
// =====================

/**
 * Full user profile schema
 * - All profile fields including optional ones
 */
export const userProfileSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  location: locationSchema,
  profession: optionalShortTextSchema,
  bio: bioSchema,
  experience: z
    .string({
      error: () => "La experiencia debe ser un texto",
    })
    .max(50, "El texto de experiencia es demasiado largo")
    .trim()
    .optional(),
  skills: skillsSchema,
  avatar: z
    .string({
      error: () => "El avatar debe ser una URL o base64",
    })
    .url("El avatar debe ser una URL válida")
    .or(z.string().startsWith("data:image/").optional())
    .optional(),
})

/**
 * Profile update schema (partial)
 * - All fields optional for partial updates
 */
export const profileUpdateSchema = userProfileSchema.partial()

/**
 * Profile validation schema for save operation
 * - Only validates required fields
 */
export const profileSaveSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  profession: optionalShortTextSchema,
})

// =====================
// Avatar Upload Schema
// =====================

/**
 * Avatar file schema for upload validation
 * - Common image formats
 * - Maximum file size (2MB)
 */
export const avatarFileSchema = z
  .instanceof(File, {
    message: "El avatar debe ser un archivo",
  })
  .refine((file) => {
    return (
      file.type === "image/jpeg" ||
      file.type === "image/jpg" ||
      file.type === "image/png" ||
      file.type === "image/webp" ||
      file.type === "image/gif"
    )
  }, "El formato de imagen no es válido (JPEG, PNG, WebP, GIF)")
  .refine((file) => {
    return file.size <= 2 * 1024 * 1024 // 2MB
  }, "La imagen es demasiado grande (máximo 2MB)")

// =====================
// Type Exports
// =====================

/** Infer types from schemas for use in the codebase */
export type UserProfile = z.infer<typeof userProfileSchema>
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
export type ProfileSaveInput = z.infer<typeof profileSaveSchema>
export type AvatarFile = z.infer<typeof avatarFileSchema>

// =====================
// Validation Helpers
// =====================

/**
 * Validate profile data for save operation
 * @param data - Profile data to validate
 * @returns Validation result with formatted errors
 */
export function validateProfileSave(data: unknown) {
  const result = profileSaveSchema.safeParse(data)

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
 * Validate avatar file upload
 * @param file - File to validate
 * @returns Validation result with formatted errors
 */
export function validateAvatarFile(file: unknown) {
  const result = avatarFileSchema.safeParse(file)

  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0]?.message || "Archivo inválido",
    }
  }

  return { success: true, data: result.data }
}
