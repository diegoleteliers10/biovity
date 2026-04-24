import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Registro de Organizacion",
  description:
    "Crea tu cuenta como Organizacion en Biovity para postear y gestionar ofertas de empleo en biotecnología y ciencias.",
}

export default function RegisterOrganizationLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children
}
