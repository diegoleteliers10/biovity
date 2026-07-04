import { Result as R, type Result } from "better-result"
import { pool } from "@/lib/db"
import { DbError } from "@/lib/errors"

export type ContactMessageInput = {
  nombre: string
  apellido: string
  email: string
  telefono?: string | null
  empresa: string
  mensaje: string
}

/**
 * Persist an organization contact form submission.
 * Used by app/api/contact/route.ts (CTAContacto.tsx landing form).
 */
export async function insertContactMessage(
  input: ContactMessageInput
): Promise<Result<void, DbError>> {
  return R.tryPromise({
    try: async () => {
      const client = await pool.connect()
      try {
        await client.query(
          `INSERT INTO contact_messages
             (nombre, apellido, email, telefono, empresa, mensaje)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            input.nombre,
            input.apellido,
            input.email,
            input.telefono ?? null,
            input.empresa,
            input.mensaje,
          ]
        )
      } finally {
        client.release()
      }
    },
    catch: (cause) => new DbError({ operation: "insert_contact_message", cause }),
  })
}
