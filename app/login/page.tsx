"use client"

import { UserIcon, Building06Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/ui/logo"
import { authClient } from "@/lib/auth-client"
import { motion } from "motion/react"

export default function LoginSelectionPage() {
  const router = useRouter()
  const { useSession } = authClient
  const { data: session, isPending } = useSession()

  // Redirigir si ya hay sesión activa
  useEffect(() => {
    if (!isPending && session?.user) {
      if (session.user.type === "persona") {
        router.push("/dashboard/employee")
      } else if (session.user.type === "organización") {
        router.push("/dashboard/organization")
      }
    }
  }, [session, isPending, router])

  // Mostrar loading mientras se verifica la sesión
  if (isPending) {
    return (
      <div className="min-h-dvh bg-gradient-to-r from-green-100 to-blue-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-5">
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex items-end gap-2"
                aria-label="Cargando"
                role="status"
              >
                <motion.span
                  className="h-3 w-3 rounded-full bg-green-600"
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.span
                  className="h-3.5 w-3.5 rounded-full bg-emerald-500"
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.12,
                  }}
                />
                <motion.span
                  className="h-3 w-3 rounded-full bg-blue-600"
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.24,
                  }}
                />
              </motion.div>
              <p className="text-sm text-gray-600">Verificando sesión...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Si hay sesión, no mostrar nada (se está redirigiendo)
  if (session?.user) {
    return null
  }
  return (
    <div className="min-h-dvh bg-gradient-to-r from-blue-100 to-green-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center space-y-1">
          {/* Logo */}
          <div className="mx-auto">
            <Logo size="lg" />
          </div>

          <div className="space-y-1">
            <CardTitle className="text-3xl font-bold text-gray-800">
              <h2>Bienvenido a Biovity</h2>
            </CardTitle>
            <CardDescription className="text-gray-600">
              Selecciona tu tipo de acceso para continuar
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-4">
            {/* User Login Option */}
            <Link href="/login/user">
              <Card className="cursor-pointer hover:shadow-md transition-all duration-200 border-2 hover:border-blue-300 hover:bg-blue-50/30">
                <CardContent className="py-1 px-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <HugeiconsIcon
                        icon={UserIcon}
                        size={24}
                        strokeWidth={1.5}
                        className="text-blue-600"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">Usuario Individual</h3>
                      <p className="text-sm text-gray-600">
                        Acceso para profesionales, investigadores y estudiantes
                      </p>
                    </div>
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      size={20}
                      strokeWidth={1.5}
                      className="text-blue-600"
                    />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Organization Login Option */}
            <Link href="/login/organization">
              <Card className="cursor-pointer hover:shadow-md transition-all duration-200 border-2 hover:border-purple-300 hover:bg-purple-50/30 mt-3">
                <CardContent className="py-1 px-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <HugeiconsIcon
                        icon={Building06Icon}
                        size={24}
                        strokeWidth={1.5}
                        className="text-purple-600"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">Organización</h3>
                      <p className="text-sm text-gray-600">
                        Portal para empresas, instituciones y laboratorios
                      </p>
                    </div>
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      size={20}
                      strokeWidth={1.5}
                      className="text-purple-600"
                    />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-6">
            {/* Divider */}
            <div className="text-center uppercase">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">¿Eres Nuevo en Biovity?</h3>
            </div>

            {/* Registration Options */}
            <div className="space-y-3">
              <Button
                asChild
                variant="outline"
                className="w-full h-12 border-blue-200 hover:bg-blue-50 text-base"
              >
                <Link href="/register/user">
                  <HugeiconsIcon icon={UserIcon} size={20} strokeWidth={1.5} className="mr-2" />
                  Crear cuenta de usuario
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full h-12 border-purple-200 hover:bg-purple-50 text-base"
              >
                <Link href="/register/organization">
                  <HugeiconsIcon
                    icon={Building06Icon}
                    size={20}
                    strokeWidth={1.5}
                    className="mr-2"
                  />
                  Registrar organización
                </Link>
              </Button>
            </div>

            {/* Help Section */}
            <div className="text-center pt-4">
              <p className="text-sm text-gray-500">
                ¿Necesitas ayuda?{" "}
                <a href="mailto:support@biovity.com" className="text-blue-600 hover:underline">
                  Contactar soporte
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
