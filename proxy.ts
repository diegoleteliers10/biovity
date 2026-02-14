import { type NextRequest, NextResponse } from "next/server"

const WAITLIST_PATH = "/lista-espera"

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isProduction = process.env.NODE_ENV === "production"

  // En producción: redirigir todo excepto lista-espera y assets al waitlist
  if (isProduction) {
    const allowedPaths = [
      WAITLIST_PATH,
      "/api/waitlist",
      "/favicon.ico",
      "/logoIconBiovity.png",
      "/manifest.json",
      "/browserconfig.xml",
      "/images",
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

  // En development: lógica de auth para dashboard
  const protectedRoutes = ["/dashboard"]
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute) {
    // Solo verificar la cookie de sesión (sincrónico, sin fetch).
    // Evita redirecciones falsas por fallos intermitentes de get-session.
    const sessionToken = request.cookies.get("better-auth.session_token")?.value

    if (!sessionToken) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
