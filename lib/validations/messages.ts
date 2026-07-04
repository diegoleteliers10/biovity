import { z } from "zod"

export const messageTypeSchema = z.enum(["text", "event", "audio", "image", "file"])

export const createMessageSchema = z
  .object({
    chatId: z.string().uuid("El chatId debe ser un UUID válido"),
    content: z.string().max(5000, "El mensaje es demasiado largo").trim(),
    type: messageTypeSchema.default("text"),
    contentType: z.record(z.string(), z.unknown()).nullish(),
  })
  .refine((val) => (val.type === "text" ? val.content.length >= 1 : true), {
    message: "El mensaje no puede estar vacío",
    path: ["content"],
  })

export type CreateMessageInput = z.infer<typeof createMessageSchema>
