"use client"

import {
  Mail01Icon,
  SquareLock02Icon,
  UserIcon,
  ViewIcon,
  ViewOffSlashIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Select } from "@/components/base/select/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/ui/logo"
import { authClient } from "@/lib/auth-client"
import { userRegistrationSchema, validateForm as validateFormZod } from "@/lib/validations"

const { signUp } = authClient

export function UserRegisterContent() {
  const router = useRouter()
  const { useSession } = authClient
  const { data: session, isPending } = useSession()

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

  // Lista de profesiones/cargos
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

  // Redirigir si ya hay sesión activa
  useEffect(() => {
    if (!isPending && session?.user) {
      if (session.user.type === "persona") {
        router.push("/dashboard/employee")
      } else if (session.user.type === "organización") {
        router.push("/dashboard/organization")
      }
    }
  }, [session, isPending, router])

  // Mostrar loading mientras se verifica la sesión
  if (isPending) {
    return (
      <div className="min-h-dvh bg-gradient-to-r from-green-100 to-blue-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-sm text-gray-600">Verificando sesión...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Si hay sesión, no mostrar nada (se está redirigiendo)
  if (session?.user) {
    return null
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
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

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    const result = await signUp.email({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      type: "persona",
      profession: formData.profession,
      avatar: "",
    })

    if (result.error) {
      setErrors({
        general: "Error al crear la cuenta. Inténtalo de nuevo.",
      })
    } else {
      router.push("/dashboard/employee")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-dvh bg-gradient-to-r from-green-100 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center space-y-4">
          {/* Logo */}
          <div className="mx-auto">
            <Logo size="lg" />
          </div>

          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold text-gray-800">
              <h2>Crear cuenta de usuario</h2>
            </CardTitle>
            <CardDescription className="text-gray-600">
              Únete a la comunidad de profesionales en biociencias
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
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
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Tu nombre completo"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`pl-10 ${errors.name ? "border-red-500" : ""}`}
                  required
                  autoComplete="name"
                />
              </div>
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Profession Field */}
            <div className="space-y-2">
              <label htmlFor="profession" className="text-sm font-medium text-gray-700">
                Profesión o Cargo
              </label>
              <div className="relative">
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
              </div>
              {errors.profession && <p className="text-sm text-red-500">{errors.profession}</p>}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <div className="relative">
                <HugeiconsIcon
                  icon={Mail01Icon}
                  size={16}
                  strokeWidth={1.5}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                  required
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
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
                  id="password"
                  name="password"
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                  required
                  autoComplete="new-password"
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
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>

            {/* Confirm Password Field */}
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
                  name="confirmPassword"
                  type={isConfirmVisible ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className={`pl-10 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                  required
                  autoComplete="new-password"
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

            {/* Terms and Conditions */}
            <div className="space-y-2">
              <Checkbox
                id="terms"
                name="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                label={
                  <span className="text-sm text-gray-700">
                    Acepto los{" "}
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      términos y condiciones
                    </button>{" "}
                    y la{" "}
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-800 hover:underline"
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
              <div className="text-sm text-red-500 text-center">{errors.general}</div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-gray-800 h-11"
              disabled={isLoading}
            >
              {isLoading ? "Creando cuenta..." : "Crear cuenta de usuario"}
            </Button>
          </form>

          {/* Navigation Links */}
          <div className="mt-6 space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes una cuenta?{" "}
                <Link
                  href="/login/user"
                  className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                ¿Representas una organización?{" "}
                <Link
                  href="/register/organization"
                  className="text-purple-600 hover:text-purple-800 hover:underline font-medium"
                >
                  Registrar organización
                </Link>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
