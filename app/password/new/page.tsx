"use client"

import {
  ArrowLeft01Icon,
  SquareLock02Icon,
  ViewIcon,
  ViewOffSlashIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState, useTransition } from "react"
import { toast } from "sonner"
import { authButtonClass, authInputClass, authLabelClass, authSubtitleClass, authTitleClass } from "@/components/auth/form-styles"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

export default function PasswordNewPage() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmVisible, setIsConfirmVisible] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      setToken(params.get("token"))
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      toast.error("El enlace de restablecimiento es inválido o ha expirado.")
      return
    }

    if (password.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres.")
      return
    }

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden.")
      return
    }

    startTransition(async () => {
      try {
        const { error } = await authClient.resetPassword({
          newPassword: password,
          token,
        })

        if (error) {
          toast.error(error.message || "Error al restablecer la contraseña.")
          return
        }

        toast.success("Contraseña restablecida con éxito. Redirigiendo a inicio de sesión...")
        setTimeout(() => {
          router.push("/login")
        }, 2000)
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
          <h1 className={authTitleClass}>Establecer nueva contraseña</h1>
          <p className={authSubtitleClass}>
            Crea una contraseña segura para tu cuenta. Debe tener al menos 8 caracteres.
          </p>
        </div>

        {!token ? (
          <div className="space-y-6 text-center py-4">
            <p className="text-xs text-destructive font-medium">
              El enlace es inválido o no contiene un token de restablecimiento válido.
            </p>
            <Link href="/password/reset" className="block">
              <Button className={cn(authButtonClass, "w-full")}>Solicitar nuevo enlace</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="new-password" className={authLabelClass}>
                Nueva contraseña
              </label>
              <div className="relative">
                <HugeiconsIcon
                  icon={SquareLock02Icon}
                  size={16}
                  strokeWidth={1.5}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="new-password"
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn(authInputClass, "pl-10 pr-10")}
                  required
                />
                <button
                  type="button"
                  aria-label={isPasswordVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
                  aria-pressed={isPasswordVisible}
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground focus:outline-none"
                >
                  <HugeiconsIcon
                    icon={isPasswordVisible ? ViewOffSlashIcon : ViewIcon}
                    size={16}
                    strokeWidth={1.75}
                  />
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="confirm-password" className={authLabelClass}>
                Confirmar contraseña
              </label>
              <div className="relative">
                <HugeiconsIcon
                  icon={SquareLock02Icon}
                  size={16}
                  strokeWidth={1.5}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="confirm-password"
                  type={isConfirmVisible ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={cn(authInputClass, "pl-10 pr-10")}
                  required
                />
                <button
                  type="button"
                  aria-label={isConfirmVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
                  aria-pressed={isConfirmVisible}
                  onClick={() => setIsConfirmVisible(!isConfirmVisible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground focus:outline-none"
                >
                  <HugeiconsIcon
                    icon={isConfirmVisible ? ViewOffSlashIcon : ViewIcon}
                    size={16}
                    strokeWidth={1.75}
                  />
                </button>
              </div>
            </div>

            <Button type="submit" className={cn(authButtonClass, "w-full")} disabled={isPending}>
              {isPending ? "Actualizando contraseña..." : "Cambiar contraseña"}
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
