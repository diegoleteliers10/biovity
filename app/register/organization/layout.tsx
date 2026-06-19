import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Registro de Organización",
  description:
    "Crea tu cuenta como Organización en Biovity para postear y gestionar ofertas de empleo en biotecnología y ciencias.",
  robots: { index: false, follow: false },
  alternates: {
    canonical: "/register/organization",
  },
}

export default function RegisterOrganizationLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children
}
