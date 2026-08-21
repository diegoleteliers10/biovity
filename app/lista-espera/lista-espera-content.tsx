"use client"

import {
  Briefcase01Icon,
  Building06Icon,
  CheckmarkCircle02Icon,
  Loading01Icon,
  Mail01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import Image from "next/image"
import Link from "next/link"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getSpringTransition, getTransition, LANDING_ANIMATION } from "@/lib/animations"
import { cn } from "@/lib/utils"

type Role = "professional" | "organization"

const ROLE_OPTIONS: { value: Role; label: string; icon: IconSvgElement }[] = [
  { value: "professional", label: "Profesional / Científico", icon: Briefcase01Icon },
  { value: "organization", label: "Empresa / Institución", icon: Building06Icon },
]

export function ListaEsperaContent() {
  const [role, setRole] = useState<Role>("professional")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isSubmittedRef = useRef(false)
  const [error, setError] = useState<string | null>(null)
  const reducedMotion = useReducedMotion()
  const t = (delay = 0) => getTransition({ delay, reducedMotion })
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })

  const emailLabel = role === "organization" ? "Correo electrónico corporativo" : "Correo electrónico"
  const emailPlaceholder = role === "organization" ? "contacto@empresa.cl" : "tu@correo.cl"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Error al registrar")
      isSubmittedRef.current = true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrar. Intenta de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmittedRef.current) {
    return (
      <main className="relative min-h-dvh w-full flex items-center justify-center overflow-hidden bg-surface-container-lowest py-20 px-4">
        {/* Ambient brand glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[44rem] h-[30rem] rounded-full bg-gradient-to-b from-secondary/10 via-accent/5 to-transparent blur-3xl opacity-70" />
        </div>

        <m.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={ts(0)}
          className="relative z-10 text-center max-w-md mx-auto bg-surface-container-low rounded-xl p-8 sm:p-10"
        >
          <div className="size-16 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center mx-auto mb-6 text-secondary">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={32} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-3 tracking-tight text-balance">
            ¡Estás en la lista de espera!
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
            Te notificaremos por correo prioritariamente cuando abramos nuevos cupos en Biovity.
          </p>
        </m.div>
      </main>
    )
  }

  return (
    <main className="relative min-h-dvh w-full flex items-center justify-center overflow-hidden bg-surface-container-lowest py-20 md:py-28 px-4 sm:px-6">
      {/* Ambient brand glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[44rem] h-[30rem] rounded-full bg-gradient-to-b from-secondary/10 via-accent/5 to-transparent blur-3xl opacity-70" />
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto">
        <m.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={t(0)}
          className="flex flex-col items-center text-center mb-10"
        >
          {/* Logo centrado, sobre el badge y sin bordes */}
          <Link
            href="/"
            aria-label="Ir al inicio"
            className="mb-6 inline-flex items-center justify-center transition-opacity hover:opacity-80"
          >
            <Image
              src="/logoIcon.png"
              alt="Biovity"
              width={54}
              height={54}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Green Plain Text Tag */}
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-3 block">
            Acceso Anticipado • Ecosistema Biovity
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4 tracking-tight text-balance">
            El nuevo estándar de empleo científico en Chile
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed text-pretty">
            Únete a la lista de espera para acceder antes a vacantes especializadas, herramientas de inteligencia salarial y reclutamiento técnico.
          </p>
        </m.div>

        {/* Form Container - Clean tonal container */}
        <m.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={ts(LANDING_ANIMATION.sequenceDelay)}
          onSubmit={handleSubmit}
          className="bg-surface-container-low rounded-xl p-6 sm:p-8 md:p-10"
        >
          <div className="mb-6">
            <label className="block text-xs font-medium text-foreground mb-2">
              ¿Cuál es tu perfil?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ROLE_OPTIONS.map((opt) => {
                const Icon = opt.icon
                const isSelected = role === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setRole(opt.value)}
                    className={cn(
                      "flex items-center justify-center gap-2 py-3 px-4 rounded-lg border text-xs sm:text-sm font-medium transition-all",
                      isSelected
                        ? "border-secondary bg-secondary/10 text-secondary font-semibold"
                        : "border-border bg-surface-container-lowest text-muted-foreground hover:border-secondary/40 hover:text-foreground"
                    )}
                    aria-pressed={isSelected}
                  >
                    <HugeiconsIcon icon={Icon} size={18} />
                    <span>{opt.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block text-xs font-medium text-foreground mb-1.5">
              {emailLabel} <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <HugeiconsIcon
                icon={Mail01Icon}
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={emailPlaceholder}
                required
                className="pl-9 h-11 bg-surface-container-lowest border-border rounded-lg text-sm"
                aria-invalid={!!error}
              />
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 p-3.5 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-xs font-medium"
            >
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-medium"
          >
            {isSubmitting ? (
              <>
                <HugeiconsIcon
                  icon={Loading01Icon}
                  size={16}
                  className="animate-spin mr-1.5"
                  aria-hidden
                />
                Registrando…
              </>
            ) : (
              "Solicitar acceso anticipado"
            )}
          </Button>
        </m.form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Sin spam. Solo recibirás novedades importantes sobre el lanzamiento.
        </p>
      </div>
    </main>
  )
}
