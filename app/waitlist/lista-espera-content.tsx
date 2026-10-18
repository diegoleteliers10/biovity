"use client"

import {
  Briefcase01Icon,
  Building06Icon,
  CheckmarkCircle02Icon,
  Loading01Icon,
  Mail01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import { Result } from "better-result"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getSpringTransition } from "@/lib/animations"
import { cn } from "@/lib/utils"

type Role = "professional" | "organization"

type WaitlistResponse = {
  error?: string
}

const ROLE_OPTIONS: { value: Role; label: string; icon: IconSvgElement }[] = [
  { value: "professional", label: "Profesional / Científico", icon: Briefcase01Icon },
  { value: "organization", label: "Empresa / Institución", icon: Building06Icon },
]

const OFFERINGS = ["Vacantes especializadas", "Datos salariales", "Reclutamiento técnico"]

export function ListaEsperaContent() {
  const [role, setRole] = useState<Role>("professional")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const reducedMotion = useReducedMotion()
  const springTransition = (delay = 0) => getSpringTransition({ delay, reducedMotion })

  const emailLabel =
    role === "organization" ? "Correo electrónico corporativo" : "Correo electrónico"
  const emailPlaceholder = role === "organization" ? "contacto@empresa.cl" : "tu@correo.cl"

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const result = await Result.tryPromise({
      try: async () => {
        const response = await fetch("/api/waitlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, role }),
        })
        const data = (await response.json()) as WaitlistResponse
        return { response, data }
      },
      catch: () => new Error("No pudimos conectar con el servidor. Intenta de nuevo."),
    })

    result.match({
      ok: ({ response, data }) => {
        if (!response.ok) {
          setError(data.error ?? "No pudimos completar el registro. Intenta de nuevo.")
          return
        }
        setIsSubmitted(true)
      },
      err: (submitError) => setError(submitError.message),
    })

    setIsSubmitting(false)
  }

  return (
    <main className="min-h-dvh bg-surface-container-lowest px-5 py-6 sm:px-8 sm:py-8 lg:px-12">
      <div className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-7xl flex-col">
        <header className="flex items-center justify-between">
          <Link
            href="/"
            aria-label="Ir al inicio de Biovity"
            className="inline-flex items-center gap-3"
          >
            <Image
              src="/logoIcon.webp"
              alt="Biovity"
              width={60}
              height={60}
              className="size-14 object-contain"
              priority
            />
            <span className="text-sm font-semibold tracking-tight text-foreground">Biovity</span>
          </Link>
          <span className="text-xs font-mono font-medium uppercase tracking-wider text-secondary">
            Lista de espera · Chile
          </span>
        </header>

        <div className="grid flex-1 content-center gap-12 py-12 lg:grid-cols-12 lg:gap-16 lg:py-16">
          <section className="lg:col-span-6 lg:self-center" aria-labelledby="waitlist-title">
            <m.div initial={false} animate={{ opacity: 1, y: 0 }}>
              <p className="mb-5 text-xs font-mono font-semibold uppercase tracking-wider text-secondary">
                Ciencia · Trabajo · Chile
              </p>
              <h1
                id="waitlist-title"
                className="max-w-2xl text-4xl font-semibold leading-[1.04] tracking-tight text-foreground text-balance sm:text-5xl lg:text-6xl"
              >
                El empleo científico, más cerca.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Conectamos profesionales y organizaciones con oportunidades en biotecnología y
                ciencias.
              </p>
            </m.div>

            <m.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 border-t border-border pt-5"
            >
              <p className="mb-4 text-xs font-medium text-muted-foreground">
                En Biovity encuentras
              </p>
              <ul className="relative grid gap-3 before:absolute before:bottom-2 before:left-[3px] before:top-2 before:w-px before:bg-border sm:grid-cols-3 sm:before:hidden lg:grid-cols-1 lg:before:block">
                {OFFERINGS.map((offering) => (
                  <li
                    key={offering}
                    className="flex items-center gap-3 text-sm font-medium text-foreground"
                  >
                    <span
                      className="relative z-10 size-3 shrink-0 rounded-[50%] bg-secondary"
                      aria-hidden="true"
                    />
                    {offering}
                  </li>
                ))}
              </ul>
            </m.div>
          </section>

          <section
            className="lg:col-span-6 lg:self-center"
            aria-label="Formulario de acceso anticipado"
          >
            {isSubmitted ? (
              <m.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={springTransition()}
                className="rounded-xl border border-border bg-surface-container-low p-6 sm:p-8 lg:p-10"
                role="status"
              >
                <div className="mb-6 flex size-12 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={26} />
                </div>
                <p className="mb-3 text-xs font-mono font-medium uppercase tracking-wider text-secondary">
                  Registro recibido
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  Ya estás en la lista.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Te avisaremos por correo cuando abramos nuevos cupos en Biovity.
                </p>
              </m.div>
            ) : (
              <m.form
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="rounded-xl border border-border bg-surface-container-low p-6 sm:p-8 lg:p-10"
              >
                <div className="mb-8 flex items-start justify-between gap-6">
                  <div>
                    <p className="mb-2 text-xs font-mono font-medium uppercase tracking-wider text-secondary">
                      Acceso anticipado
                    </p>
                    <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                      Únete a Biovity
                    </h2>
                  </div>
                </div>

                <p className="-mt-4 mb-7 text-sm leading-relaxed text-muted-foreground">
                  Recibe novedades por correo cuando se abran nuevos cupos.
                </p>

                <fieldset className="mb-7">
                  <legend className="mb-3 text-sm font-medium text-foreground">
                    ¿Cuál es tu perfil?
                  </legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {ROLE_OPTIONS.map((option) => {
                      const Icon = option.icon
                      const isSelected = role === option.value
                      const isOrganization = option.value === "organization"
                      const selectedClasses = isOrganization
                        ? "border-accent bg-accent/10"
                        : "border-secondary bg-secondary/5"
                      const markerClass = isOrganization ? "bg-accent" : "bg-secondary"
                      const iconClass = isOrganization
                        ? "bg-accent/10 text-accent"
                        : "bg-secondary/10 text-secondary"
                      const idleHoverClass = isOrganization
                        ? "hover:border-accent/50 hover:text-foreground"
                        : "hover:border-secondary/50 hover:text-foreground"

                      return (
                        <m.button
                          key={option.value}
                          type="button"
                          onClick={() => setRole(option.value)}
                          whileHover={reducedMotion ? undefined : { y: -2 }}
                          whileTap={reducedMotion ? undefined : { scale: 0.99 }}
                          transition={{ duration: 0.16 }}
                          className={cn(
                            "relative flex min-h-14 items-center gap-3 overflow-hidden rounded-lg border px-4 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                            isSelected
                              ? `${selectedClasses} text-foreground ${isOrganization ? "focus-visible:ring-accent" : "focus-visible:ring-secondary"}`
                              : `border-border bg-surface-container-lowest text-muted-foreground ${idleHoverClass} ${isOrganization ? "focus-visible:ring-accent" : "focus-visible:ring-secondary"}`
                          )}
                          aria-pressed={isSelected}
                        >
                          {isSelected && (
                            <m.span
                              layoutId="waitlist-role-marker"
                              transition={springTransition()}
                              aria-hidden="true"
                              className={cn(
                                "absolute inset-y-3 left-0 w-[3px] rounded-r",
                                markerClass
                              )}
                            />
                          )}
                          <span
                            className={cn(
                              "flex size-9 shrink-0 items-center justify-center rounded-md",
                              isSelected
                                ? iconClass
                                : "bg-surface-container-low text-muted-foreground"
                            )}
                          >
                            <HugeiconsIcon icon={Icon} size={18} />
                          </span>
                          <span>{option.label}</span>
                        </m.button>
                      )
                    })}
                  </div>
                </fieldset>

                <div className="mb-6">
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                    {emailLabel} <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <HugeiconsIcon
                      icon={Mail01Icon}
                      size={17}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder={emailPlaceholder}
                      required
                      className="h-12 rounded-lg border-border bg-surface-container-lowest pl-10 text-sm focus-visible:ring-secondary"
                      aria-invalid={!!error}
                      aria-describedby={error ? "waitlist-error" : undefined}
                    />
                  </div>
                </div>

                {error && (
                  <div
                    id="waitlist-error"
                    role="alert"
                    className="mb-5 rounded-lg border border-destructive/20 bg-destructive/10 p-3.5 text-sm font-medium text-destructive"
                  >
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 w-full rounded-lg bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <>
                      <HugeiconsIcon
                        icon={Loading01Icon}
                        size={16}
                        className="mr-2 animate-spin"
                        aria-hidden
                      />
                      Registrando…
                    </>
                  ) : (
                    "Solicitar acceso anticipado"
                  )}
                </Button>
              </m.form>
            )}
          </section>
        </div>

        <footer className="flex items-center justify-between border-t border-border/70 py-5 text-xs text-muted-foreground">
          <span>Biovity · Empleo científico en Chile</span>
          <Link
            href="/"
            className="font-medium text-secondary transition-colors hover:text-foreground"
          >
            Volver a Biovity
          </Link>
        </footer>
      </div>
    </main>
  )
}
