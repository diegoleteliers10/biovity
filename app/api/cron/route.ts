import { timingSafeEqual } from "node:crypto"
import { Result as R } from "better-result"
import { NextResponse } from "next/server"
import { pool } from "@/lib/db"
import { DbError } from "@/lib/errors"

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "")
  if (!secret || !token) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const expected = Buffer.from(secret)
  const actual = Buffer.from(token)
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

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

  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const internalApiKey = process.env.INTERNAL_API_KEY
  if (!apiUrl || !internalApiKey) {
    return NextResponse.json(
      { success: false, message: "Cron dispatcher is not configured" },
      { status: 503 }
    )
  }

  const dispatchUrl = `${apiUrl.replace(/\/$/, "")}/api/v1/internal/cron/dispatch`
  const dispatchResult = await R.tryPromise({
    try: () =>
      fetch(dispatchUrl, {
        method: "POST",
        headers: { "x-internal-key": internalApiKey },
        cache: "no-store",
      }),
    catch: (cause) => new Error("Scheduled jobs request failed", { cause }),
  })
  if (dispatchResult.isErr()) {
    console.error("Scheduled jobs dispatch failed:", dispatchResult.error)
    return NextResponse.json(
      { success: false, message: "Scheduled jobs dispatch failed" },
      { status: 502 }
    )
  }
  if (!dispatchResult.value.ok) {
    console.error("Scheduled jobs dispatcher returned an error:", dispatchResult.value.status)
    return NextResponse.json(
      { success: false, message: "Scheduled jobs dispatch failed" },
      { status: 502 }
    )
  }
  const dispatchBody = await R.tryPromise({
    try: () => dispatchResult.value.json() as Promise<{ ok?: boolean }>,
    catch: (cause) => new Error("Scheduled jobs response was invalid", { cause }),
  })
  if (dispatchBody.isErr() || dispatchBody.value.ok !== true) {
    console.error("Scheduled jobs dispatcher reported a failed job")
    return NextResponse.json(
      { success: false, message: "One or more scheduled jobs failed" },
      { status: 502 }
    )
  }

  return NextResponse.json({
    success: true,
    message: "Scheduled jobs dispatched",
  })
}
