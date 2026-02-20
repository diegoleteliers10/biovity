"use client"

import { ArrowRight01Icon, Building06Icon, UserIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import * as m from "motion/react-m"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/ui/logo"
import { authClient } from "@/lib/auth-client"

export function RegisterContent() {
  const router = useRouter()
  const { useSession } = authClient
  const { data: session, isPending } = useSession()

  useEffect(() => {
    if (!isPending && session?.user) {
      if (session.user.type === "persona") {
        router.push("/dashboard/employee")
      } else if (session.user.type === "organización") {
        router.push("/dashboard/organization")
      }
    }
  }, [session, isPending, router])

  if (isPending) {
    return (
      <div className="min-h-dvh bg-gradient-to-r from-green-100 to-blue-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-5">
              <m.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex items-end gap-2"
                aria-label="Cargando"
                role="status"
              >
                <m.span
                  className="h-3 w-3 rounded-full bg-green-600"
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <m.span
                  className="h-3.5 w-3.5 rounded-full bg-emerald-500"
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.12,
                  }}
                />
                <m.span
                  className="h-3 w-3 rounded-full bg-blue-600"
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.24,
                  }}
                />
              </m.div>
              <p className="text-sm text-gray-600">Verificando sesión...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (session?.user) {
    return null
  }

  return (
    <div className="min-h-dvh bg-gradient-to-r from-green-100 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center space-y-1">
          <div className="mx-auto">
            <Logo size="lg" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold text-gray-800">Únete a Biovity</CardTitle>
            <CardDescription className="text-gray-600">
              Selecciona el tipo de cuenta que quieres crear
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex gap-6">
          <div>
            <Link href="/register/user">
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
                        Para profesionales, investigadores y estudiantes
                      </p>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Acceso básico
                        </span>
                      </div>
                    </div>
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      size={24}
                      strokeWidth={1.5}
                      className="text-blue-600"
                    />
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/register/organization">
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
                        Para empresas, instituciones y laboratorios
                      </p>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Portal empresarial
                        </span>
                      </div>
                    </div>
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      size={24}
                      strokeWidth={1.5}
                      className="text-purple-600"
                    />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
          <div className="flex flex-col justify-between">
            <div className="bg-gray-50 rounded-lg py-2 px-4 space-y-2">
              <h4 className="text-sm font-semibold text-gray-800">¿Por qué unirse a Biovity?</h4>
              <ul className="text-xs text-gray-600 space-y-2">
                <li>• Conecta con profesionales en biotecnología</li>
                <li>• Acceso a oportunidades laborales exclusivas</li>
                <li>• Red de colaboración científica</li>
                <li>• Recursos y herramientas especializadas</li>
              </ul>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">¿Ya tienes cuenta?</span>
              </div>
            </div>
            <div className="space-y-3">
              <Button
                asChild
                variant="outline"
                className="w-full h-11 border-blue-200 hover:bg-blue-50"
              >
                <Link href="/login/user">
                  <HugeiconsIcon icon={UserIcon} size={24} strokeWidth={1.5} />
                  Iniciar sesión como usuario
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full h-11 border-purple-200 hover:bg-purple-50"
              >
                <Link href="/login/organization">
                  <HugeiconsIcon icon={Building06Icon} size={24} strokeWidth={1.5} />
                  Portal organizacional
                </Link>
              </Button>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">
                ¿Tienes preguntas?{" "}
                <a href="mailto:help@biovity.com" className="text-green-600 hover:underline">
                  Obtener ayuda
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
