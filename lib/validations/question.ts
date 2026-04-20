import { z } from "zod"

export const questionTypeSchema = z.enum([
  "text",
  "textarea",
  "number",
  "select",
  "multiselect",
  "boolean",
  "date",
])

export const questionStatusSchema = z.enum(["draft", "published"])

export const createQuestionSchema = z.object({
  label: z
    .string({
      error: () => "La etiqueta de la pregunta es requerida",
    })
    .min(1, "La pregunta no puede estar vacía")
    .max(500, "La pregunta es demasiado larga")
    .trim(),
  type: questionTypeSchema,
  required: z.boolean().optional().default(false),
  placeholder: z
    .string({
      error: () => "El placeholder debe ser un texto",
    })
    .max(255, "El placeholder es demasiado largo")
    .trim()
    .optional(),
  helperText: z
    .string({
      error: () => "El texto de ayuda debe ser un texto",
    })
    .max(500, "El texto de ayuda es demasiado largo")
    .trim()
    .optional(),
  options: z
    .array(
      z.string().min(1, "La opción no puede estar vacía").max(100, "La opción es demasiado larga")
    )
    .min(2, "Se requieren al menos 2 opciones")
    .max(50, "Máximo 50 opciones")
    .optional(),
  orderIndex: z.number().int().min(0).optional(),
  status: questionStatusSchema.optional().default("draft"),
})

export const updateQuestionSchema = createQuestionSchema.partial()

export const reorderQuestionsSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().uuid("ID de pregunta inválido"),
        orderIndex: z.number().int().min(0),
      })
    )
    .min(1, "Debe incluir al menos una pregunta"),
})

export type QuestionType = z.infer<typeof questionTypeSchema>
export type QuestionStatus = z.infer<typeof questionStatusSchema>
export type CreateQuestionInput = z.infer<typeof createQuestionSchema>
export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>
export type ReorderQuestionsInput = z.infer<typeof reorderQuestionsSchema>

export function validateCreateQuestion(data: unknown) {
  const result = createQuestionSchema.safeParse(data)
  if (!result.success) {
    const errors: Record<string, string> = {}
    result.error.issues.forEach((issue) => {
      errors[issue.path.join(".")] = issue.message
    })
    return { success: false as const, errors }
  }
  const dataParsed = result.data
  if (
    (dataParsed.type === "select" || dataParsed.type === "multiselect") &&
    (!dataParsed.options || dataParsed.options.length < 2)
  ) {
    return {
      success: false as const,
      errors: { options: "Se requieren al menos 2 opciones para tipo select/multiselect" },
    }
  }
  return { success: true as const, data: dataParsed }
}

export function validateUpdateQuestion(data: unknown) {
  const result = updateQuestionSchema.safeParse(data)
  if (!result.success) {
    const errors: Record<string, string> = {}
    result.error.issues.forEach((issue) => {
      errors[issue.path.join(".")] = issue.message
    })
    return { success: false as const, errors }
  }
  return { success: true as const, data: result.data }
}

export function validateReorderQuestions(data: unknown) {
  const result = reorderQuestionsSchema.safeParse(data)
  if (!result.success) {
    const errors: Record<string, string> = {}
    result.error.issues.forEach((issue) => {
      errors[issue.path.join(".")] = issue.message
    })
    return { success: false as const, errors }
  }
  return { success: true as const, data: result.data }
}
