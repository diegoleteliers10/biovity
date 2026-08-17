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
import { Logo } from "@/components/ui/logo"
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
  }

  const validateFullForm = () => {
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

    if (!validateFullForm()) {
      return
    }

    setErrors((prev) => ({ ...prev, general: "" }))

    startTransition(async () => {
      try {
        const response = await fetch("/api/register/organization", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contactName: formData.contactName,
            contactEmail: formData.contactEmail,
            contactPassword: formData.contactPassword,
            contactPosition: formData.contactPosition,
            organizationName: formData.organizationName,
            organizationWebsite: formData.organizationWebsite,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          setErrors({ general: data.error || "Error al registrar. Intentalo de nuevo." })
          return
        }

        setRegisteredEmail(formData.contactEmail)
      } catch (err) {
        setErrors({
          general: err instanceof Error ? err.message : "Error al registrar. Intentalo de nuevo.",
        })
      }
    })
  }

  return (
    <>
      <SessionRefresher />
      <div className="flex h-dvh">
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

        <div className="flex min-h-0 w-full flex-col overflow-y-auto bg-background lg:w-1/2">
          <div className="m-auto w-full max-w-xl space-y-8 p-6 lg:p-12">
            {registeredEmail ? (
              <CheckYourEmail
                email={registeredEmail}
                loginHref="/login/organization"
                description="Te enviamos un correo de verificación a"
              />
            ) : (
              <>
                <div className="space-y-2 text-center">
                  <Logo size="lg" className="justify-center" />
                  <h1 className={`text-center ${authTitleClass}`}>Registrar Organización</h1>
                  <p className={`text-center ${authSubtitleClass}`}>
                    Únete a la red de organizaciones en biociencias
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      1
                    </span>
                    <span
                      className={cn(
                        "text-sm",
                        step === 1 ? "font-medium text-foreground" : "text-muted-foreground"
                      )}
                    >
                      Contacto
                    </span>
                  </div>
                  <div className={cn("h-px w-10", step === 2 ? "bg-primary" : "bg-border")} />
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "flex size-6 items-center justify-center rounded-full text-xs font-medium",
                        step === 2
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      2
                    </span>
                    <span
                      className={cn(
                        "text-sm",
                        step === 2 ? "font-medium text-foreground" : "text-muted-foreground"
                      )}
                    >
                      Organización
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSignUp} className="space-y-8">
                  {step === 1 && (
                    <div className="space-y-4">
                      <h3 className={cn("pb-2", authSectionTitleClass)}>
                        Información del Contacto Principal
                      </h3>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label htmlFor="contactName" className={authLabelClass}>
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
                              className={cn(
                                authInputClass,
                                "pl-10",
                                errors.contactName && "border-destructive"
                              )}
                              required
                            />
                          </div>
                          {errors.contactName && (
                            <p className="text-sm text-destructive">{errors.contactName}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="contactPosition" className={authLabelClass}>
                            Cargo/Posición
                          </label>
                          <Input
                            id="contactPosition"
                            type="text"
                            placeholder="Director, Gerente, CEO, etc."
                            value={formData.contactPosition}
                            onChange={(e) => handleInputChange("contactPosition", e.target.value)}
                            className={cn(
                              authInputClass,
                              errors.contactPosition && "border-destructive"
                            )}
                          />
                          {errors.contactPosition && (
                            <p className="text-sm text-destructive">{errors.contactPosition}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="contactEmail" className={authLabelClass}>
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
                          <p className="text-sm text-destructive">{errors.contactEmail}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label htmlFor="contactPassword" className={authLabelClass}>
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

                        <div className="space-y-2">
                          <label htmlFor="confirmPassword" className={authLabelClass}>
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

                      {errors.general && (
                        <div className="rounded-md bg-destructive/10 p-3 text-center text-sm text-destructive">
                          {errors.general}
                        </div>
                      )}

                      <Button
                        type="button"
                        variant="default"
                        className={cn(authButtonClass, "w-full")}
                        onClick={handleContinue}
                      >
                        Continuar
                      </Button>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4">
                      <h3 className={cn("pb-2", authSectionTitleClass)}>
                        Información de la Organización
                      </h3>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label htmlFor="organizationName" className={authLabelClass}>
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
                              placeholder="Nombre oficial"
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
                            <p className="text-sm text-destructive">{errors.organizationName}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="organizationWebsite" className={authLabelClass}>
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
                            <p className="text-sm text-destructive">{errors.organizationWebsite}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-start gap-2 text-xs">
                          <Checkbox
                            id="terms"
                            checked={acceptTerms}
                            onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                            className="mt-0.5"
                          />
                          <span className="text-sm text-foreground">
                            En nombre de la organización, acepto los{" "}
                            <button type="button" className={authLinkClass}>
                              términos y condiciones empresariales
                            </button>{" "}
                            y la{" "}
                            <button type="button" className={authLinkClass}>
                              política de privacidad
                            </button>
                          </span>
                        </label>
                        {errors.acceptTerms && (
                          <p className="text-sm text-destructive">{errors.acceptTerms}</p>
                        )}
                      </div>

                      {errors.general && (
                        <div className="rounded-md bg-destructive/10 p-3 text-center text-sm text-destructive">
                          {errors.general}
                        </div>
                      )}

                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(authButtonClass, "w-32")}
                          onClick={handleBack}
                          disabled={isPending || createOrganizationMutation.isPending}
                        >
                          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} strokeWidth={1.5} />
                          Volver
                        </Button>
                        <Button
                          type="submit"
                          variant="default"
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

                <div className="space-y-4 border-t border-border/15 pt-8">
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
                      <Link href="/login/organization" className={authOrgLinkClass}>
                        Acceder al portal
                      </Link>
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      ¿Eres usuario individual?{" "}
                      <Link href="/register/professional" className={authLinkClass}>
                        Crear cuenta de usuario
                      </Link>
                    </p>
                  </div>
                </div>

                <p className="text-center text-sm text-muted-foreground">
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
