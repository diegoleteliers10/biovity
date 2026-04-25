import type { Metadata } from "next"
import { Suspense } from "react"
import { SessionRefresher } from "@/components/auth/SessionRefresher"
import { AuthLoader } from "@/components/ui/auth-loader"
import { UserLoginContent } from "./user-login-content"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Iniciar Sesión - Profesional",
  description:
    "Inicia sesión en Biovity con tu cuenta de profesional para acceder a ofertas de empleo.",
}

export default function UserLoginPage() {
  return (
    <Suspense fallback={<AuthLoader />}>
      <SessionRefresher />
      <UserLoginContent />
    </Suspense>
  )
}
