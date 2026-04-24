"use client"

import {
  ArrowLeft01Icon,
  Mail01Icon,
  SquareLock02Icon,
  UserIcon,
  ViewIcon,
  ViewOffSlashIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Select } from "@/components/base/select/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/ui/logo"
import { type AuthUser, authClient, createRoleBasedRedirect } from "@/lib/auth-client"
import { userRegistrationSchema, validateForm as validateFormZod } from "@/lib/validations"

const { signUp } = authClient

const professions = [
  { label: "Biotecnólogo", id: "biotecnologo" },
  { label: "Bioinformático", id: "bioinformatico" },
  { label: "Investigador", id: "investigador" },
  { label: "Analista de Laboratorio", id: "analista-lab" },
  { label: "Ingeniero Biomédico", id: "ing-biomedico" },
  { label: "Microbiólogo", id: "microbiologo" },
  { label: "Genetista", id: "genetista" },
  { label: "Bioquímico", id: "bioquimico" },
  { label: "Especialista en Calidad", id: "calidad" },
  { label: "Técnico de Laboratorio", id: "tecnico-lab" },
  { label: "Gerente de Proyectos", id: "gerente-proyectos" },
  { label: "Científico de Datos", id: "cientifico-datos" },
  { label: "Especialista Regulatorio", id: "regulatorio" },
  { label: "Bioestadístico", id: "bioestadistico" },
  { label: "Consultor", id: "consultor" },
  { label: "Docente/Profesor", id: "docente" },
  { label: "Estudiante", id: "estudiante" },
  { label: "Otro", id: "otro" },
]

export function UserRegisterContent() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profession: "",
  })
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmVisible, setIsConfirmVisible] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const handleProfessionChange = (value: string | number | null) => {
    handleInputChange("profession", value ? String(value) : "")
  }

  const validateForm = () => {
    const result = validateFormZod(userRegistrationSchema, {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      profession: formData.profession,
      acceptTerms: acceptTerms,
    })

    if (!result.success) {
      setErrors(result.errors)
      return false
    }

    return true
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setErrors((prev) => ({ ...prev, general: "" }))

    const result = await signUp.email(
      {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        type: "professional",
        profession: formData.profession,
        avatar: "",
      },
      {
        onSuccess: async (ctx) => {
          await authClient.getSession()
          const redirectPath = createRoleBasedRedirect(ctx.data.user as AuthUser)
          window.location.replace(redirectPath)
        },
      }
    )

    if (result?.error) {
      setErrors({
        general: "Error al crear la cuenta. Intentalo de nuevo.",
      })
    }

    setIsLoading(false)
  }

  return (
    <div className="flex h-dvh">
      {/* Left: Illustration */}
      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        <Image
          src="/ilustracionRegistroUsers.png"
          alt="Biovity - Talento bio-digital y desarrollo profesional"
          fill
          className="object-cover object-center p-2.5 rounded-[20px]"
          priority
          sizes="50vw"
        />
      </div>

      {/* Right: Registration form */}
      <div className="flex min-h-0 w-full flex-col justify-center overflow-y-auto bg-background p-6 lg:w-1/2 lg:p-12">
        <div className="mx-auto w-full max-w-lg space-y-8">
          <div className="space-y-2 text-center">
            <Logo size="lg" className="justify-center" />
            <h1 className="text-center text-2xl font-bold tracking-tight text-foreground">
              Crear cuenta de usuario
            </h1>
            <p className="text-center text-muted-foreground">
              Únete a la comunidad de profesionales en biociencias
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                Nombre completo
              </label>
              <div className="relative">
                <HugeiconsIcon
                  icon={UserIcon}
                  size={16}
                  strokeWidth={1.5}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Tu nombre completo"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`pl-10 ${errors.name ? "border-destructive" : ""}`}
                  required
                  autoComplete="name"
                />
              </div>
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="profession" className="text-sm font-medium text-foreground">
                Profesión o Cargo
              </label>
              <Select.ComboBox
                isRequired
                placeholder="Buscar tu profesión..."
                items={professions}
                selectedKey={formData.profession}
                onSelectionChange={handleProfessionChange}
                className="w-full"
              >
                {(item) => (
                  <Select.Item id={item.id} supportingText={item.supportingText}>
                    {item.label}
                  </Select.Item>
                )}
              </Select.ComboBox>
              {errors.profession && <p className="text-sm text-destructive">{errors.profession}</p>}
            </div>

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
                  name="email"
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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                    name="password"
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`pl-10 pr-10 ${errors.password ? "border-destructive" : ""}`}
                    required
                    autoComplete="new-password"
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

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
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
                    id="confirmPassword"
                    name="confirmPassword"
                    type={isConfirmVisible ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className={`pl-10 pr-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    aria-label={isConfirmVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
                    aria-pressed={isConfirmVisible}
                    onClick={() => setIsConfirmVisible((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-0"
                  >
                    <HugeiconsIcon
                      icon={isConfirmVisible ? ViewOffSlashIcon : ViewIcon}
                      size={18}
                      strokeWidth={1.75}
                    />
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Checkbox
                id="terms"
                name="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                label={
                  <span className="text-sm text-foreground">
                    Acepto los{" "}
                    <button
                      type="button"
                      className="text-secondary hover:text-secondary/80 hover:underline"
                    >
                      términos y condiciones
                    </button>{" "}
                    y la{" "}
                    <button
                      type="button"
                      className="text-secondary hover:text-secondary/80 hover:underline"
                    >
                      política de privacidad
                    </button>
                  </span>
                }
              />
              {errors.acceptTerms && (
                <p className="text-sm text-destructive">{errors.acceptTerms}</p>
              )}
            </div>

            {errors.general && (
              <div className="rounded-md bg-destructive/10 p-3 text-center text-sm text-destructive">
                {errors.general}
              </div>
            )}

            <Button type="submit" className="h-11 w-full" disabled={isLoading}>
              {isLoading ? "Creando cuenta..." : "Crear cuenta de usuario"}
            </Button>
          </form>

          <div className="space-y-4 border-t border-border/10 pt-6">
            <div className="text-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={16} strokeWidth={1.5} />
                Volver a selección de registro
              </Link>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                ¿Ya tienes una cuenta?{" "}
                <Link
                  href="/login/professional"
                  className="font-medium text-teal-600 hover:text-teal-700 hover:underline"
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                ¿Representas una organización?{" "}
                <Link
                  href="/register/organization"
                  className="font-medium text-accent hover:text-accent/80 hover:underline"
                >
                  Registrar organización
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
