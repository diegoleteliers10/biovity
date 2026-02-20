import type { Metadata } from "next"
import { RegisterContent } from "./register-content"

export const metadata: Metadata = {
  title: "Registro",
  description:
    "Regístrate en Biovity como profesional o empresa para acceder a oportunidades en biotecnología y ciencias en Chile.",
}

export default function RegisterPage() {
  return <RegisterContent />
}
