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
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/ui/logo"
import { authClient } from "@/lib/auth-client"

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
        "Credenciales invalidas. Verifica tu email y contrasena."
      dispatch({ type: "SET_ERRORS", errors: { general: msg } })
      dispatch({ type: "SET_LOADING", value: false })
      return
    }

    authClient.$store.notify("$sessionSignal")
    window.location.href = "/dashboard"
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
            <h1 className="text-center text-2xl font-semibold tracking-tight text-foreground">
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
                  value={state.formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`pl-10 ${state.errors.email ? "border-destructive" : ""}`}
                  required
                  autoComplete="email"
                />
              </div>
              {state.errors.email && (
                <p className="text-sm text-destructive">{state.errors.email}</p>
              )}
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
                  type={state.isPasswordVisible ? "text" : "password"}
                  placeholder="••••••••"
                  value={state.formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={`pl-10 pr-10 ${state.errors.password ? "border-destructive" : ""}`}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  aria-label={state.isPasswordVisible ? "Ocultar contrasena" : "Mostrar contrasena"}
                  aria-pressed={state.isPasswordVisible}
                  onClick={() => dispatch({ type: "TOGGLE_PASSWORD_VISIBILITY" })}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-0"
                >
                  <HugeiconsIcon
                    icon={state.isPasswordVisible ? ViewOffSlashIcon : ViewIcon}
                    size={18}
                    strokeWidth={1.75}
                  />
                </button>
              </div>
              {state.errors.password && (
                <p className="text-sm text-destructive">{state.errors.password}</p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <Checkbox
                id="remember"
                checked={state.rememberMe}
                onChange={(e) => dispatch({ type: "SET_REMEMBER_ME", value: e.target.checked })}
                label="Recordarme"
              />
            </div>
            {state.errors.general && (
              <div className="text-center text-sm text-destructive">{state.errors.general}</div>
            )}
            <Button type="submit" className="h-11 w-full" disabled={state.isLoading}>
              {state.isLoading ? "Cargando..." : "Acceder al panel"}
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

function _isAdminEmail(email: string): boolean {
  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()) ?? []
  return adminEmails.includes(email)
}
