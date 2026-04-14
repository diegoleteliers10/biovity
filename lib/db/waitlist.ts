import { Result as R, type Result } from "better-result"
import { pool } from "@/lib/db"
import { DbError } from "@/lib/errors"

export async function insertWaitlistEntry(
  email: string,
  role: string
): Promise<Result<void, DbError>> {
  return R.tryPromise({
    try: async () => {
      const client = await pool.connect()
      try {
        await client.query("INSERT INTO waitlist (email, role) VALUES ($1, $2)", [email, role])
      } finally {
        client.release()
      }
    },
    catch: (cause) => new DbError({ operation: "insert_waitlist", cause }),
  })
}
