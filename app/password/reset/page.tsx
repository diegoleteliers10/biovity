"use client"

import { ArrowLeft01Icon, Mail01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"
import Link from "next/link"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { authButtonClass, authInputClass, authLabelClass, authSubtitleClass, authTitleClass } from "@/components/auth/form-styles"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

export default function PasswordResetPage() {
  const [email, setEmail] = useState("")
  const [isPending, startTransition] = useTransition()
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    startTransition(async () => {
      try {
        const { error } = await authClient.requestPasswordReset({
          email: email.trim(),
          redirectTo: "/password/new",
        })

        if (error) {
          toast.error(error.message || "Error al procesar la solicitud.")
          return
        }

        setIsSent(true)
        toast.success("Correo de restablecimiento enviado con éxito.")
      } catch (_err) {
        toast.error("Ocurrió un error inesperado. Inténtalo de nuevo.")
      }
    })
  }

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center bg-surface-container-low p-4 sm:p-6">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[44rem] h-[30rem] rounded-full bg-gradient-to-b from-secondary/10 via-accent/5 to-transparent blur-3xl opacity-70" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8 rounded-xl border border-border bg-surface-container-lowest p-6 sm:p-10 shadow-none">
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
          <h1 className={authTitleClass}>¿Olvidaste tu contraseña?</h1>
          <p className={authSubtitleClass}>
            Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu cuenta.
          </p>
        </div>

        {isSent ? (
          <div className="space-y-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/10 border border-secondary/20 text-secondary">
              <HugeiconsIcon icon={Mail01Icon} size={28} strokeWidth={1.5} />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">¡Correo enviado!</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Hemos enviado un enlace de recuperación a <strong className="text-foreground font-mono">{email}</strong>. Por favor revisa tu bandeja de entrada y spam.
              </p>
            </div>
            <Button variant="outline" className="w-full h-11 rounded-xl bg-surface-container-lowest border-border text-foreground hover:bg-surface-container-low text-xs font-medium" onClick={() => setIsSent(false)}>
              Intentar con otro correo
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className={authLabelClass}>
                Correo electrónico
              </label>
              <div className="relative">
                <HugeiconsIcon
                  icon={Mail01Icon}
                  size={16}
                  strokeWidth={1.5}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(authInputClass, "pl-10")}
                  required
                />
              </div>
            </div>

            <Button type="submit" className={cn(authButtonClass, "w-full")} disabled={isPending}>
              {isPending ? "Enviando enlace..." : "Enviar enlace de recuperación"}
            </Button>
          </form>
        )}

        <div className="border-t border-border pt-6 text-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={14} strokeWidth={1.5} />
            Volver a selección de acceso
          </Link>
        </div>
      </div>
    </div>
  )
}
