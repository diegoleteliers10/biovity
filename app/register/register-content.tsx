"use client"

import { ArrowRight01Icon, Building06Icon, UserIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { AuthLoader } from "@/components/ui/auth-loader"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Logo } from "@/components/ui/logo"
import { authClient } from "@/lib/auth-client"

export function RegisterContent() {
  const router = useRouter()
  const { useSession } = authClient
  const { data: session, isPending } = useSession()

  useEffect(() => {
    if (!isPending && session?.user) {
      const type = (session.user as { type?: string }).type
      if (type === "professional" || type === "organization" || type === "admin") {
        router.push("/dashboard")
      }
    }
  }, [session, isPending, router])

  if (isPending) {
    return <AuthLoader />
  }

  if (session?.user) return null

  return (
    <div className="flex h-dvh">
      {/* Left: Illustration */}
      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        <Image
          src="/images/ilustrationOG.png"
          alt="Biovity - Colaboración en ciencias y biotecnología"
          fill
          className="object-cover object-center p-2.5 rounded-[20px]"
          priority
          sizes="50vw"
        />
      </div>

      {/* Right: Register block */}
      <div className="flex min-h-0 w-full flex-col justify-center overflow-y-auto bg-background p-6 lg:w-1/2 lg:p-12">
        <div className="mx-auto w-full max-w-sm space-y-8">
          <div className="space-y-2 text-center">
            <Logo size="lg" className="justify-center" />
            <h1 className="text-center text-2xl font-bold tracking-tight text-foreground">
              Únete a Biovity
            </h1>
            <p className="text-center text-muted-foreground">
              Selecciona el tipo de cuenta que quieres crear
            </p>
          </div>

          <div className="flex flex-col space-y-2">
            <Link href="/register/professional">
              <Card className="group cursor-pointer border border-border/15 bg-white hover:border-border/30 hover:bg-[#f3f3f5] transition-all duration-200">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary transition-colors group-hover:bg-secondary/20">
                    <HugeiconsIcon icon={UserIcon} size={22} strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <h3 className="font-semibold text-foreground transition-colors">
                      Usuario Individual
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Profesionales, investigadores y estudiantes
                    </p>
                  </div>
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={18}
                    strokeWidth={1.5}
                    className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-secondary"
                  />
                </CardContent>
              </Card>
            </Link>
            <Link href="/register/organization">
              <Card className="group cursor-pointer border border-border/15 bg-white hover:border-border/30 hover:bg-[#f3f3f5] transition-all duration-200">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent transition-colors group-hover:bg-accent/20">
                    <HugeiconsIcon icon={Building06Icon} size={22} strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <h3 className="font-semibold text-foreground transition-colors">
                      Organización
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Empresas, instituciones y laboratorios
                    </p>
                  </div>
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={18}
                    strokeWidth={1.5}
                    className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
                  />
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="space-y-4 border-t border-border/15 pt-6">
            <p className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
              ¿Ya tienes cuenta?
            </p>
            <div className="space-y-2">
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="h-11 w-full"
              >
                <Link href="/login/professional" className="flex items-center gap-2">
                  <HugeiconsIcon icon={UserIcon} size={18} strokeWidth={1.5} />
                  Iniciar sesión como usuario
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="h-11 w-full"
              >
                <Link href="/login/organization" className="flex items-center gap-2">
                  <HugeiconsIcon icon={Building06Icon} size={18} strokeWidth={1.5} />
                  Acceder al portal organizacional
                </Link>
              </Button>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            ¿Necesitas ayuda?{" "}
            <a
              href="mailto:support@biovity.com"
              className="font-medium text-primary hover:underline"
            >
              Contactar soporte
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
