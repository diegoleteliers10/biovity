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
import { useEffect, useState } from "react"
import { AuthLoader } from "@/components/ui/auth-loader"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/ui/logo"
import { authClient } from "@/lib/auth-client"

const { signIn } = authClient

export function UserLoginContent() {
  const router = useRouter()
  const { useSession } = authClient
  const { data: session, isPending } = useSession()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    profession: "",
  })
  const [rememberMe, setRememberMe] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  useEffect(() => {
    if (!isPending && session?.user) {
      router.replace("/dashboard")
    }
  }, [session, isPending, router])

  if (isPending) {
    return <AuthLoader />
  }

  if (session?.user) {
    return null
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    try {
      const result = await signIn.email({
        email: formData.email,
        password: formData.password,
        rememberMe,
      })
      if (result.error) {
        const msg =
          (result.error as { message?: string })?.message ??
          "Credenciales inválidas. Por favor verifica tu email y contraseña."
        setErrors({ general: msg })
      }
    } catch {
      setErrors({ general: "Error al iniciar sesión. Inténtalo de nuevo." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-dvh">
      {/* Left: Illustration */}
      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        <Image
          src="/images/ilustrationOG.png"
          alt="Biovity - Colaboración en ciencias y biotecnología"
          fill
          className="object-cover object-center p-2.5 rounded-[20px]"
          priority
          sizes="50vw"
        />
      </div>

      {/* Right: Login form */}
      <div className="flex min-h-0 w-full flex-col justify-center overflow-y-auto bg-background p-6 lg:w-1/2 lg:p-12">
        <div className="mx-auto w-full max-w-sm space-y-8">
          <div className="space-y-2 text-center">
            <Logo size="lg" className="justify-center" />
            <h1 className="text-center text-2xl font-bold tracking-tight text-foreground">
              Iniciar sesión
            </h1>
            <p className="text-center text-muted-foreground">
              Acceso para profesionales, investigadores y estudiantes
            </p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
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
                Contraseña
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
                  aria-label={isPasswordVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
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
              <button
                type="button"
                className="text-sm text-secondary hover:text-secondary/80 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            {errors.general && (
              <div className="text-center text-sm text-destructive">{errors.general}</div>
            )}
            <Button type="submit" className="h-11 w-full" disabled={isLoading}>
              {isLoading ? "Cargando..." : "Iniciar sesión"}
            </Button>
          </form>

          <div className="space-y-4 border-t border-border/15 pt-6">
            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={16} strokeWidth={1.5} />
                Volver a selección de acceso
              </Link>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                ¿No tienes una cuenta?{" "}
                <Link
                  href="/register/professional"
                  className="font-medium text-secondary hover:text-secondary/80 hover:underline"
                >
                  Regístrate como usuario
                </Link>
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                ¿Eres una organización?{" "}
                <Link
                  href="/login/organization"
                  className="font-medium text-accent hover:text-accent/80 hover:underline"
                >
                  Acceso organizacional
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            ¿Necesitas ayuda?{" "}
            <a
              href="mailto:support@biovity.com"
              className="font-medium text-primary hover:underline"
            >
              Contactar soporte
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
