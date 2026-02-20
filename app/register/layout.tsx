import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Registro",
  description:
    "Regístrate en Biovity como profesional o empresa para acceder a oportunidades en biotecnología y ciencias en Chile.",
}

export default function RegisterLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
