"use client"

import { MailSend01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"
import Link from "next/link"
import { authButtonClass, authSubtitleClass, authTitleClass } from "@/components/auth/form-styles"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type CheckYourEmailProps = {
  email: string
  loginHref: string
  description: string
}

export function CheckYourEmail({ email, loginHref, description }: CheckYourEmailProps) {
  return (
    <div className="space-y-8 text-center">
      <div className="flex flex-col items-center space-y-4">
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
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/10 border border-secondary/20 text-secondary">
          <HugeiconsIcon
            icon={MailSend01Icon}
            size={28}
            strokeWidth={1.5}
          />
        </div>
        <h1 className={authTitleClass}>Revisa tu correo</h1>
        <p className={`mx-auto max-w-sm ${authSubtitleClass}`}>
          {description} <span className="font-semibold text-foreground font-mono">{email}</span>. Haz clic en el
          enlace para confirmar tu cuenta y luego inicia sesión.
        </p>
      </div>
      <div className="space-y-4">
        <Button asChild variant="default" className={cn(authButtonClass, "w-full")}>
          <Link href={loginHref}>Ir a iniciar sesión</Link>
        </Button>
        <p className="text-xs text-muted-foreground">
          ¿No recibiste el correo? Revisa tu bandeja de spam o intenta registrarte nuevamente.
        </p>
      </div>
    </div>
  )
}
