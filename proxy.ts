import { type NextRequest, NextResponse } from "next/server"

export async function proxy(request: NextRequest) {
  // Rutas que requieren autenticación
  const protectedRoutes = ["/dashboard"]
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

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
  matcher: ["/dashboard/:path*"],
}
