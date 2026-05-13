"use client"

/* eslint-disable react-doctor/no-giant-component -- large component, intentional */
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
import { useReducer } from "react"
import { Select } from "@/components/base/select/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/ui/logo"
import { createResume } from "@/lib/api/resumes"
import { authClient } from "@/lib/auth-client"
import { userRegistrationSchema, validateForm as validateFormZod } from "@/lib/validations"

type RegisterFormState = {
  name: string
  email: string
  password: string
  confirmPassword: string
  profession: string
  acceptTerms: boolean
  isLoading: boolean
  isPasswordVisible: boolean
  isConfirmVisible: boolean
  errors: Record<string, string>
}

type RegisterFormAction =
  | {
      type: "SET_FIELD"
      field: keyof RegisterFormState
      value: RegisterFormState[keyof RegisterFormState]
    }
  | { type: "CLEAR_ERROR"; field: string }
  | { type: "SET_GENERAL_ERROR"; error: string }
  | { type: "CLEAR_GENERAL_ERROR" }
  | { type: "RESET" }

const registerFormReducer = (
  state: RegisterFormState,
  action: RegisterFormAction
): RegisterFormState => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value }
    case "CLEAR_ERROR":
      return { ...state, errors: { ...state.errors, [action.field]: "" } }
    case "SET_GENERAL_ERROR":
      return { ...state, errors: { ...state.errors, general: action.error } }
    case "CLEAR_GENERAL_ERROR":
      return { ...state, errors: { ...state.errors, general: "" } }
    case "RESET":
      return {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        profession: "",
        acceptTerms: false,
        isLoading: false,
        isPasswordVisible: false,
        isConfirmVisible: false,
        errors: {},
      }
    default:
      return state
  }
}

const initialRegisterFormState: RegisterFormState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  profession: "",
  acceptTerms: false,
  isLoading: false,
  isPasswordVisible: false,
  isConfirmVisible: false,
  errors: {},
}

const professions = [
  { label: "Biotecnólogo/a", id: "biotecnologo" },
  { label: "Bioinformático/a", id: "bioinformatico" },
  { label: "Investigador/a", id: "investigador" },
  { label: "Analista de Laboratorio", id: "analista-lab" },
  { label: "Ingeniero/a Biomédico/a", id: "ing-biomedico" },
  { label: "Microbiólogo/a", id: "microbiologo" },
  { label: "Genetista", id: "genetista" },
  { label: "Bioquímico/a", id: "bioquimico" },
  { label: "Especialista en Calidad", id: "calidad" },
  { label: "Técnico/a de Laboratorio", id: "tecnico-lab" },
  { label: "Gerente de Proyectos", id: "gerente-proyectos" },
  { label: "Científico/a de Datos", id: "cientifico-datos" },
  { label: "Especialista Regulatorio/a", id: "regulatorio" },
  { label: "Bioestadístico/a", id: "bioestadistico" },
  { label: "Consultor/a", id: "consultor" },
  { label: "Docente/Profesor", id: "docente" },
  { label: "Estudiante", id: "estudiante" },
  { label: "Otro/a", id: "otro" },
]

export function UserRegisterContent() {
  const { replace } = useRouter()

  const [formState, dispatch] = useReducer(registerFormReducer, initialRegisterFormState)

  const handleInputChange = (field: string, value: string) => {
    dispatch({ type: "SET_FIELD", field: field as keyof RegisterFormState, value })
    if (formState.errors[field]) {
      dispatch({ type: "CLEAR_ERROR", field })
    }
  }

  const handleProfessionChange = (value: string | number | null) => {
    handleInputChange("profession", value ? String(value) : "")
  }

  const validateForm = () => {
    const result = validateFormZod(userRegistrationSchema, {
      name: formState.name,
      email: formState.email,
      password: formState.password,
      confirmPassword: formState.confirmPassword,
      profession: formState.profession,
      acceptTerms: formState.acceptTerms,
    })

    if (!result.success) {
      dispatch({ type: "SET_FIELD", field: "errors", value: result.errors })
      return false
    }

    return true
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    dispatch({ type: "SET_FIELD", field: "isLoading", value: true })
    dispatch({ type: "CLEAR_GENERAL_ERROR" })

    try {
      const response = await fetch("/api/register/professional", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formState.email,
          password: formState.password,
          name: formState.name,
          profession: formState.profession,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        dispatch({
          type: "SET_FIELD",
          field: "errors",
          value: { general: data.error || "Error al crear la cuenta. Intentalo de nuevo." },
        })
        dispatch({ type: "SET_FIELD", field: "isLoading", value: false })
        return
      }

      // Create resume for the new user
      if (data.user?.id) {
        await createResume({ userId: data.user.id })
      }

      // Refresh session
      await authClient.getSession()
      authClient.$store.notify("$sessionSignal")
      replace("/dashboard")
    } catch {
      dispatch({
        type: "SET_FIELD",
        field: "errors",
        value: { general: "Error al crear la cuenta. Intentalo de nuevo." },
      })
      dispatch({ type: "SET_FIELD", field: "isLoading", value: false })
    }
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
            <h1 className="text-center text-2xl font-semibold tracking-tight text-foreground">
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
                  value={formState.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`pl-10 ${formState.errors.name ? "border-destructive" : ""}`}
                  required
                  autoComplete="name"
                />
              </div>
              {formState.errors.name && (
                <p className="text-sm text-destructive">{formState.errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="profession" className="text-sm font-medium text-foreground">
                Profesión o Cargo
              </label>
              <Select.ComboBox
                isRequired
                placeholder="Buscar tu profesión..."
                items={professions}
                selectedKey={formState.profession}
                onSelectionChange={handleProfessionChange}
                className="w-full"
              >
                {(item) => (
                  <Select.Item id={item.id} supportingText={item.supportingText}>
                    {item.label}
                  </Select.Item>
                )}
              </Select.ComboBox>
              {formState.errors.profession && (
                <p className="text-sm text-destructive">{formState.errors.profession}</p>
              )}
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
                  value={formState.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`pl-10 ${formState.errors.email ? "border-destructive" : ""}`}
                  required
                  autoComplete="email"
                />
              </div>
              {formState.errors.email && (
                <p className="text-sm text-destructive">{formState.errors.email}</p>
              )}
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
                    type={formState.isPasswordVisible ? "text" : "password"}
                    placeholder="••••••••"
                    value={formState.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`pl-10 pr-10 ${formState.errors.password ? "border-destructive" : ""}`}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    aria-label={
                      formState.isPasswordVisible ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                    aria-pressed={formState.isPasswordVisible}
                    onClick={() =>
                      dispatch({
                        type: "SET_FIELD",
                        field: "isPasswordVisible",
                        value: !formState.isPasswordVisible,
                      })
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-0"
                  >
                    <HugeiconsIcon
                      icon={formState.isPasswordVisible ? ViewOffSlashIcon : ViewIcon}
                      size={18}
                      strokeWidth={1.75}
                    />
                  </button>
                </div>
                {formState.errors.password && (
                  <p className="text-sm text-destructive">{formState.errors.password}</p>
                )}
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
                    type={formState.isConfirmVisible ? "text" : "password"}
                    placeholder="••••••••"
                    value={formState.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className={`pl-10 pr-10 ${formState.errors.confirmPassword ? "border-destructive" : ""}`}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    aria-label={
                      formState.isConfirmVisible ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                    aria-pressed={formState.isConfirmVisible}
                    onClick={() =>
                      dispatch({
                        type: "SET_FIELD",
                        field: "isConfirmVisible",
                        value: !formState.isConfirmVisible,
                      })
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-0"
                  >
                    <HugeiconsIcon
                      icon={formState.isConfirmVisible ? ViewOffSlashIcon : ViewIcon}
                      size={18}
                      strokeWidth={1.75}
                    />
                  </button>
                </div>
                {formState.errors.confirmPassword && (
                  <p className="text-sm text-destructive">{formState.errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Checkbox
                id="terms"
                name="terms"
                checked={formState.acceptTerms}
                onChange={(e) =>
                  dispatch({ type: "SET_FIELD", field: "acceptTerms", value: e.target.checked })
                }
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
              {formState.errors.acceptTerms && (
                <p className="text-sm text-destructive">{formState.errors.acceptTerms}</p>
              )}
            </div>

            {formState.errors.general && (
              <div className="rounded-md bg-destructive/10 p-3 text-center text-sm text-destructive">
                {formState.errors.general}
              </div>
            )}

            <Button type="submit" className="h-11 w-full" disabled={formState.isLoading}>
              {formState.isLoading ? "Creando cuenta..." : "Crear cuenta de usuario"}
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
