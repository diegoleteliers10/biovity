import type { Metadata } from "next"
import { LoginContent } from "./login-content"

export const metadata: Metadata = {
  title: "Iniciar Sesión",
  description:
    "Inicia sesión en Biovity para acceder a tu cuenta y gestionar tus oportunidades en biotecnología y ciencias.",
}

export default function LoginPage() {
  return <LoginContent />
}
