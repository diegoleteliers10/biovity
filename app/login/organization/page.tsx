import type { Metadata } from "next"
import { Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { OrganizationLoginContent } from "./organization-login-content"

export const metadata: Metadata = {
  title: "Iniciar Sesión - Empresa",
  description:
    "Inicia sesión en Biovity con tu cuenta de empresa para gestionar ofertas de empleo y candidatos.",
}

export default function OrganizationLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh bg-gradient-to-r from-purple-100 to-blue-100 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
                <p className="text-sm text-gray-600">Cargando...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      }
    >
      <OrganizationLoginContent />
    </Suspense>
  )
}
