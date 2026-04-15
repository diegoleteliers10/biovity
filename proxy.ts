import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

const WAITLIST_PATH = "/lista-espera"

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isWaitList = (process.env.NODE_ENV as string) === "wait-list"

  // En wait-list: redirigir todo excepto lista-espera y assets al waitlist
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

  // En producción: lógica de auth para dashboard
  const protectedRoutes = ["/dashboard"]
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute) {
    // En desarrollo, verificar sesión usando better-auth directamente
    // para evitar problemas con cookies en localhost
    if (process.env.NODE_ENV === "development") {
      try {
        const session = await auth.api.getSession({
          headers: request.headers,
        })
        if (!session?.user) {
          const loginUrl = new URL("/login", request.url)
          loginUrl.searchParams.set("redirect", request.nextUrl.pathname)
          return NextResponse.redirect(loginUrl)
        }
      } catch {
        // Si falla la verificación de sesión, permitir pasar
        // para evitar bloqueos por problemas de conexión
      }
    } else {
      // En producción: solo verificar la cookie de sesión (sincrónico, sin fetch).
      // Evita redirecciones falsas por fallos intermitentes de get-session.
      const sessionToken = request.cookies.get("better-auth.session_token")?.value
      if (!sessionToken) {
        const loginUrl = new URL("/login", request.url)
        loginUrl.searchParams.set("redirect", request.nextUrl.pathname)
        return NextResponse.redirect(loginUrl)
      }
    }
  }

  // Si ya tiene sesión y va a /login o /register (o sus sub-rutas), redirigir a /dashboard
  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/login/") ||
    pathname.startsWith("/register/")
  ) {
    // En desarrollo, verificar sesión usando better-auth
    if (process.env.NODE_ENV === "development") {
      try {
        const session = await auth.api.getSession({
          headers: request.headers,
        })
        if (session?.user) {
          return NextResponse.redirect(new URL("/dashboard", request.url))
        }
      } catch {
        // Si falla, no redirigir
      }
    } else {
      const sessionToken = request.cookies.get("better-auth.session_token")?.value
      if (sessionToken) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
