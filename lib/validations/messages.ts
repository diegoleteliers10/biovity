import { z } from "zod"
import { messageSchema } from "./primitives"

export const createMessageSchema = z.object({
  chatId: z.string().uuid("El chatId debe ser un UUID válido"),
  content: messageSchema,
})

export type CreateMessageInput = z.infer<typeof createMessageSchema>
