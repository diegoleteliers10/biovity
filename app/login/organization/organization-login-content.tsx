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
import { useState, useTransition } from "react"
import {
  authButtonClass,
  authInputClass,
  authLabelClass,
  authLinkClass,
  authOrgLinkClass,
  authSubtitleClass,
  authTitleClass,
} from "@/components/auth/form-styles"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { organizationLoginSchema, validateForm as validateFormZod } from "@/lib/validations"

const { signIn } = authClient

export function OrganizationLoginContent() {
  const _router = useRouter()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [rememberMe, setRememberMe] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()

    const validation = validateFormZod(organizationLoginSchema, {
      email: formData.email,
      password: formData.password,
      rememberMe: rememberMe,
    })
    if (!validation.success) {
      setErrors(validation.errors)
      return
    }

    startTransition(async () => {
      setErrors({})

      const result = await signIn.email({
        email: formData.email,
        password: formData.password,
        rememberMe,
        callbackURL: "/dashboard",
      })

      if (result?.error) {
        const msg =
          (result.error as { message?: string })?.message ??
          "Credenciales inválidas. Por favor verifica tu email y contraseña."
        setErrors({ general: msg })
        return
      }

      authClient.$store.notify("$sessionSignal")
      window.location.href = "/dashboard"
    })
  }

  return (
    <div className="flex h-dvh bg-surface-container-lowest overflow-hidden">
      {/* Left: Illustration */}
      <div className="relative hidden w-1/2 p-4 lg:p-6 lg:block">
        <div className="relative w-full h-full rounded-2xl overflow-hidden border border-border bg-surface-container-low">
          <Image
            src="/images/ilustrationOG.png"
            alt="Biovity - Colaboración en ciencias y biotecnología"
            fill
            className="object-cover object-center"
            priority
            sizes="50vw"
          />
        </div>
      </div>

      {/* Right: Login form */}
      <div className="flex min-h-0 w-full flex-col overflow-y-auto bg-surface-container-lowest lg:w-1/2">
        <div className="m-auto w-full max-w-sm space-y-8 p-6 lg:p-12">
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
            <h1 className={authTitleClass}>Portal Organizacional</h1>
            <p className={authSubtitleClass}>
              Acceso para empresas, instituciones y laboratorios
            </p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className={authLabelClass}>
                Correo corporativo
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
                  placeholder="admin@tuorganizacion.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={cn(authInputClass, "pl-10", errors.email && "border-destructive")}
                  required
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className={authLabelClass}>
                Contraseña
              </label>
              <div className="relative">
                <HugeiconsIcon
                  icon={SquareLock02Icon}
                  size={16}
                  strokeWidth={1.5}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="password"
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={cn(
                    authInputClass,
                    "pl-10 pr-10",
                    errors.password && "border-destructive"
                  )}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  aria-label={isPasswordVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
                  aria-pressed={isPasswordVisible}
                  onClick={() => setIsPasswordVisible((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground focus:outline-none"
                >
                  <HugeiconsIcon
                    icon={isPasswordVisible ? ViewOffSlashIcon : ViewIcon}
                    size={16}
                    strokeWidth={1.75}
                  />
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between pt-1">
              <label htmlFor="remember" className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground cursor-pointer select-none">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                Recordar sesión
              </label>
              <Link href="/password/reset" className={authLinkClass}>
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {errors.general && (
              <div role="alert" className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-xs text-destructive text-center">
                {errors.general}
              </div>
            )}

            <Button
              type="submit"
              className={cn(authButtonClass, "w-full")}
              disabled={isPending}
            >
              {isPending ? "Accediendo..." : "Acceder al portal"}
            </Button>
          </form>

          <div className="space-y-3.5 border-t border-border pt-6 text-center text-xs sm:text-sm">
            <div>
              <p className="text-muted-foreground">
                ¿Tu organización no está registrada?{" "}
                <Link href="/register/organization" className={authOrgLinkClass}>
                  Registrar organización
                </Link>
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">
                ¿Eres usuario individual?{" "}
                <Link href="/login/professional" className={authLinkClass}>
                  Acceso de usuario
                </Link>
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={14} strokeWidth={1.5} />
                Volver a selección de acceso
              </Link>
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
