"use client"

import {
  ArrowLeft01Icon,
  Mail01Icon,
  SquareLock02Icon,
  ViewIcon,
  ViewOffSlashIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/ui/logo"
import { type AuthUser, authClient, createRoleBasedRedirect } from "@/lib/auth-client"

const { signIn } = authClient

export function AdminLoginContent() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [rememberMe, setRememberMe] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    const result = await signIn.email(
      {
        email: formData.email,
        password: formData.password,
        rememberMe,
      },
      {
        onSuccess: (ctx) => {
          const user = ctx.data.user as AuthUser
          if (user.type !== "admin" && !isAdminEmail(formData.email)) {
            setErrors({ general: "Acceso restringido. Solo administradores." })
            setIsLoading(false)
            return
          }
          const redirectPath = createRoleBasedRedirect(user)
          router.push(redirectPath)
        },
      }
    )

    if (result?.error) {
      const msg =
        (result.error as { message?: string })?.message ??
        "Credenciales invalidas. Verifica tu email y contrasena."
      setErrors({ general: msg })
    }

    setIsLoading(false)
  }

  return (
    <div className="flex h-dvh">
      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        <Image
          src="/images/ilustrationOG.png"
          alt="Biovity - Panel de Administracion"
          fill
          className="object-cover object-center p-2.5 rounded-[20px]"
          priority
          sizes="50vw"
        />
      </div>

      <div className="flex min-h-0 w-full flex-col justify-center overflow-y-auto bg-background p-6 lg:w-1/2 lg:p-12">
        <div className="mx-auto w-full max-w-sm space-y-8">
          <div className="space-y-2 text-center">
            <Logo size="lg" className="justify-center" />
            <h1 className="text-center text-2xl font-bold tracking-tight text-foreground">
              Panel de Administracion
            </h1>
            <p className="text-center text-muted-foreground">
              Acceso exclusivo para administradores del sistema
            </p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Correo electronico
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
                  placeholder="admin@biovity.cl"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                  required
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Contrasena
              </label>
              <div className="relative">
                <HugeiconsIcon
                  icon={SquareLock02Icon}
                  size={16}
                  strokeWidth={1.5}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="password"
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={`pl-10 pr-10 ${errors.password ? "border-destructive" : ""}`}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  aria-label={isPasswordVisible ? "Ocultar contrasena" : "Mostrar contrasena"}
                  aria-pressed={isPasswordVisible}
                  onClick={() => setIsPasswordVisible((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-0"
                >
                  <HugeiconsIcon
                    icon={isPasswordVisible ? ViewOffSlashIcon : ViewIcon}
                    size={18}
                    strokeWidth={1.75}
                  />
                </button>
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>
            <div className="flex items-center justify-between">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                label="Recordarme"
              />
            </div>
            {errors.general && (
              <div className="text-center text-sm text-destructive">{errors.general}</div>
            )}
            <Button type="submit" className="h-11 w-full" disabled={isLoading}>
              {isLoading ? "Cargando..." : "Acceder al panel"}
            </Button>
          </form>

          <div className="border-t border-border/15 pt-6">
            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={16} strokeWidth={1.5} />
                Volver a seleccion de acceso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function isAdminEmail(email: string): boolean {
  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()) ?? []
  return adminEmails.includes(email)
}
