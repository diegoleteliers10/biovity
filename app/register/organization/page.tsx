"use client"

import {
  Building06Icon,
  Globe02Icon,
  Mail01Icon,
  SquareLock02Icon,
  UserIcon,
  ViewIcon,
  ViewOffSlashIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
      type: "organización",
      profession: formData.contactPosition || "Representante",
      avatar: "",
    })

    if (result.error) {
      setErrors({
        general: "Error al crear la cuenta organizacional. Inténtalo de nuevo.",
      })
    } else {
      router.push("/dashboard/organization")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-dvh bg-gradient-to-r from-purple-100 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center space-y-4">
          {/* Logo */}
          <div className="mx-auto">
            <Logo size="lg" />
          </div>

          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold text-gray-800">
              <h2>Registrar Organización</h2>
            </CardTitle>
            <CardDescription className="text-gray-600">
              Únete a la red de organizaciones en biociencias
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-8">
            {/* Información del Contacto Principal */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 pb-2">
                Información del Contacto Principal
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Contact Name */}
                <div className="space-y-2">
                  <label htmlFor="contactName" className="text-sm font-medium text-gray-700">
                    Nombre completo
                  </label>
                  <div className="relative">
                    <HugeiconsIcon
                      icon={UserIcon}
                      size={16}
                      strokeWidth={1.5}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <Input
                      id="contactName"
                      type="text"
                      placeholder="Nombre del representante"
                      value={formData.contactName}
                      onChange={(e) => handleInputChange("contactName", e.target.value)}
                      className={`pl-10 ${errors.contactName ? "border-red-500" : ""}`}
                      required
                    />
                  </div>
                  {errors.contactName && (
                    <p className="text-sm text-red-500">{errors.contactName}</p>
                  )}
                </div>

                {/* Contact Position */}
                <div className="space-y-2">
                  <label htmlFor="contactPosition" className="text-sm font-medium text-gray-700">
                    Cargo/Posición
                  </label>
                  <Input
                    id="contactPosition"
                    type="text"
                    placeholder="Director, Gerente, CEO, etc."
                    value={formData.contactPosition}
                    onChange={(e) => handleInputChange("contactPosition", e.target.value)}
                    className={errors.contactPosition ? "border-red-500" : ""}
                  />
                  {errors.contactPosition && (
                    <p className="text-sm text-red-500">{errors.contactPosition}</p>
                  )}
                </div>
              </div>

              {/* Contact Email */}
              <div className="space-y-2">
                <label htmlFor="contactEmail" className="text-sm font-medium text-gray-700">
                  Correo electrónico corporativo
                </label>
                <div className="relative">
                  <HugeiconsIcon
                    icon={Mail01Icon}
                    size={16}
                    strokeWidth={1.5}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="contacto@tuorganizacion.com"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                    className={`pl-10 ${errors.contactEmail ? "border-red-500" : ""}`}
                    required
                    autoComplete="email"
                  />
                </div>
                {errors.contactEmail && (
                  <p className="text-sm text-red-500">{errors.contactEmail}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Password */}
                <div className="space-y-2">
                  <label htmlFor="contactPassword" className="text-sm font-medium text-gray-700">
                    Contraseña
                  </label>
                  <div className="relative">
                    <HugeiconsIcon
                      icon={SquareLock02Icon}
                      size={16}
                      strokeWidth={1.5}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <Input
                      id="contactPassword"
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.contactPassword}
                      onChange={(e) => handleInputChange("contactPassword", e.target.value)}
                      className={`pl-10 pr-10 ${errors.contactPassword ? "border-red-500" : ""}`}
                      required
                    />
                    <button
                      type="button"
                      aria-label={isPasswordVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
                      aria-pressed={isPasswordVisible}
                      onClick={() => setIsPasswordVisible((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-0 rounded"
                    >
                      <HugeiconsIcon
                        icon={isPasswordVisible ? ViewOffSlashIcon : ViewIcon}
                        size={18}
                        strokeWidth={1.75}
                      />
                    </button>
                  </div>
                  {errors.contactPassword && (
                    <p className="text-sm text-red-500">{errors.contactPassword}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirmar contraseña
                  </label>
                  <div className="relative">
                    <HugeiconsIcon
                      icon={SquareLock02Icon}
                      size={16}
                      strokeWidth={1.5}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <Input
                      id="confirmPassword"
                      type={isConfirmVisible ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className={`pl-10 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                      required
                    />
                    <button
                      type="button"
                      aria-label={isConfirmVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
                      aria-pressed={isConfirmVisible}
                      onClick={() => setIsConfirmVisible((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-0 rounded"
                    >
                      <HugeiconsIcon
                        icon={isConfirmVisible ? ViewOffSlashIcon : ViewIcon}
                        size={18}
                        strokeWidth={1.75}
                      />
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Información de la Organización */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 pb-2">
                Información de la Organización
              </h3>

              {/* Organization Name */}
              <div className="space-y-2">
                <label htmlFor="organizationName" className="text-sm font-medium text-gray-700">
                  Nombre de la organización
                </label>
                <div className="relative">
                  <HugeiconsIcon
                    icon={Building06Icon}
                    size={16}
                    strokeWidth={1.5}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <Input
                    id="organizationName"
                    type="text"
                    placeholder="Nombre oficial de la organización"
                    value={formData.organizationName}
                    onChange={(e) => handleInputChange("organizationName", e.target.value)}
                    className={`pl-10 ${errors.organizationName ? "border-red-500" : ""}`}
                    required
                  />
                </div>
                {errors.organizationName && (
                  <p className="text-sm text-red-500">{errors.organizationName}</p>
                )}
              </div>

              {/* Website */}
              <div className="space-y-2">
                <label htmlFor="organizationWebsite" className="text-sm font-medium text-gray-700">
                  Sitio web
                </label>
                <div className="relative">
                  <HugeiconsIcon
                    icon={Globe02Icon}
                    size={16}
                    strokeWidth={1.5}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <Input
                    id="organizationWebsite"
                    type="url"
                    placeholder="https://tuorganizacion.com"
                    value={formData.organizationWebsite}
                    onChange={(e) => handleInputChange("organizationWebsite", e.target.value)}
                    className={`pl-10 ${errors.organizationWebsite ? "border-red-500" : ""}`}
                    required
                  />
                </div>
                {errors.organizationWebsite && (
                  <p className="text-sm text-red-500">{errors.organizationWebsite}</p>
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
                  <span className="text-sm text-gray-700">
                    En nombre de la organización, acepto los{" "}
                    <button
                      type="button"
                      className="text-purple-600 hover:text-purple-800 hover:underline"
                    >
                      términos y condiciones empresariales
                    </button>{" "}
                    y la{" "}
                    <button
                      type="button"
                      className="text-purple-600 hover:text-purple-800 hover:underline"
                    >
                      política de privacidad
                    </button>
                  </span>
                }
              />
              {errors.terms && <p className="text-sm text-red-500">{errors.terms}</p>}
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="text-sm text-red-500 text-center p-3 bg-red-50 rounded-md">
                {errors.general}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-purple-600 text-white hover:bg-purple-700 h-11"
              disabled={isLoading}
            >
              {isLoading ? "Registrando organización..." : "Registrar Organización"}
            </Button>
          </form>

          {/* Navigation Links */}
          <div className="mt-6 space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                ¿Tu organización ya está registrada?{" "}
                <Link
                  href="/login/organization"
                  className="text-purple-600 hover:text-purple-800 hover:underline font-medium"
                >
                  Acceder al portal
                </Link>
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                ¿Eres usuario individual?{" "}
                <Link
                  href="/register/user"
                  className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                >
                  Crear cuenta de usuario
                </Link>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
