import type { Metadata } from "next"
import { LoginContent } from "./login-content"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Iniciar Sesión | Biovity",
  description:
    "Inicia sesión en Biovity para acceder a tu cuenta y gestionar tus oportunidades en biotecnología y ciencias.",
  robots: "noindex, nofollow",
  alternates: {
    canonical: "/login",
  },
}

export default function LoginPage() {
  return <LoginContent />
}
