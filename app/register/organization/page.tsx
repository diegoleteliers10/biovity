"use client"

import {
  ArrowLeft01Icon,
  Building06Icon,
  Globe02Icon,
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
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/ui/logo"
import { authClient } from "@/lib/auth-client"
import { organizationRegistrationSchema, validateForm as validateFormZod } from "@/lib/validations"

const { signUp } = authClient

export default function OrganizationRegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    // Información del contacto principal
    contactName: "",
    contactEmail: "",
    contactPassword: "",
    confirmPassword: "",
    contactPosition: "",

    // Información de la organización
    organizationName: "",
    organizationWebsite: "",
  })
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmVisible, setIsConfirmVisible] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const result = validateFormZod(organizationRegistrationSchema, {
      contactName: formData.contactName,
      contactEmail: formData.contactEmail,
      contactPassword: formData.contactPassword,
      confirmPassword: formData.confirmPassword,
      contactPosition: formData.contactPosition,
      organizationName: formData.organizationName,
      organizationWebsite: formData.organizationWebsite,
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

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    const result = await signUp.email({
      email: formData.contactEmail,
      password: formData.contactPassword,
      name: formData.contactName,
      type: "organization",
      profession: formData.contactPosition || "Representante",
      avatar: "",
    })

    if (result.error) {
      setErrors({
        general: "Error al crear la cuenta organizacional. Inténtalo de nuevo.",
      })
    } else {
      router.push("/dashboard")
    }

    setIsLoading(false)
  }

  return (
    <div className="flex h-dvh">
      {/* Left: Illustration */}
      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        <Image
          src="/ilustracionRegistroOrganization.png"
          alt="Biovity - Gestión empresarial y colaboración"
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
              Registrar Organización
            </h1>
            <p className="text-center text-muted-foreground">
              Únete a la red de organizaciones en biociencias
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-8">
            {/* Información del Contacto Principal */}
            <div className="space-y-4">
              <h3 className="pb-2 text-lg font-semibold text-foreground">
                Información del Contacto Principal
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="contactName" className="text-sm font-medium text-foreground">
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
                      id="contactName"
                      type="text"
                      placeholder="Nombre del representante"
                      value={formData.contactName}
                      onChange={(e) => handleInputChange("contactName", e.target.value)}
                      className={`pl-10 ${errors.contactName ? "border-destructive" : ""}`}
                      required
                    />
                  </div>
                  {errors.contactName && (
                    <p className="text-sm text-destructive">{errors.contactName}</p>
                  )}
                </div>

                {/* Contact Position */}
                <div className="space-y-2">
                  <label htmlFor="contactPosition" className="text-sm font-medium text-foreground">
                    Cargo/Posición
                  </label>
                  <Input
                    id="contactPosition"
                    type="text"
                    placeholder="Director, Gerente, CEO, etc."
                    value={formData.contactPosition}
                    onChange={(e) => handleInputChange("contactPosition", e.target.value)}
                    className={errors.contactPosition ? "border-destructive" : ""}
                  />
                  {errors.contactPosition && (
                    <p className="text-sm text-destructive">{errors.contactPosition}</p>
                  )}
                </div>
              </div>

              {/* Contact Email */}
              <div className="space-y-2">
                <label htmlFor="contactEmail" className="text-sm font-medium text-foreground">
                  Correo electrónico corporativo
                </label>
                <div className="relative">
                  <HugeiconsIcon
                    icon={Mail01Icon}
                    size={16}
                    strokeWidth={1.5}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="contacto@tuorganizacion.com"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                    className={`pl-10 ${errors.contactEmail ? "border-destructive" : ""}`}
                    required
                    autoComplete="email"
                  />
                </div>
                {errors.contactEmail && (
                  <p className="text-sm text-destructive">{errors.contactEmail}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="contactPassword" className="text-sm font-medium text-foreground">
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
                      id="contactPassword"
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.contactPassword}
                      onChange={(e) => handleInputChange("contactPassword", e.target.value)}
                      className={`pl-10 pr-10 ${errors.contactPassword ? "border-destructive" : ""}`}
                      required
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
                  {errors.contactPassword && (
                    <p className="text-sm text-destructive">{errors.contactPassword}</p>
                  )}
                </div>

                {/* Confirm Password */}
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
                      type={isConfirmVisible ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className={`pl-10 pr-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                      required
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
            </div>

            {/* Información de la Organización */}
            <div className="space-y-4">
              <h3 className="pb-2 text-lg font-semibold text-foreground">
                Información de la Organización
              </h3>

              {/* Organization Name */}
              <div className="space-y-2">
                <label htmlFor="organizationName" className="text-sm font-medium text-foreground">
                  Nombre de la organización
                </label>
                <div className="relative">
                  <HugeiconsIcon
                    icon={Building06Icon}
                    size={16}
                    strokeWidth={1.5}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="organizationName"
                    type="text"
                    placeholder="Nombre oficial de la organización"
                    value={formData.organizationName}
                    onChange={(e) => handleInputChange("organizationName", e.target.value)}
                    className={`pl-10 ${errors.organizationName ? "border-destructive" : ""}`}
                    required
                  />
                </div>
                {errors.organizationName && (
                  <p className="text-sm text-destructive">{errors.organizationName}</p>
                )}
              </div>

              {/* Website */}
              <div className="space-y-2">
                <label
                  htmlFor="organizationWebsite"
                  className="text-sm font-medium text-foreground"
                >
                  Sitio web
                </label>
                <div className="relative">
                  <HugeiconsIcon
                    icon={Globe02Icon}
                    size={16}
                    strokeWidth={1.5}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="organizationWebsite"
                    type="url"
                    placeholder="https://tuorganizacion.com"
                    value={formData.organizationWebsite}
                    onChange={(e) => handleInputChange("organizationWebsite", e.target.value)}
                    className={`pl-10 ${errors.organizationWebsite ? "border-destructive" : ""}`}
                    required
                  />
                </div>
                {errors.organizationWebsite && (
                  <p className="text-sm text-destructive">{errors.organizationWebsite}</p>
                )}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                label={
                  <span className="text-sm text-foreground">
                    En nombre de la organización, acepto los{" "}
                    <button
                      type="button"
                      className="text-fuchsia-600 hover:text-fuchsia-700 hover:underline"
                    >
                      términos y condiciones empresariales
                    </button>{" "}
                    y la{" "}
                    <button
                      type="button"
                      className="text-fuchsia-600 hover:text-fuchsia-700 hover:underline"
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

            {/* General Error */}
            {errors.general && (
              <div className="rounded-md bg-destructive/10 p-3 text-center text-sm text-destructive">
                {errors.general}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="h-11 w-full bg-fuchsia-600 text-white hover:bg-fuchsia-700"
              disabled={isLoading}
            >
              {isLoading ? "Registrando organización..." : "Registrar Organización"}
            </Button>
          </form>

          <div className="space-y-4 border-t pt-6">
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
                ¿Tu organización ya está registrada?{" "}
                <Link
                  href="/login/organization"
                  className="font-medium text-fuchsia-600 hover:text-fuchsia-700 hover:underline"
                >
                  Acceder al portal
                </Link>
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                ¿Eres usuario individual?{" "}
                <Link
                  href="/register/professional"
                  className="font-medium text-teal-600 hover:text-teal-700 hover:underline"
                >
                  Crear cuenta de usuario
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
