import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Registro de Profesional",
  description:
    "Crea tu cuenta como profesional en Biovity para acceder a ofertas de empleo en biotecnología y ciencias.",
  robots: { index: false, follow: false },
  alternates: {
    canonical: "/register/professional",
  },
}

export default function RegisterProfessionalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children
}
