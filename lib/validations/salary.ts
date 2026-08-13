/**
 * Salary submission validation schema (Give-to-Get form, mercado chileno)
 * @see lib/validations/primitives.ts for base schemas
 */

import { z } from "zod"

export const salarySubmissionSchema = z.object({
  profession: z
    .string()
    .min(1, "Selecciona tu carrera o profesión")
    .max(100, "La profesión es demasiado larga")
    .trim(),
  industry: z
    .string()
    .min(1, "Selecciona tu industria")
    .max(100, "La industria es demasiado larga")
    .trim(),
  experienceYears: z
    .number({ error: () => "Ingresa tus años de experiencia" })
    .int("Los años de experiencia deben ser un número entero")
    .min(0, "Los años no pueden ser negativos")
    .max(50, "Ingresa un valor realista (máx. 50)"),
  experienceLevel: z.enum(["JUNIOR", "MID", "SENIOR", "LEAD"], {
    error: () => "Selecciona un nivel de experiencia válido",
  }),
  educationLevel: z.enum(["LICENCIATURA", "MAGISTER", "DOCTORADO", "POSTDOC"], {
    error: () => "Selecciona un nivel educativo válido",
  }),
  region: z.enum(
    [
      "ARICA_Y_PARINACOTA",
      "TARAPACA",
      "ANTOFAGASTA",
      "ATACAMA",
      "COQUIMBO",
      "VALPARAISO",
      "METROPOLITANA",
      "OHIGGINS",
      "MAULE",
      "NUBLE",
      "BIOBIO",
      "ARAUCANIA",
      "LOS_RIOS",
      "LOS_LAGOS",
      "AYSEN",
      "MAGALLANES",
    ],
    { error: () => "Selecciona una región de Chile válida" }
  ),
  workMode: z.enum(["PRESENCIAL", "HIBRIDO", "REMOTO"], {
    error: () => "Selecciona una modalidad de trabajo",
  }),
  monthlySalaryClp: z
    .number({ error: () => "Ingresa tu sueldo líquido mensual en CLP" })
    .int("El sueldo debe ser un número entero")
    .min(300000, "Ingresa un sueldo mensual realista (mín. $300.000)")
    .max(20000000, "El sueldo ingresado parece demasiado alto"),
  annualBonusClp: z
    .number()
    .int("El bono debe ser un número entero")
    .min(0, "El bono no puede ser negativo")
    .max(50000000, "El bono ingresado parece demasiado alto")
    .optional()
    .or(z.literal(0)),
  benefits: z
    .array(z.string().max(80, "Beneficio demasiado largo").trim())
    .max(10, "Demasiados beneficios (máx. 10)")
    .optional(),
  skills: z
    .array(z.string().max(80, "Habilidad demasiado larga").trim())
    .max(10, "Demasiadas habilidades (máx. 10)")
    .optional(),
})

export const salaryStatsQuerySchema = z.object({
  profession: z.string().trim().optional(),
  industry: z.string().trim().optional(),
  region: z.string().trim().optional(),
})

export type SalarySubmissionInput = z.infer<typeof salarySubmissionSchema>
export type SalaryStatsQuery = z.infer<typeof salaryStatsQuerySchema>

export type SalaryStats = {
  count: number
  median: number
  p25: number
  p75: number
  p90: number
  average: number
}

export type SalaryValidationSuccess = { success: true; data: SalarySubmissionInput }
export type SalaryValidationError = { success: false; errors: Record<string, string> }
export type SalaryValidationResult = SalaryValidationSuccess | SalaryValidationError

export function validateSalarySubmission(data: unknown): SalaryValidationResult {
  const result = salarySubmissionSchema.safeParse(data)

  if (!result.success) {
    const errors: Record<string, string> = {}
    result.error.issues.forEach((issue) => {
      const path = issue.path.join(".")
      if (!errors[path]) errors[path] = issue.message
    })
    return { success: false, errors }
  }

  return { success: true, data: result.data }
}
