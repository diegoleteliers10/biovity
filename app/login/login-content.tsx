"use client"

import { ArrowRight01Icon, Building06Icon, UserIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"
import Link from "next/link"
import { authLinkClass, authSubtitleClass, authTitleClass } from "@/components/auth/form-styles"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function LoginContent() {
  return (
    <div className="flex h-dvh bg-surface-container-lowest overflow-hidden">
      {/* Left: Illustration Column */}
      <div className="relative hidden w-1/2 p-4 lg:p-6 lg:block">
        <div className="relative w-full h-full rounded-2xl overflow-hidden border border-border bg-surface-container-low">
          <Image
            src="/Login.png"
            alt="Persona frente a una puerta abierta"
            fill
            className="object-cover object-center"
            priority
            sizes="50vw"
          />
        </div>
      </div>

      {/* Right: Login block */}
      <div className="flex min-h-0 w-full flex-col overflow-y-auto bg-surface-container-lowest lg:w-1/2">
        <div className="m-auto w-full max-w-xl space-y-8 p-6 lg:p-12">
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center space-y-3">
            <Link
              href="/"
              aria-label="Ir al inicio"
              className="inline-flex items-center justify-center transition-opacity hover:opacity-80 mb-2"
            >
              <Image
                src="/logoIcon.png"
                alt="Biovity"
                width={50}
                height={50}
                className="h-12 w-auto object-contain"
                priority
              />
            </Link>
            <h1 className={authTitleClass}>Bienvenido a Biovity</h1>
            <p className={authSubtitleClass}>Selecciona tu tipo de acceso para continuar</p>
          </div>

          {/* Cards for User vs Org */}
          <div className="flex flex-col gap-3">
            <Link href="/login/professional" className="block">
              <Card className="group cursor-pointer rounded-xl border border-border bg-surface-container-low hover:border-secondary/40 hover:bg-secondary/5 transition-all duration-200 shadow-none">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-surface-container-lowest border border-border text-secondary transition-colors group-hover:border-secondary/40 group-hover:bg-secondary/10">
                    <HugeiconsIcon icon={UserIcon} size={20} strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <h3 className="font-semibold text-foreground text-sm transition-colors">
                      Usuario Individual
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Profesionales, investigadores y estudiantes
                    </p>
                  </div>
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={16}
                    strokeWidth={1.5}
                    className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-secondary"
                  />
                </CardContent>
              </Card>
            </Link>

            <Link href="/login/organization" className="block">
              <Card className="group cursor-pointer rounded-xl border border-border bg-surface-container-low hover:border-accent/40 hover:bg-accent/5 transition-all duration-200 shadow-none">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-surface-container-lowest border border-border text-accent transition-colors group-hover:border-accent/40 group-hover:bg-accent/10">
                    <HugeiconsIcon icon={Building06Icon} size={20} strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <h3 className="font-semibold text-foreground text-sm transition-colors">
                      Organización
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Empresas, instituciones y laboratorios
                    </p>
                  </div>
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={16}
                    strokeWidth={1.5}
                    className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
                  />
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Registration Options */}
          <div className="space-y-4 border-t border-border pt-6">
            <p className="text-center text-xs font-mono font-semibold uppercase tracking-wider text-secondary">
              ¿Eres nuevo en Biovity?
            </p>
            <div className="space-y-2">
              <Button
                asChild
                variant="outline"
                className="w-full h-11 rounded-lg bg-surface-container-lowest border-border/40 text-foreground hover:bg-surface-container-low text-sm font-medium"
              >
                <Link
                  href="/register/professional"
                  className="flex items-center justify-center gap-2"
                >
                  <HugeiconsIcon icon={UserIcon} size={16} strokeWidth={1.5} />
                  Crear cuenta de usuario
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full h-11 rounded-lg bg-surface-container-lowest border-border/40 text-foreground hover:bg-surface-container-low text-sm font-medium"
              >
                <Link
                  href="/register/organization"
                  className="flex items-center justify-center gap-2"
                >
                  <HugeiconsIcon icon={Building06Icon} size={16} strokeWidth={1.5} />
                  Registrar organización
                </Link>
              </Button>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            ¿Necesitas ayuda?{" "}
            <a href="mailto:support@biovity.com" className={authLinkClass}>
              Contactar soporte
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
