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
 * Upper bound for the recipients of one request, for both scopes. It keeps the
 * bind parameters inside the Postgres limit, the batch inside the Resend rate
 * limit, and the request inside the function time budget: every recipient is an
 * awaited HTTP call, so an unbounded `all` can outrun the timeout.
 */
export const MAX_INVITE_RECIPIENTS = 500

export const adminWaitlistInviteSchema = z.discriminatedUnion(
  "scope",
  [
    z.object({ scope: z.literal("all") }),
    z.object({
      scope: z.literal("selected"),
      ids: z
        .array(waitlistEntryIdSchema)
        .min(1, "Selecciona al menos una entrada de la lista de espera")
        .max(
          MAX_INVITE_RECIPIENTS,
          `Selecciona a lo mas ${MAX_INVITE_RECIPIENTS} entradas por envio`
        ),
    }),
  ],
  { error: 'El campo "scope" debe ser "all" o "selected"' }
)

export const adminWaitlistEntryParamsSchema = z.object({ id: waitlistEntryIdSchema })

export type AdminWaitlistInvite = z.infer<typeof adminWaitlistInviteSchema>
