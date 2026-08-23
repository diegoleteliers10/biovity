"use client"

/* eslint-disable react-doctor/prefer-useReducer -- refactoring to reducer is a large change (6+ useState calls) */
/* eslint-disable react-doctor/no-giant-component -- refactoring 460-line component is a large change */
/* eslint-disable react-doctor/nextjs-missing-metadata -- metadata is in parent layout for client page */
/* eslint-disable react-doctor/async-parallel -- sequential awaits are dependent (linkUser depends on userId from signup) */

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
import { useEffect, useState, useTransition } from "react"
import { toast } from "sonner"
import { CheckYourEmail } from "@/components/auth/CheckYourEmail"
import {
  authButtonClass,
  authInputClass,
  authLabelClass,
  authLinkClass,
  authOrgLinkClass,
  authSectionTitleClass,
  authSubtitleClass,
  authTitleClass,
} from "@/components/auth/form-styles"
import { SessionRefresher } from "@/components/auth/SessionRefresher"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { useCreateOrganizationMutation } from "@/lib/api/use-organization-mutations"
import { cn } from "@/lib/utils"
import {
  organizationRegistrationSchema,
  organizationStepOneSchema,
  organizationStepTwoSchema,
  validateForm as validateFormZod,
} from "@/lib/validations"

export default function OrganizationRegisterPage() {
  const [step, setStep] = useState(1)
  const [isPending, startTransition] = useTransition()
  const createOrganizationMutation = useCreateOrganizationMutation()

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
  const [formData, setFormData] = useState({
    contactName: "",
    contactEmail: "",
    contactPassword: "",
    confirmPassword: "",
    contactPosition: "",
    organizationName: "",
    organizationWebsite: "",
  })
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmVisible, setIsConfirmVisible] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateStep = (currentStep: number) => {
    const schema = currentStep === 1 ? organizationStepOneSchema : organizationStepTwoSchema

    const data =
      currentStep === 1
        ? {
            contactName: formData.contactName,
            contactEmail: formData.contactEmail,
            contactPassword: formData.contactPassword,
            confirmPassword: formData.confirmPassword,
            contactPosition: formData.contactPosition,
          }
        : {
            organizationName: formData.organizationName,
            organizationWebsite: formData.organizationWebsite,
            acceptTerms,
          }

    const result = validateFormZod(schema, data)
    if (!result.success) {
      setErrors({
        ...result.errors,
        general:
          currentStep === 1
            ? "Debes completar todos los campos para continuar"
            : "Debes completar todos los campos y aceptar los términos",
      })
      return false
    }

    if (currentStep === 1 && formData.contactPassword !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Las contraseñas no coinciden" })
      return false
    }

    setErrors({})
    return true
  }

  const handleContinue = () => {
    if (validateStep(1)) {
      setStep(2)
    }
  }

  const handleBack = () => {
    setStep(1)
    setErrors({})
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    const fullValidation = validateFormZod(organizationRegistrationSchema, {
      ...formData,
      acceptTerms,
    })

    if (!fullValidation.success) {
      setErrors(fullValidation.errors)
      return
    }

    if (formData.contactPassword !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Las contraseñas no coinciden" })
      return
    }

    startTransition(async () => {
      setErrors({})

      try {
        const response = await fetch("/api/register/organization", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.contactEmail,
            password: formData.contactPassword,
            name: formData.contactName,
            organizationName: formData.organizationName,
            organizationWebsite: formData.organizationWebsite,
            contactPosition: formData.contactPosition,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          setErrors({
            general: data.error || "Error al crear la cuenta. Inténtalo de nuevo.",
          })
          return
        }

        setRegisteredEmail(formData.contactEmail)
      } catch (_err) {
        setErrors({
          general: "Error al crear la cuenta. Inténtalo de nuevo.",
        })
      }
    })
  }

  return (
    <>
      <SessionRefresher />
      <div className="flex h-dvh bg-surface-container-lowest overflow-hidden">
        {/* Left: Illustration */}
        <div className="relative hidden w-1/2 p-4 lg:p-6 lg:block">
          <div className="relative w-full h-full rounded-2xl overflow-hidden border border-border bg-surface-container-low">
            <Image
              src="/Register.png"
              alt="Biovity - Registro de organización"
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
            {registeredEmail ? (
              <CheckYourEmail
                email={registeredEmail}
                loginHref="/login/organization"
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
                  <h1 className={authTitleClass}>Registrar Organización</h1>
                  <p className={authSubtitleClass}>
                    Únete a la red de empresas y centros de investigación en biociencias
                  </p>
                </div>

                {/* Steps Indicator */}
                <div className="flex items-center justify-center gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "flex size-6 items-center justify-center rounded-full text-xs font-mono font-medium",
                        step === 1
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-secondary/20 text-secondary"
                      )}
                    >
                      1
                    </span>
                    <span
                      className={cn(
                        "text-xs font-medium",
                        step === 1 ? "text-foreground font-semibold" : "text-muted-foreground"
                      )}
                    >
                      Contacto
                    </span>
                  </div>
                  <div className={cn("h-px w-10", step === 2 ? "bg-secondary" : "bg-border")} />
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "flex size-6 items-center justify-center rounded-full text-xs font-mono font-medium",
                        step === 2
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-surface-container-highest text-muted-foreground"
                      )}
                    >
                      2
                    </span>
                    <span
                      className={cn(
                        "text-xs font-medium",
                        step === 2 ? "text-foreground font-semibold" : "text-muted-foreground"
                      )}
                    >
                      Organización
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSignUp} className="space-y-6">
                  {step === 1 && (
                    <div className="space-y-4">
                      <h3 className={cn("pb-1", authSectionTitleClass)}>
                        Información del Contacto Principal
                      </h3>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                          <label htmlFor="contactName" className={authLabelClass}>
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
                              id="contactName"
                              type="text"
                              placeholder="Nombre del representante"
                              value={formData.contactName}
                              onChange={(e) => handleInputChange("contactName", e.target.value)}
                              className={cn(
                                authInputClass,
                                "pl-10",
                                errors.contactName && "border-destructive"
                              )}
                              required
                            />
                          </div>
                          {errors.contactName && (
                            <p className="text-xs text-destructive mt-1">{errors.contactName}</p>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="contactPosition" className={authLabelClass}>
                            Cargo / Posición
                          </label>
                          <Input
                            id="contactPosition"
                            type="text"
                            placeholder="Director, Reclutador, etc."
                            value={formData.contactPosition}
                            onChange={(e) => handleInputChange("contactPosition", e.target.value)}
                            className={cn(
                              authInputClass,
                              errors.contactPosition && "border-destructive"
                            )}
                          />
                          {errors.contactPosition && (
                            <p className="text-xs text-destructive mt-1">
                              {errors.contactPosition}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="contactEmail" className={authLabelClass}>
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
                            id="contactEmail"
                            type="email"
                            placeholder="contacto@tuorganizacion.com"
                            value={formData.contactEmail}
                            onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                            className={cn(
                              authInputClass,
                              "pl-10",
                              errors.contactEmail && "border-destructive"
                            )}
                            required
                            autoComplete="email"
                          />
                        </div>
                        {errors.contactEmail && (
                          <p className="text-xs text-destructive mt-1">{errors.contactEmail}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                          <label htmlFor="contactPassword" className={authLabelClass}>
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
                              id="contactPassword"
                              type={isPasswordVisible ? "text" : "password"}
                              placeholder="••••••••"
                              value={formData.contactPassword}
                              onChange={(e) => handleInputChange("contactPassword", e.target.value)}
                              className={cn(
                                authInputClass,
                                "pl-10 pr-10",
                                errors.contactPassword && "border-destructive"
                              )}
                              required
                            />
                            <button
                              type="button"
                              aria-label={
                                isPasswordVisible ? "Ocultar contraseña" : "Mostrar contraseña"
                              }
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
                          {errors.contactPassword && (
                            <p className="text-xs text-destructive mt-1">
                              {errors.contactPassword}
                            </p>
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
                              type={isConfirmVisible ? "text" : "password"}
                              placeholder="••••••••"
                              value={formData.confirmPassword}
                              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                              className={cn(
                                authInputClass,
                                "pl-10 pr-10",
                                errors.confirmPassword && "border-destructive"
                              )}
                              required
                            />
                            <button
                              type="button"
                              aria-label={
                                isConfirmVisible ? "Ocultar contraseña" : "Mostrar contraseña"
                              }
                              aria-pressed={isConfirmVisible}
                              onClick={() => setIsConfirmVisible((v) => !v)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground focus:outline-none"
                            >
                              <HugeiconsIcon
                                icon={isConfirmVisible ? ViewOffSlashIcon : ViewIcon}
                                size={16}
                                strokeWidth={1.75}
                              />
                            </button>
                          </div>
                          {errors.confirmPassword && (
                            <p className="text-xs text-destructive mt-1">
                              {errors.confirmPassword}
                            </p>
                          )}
                        </div>
                      </div>

                      {errors.general && (
                        <div
                          role="alert"
                          className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-xs text-destructive text-center"
                        >
                          {errors.general}
                        </div>
                      )}

                      <Button
                        type="button"
                        className={cn(authButtonClass, "w-full")}
                        onClick={handleContinue}
                      >
                        Continuar
                      </Button>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4">
                      <h3 className={cn("pb-1", authSectionTitleClass)}>
                        Información de la Organización
                      </h3>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                          <label htmlFor="organizationName" className={authLabelClass}>
                            Nombre de la organización
                          </label>
                          <div className="relative">
                            <HugeiconsIcon
                              icon={Building06Icon}
                              size={16}
                              strokeWidth={1.5}
                              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                            />
                            <Input
                              id="organizationName"
                              type="text"
                              placeholder="Nombre oficial o razón social"
                              value={formData.organizationName}
                              onChange={(e) =>
                                handleInputChange("organizationName", e.target.value)
                              }
                              className={cn(
                                authInputClass,
                                "pl-10",
                                errors.organizationName && "border-destructive"
                              )}
                              required
                            />
                          </div>
                          {errors.organizationName && (
                            <p className="text-xs text-destructive mt-1">
                              {errors.organizationName}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="organizationWebsite" className={authLabelClass}>
                            Sitio web
                          </label>
                          <div className="relative">
                            <HugeiconsIcon
                              icon={Globe02Icon}
                              size={16}
                              strokeWidth={1.5}
                              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                            />
                            <Input
                              id="organizationWebsite"
                              type="url"
                              placeholder="https://tuorganizacion.com"
                              value={formData.organizationWebsite}
                              onChange={(e) =>
                                handleInputChange("organizationWebsite", e.target.value)
                              }
                              className={cn(
                                authInputClass,
                                "pl-10",
                                errors.organizationWebsite && "border-destructive"
                              )}
                              required
                            />
                          </div>
                          {errors.organizationWebsite && (
                            <p className="text-xs text-destructive mt-1">
                              {errors.organizationWebsite}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="pt-2">
                        <label className="flex items-start gap-2 text-xs cursor-pointer select-none">
                          <Checkbox
                            id="terms"
                            checked={acceptTerms}
                            onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                            className="mt-0.5"
                          />
                          <span className="text-xs text-muted-foreground leading-relaxed">
                            En nombre de la organización, acepto los{" "}
                            <Link href="/terminos" target="_blank" className={authLinkClass}>
                              términos y condiciones
                            </Link>{" "}
                            y la{" "}
                            <Link href="/privacidad" target="_blank" className={authLinkClass}>
                              política de privacidad
                            </Link>
                          </span>
                        </label>
                        {errors.acceptTerms && (
                          <p className="text-xs text-destructive mt-1">{errors.acceptTerms}</p>
                        )}
                      </div>

                      {errors.general && (
                        <div
                          role="alert"
                          className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-xs text-destructive text-center"
                        >
                          {errors.general}
                        </div>
                      )}

                      <div className="flex gap-3 pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="h-11 px-4 rounded-lg bg-surface-container-lowest border-border/40 text-foreground hover:bg-surface-container-low text-sm font-medium"
                          onClick={handleBack}
                          disabled={isPending || createOrganizationMutation.isPending}
                        >
                          <HugeiconsIcon
                            icon={ArrowLeft01Icon}
                            size={16}
                            strokeWidth={1.5}
                            className="mr-1"
                          />
                          Volver
                        </Button>
                        <Button
                          type="submit"
                          className={cn(authButtonClass, "flex-1")}
                          disabled={isPending || createOrganizationMutation.isPending}
                        >
                          {isPending || createOrganizationMutation.isPending
                            ? "Registrando organización..."
                            : "Registrar Organización"}
                        </Button>
                      </div>
                    </div>
                  )}
                </form>

                <div className="space-y-3.5 border-t border-border pt-6 text-center text-xs sm:text-sm">
                  <div>
                    <p className="text-muted-foreground">
                      ¿Tu organización ya está registrada?{" "}
                      <Link href="/login/organization" className={authOrgLinkClass}>
                        Acceder al portal
                      </Link>
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">
                      ¿Eres usuario individual?{" "}
                      <Link href="/register/professional" className={authLinkClass}>
                        Crear cuenta de usuario
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
    </>
  )
}
