"use client"

import { MailSend01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { authButtonClass, authSubtitleClass, authTitleClass } from "@/components/auth/form-styles"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { cn } from "@/lib/utils"

type CheckYourEmailProps = {
  email: string
  loginHref: string
  description: string
}

export function CheckYourEmail({ email, loginHref, description }: CheckYourEmailProps) {
  return (
    <div className="space-y-8 text-center">
      <div className="space-y-4">
        <Logo size="lg" className="justify-center" />
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
          <HugeiconsIcon
            icon={MailSend01Icon}
            size={32}
            strokeWidth={1.5}
            className="text-accent"
          />
        </div>
        <h1 className={authTitleClass}>Revisa tu correo</h1>
        <p className={`mx-auto max-w-sm ${authSubtitleClass}`}>
          {description} <span className="font-medium text-foreground">{email}</span>. Haz clic en el
          enlace para confirmar tu cuenta y luego inicia sesión.
        </p>
      </div>
      <div className="space-y-4">
        <Button asChild variant="default" className={cn(authButtonClass, "w-full")}>
          <Link href={loginHref}>Ir a iniciar sesión</Link>
        </Button>
        <p className="text-sm text-muted-foreground">
          ¿No recibiste el correo? Revisa tu bandeja de spam o intenta registrarte nuevamente.
        </p>
      </div>
    </div>
  )
}
