"use client"

import { ArrowLeft01Icon, Mail01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/ui/logo"
import { authClient } from "@/lib/auth-client"

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
    <div className="flex min-h-dvh flex-col items-center justify-center bg-muted/30 p-6">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-border/15 bg-background p-8 shadow-xl shadow-muted/20">
        <div className="space-y-3 text-center">
          <Logo size="md" className="justify-center" />
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            ¿Olvidaste tu contraseña?
          </h1>
          <p className="text-sm text-muted-foreground">
            Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu
            cuenta.
          </p>
        </div>

        {isSent ? (
          <div className="space-y-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10 text-secondary">
              <HugeiconsIcon icon={Mail01Icon} size={24} strokeWidth={1.5} />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">¡Correo enviado!</p>
              <p className="text-xs text-muted-foreground">
                Hemos enviado un enlace de recuperación a <strong>{email}</strong>. Por favor revisa
                tu bandeja de entrada y spam.
              </p>
            </div>
            <Button variant="outline" className="w-full" onClick={() => setIsSent(false)}>
              Intentar con otro correo
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-xs font-semibold text-foreground uppercase tracking-wider"
              >
                Correo electrónico
              </label>
              <div className="relative">
                <HugeiconsIcon
                  icon={Mail01Icon}
                  size={16}
                  strokeWidth={1.5}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-11" disabled={isPending}>
              {isPending ? "Enviando enlace..." : "Enviar enlace de recuperación"}
            </Button>
          </form>
        )}

        <div className="border-t border-border/15 pt-6 text-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={14} strokeWidth={1.5} />
            Volver a selección de acceso
          </Link>
        </div>
      </div>
    </div>
  )
}
