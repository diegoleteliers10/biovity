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
import { useReducer } from "react"
import {
  authButtonClass,
  authInputClass,
  authLabelClass,
  authSubtitleClass,
  authTitleClass,
} from "@/components/auth/form-styles"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

type LoginState = {
  formData: { email: string; password: string }
  rememberMe: boolean
  isLoading: boolean
  errors: Record<string, string>
  isPasswordVisible: boolean
}

type LoginAction =
  | { type: "SET_FORM_FIELD"; field: "email" | "password"; value: string }
  | { type: "SET_REMEMBER_ME"; value: boolean }
  | { type: "SET_LOADING"; value: boolean }
  | { type: "SET_ERRORS"; errors: Record<string, string> }
  | { type: "CLEAR_ERROR"; field: string }
  | { type: "TOGGLE_PASSWORD_VISIBILITY" }
  | { type: "RESET" }

const loginReducer = (state: LoginState, action: LoginAction): LoginState => {
  switch (action.type) {
    case "SET_FORM_FIELD":
      return {
        ...state,
        formData: { ...state.formData, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: "" },
      }
    case "SET_REMEMBER_ME":
      return { ...state, rememberMe: action.value }
    case "SET_LOADING":
      return { ...state, isLoading: action.value }
    case "SET_ERRORS":
      return { ...state, errors: action.errors }
    case "CLEAR_ERROR":
      return { ...state, errors: { ...state.errors, [action.field]: "" } }
    case "TOGGLE_PASSWORD_VISIBILITY":
      return { ...state, isPasswordVisible: !state.isPasswordVisible }
    case "RESET":
      return {
        formData: { email: "", password: "" },
        rememberMe: true,
        isLoading: false,
        errors: {},
        isPasswordVisible: false,
      }
  }
}

const initialLoginState: LoginState = {
  formData: { email: "", password: "" },
  rememberMe: true,
  isLoading: false,
  errors: {},
  isPasswordVisible: false,
}

const { signIn } = authClient

export function AdminLoginContent() {
  const [state, dispatch] = useReducer(loginReducer, initialLoginState)

  const handleInputChange = (field: "email" | "password", value: string) => {
    dispatch({ type: "SET_FORM_FIELD", field, value })
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch({ type: "SET_LOADING", value: true })
    dispatch({ type: "SET_ERRORS", errors: {} })

    const result = await signIn.email({
      email: state.formData.email,
      password: state.formData.password,
      rememberMe: state.rememberMe,
      callbackURL: "/dashboard",
    })

    if (result?.error) {
      const msg =
        (result.error as { message?: string })?.message ??
        "Credenciales inválidas. Verifica tu email y contraseña."
      dispatch({ type: "SET_ERRORS", errors: { general: msg } })
      dispatch({ type: "SET_LOADING", value: false })
      return
    }

    authClient.$store.notify("$sessionSignal")
    window.location.href = "/dashboard"
  }

  return (
    <div className="flex h-dvh bg-surface-container-lowest overflow-hidden">
      <div className="relative hidden w-1/2 p-4 lg:p-6 lg:block">
        <div className="relative w-full h-full rounded-2xl overflow-hidden border border-border bg-surface-container-low">
          <Image
            src="/images/ilustrationOG.png"
            alt="Biovity - Panel de Administración"
            fill
            className="object-cover object-center"
            priority
            sizes="50vw"
          />
        </div>
      </div>

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
            <h1 className={authTitleClass}>Panel de Administración</h1>
            <p className={authSubtitleClass}>
              Acceso exclusivo para administradores del sistema
            </p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
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
                  type="email"
                  placeholder="admin@biovity.cl"
                  value={state.formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={cn(
                    authInputClass,
                    "pl-10",
                    state.errors.email && "border-destructive"
                  )}
                  required
                  autoComplete="email"
                />
              </div>
              {state.errors.email && (
                <p className="text-xs text-destructive mt-1">{state.errors.email}</p>
              )}
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
                  type={state.isPasswordVisible ? "text" : "password"}
                  placeholder="••••••••"
                  value={state.formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={cn(
                    authInputClass,
                    "pl-10 pr-10",
                    state.errors.password && "border-destructive"
                  )}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  aria-label={state.isPasswordVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
                  aria-pressed={state.isPasswordVisible}
                  onClick={() => dispatch({ type: "TOGGLE_PASSWORD_VISIBILITY" })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground focus:outline-none"
                >
                  <HugeiconsIcon
                    icon={state.isPasswordVisible ? ViewOffSlashIcon : ViewIcon}
                    size={16}
                    strokeWidth={1.75}
                  />
                </button>
              </div>
              {state.errors.password && (
                <p className="text-xs text-destructive mt-1">{state.errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <label htmlFor="remember" className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground cursor-pointer select-none">
                <Checkbox
                  id="remember"
                  checked={state.rememberMe}
                  onCheckedChange={(checked) =>
                    dispatch({ type: "SET_REMEMBER_ME", value: checked === true })
                  }
                />
                Recordarme
              </label>
            </div>

            {state.errors.general && (
              <div role="alert" className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-xs text-destructive text-center">
                {state.errors.general}
              </div>
            )}

            <Button
              type="submit"
              className={cn(authButtonClass, "w-full")}
              disabled={state.isLoading}
            >
              {state.isLoading ? "Accediendo..." : "Acceder al panel"}
            </Button>
          </form>

          <div className="border-t border-border pt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={14} strokeWidth={1.5} />
              Volver a selección de acceso
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
