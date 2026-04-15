import { NextResponse } from "next/server"
import { Result as R } from "better-result"
import { pool } from "@/lib/db"
import { DbError } from "@/lib/errors"

export async function GET() {
  const result = await R.tryPromise({
    try: () => pool.query("SELECT 1"),
    catch: (cause) => new DbError({ operation: "cron_ping", cause }),
  })

  if (result.isErr()) {
    console.error("Database ping failed:", result.error)
    return NextResponse.json(
      {
        success: false,
        message: "Database ping failed",
        error: result.error.message,
      },
      { status: 500 }
    )
  }

  return NextResponse.json({
    success: true,
    message: "Database ping successful",
  })
}
