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
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getSpringTransition, LANDING_ANIMATION } from "@/lib/animations"
import { cn } from "@/lib/utils"

type Role = "professional" | "organization"

const ROLE_OPTIONS: { value: Role; label: string; icon: IconSvgElement }[] = [
  { value: "professional", label: "Profesional", icon: Briefcase01Icon },
  { value: "organization", label: "Empresa", icon: Building06Icon },
]

const BackgroundBlobs = (
  <div className="absolute inset-0 bg-gradient-to-br from-[#f9f9fb] via-[#f3f3f5] to-[#f9f9fb] pointer-events-none">
    <div className="absolute top-[5%] left-[10%] size-[22rem] bg-[#00374a]/25 rounded-full blur-3xl"></div>
    <div className="absolute top-[15%] right-[15%] size-[18rem] bg-[#00374a]/20 rounded-full blur-2xl"></div>
    <div className="absolute top-[55%] left-[5%] size-[20rem] bg-[#006b5e]/30 rounded-full blur-3xl"></div>
    <div className="absolute top-[65%] right-[10%] size-[24rem] bg-[#006b5e]/25 rounded-full blur-2xl"></div>
    <div className="absolute bottom-[15%] left-[25%] size-[19rem] bg-[#8483d4]/25 rounded-full blur-3xl"></div>
    <div className="absolute top-[35%] right-[30%] size-[16rem] bg-[#8483d4]/20 rounded-full blur-2xl"></div>
  </div>
)

export function ListaEsperaContent() {
  const [role, setRole] = useState<Role>("professional")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isSubmittedRef = useRef(false)
  const [error, setError] = useState<string | null>(null)
  const reducedMotion = useReducedMotion()
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })

  const emailLabel = role === "organization" ? "Correo corporativo" : "Correo personal"
  const emailPlaceholder = role === "organization" ? "contacto@empresa.cl" : "tu@email.com"

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
      <main className="relative min-h-dvh w-full flex items-center justify-center overflow-hidden">
        {BackgroundBlobs}
        <m.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={ts(0)}
          className="relative z-10 text-center max-w-3xl mx-auto px-4"
        >
          <Image
            src="/logoIcon.png"
            alt="Biovity"
            width={96}
            height={96}
            className="mx-auto mb-6"
            priority
          />
          <div className="size-20 rounded-full bg-[#006b5e]/20 flex items-center justify-center mx-auto mb-6">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={40} className="text-[#006b5e]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-4 text-balance">
            ¡Estás en la lista!
          </h1>
          <p className="text-lg text-muted-foreground text-pretty">
            Te avisaremos cuando Biovity esté listo. Mientras tanto, seguimos construyendo el mejor
            portal de empleo para el sector científico en Chile.
          </p>
        </m.div>
      </main>
    )
  }

  return (
    <main className="relative min-h-dvh w-full flex items-center justify-center overflow-hidden">
      {BackgroundBlobs}

      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6">
        <m.div
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={ts(0)}
          className="text-center mb-8"
        >
          <Image
            src="/logoIcon.png"
            alt="Biovity"
            width={120}
            height={120}
            className="mx-auto mb-6"
            priority
          />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4 leading-tight text-balance">
            <span className="text-accent font-semibold">Biovity</span> llega pronto
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground text-pretty">
            El portal de empleo para biotecnología, bioquímica y ciencias en Chile está en
            construcción. Únete a la lista y sé el primero en enterarte.
          </p>
        </m.div>

        <m.form
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={ts(LANDING_ANIMATION.sequenceDelay)}
          onSubmit={handleSubmit}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl border border-border/10"
        >
          <div className="mb-6">
            <span className="block text-sm font-medium text-foreground mb-3">
              ¿Qué te describe mejor?
            </span>
            <div className="flex gap-3">
              {ROLE_OPTIONS.map((opt) => {
                const Icon = opt.icon
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setRole(opt.value)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all font-medium",
                      role === opt.value
                        ? "border-secondary bg-secondary/10 text-secondary"
                        : "border-border/20 bg-white text-muted-foreground hover:border-secondary/40"
                    )}
                    aria-pressed={role === opt.value}
                    aria-label={`Seleccionar ${opt.label}`}
                  >
                    <HugeiconsIcon icon={Icon} size={20} />
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              {emailLabel}
            </label>
            <div className="relative">
              <HugeiconsIcon
                icon={Mail01Icon}
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={emailPlaceholder}
                required
                className="pl-10 h-12 bg-white border border-border/20 focus:border-secondary focus:ring-secondary/20 transition-colors"
                aria-invalid={!!error}
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 mb-4" role="alert">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold"
          >
            {isSubmitting ? (
              <>
                <HugeiconsIcon
                  icon={Loading01Icon}
                  size={20}
                  className="animate-spin"
                  aria-hidden
                />
                Registrando…
              </>
            ) : (
              "Unirme a la lista"
            )}
          </Button>
        </m.form>

        <p className="text-center text-sm text-muted-foreground mt-6 text-pretty">
          Sin spam. Solo te avisaremos cuando estemos listos.
        </p>
      </div>
    </main>
  )
}
