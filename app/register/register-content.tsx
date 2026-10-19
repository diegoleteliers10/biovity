"use client"

import { ArrowRight01Icon, Building06Icon, UserIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"
import Link from "next/link"
import { AuthPageShell } from "@/components/auth/AuthPageShell"
import { authLinkClass, authSubtitleClass, authTitleClass } from "@/components/auth/form-styles"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function RegisterContent() {
  return (
    <AuthPageShell
      imageSrc="/Login.webp"
      imageAlt="Persona frente a una puerta abierta"
      imageClassName="scale-[1.06]"
    >
      <div className="w-full max-w-xl space-y-7">
        {/* Logo & Header */}
        <div className="flex flex-col items-start space-y-3 text-left">
          <Link
            href="/"
            aria-label="Ir al inicio"
            className="inline-flex items-center justify-center transition-opacity hover:opacity-80 mb-2"
          >
            <Image
              src="/logoIcon.webp"
              alt="Biovity"
              width={50}
              height={50}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>
          <h1 className={authTitleClass}>Únete a Biovity</h1>
          <p className={authSubtitleClass}>Selecciona el tipo de cuenta que quieres crear</p>
        </div>

        {/* Role Cards */}
        <div className="flex flex-col gap-3">
          <Link
            href="/register/professional"
            className="group block rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
          >
            <Card className="rounded-lg border border-border/40 bg-surface-container-low transition-[transform,background-color,border-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-0.5 group-hover:border-secondary/40 group-hover:bg-secondary/5 group-active:translate-y-0 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 shadow-none">
              <CardContent className="flex items-center gap-4 p-5 sm:p-6">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-secondary/10 text-secondary">
                  <HugeiconsIcon icon={UserIcon} size={22} strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <h2 className="text-base font-semibold text-foreground">Usuario Individual</h2>
                  <p className="mt-1 text-sm leading-5 text-muted-foreground">
                    Profesionales, investigadores y estudiantes
                  </p>
                </div>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-container-lowest text-secondary transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">
                  <HugeiconsIcon icon={ArrowRight01Icon} size={17} strokeWidth={1.5} />
                </span>
              </CardContent>
            </Card>
          </Link>

          <Link
            href="/register/organization"
            className="group block rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
          >
            <Card className="rounded-lg border border-border/40 bg-surface-container-low transition-[transform,background-color,border-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-0.5 group-hover:border-accent/40 group-hover:bg-accent/5 group-active:translate-y-0 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 shadow-none">
              <CardContent className="flex items-center gap-4 p-5 sm:p-6">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-accent/10 text-primary">
                  <HugeiconsIcon icon={Building06Icon} size={22} strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <h2 className="text-base font-semibold text-foreground">Organización</h2>
                  <p className="mt-1 text-sm leading-5 text-muted-foreground">
                    Empresas, instituciones y laboratorios
                  </p>
                </div>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-container-lowest text-primary transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">
                  <HugeiconsIcon icon={ArrowRight01Icon} size={17} strokeWidth={1.5} />
                </span>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Already have account */}
        <div className="space-y-4 rounded-lg bg-surface-container-low p-5 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:space-y-0">
          <p className="text-left text-sm font-semibold text-secondary">¿Ya tienes cuenta?</p>
          <div className="flex flex-col gap-2 sm:items-end">
            <Button
              asChild
              variant="outline"
              className="h-10 w-full justify-start rounded-md border-border/40 bg-surface-container-lowest px-3 text-sm font-medium text-foreground transition-colors duration-150 ease-out hover:bg-surface-container-highest active:scale-[0.98] sm:w-72"
            >
              <Link href="/login/professional" className="flex items-center gap-2">
                <HugeiconsIcon icon={UserIcon} size={16} strokeWidth={1.5} />
                Iniciar sesión como usuario
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-10 w-full justify-start rounded-md border-border/40 bg-surface-container-lowest px-3 text-sm font-medium text-foreground transition-colors duration-150 ease-out hover:bg-surface-container-highest active:scale-[0.98] sm:w-72"
            >
              <Link href="/login/organization" className="flex items-center gap-2">
                <HugeiconsIcon icon={Building06Icon} size={16} strokeWidth={1.5} />
                Acceder al portal organizacional
              </Link>
            </Button>
          </div>
        </div>

        <p className="text-left text-xs text-muted-foreground">
          ¿Necesitas ayuda?{" "}
          <a href="mailto:support@biovity.com" className={authLinkClass}>
            Contactar soporte
          </a>
        </p>
      </div>
    </AuthPageShell>
  )
}
