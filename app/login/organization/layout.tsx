import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Iniciar Sesión - Empresa",
  description:
    "Inicia sesión en Biovity con tu cuenta de empresa para gestionar ofertas de empleo y candidatos.",
}

export default function LoginOrganizationLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children
}
