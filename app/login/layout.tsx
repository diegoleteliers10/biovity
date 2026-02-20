import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Iniciar Sesión",
  description:
    "Inicia sesión en Biovity para acceder a tu cuenta y gestionar tus oportunidades en biotecnología y ciencias.",
}

export default function LoginLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
