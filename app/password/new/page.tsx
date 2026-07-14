"use client"

import {
  ArrowLeft01Icon,
  SquareLock02Icon,
  ViewIcon,
  ViewOffSlashIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState, useTransition } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/ui/logo"
import { authClient } from "@/lib/auth-client"

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
    <div className="flex min-h-dvh flex-col items-center justify-center bg-muted/30 p-6">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-border/15 bg-background p-8 shadow-xl shadow-muted/20">
        <div className="space-y-3 text-center">
          <Logo size="md" className="justify-center" />
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Establecer nueva contraseña
          </h1>
          <p className="text-sm text-muted-foreground">
            Crea una contraseña segura para tu cuenta. Debe tener al menos 8 caracteres.
          </p>
        </div>

        {!token ? (
          <div className="space-y-6 text-center py-4">
            <p className="text-sm text-destructive font-medium">
              El enlace es inválido o no contiene un token de restablecimiento válido.
            </p>
            <Link href="/password/reset" className="block">
              <Button className="w-full h-11">Solicitar nuevo enlace</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="new-password"
                className="text-xs font-semibold text-foreground uppercase tracking-wider"
              >
                Nueva contraseña
              </label>
              <div className="relative">
                <HugeiconsIcon
                  icon={SquareLock02Icon}
                  size={16}
                  strokeWidth={1.5}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="new-password"
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground focus:outline-none"
                >
                  <HugeiconsIcon
                    icon={isPasswordVisible ? ViewOffSlashIcon : ViewIcon}
                    size={18}
                    strokeWidth={1.75}
                  />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirm-password"
                className="text-xs font-semibold text-foreground uppercase tracking-wider"
              >
                Confirmar contraseña
              </label>
              <div className="relative">
                <HugeiconsIcon
                  icon={SquareLock02Icon}
                  size={16}
                  strokeWidth={1.5}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="confirm-password"
                  type={isConfirmVisible ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10 h-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setIsConfirmVisible(!isConfirmVisible)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground focus:outline-none"
                >
                  <HugeiconsIcon
                    icon={isConfirmVisible ? ViewOffSlashIcon : ViewIcon}
                    size={18}
                    strokeWidth={1.75}
                  />
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-11" disabled={isPending}>
              {isPending ? "Actualizando contraseña..." : "Cambiar contraseña"}
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
