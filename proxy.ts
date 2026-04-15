import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { Result as R } from "better-result"

const WAITLIST_PATH = "/lista-espera"

async function getSessionSafe(request: NextRequest) {
  return R.tryPromise({
    try: async () =>
      auth.api.getSession({
        headers: request.headers,
      }),
    catch: (e) => (e instanceof Error ? e : new Error(String(e))),
  })
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isWaitList = (process.env.NODE_ENV as string) === "wait-list"

  if (isWaitList) {
    const allowedPaths = [
      WAITLIST_PATH,
      "/api/waitlist",
      "/favicon.ico",
      "/logoIconBiovity.png",
      "/manifest.json",
      "/browserconfig.xml",
      "/images",
      "/opengraph-image",
    ]
    const isAllowed =
      pathname === WAITLIST_PATH ||
      pathname.startsWith("/api/") ||
      pathname.startsWith("/_next/") ||
      allowedPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`))

    if (!isAllowed) {
      return NextResponse.redirect(new URL(WAITLIST_PATH, request.url))
    }
    return NextResponse.next()
  }

  const protectedRoutes = ["/dashboard"]
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute) {
    const sessionResult = await getSessionSafe(request)

    if (sessionResult.isOk() && !sessionResult.value?.user) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/login/") ||
    pathname.startsWith("/register/")
  ) {
    const sessionResult = await getSessionSafe(request)

    if (sessionResult.isOk() && sessionResult.value?.user) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
