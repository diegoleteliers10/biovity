"use client"

import {
  Briefcase01Icon,
  Building06Icon,
  CheckmarkCircle02Icon,
  Loading01Icon,
  Mail01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import * as m from "motion/react-m"
import { useReducedMotion } from "motion/react"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getSpringTransition, LANDING_ANIMATION } from "@/lib/animations"
import { cn } from "@/lib/utils"

type Role = "professional" | "empresa"

const ROLE_OPTIONS: { value: Role; label: string; icon: any }[] = [
  { value: "professional", label: "Profesional", icon: Briefcase01Icon },
  { value: "empresa", label: "Empresa", icon: Building06Icon },
]

export function ListaEsperaContent() {
  const [role, setRole] = useState<Role>("professional")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const reducedMotion = useReducedMotion()
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })

  const emailLabel = role === "empresa" ? "Correo corporativo" : "Correo personal"
  const emailPlaceholder = role === "empresa" ? "contacto@empresa.cl" : "tu@email.com"

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
      setIsSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrar. Intenta de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <main className="relative min-h-dvh w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-green-50 pointer-events-none" />
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
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={40} className="text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-balance">
            ¡Estás en la lista!
          </h1>
          <p className="text-lg text-gray-600 text-pretty">
            Te avisaremos cuando Biovity esté listo. Mientras tanto, seguimos construyendo el mejor
            portal de empleo para el sector científico en Chile.
          </p>
        </m.div>
      </main>
    )
  }

  return (
    <main className="relative min-h-dvh w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-green-50 pointer-events-none">
        <div className="absolute top-[12%] left-[5%] w-76 h-76 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-20 blur-2xl" />
        <div className="absolute top-[8%] right-[6%] w-72 h-72 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-18 blur-2xl" />
        <div className="absolute top-[48%] left-[50%] w-84 h-84 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-12 blur-3xl" />
        <div className="absolute top-[75%] left-[4%] w-80 h-80 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full opacity-21 blur-2xl" />
        <div className="absolute top-[62%] right-[5%] w-76 h-76 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full opacity-17 blur-2xl" />
        <div className="absolute top-[28%] left-[18%] w-68 h-68 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full opacity-18 blur-2xl" />
        <div className="absolute top-[22%] right-[22%] w-72 h-72 bg-gradient-to-br from-violet-400 to-purple-400 rounded-full opacity-19 blur-2xl" />
        <div className="absolute top-[65%] left-[35%] w-68 h-68 bg-gradient-to-br from-violet-400 to-purple-400 rounded-full opacity-18 blur-2xl" />
        <div className="absolute top-[72%] right-[18%] w-76 h-76 bg-gradient-to-br from-violet-400 to-purple-400 rounded-full opacity-20 blur-2xl" />
      </div>

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
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight text-balance">
            <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              Biovity
            </span>{" "}
            llega pronto
          </h1>
          <p className="text-base sm:text-lg text-gray-600 text-pretty">
            El portal de empleo para biotecnología, bioquímica y ciencias en Chile está en
            construcción. Únete a la lista y sé el primero en enterarte.
          </p>
        </m.div>

        <m.form
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={ts(LANDING_ANIMATION.sequenceDelay)}
          onSubmit={handleSubmit}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100"
        >
          <div className="mb-6">
            <span className="block text-sm font-medium text-gray-700 mb-3">
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
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
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
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              {emailLabel}
            </label>
            <div className="relative">
              <HugeiconsIcon
                icon={Mail01Icon}
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={emailPlaceholder}
                required
                className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white"
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
            className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-semibold"
          >
            {isSubmitting ? (
              <>
                <HugeiconsIcon
                  icon={Loading01Icon}
                  size={20}
                  className="animate-spin"
                  aria-hidden
                />
                Registrando...
              </>
            ) : (
              "Unirme a la lista"
            )}
          </Button>
        </m.form>

        <p className="text-center text-sm text-gray-500 mt-6 text-pretty">
          Sin spam. Solo te avisaremos cuando estemos listos.
        </p>
      </div>
    </main>
  )
}
