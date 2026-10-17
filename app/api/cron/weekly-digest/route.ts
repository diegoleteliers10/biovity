import { timingSafeEqual } from "node:crypto"
import { NextResponse } from "next/server"
import { enqueueOrganizationWeeklyDigests } from "@/lib/organization-weekly-digest"

export const maxDuration = 60

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "")
  if (!secret || !token) return false
  const expected = Buffer.from(secret)
  const actual = Buffer.from(token)
  return expected.length === actual.length && timingSafeEqual(expected, actual)
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const result = await enqueueOrganizationWeeklyDigests()
  if (result.kind === "error") {
    console.error("[weekly-digest] enqueue failed", result.error)
    return NextResponse.json({ error: "No se pudieron crear los resúmenes" }, { status: 500 })
  }

  return NextResponse.json(result, {
    headers: { "Cache-Control": "private, no-store, max-age=0" },
  })
}
