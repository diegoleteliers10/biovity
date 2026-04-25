import type { Metadata } from "next"
import { Suspense } from "react"
import { SessionRefresher } from "@/components/auth/SessionRefresher"
import { AuthLoader } from "@/components/ui/auth-loader"
import { UserRegisterContent } from "./register-user-content"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Registro de Profesional",
  description:
    "Crea tu cuenta como profesional en Biovity para acceder a ofertas de empleo en biotecnología y ciencias.",
}

export default function UserRegisterPage() {
  return (
    <Suspense fallback={<AuthLoader />}>
      <SessionRefresher />
      <UserRegisterContent />
    </Suspense>
  )
}
