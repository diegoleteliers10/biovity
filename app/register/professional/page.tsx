import type { Metadata } from "next"
import { UserRegisterContent } from "./register-user-content"

export const metadata: Metadata = {
  title: "Registro de Profesional",
  description:
    "Crea tu cuenta como profesional en Biovity para acceder a ofertas de empleo en biotecnología y ciencias.",
}

export default function UserRegisterPage() {
  return <UserRegisterContent />
}
