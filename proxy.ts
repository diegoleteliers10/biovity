import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

const WAITLIST_PATH = "/lista-espera"

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isWaitList = (process.env.NODE_ENV as string) === "wait-list"
  const isProduction = process.env.NODE_ENV === "production"

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
    // Verificar sesión usando better-auth (funciona en dev y prod)
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
      // para evitar bloqueos por problemas de red o configuración
    }
  }

  // Si ya tiene sesión y va a /login o /register (o sus sub-rutas), redirigir a /dashboard
  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/login/") ||
    pathname.startsWith("/register/")
  ) {
    try {
      const session = await auth.api.getSession({
        headers: request.headers,
      })
      if (session?.user) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    } catch {
      // Si falla, no redirigir y permitir acceso al login/register
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
