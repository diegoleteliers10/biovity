import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Iniciar Sesión - Profesional",
  description:
    "Inicia sesión en Biovity con tu cuenta de profesional para acceder a ofertas de empleo.",
}

export default function LoginUserLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
