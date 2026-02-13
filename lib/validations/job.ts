/**
 * Job search and posting validation schemas
 * @see lib/validations/primitives.ts for base schemas
 */

import { z } from "zod"
import { experienceLevelSchema, jobTypeSchema } from "./primitives"

// =====================
// Job Search Schemas
// =====================

/**
 * Job search filters schema
 * - All fields optional for flexible searching
 */
export const jobSearchSchema = z.object({
  query: z
    .string({
      error: () => "La búsqueda debe ser un texto",
    })
    .max(200, "La búsqueda es demasiado larga")
    .trim()
    .optional(),
  location: z
    .string({
      error: () => "La ubicación debe ser un texto",
    })
    .max(200, "La ubicación es demasiado larga")
    .trim()
    .optional(),
  remoteOnly: z.boolean().optional().default(false),
  jobType: jobTypeSchema.optional().default("any"),
  experience: experienceLevelSchema.optional().default("any"),
  minSalary: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => {
      if (typeof val === "number") return val
      if (!val) return undefined
      const num = Number.parseInt(val.replace(/[^0-9]/g, ""), 10)
      return Number.isNaN(num) ? undefined : num
    })
    .refine((val) => val === undefined || (val >= 0 && val <= 100000000), {
      message: "El salario mínimo debe ser positivo",
    }),
  maxSalary: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => {
      if (typeof val === "number") return val
      if (!val) return undefined
      const num = Number.parseInt(val.replace(/[^0-9]/g, ""), 10)
      return Number.isNaN(num) ? undefined : num
    })
    .refine((val) => val === undefined || (val >= 0 && val <= 100000000), {
      message: "El salario máximo debe ser positivo",
    }),
})

/**
 * Job search schema with salary range validation
 */
export const jobSearchWithValidationSchema = jobSearchSchema.refine(
  (data) => {
    if (data.minSalary === undefined || data.maxSalary === undefined) {
      return true
    }
    return data.minSalary <= data.maxSalary
  },
  {
    message: "El salario mínimo no puede ser mayor al máximo",
    path: ["minSalary"],
  }
)

// =====================
// Job Posting Schemas
// =====================

/**
 * Job posting schema for creating/editing job listings
 */
export const jobPostingSchema = z.object({
  title: z
    .string({
      error: () => "El título del cargo debe ser un texto",
    })
    .min(5, "El título debe tener al menos 5 caracteres")
    .max(200, "El título es demasiado largo")
    .trim(),
  company: z
    .string({
      error: () => "El nombre de la empresa debe ser un texto",
    })
    .min(2, "El nombre de la empresa debe tener al menos 2 caracteres")
    .max(200, "El nombre de la empresa es demasiado largo")
    .trim(),
  location: z
    .string({
      error: () => "La ubicación debe ser un texto",
    })
    .min(2, "La ubicación debe tener al menos 2 caracteres")
    .max(200, "La ubicación es demasiado larga")
    .trim(),
  salaryMin: z
    .number({
      error: () => "El salario mínimo debe ser un número",
    })
    .min(0, "El salario mínimo debe ser positivo")
    .max(100000000, "El salario mínimo es demasiado alto")
    .optional(),
  salaryMax: z
    .number({
      error: () => "El salario máximo debe ser un número",
    })
    .min(0, "El salario máximo debe ser positivo")
    .max(100000000, "El salario máximo es demasiado alto")
    .optional(),
  jobType: jobTypeSchema,
  experienceLevel: experienceLevelSchema,
  description: z
    .string({
      error: () => "La descripción debe ser un texto",
    })
    .min(50, "La descripción debe tener al menos 50 caracteres")
    .max(10000, "La descripción es demasiado larga")
    .trim(),
  requirements: z
    .string({
      error: () => "Los requisitos deben ser un texto",
    })
    .min(20, "Los requisitos deben tener al menos 20 caracteres")
    .max(5000, "Los requisitos son demasiado largos")
    .trim()
    .optional(),
  tags: z
    .array(
      z.string().min(1, "El tag no puede estar vacío").max(50, "El tag es demasiado largo").trim()
    )
    .min(1, "Debe tener al menos un tag")
    .max(20, "Demasiados tags (máximo 20)")
    .default([]),
  isRemote: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
})

/**
 * Job posting schema with salary range validation
 */
export const jobPostingWithValidationSchema = jobPostingSchema.refine(
  (data) => {
    if (data.salaryMin === undefined || data.salaryMax === undefined) {
      return true
    }
    return data.salaryMin <= data.salaryMax
  },
  {
    message: "El salario mínimo no puede ser mayor al máximo",
    path: ["salaryMin"],
  }
)

// =====================
// Job Application Schema
// =====================

/**
 * Job application schema for submitting applications
 */
export const jobApplicationSchema = z.object({
  jobId: z
    .string({
      error: () => "El ID del cargo debe ser un texto",
    })
    .uuid("El ID del cargo no es válido"),
  coverLetter: z
    .string({
      error: () => "La carta de presentación debe ser un texto",
    })
    .min(50, "La carta debe tener al menos 50 caracteres")
    .max(5000, "La carta es demasiado larga")
    .trim(),
  resumeUrl: z
    .string({
      error: () => "El CV debe ser un texto",
    })
    .url("El CV debe ser una URL válida"),
  answers: z
    .array(
      z.object({
        question: z.string().min(1, "La pregunta no puede estar vacía"),
        answer: z.string().min(1, "La respuesta no puede estar vacía"),
      })
    )
    .optional(),
})

// =====================
// Type Exports
// =====================

/** Infer types from schemas for use in the codebase */
export type JobSearchInput = z.infer<typeof jobSearchSchema>
export type JobSearchWithValidationInput = z.infer<typeof jobSearchWithValidationSchema>
export type JobPostingInput = z.infer<typeof jobPostingSchema>
export type JobPostingWithValidationInput = z.infer<typeof jobPostingWithValidationSchema>
export type JobApplicationInput = z.infer<typeof jobApplicationSchema>

// =====================
// Validation Helpers
// =====================

/**
 * Validate job search filters
 * @param data - Search filters to validate
 * @returns Validation result with formatted errors
 */
export function validateJobSearch(data: unknown) {
  const result = jobSearchWithValidationSchema.safeParse(data)

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
 * Validate job posting data
 * @param data - Job posting to validate
 * @returns Validation result with formatted errors
 */
export function validateJobPosting(data: unknown) {
  const result = jobPostingWithValidationSchema.safeParse(data)

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
