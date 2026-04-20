import { z } from "zod"

export const applicationStatusSchema = z.enum([
  "pendiente",
  "oferta",
  "entrevista",
  "rechazado",
  "contratado",
])

export const applicationAnswerSchema = z.object({
  questionId: z.string().uuid("ID de pregunta inválido"),
  value: z.string().min(1, "La respuesta no puede estar vacía"),
})

export const createApplicationSchema = z.object({
  jobId: z.string().uuid("ID de trabajo inválido"),
  candidateId: z.string().uuid("ID de candidato inválido").optional(),
  coverLetter: z
    .string({
      error: () => "La carta de presentación debe ser un texto",
    })
    .max(2000, "La carta es demasiado larga")
    .trim()
    .optional(),
  salaryMin: z.number().min(0).optional(),
  salaryMax: z.number().min(0).optional(),
  salaryCurrency: z.string().length(3).default("USD"),
  availabilityDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido")
    .optional(),
  resumeUrl: z.string().url("URL de CV inválida").optional(),
  answers: z.array(applicationAnswerSchema).optional(),
})

export const createApplicationWithValidationSchema = createApplicationSchema.refine(
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

export type ApplicationStatus = z.infer<typeof applicationStatusSchema>
export type ApplicationAnswerInput = z.infer<typeof applicationAnswerSchema>
export type CreateApplicationInput = z.infer<typeof createApplicationSchema>
export type CreateApplicationWithValidationInput = z.infer<
  typeof createApplicationWithValidationSchema
>

export function validateCreateApplication(data: unknown) {
  const result = createApplicationWithValidationSchema.safeParse(data)
  if (!result.success) {
    const errors: Record<string, string> = {}
    result.error.issues.forEach((issue) => {
      errors[issue.path.join(".")] = issue.message
    })
    return { success: false as const, errors }
  }
  return { success: true as const, data: result.data }
}
