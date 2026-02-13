import { Pool } from "pg"

const waitlistPool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function insertWaitlistEntry(email: string, role: string) {
  const client = await waitlistPool.connect()
  try {
    await client.query("INSERT INTO waitlist (email, role) VALUES ($1, $2)", [email, role])
  } finally {
    client.release()
  }
}
