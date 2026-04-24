import type { Metadata } from "next"
import { Suspense } from "react"
import { AuthLoader } from "@/components/ui/auth-loader"
import { OrganizationLoginContent } from "./organization-login-content"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Iniciar Sesión - Empresa",
  description:
    "Inicia sesión en Biovity con tu cuenta de empresa para gestionar ofertas de empleo y candidatos.",
}

export default function OrganizationLoginPage() {
  return (
    <Suspense fallback={<AuthLoader />}>
      <OrganizationLoginContent />
    </Suspense>
  )
}
