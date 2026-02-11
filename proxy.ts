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
    // Verificar si hay una sesión activa
    const sessionToken = request.cookies.get("better-auth.session_token")?.value

    if (!sessionToken) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Verificar la sesión usando el endpoint correcto de Better Auth
    try {
      const response = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
        method: "GET",
        headers: {
          Cookie: request.headers.get("cookie") || "",
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const loginUrl = new URL("/login", request.url)
        loginUrl.searchParams.set("redirect", request.nextUrl.pathname)
        return NextResponse.redirect(loginUrl)
      }

      const sessionData = await response.json()

      if (!sessionData || !sessionData.user) {
        const loginUrl = new URL("/login", request.url)
        loginUrl.searchParams.set("redirect", request.nextUrl.pathname)
        return NextResponse.redirect(loginUrl)
      }
    } catch (error) {
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
