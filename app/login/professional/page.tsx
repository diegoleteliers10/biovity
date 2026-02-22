import type { Metadata } from "next"
import { Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { UserLoginContent } from "./user-login-content"

export const metadata: Metadata = {
  title: "Iniciar Sesión - Profesional",
  description:
    "Inicia sesión en Biovity con tu cuenta de profesional para acceder a ofertas de empleo.",
}

export default function UserLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh bg-gradient-to-r from-green-100 to-blue-100 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                <p className="text-sm text-gray-600">Cargando...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      }
    >
      <UserLoginContent />
    </Suspense>
  )
}
