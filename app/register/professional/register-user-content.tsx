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
import { useEffect, useReducer } from "react"
import { toast } from "sonner"
import { CheckYourEmail } from "@/components/auth/CheckYourEmail"
import {
  authButtonClass,
  authInputClass,
  authLabelClass,
  authLinkClass,
  authOrgLinkClass,
  authSubtitleClass,
  authTitleClass,
} from "@/components/auth/form-styles"
import { Select } from "@/components/base/select/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { createResume } from "@/lib/api/resumes"
import { cn } from "@/lib/utils"
import { userRegistrationSchema, validateForm as validateFormZod } from "@/lib/validations"

type RegisterFormState = {
  name: string
  email: string
  password: string
  confirmPassword: string
  profession: string
  acceptTerms: boolean
  isRegistered: boolean
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
  | { type: "REGISTER_SUCCESS" }
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
    case "REGISTER_SUCCESS":
      return { ...state, isRegistered: true, isLoading: false }
    case "RESET":
      return {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        profession: "",
        acceptTerms: false,
        isRegistered: false,
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
  isRegistered: false,
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
  const [formState, dispatch] = useReducer(registerFormReducer, initialRegisterFormState)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      if (params.get("verified") === "true") {
        toast.success("Se ha verificado correctamente tu cuenta")
        const newUrl = window.location.pathname
        window.history.replaceState({}, "", newUrl)
      }
    }
  }, [])

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
          value: { general: data.error || "Error al crear la cuenta. Inténtalo de nuevo." },
        })
        dispatch({ type: "SET_FIELD", field: "isLoading", value: false })
        return
      }

      // Create resume for the new user
      if (data.user?.id) {
        await createResume({ userId: data.user.id })
      }

      dispatch({ type: "REGISTER_SUCCESS" })
    } catch {
      dispatch({
        type: "SET_FIELD",
        field: "errors",
        value: { general: "Error al crear la cuenta. Inténtalo de nuevo." },
      })
      dispatch({ type: "SET_FIELD", field: "isLoading", value: false })
    }
  }

  return (
    <div className="flex h-dvh bg-surface-container-lowest overflow-hidden">
      {/* Left: Illustration */}
      <div className="relative hidden w-1/2 p-4 lg:p-6 lg:block">
        <div className="relative w-full h-full rounded-2xl overflow-hidden border border-border bg-surface-container-low">
          <Image
            src="/Register.png"
            alt="Biovity - Creación de cuenta"
            fill
            className="object-cover object-center"
            priority
            sizes="50vw"
          />
        </div>
      </div>

      {/* Right: Registration form */}
      <div className="flex min-h-0 w-full flex-col overflow-y-auto bg-surface-container-lowest lg:w-1/2">
        <div className="m-auto w-full max-w-2xl space-y-8 p-6 lg:p-12">
          {formState.isRegistered ? (
            <CheckYourEmail
              email={formState.email}
              loginHref="/login/professional"
              description="Te enviamos un correo de verificación a"
            />
          ) : (
            <>
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
                <h1 className={authTitleClass}>Crear cuenta de usuario</h1>
                <p className={authSubtitleClass}>
                  Únete a la comunidad de profesionales en biociencias
                </p>
              </div>

              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className={authLabelClass}>
                    Nombre completo
                  </label>
                  <div className="relative">
                    <HugeiconsIcon
                      icon={UserIcon}
                      size={16}
                      strokeWidth={1.5}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Tu nombre completo"
                      value={formState.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className={cn(
                        authInputClass,
                        "pl-10",
                        formState.errors.name && "border-destructive"
                      )}
                      required
                      autoComplete="name"
                    />
                  </div>
                  {formState.errors.name && (
                    <p className="text-xs text-destructive mt-1">{formState.errors.name}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="profession" className={authLabelClass}>
                    Profesión o Especialidad
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
                    <p className="text-xs text-destructive mt-1">{formState.errors.profession}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className={authLabelClass}>
                    Correo electrónico
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
                      name="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={formState.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={cn(
                        authInputClass,
                        "pl-10",
                        formState.errors.email && "border-destructive"
                      )}
                      required
                      autoComplete="email"
                    />
                  </div>
                  {formState.errors.email && (
                    <p className="text-xs text-destructive mt-1">{formState.errors.email}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                        name="password"
                        type={formState.isPasswordVisible ? "text" : "password"}
                        placeholder="••••••••"
                        value={formState.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className={cn(
                          authInputClass,
                          "pl-10 pr-10",
                          formState.errors.password && "border-destructive"
                        )}
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
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground focus:outline-none"
                      >
                        <HugeiconsIcon
                          icon={formState.isPasswordVisible ? ViewOffSlashIcon : ViewIcon}
                          size={16}
                          strokeWidth={1.75}
                        />
                      </button>
                    </div>
                    {formState.errors.password && (
                      <p className="text-xs text-destructive mt-1">{formState.errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="confirmPassword" className={authLabelClass}>
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
                        id="confirmPassword"
                        name="confirmPassword"
                        type={formState.isConfirmVisible ? "text" : "password"}
                        placeholder="••••••••"
                        value={formState.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className={cn(
                          authInputClass,
                          "pl-10 pr-10",
                          formState.errors.confirmPassword && "border-destructive"
                        )}
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
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground focus:outline-none"
                      >
                        <HugeiconsIcon
                          icon={formState.isConfirmVisible ? ViewOffSlashIcon : ViewIcon}
                          size={16}
                          strokeWidth={1.75}
                        />
                      </button>
                    </div>
                    {formState.errors.confirmPassword && (
                      <p className="text-xs text-destructive mt-1">
                        {formState.errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-2 text-xs cursor-pointer select-none">
                    <Checkbox
                      id="terms"
                      checked={formState.acceptTerms}
                      onCheckedChange={(checked) =>
                        dispatch({
                          type: "SET_FIELD",
                          field: "acceptTerms",
                          value: checked === true,
                        })
                      }
                      className="mt-0.5"
                    />
                    <span className="text-xs text-muted-foreground leading-relaxed">
                      Acepto los{" "}
                      <Link href="/terminos" target="_blank" className={authLinkClass}>
                        términos y condiciones
                      </Link>{" "}
                      y la{" "}
                      <Link href="/privacidad" target="_blank" className={authLinkClass}>
                        política de privacidad
                      </Link>
                    </span>
                  </label>
                  {formState.errors.acceptTerms && (
                    <p className="text-xs text-destructive mt-1">{formState.errors.acceptTerms}</p>
                  )}
                </div>

                {formState.errors.general && (
                  <div
                    role="alert"
                    className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-xs text-destructive text-center"
                  >
                    {formState.errors.general}
                  </div>
                )}

                <Button
                  type="submit"
                  className={cn(authButtonClass, "w-full")}
                  disabled={formState.isLoading}
                >
                  {formState.isLoading ? "Creando cuenta..." : "Crear cuenta de usuario"}
                </Button>
              </form>

              <div className="space-y-3.5 border-t border-border pt-6 text-center text-xs sm:text-sm">
                <div>
                  <p className="text-muted-foreground">
                    ¿Ya tienes una cuenta?{" "}
                    <Link href="/login/professional" className={authLinkClass}>
                      Inicia sesión aquí
                    </Link>
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">
                    ¿Representas una organización?{" "}
                    <Link href="/register/organization" className={authOrgLinkClass}>
                      Registrar organización
                    </Link>
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <HugeiconsIcon icon={ArrowLeft01Icon} size={14} strokeWidth={1.5} />
                    Volver a selección de registro
                  </Link>
                </div>
              </div>

              <p className="text-center text-xs text-muted-foreground">
                ¿Necesitas ayuda?{" "}
                <a href="mailto:support@biovity.com" className={authLinkClass}>
                  Contactar soporte
                </a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
