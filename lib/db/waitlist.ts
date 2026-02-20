import { pool } from "@/lib/db"

export async function insertWaitlistEntry(email: string, role: string) {
  const client = await pool.connect()
  try {
    await client.query("INSERT INTO waitlist (email, role) VALUES ($1, $2)", [email, role])
  } finally {
    client.release()
  }
}
