/**
 * Admin waitlist validation schemas
 * @see lib/validations/primitives.ts for base schemas
 */

import { z } from "zod"

/** `waitlist.id` is a uuid column, so ids stay strings from the browser to Postgres */
export const waitlistEntryIdSchema = z
  .string({ error: "El id de la entrada de lista de espera debe ser un texto" })
  .uuid("El id de la entrada de lista de espera no es un UUID valido")

/**
 * Upper bound for a single `selected` request. It keeps the bind parameters
 * inside the Postgres limit and the batch inside the Resend rate limit.
 * `scope: "all"` has no bound: the admin UI asks for confirmation first.
 */
const MAX_INVITE_IDS = 500

export const adminWaitlistInviteSchema = z.discriminatedUnion(
  "scope",
  [
    z.object({ scope: z.literal("all") }),
    z.object({
      scope: z.literal("selected"),
      ids: z
        .array(waitlistEntryIdSchema)
        .min(1, "Selecciona al menos una entrada de la lista de espera")
        .max(MAX_INVITE_IDS, `Selecciona a lo mas ${MAX_INVITE_IDS} entradas por envio`),
    }),
  ],
  { error: 'El campo "scope" debe ser "all" o "selected"' }
)

export const adminWaitlistEntryParamsSchema = z.object({ id: waitlistEntryIdSchema })

export type AdminWaitlistInvite = z.infer<typeof adminWaitlistInviteSchema>
