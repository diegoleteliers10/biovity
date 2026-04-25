import type { Metadata } from "next"
import { Suspense } from "react"
import { SessionRefresher } from "@/components/auth/SessionRefresher"
import { AuthLoader } from "@/components/ui/auth-loader"
import { RegisterContent } from "./register-content"

export const metadata: Metadata = {
  title: "Registro | Biovity",
  description:
    "Regístrate en Biovity como profesional o empresa para acceder a oportunidades en biotecnología y ciencias en Chile.",
  robots: "noindex, nofollow",
  alternates: {
    canonical: "/register",
  },
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<AuthLoader />}>
      <SessionRefresher />
      <RegisterContent />
    </Suspense>
  )
}
