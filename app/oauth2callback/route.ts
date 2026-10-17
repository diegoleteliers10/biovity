import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL
  if (!apiUrl) {
    return NextResponse.redirect(new URL("/dashboard/profile?googleCalendar=failed", request.url))
  }

  const callbackUrl = new URL("/api/v1/google-calendar/oauth/callback", apiUrl)
  callbackUrl.search = request.nextUrl.search
  const result = await fetch(callbackUrl, {
    cache: "no-store",
    redirect: "manual",
    signal: AbortSignal.timeout(15_000),
  }).then(
    (response) => ({ kind: "response" as const, response }),
    () => ({ kind: "network_error" as const })
  )

  if (result.kind === "network_error") {
    return NextResponse.redirect(new URL("/dashboard/profile?googleCalendar=failed", request.url))
  }

  const location = result.response.headers.get("location")
  if (!location) {
    return NextResponse.redirect(new URL("/dashboard/profile?googleCalendar=failed", request.url))
  }

  return NextResponse.redirect(location)
}
