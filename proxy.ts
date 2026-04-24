import { Result as R } from "better-result"
import { type NextRequest, NextResponse } from "next/server"
import { checkRateLimit, getUserRateLimit } from "@/lib/ai/rate-limit"
import { auth } from "@/lib/auth"

const WAITLIST_PATH = "/lista-espera"
const AI_API_PATTERN = /^\/api\/ai\//

async function getSessionSafe(request: NextRequest) {
  return R.tryPromise({
    try: async () =>
      auth.api.getSession({
        headers: request.headers,
      }),
    catch: (e) => (e instanceof Error ? e : new Error(String(e))),
  })
}

async function handleAI_RATE_LIMIT(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (!AI_API_PATTERN.test(pathname)) {
    return null
  }

  if (request.method === "GET") {
    return null
  }

  const sessionResult = await getSessionSafe(request)
  const session = sessionResult.isOk() ? sessionResult.value : null
  const isAuthenticated = !!session?.user?.id
  const limit = getUserRateLimit(isAuthenticated)

  const identifier = isAuthenticated
    ? `user:${session.user.id}`
    : `ip:${request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "unknown"}`

  const result = checkRateLimit(identifier, limit)

  if (!result.allowed) {
    return NextResponse.json(
      {
        error: "Demasiadas solicitudes. Por favor espera un momento.",
        code: "ERR_RATE_LIMIT_EXCEEDED",
        retryAfter: result.retryAfter,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(result.retryAfter ?? 60),
          "X-RateLimit-Limit": String(result.limit),
          "X-RateLimit-Remaining": "0",
        },
      }
    )
  }

  const response = NextResponse.next()
  response.headers.set("X-RateLimit-Limit", String(result.limit))
  response.headers.set("X-RateLimit-Remaining", String(result.remaining))
  return response
}

function getDashboardForUserType(_userType: string | undefined): string {
  return "/dashboard"
}

function isAuthPage(pathname: string): boolean {
  return pathname.startsWith("/login") || pathname.startsWith("/register")
}

async function handleAuthenticatedUserRedirect(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (!isAuthPage(pathname)) {
    return null
  }

  const sessionCookie = request.cookies.get("better-auth.session_token")
  if (!sessionCookie?.value) {
    return null
  }

  const sessionResult = await getSessionSafe(request)

  if (sessionResult.isOk() && sessionResult.value?.user) {
    const user = sessionResult.value.user as { type?: string }
    const dashboardPath = getDashboardForUserType(user.type)
    return NextResponse.redirect(new URL(dashboardPath, request.url))
  }

  return null
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isWaitList = (process.env.NODE_ENV as string) === "wait-list"

  const aiResponse = await handleAI_RATE_LIMIT(request)
  if (aiResponse) {
    return aiResponse
  }

  const authPageRedirect = await handleAuthenticatedUserRedirect(request)
  if (authPageRedirect) {
    return authPageRedirect
  }

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

  // Protect /dashboard routes - redirect to home if not authenticated
  const protectedRoutes = ["/dashboard"]
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute) {
    const sessionResult = await getSessionSafe(request)

    if (!sessionResult.isOk() || !sessionResult.value?.user) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    // Prevent browser from caching authenticated pages
    const response = NextResponse.next()
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, private")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
