"use client"

import {
  ArrowRight01Icon,
  Building02Icon,
  CallIcon,
  CheckmarkCircle02Icon,
  Mail01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import Link from "next/link"
import { useRef, useState } from "react"
import { getSpringTransition, LANDING_ANIMATION } from "@/lib/animations"
import { validateOrganizationContact } from "@/lib/validations"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"

export function CTAContacto() {
  const formRef = useRef<HTMLFormElement>(null)
  const reducedMotion = useReducedMotion()
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})

    if (!formRef.current) return

    const formData = new FormData(formRef.current)
    const data = {
      nombre: formData.get("nombre") as string,
      apellido: formData.get("apellido") as string,
      email: formData.get("email") as string,
      telefono: formData.get("telefono") as string | null,
      empresa: formData.get("empresa") as string,
      mensaje: formData.get("mensaje") as string,
    }

    const result = validateOrganizationContact(data)

    if (!result.success) {
      setErrors(result.errors ?? {})
      return
    }

    setIsSubmitting(true)
    setErrors({})
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const payload = (await response.json().catch(() => ({}))) as {
        error?: string
        success?: boolean
      }

      if (!response.ok || !payload.success) {
        setErrors({ form: payload.error || "No pudimos enviar tu mensaje. Intenta de nuevo." })
        return
      }

      setIsSubmitted(true)
    } catch (err) {
      console.error("[CTAContacto] submit error:", err)
      setErrors({ form: "Error de conexión. Verifica tu red e intenta de nuevo." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contacto" className="py-20 md:py-28 bg-surface-container-lowest">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Context & Direct Info */}
          <m.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={ts(0)}
            className="lg:col-span-5"
          >
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-3 block">
              Contacto Corporativo
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-6 tracking-tight text-balance">
              ¿Listo para encontrar tu próximo{" "}
              <span className="text-accent font-semibold">talento científico</span>?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed text-pretty">
              Comienza gratis con tu cuenta de empresa o déjanos un mensaje para coordinar una demo
              personalizada de nuestras herramientas ATS y búsqueda de candidatos.
            </p>

            <div className="space-y-4 mb-8">
              <a
                href="mailto:empresas@biovity.cl"
                className="flex items-center gap-3 text-sm text-foreground hover:text-secondary transition-colors"
              >
                <div className="size-9 rounded-lg bg-surface-container-low flex items-center justify-center text-primary shrink-0">
                  <HugeiconsIcon icon={Mail01Icon} size={18} />
                </div>
                <span className="font-medium">empresas@biovity.cl</span>
              </a>

              <a
                href="tel:+56912345678"
                className="flex items-center gap-3 text-sm text-foreground hover:text-secondary transition-colors"
              >
                <div className="size-9 rounded-lg bg-surface-container-low flex items-center justify-center text-primary shrink-0">
                  <HugeiconsIcon icon={CallIcon} size={18} />
                </div>
                <span className="font-medium">+56 9 1234 5678</span>
              </a>
            </div>

            <Button
              size="lg"
              variant="outline"
              className="h-11 px-5 bg-surface-container-lowest border border-border hover:bg-surface-container-low rounded-lg text-sm font-medium"
              asChild
            >
              <Link href="/register/organization">
                Crear cuenta de empresa
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="ml-1.5" />
              </Link>
            </Button>
          </m.div>

          {/* Right Column: Contact Form - Clean borderless container on surface-container-lowest */}
          <m.div
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={ts(LANDING_ANIMATION.stagger)}
            className="lg:col-span-7"
          >
            {isSubmitted ? (
              <div className="bg-surface-container-low rounded-xl p-8 sm:p-12 text-center">
                <div className="size-14 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center mx-auto mb-4 text-secondary">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={28} />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  ¡Mensaje enviado con éxito!
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto text-pretty">
                  Nos pondremos en contacto contigo dentro de las próximas 24 horas hábiles. Gracias
                  por tu interés en Biovity.
                </p>
              </div>
            ) : (
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="bg-surface-container-low rounded-xl p-6 sm:p-8 md:p-10"
              >
                <div className="mb-6 pb-4 border-b border-border">
                  <h3 className="text-lg font-semibold text-foreground">
                    Contacta a nuestro equipo
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Cuéntanos sobre tus requerimientos y te responderemos a la brevedad.
                  </p>
                </div>

                {Object.keys(errors).length > 0 && (
                  <div
                    role="alert"
                    className="mb-5 p-3.5 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-xs font-medium"
                  >
                    {Object.values(errors)[0]}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="nombre"
                        className="block text-xs font-medium text-foreground mb-1.5"
                      >
                        Nombre <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <HugeiconsIcon
                          icon={UserIcon}
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                        />
                        <Input
                          id="nombre"
                          name="nombre"
                          required
                          placeholder="Tu nombre"
                          className={`pl-9 h-10 text-sm bg-surface-container-lowest border-border rounded-lg ${
                            errors.nombre
                              ? "border-destructive focus-visible:ring-destructive/30"
                              : ""
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="apellido"
                        className="block text-xs font-medium text-foreground mb-1.5"
                      >
                        Apellido <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id="apellido"
                        name="apellido"
                        required
                        placeholder="Tu apellido"
                        className="h-10 text-sm bg-surface-container-lowest border-border rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-xs font-medium text-foreground mb-1.5"
                      >
                        Email corporativo <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <HugeiconsIcon
                          icon={Mail01Icon}
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                        />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder="tu@empresa.cl"
                          className="pl-9 h-10 text-sm bg-surface-container-lowest border-border rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="empresa"
                        className="block text-xs font-medium text-foreground mb-1.5"
                      >
                        Empresa / Institución <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <HugeiconsIcon
                          icon={Building02Icon}
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                        />
                        <Input
                          id="empresa"
                          name="empresa"
                          required
                          placeholder="Nombre de la entidad"
                          className="pl-9 h-10 text-sm bg-surface-container-lowest border-border rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="telefono"
                      className="block text-xs font-medium text-foreground mb-1.5"
                    >
                      Teléfono <span className="text-muted-foreground font-normal">(opcional)</span>
                    </label>
                    <div className="relative">
                      <HugeiconsIcon
                        icon={CallIcon}
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                      />
                      <Input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        placeholder="+56 9 1234 5678"
                        className="pl-9 h-10 text-sm bg-surface-container-lowest border-border rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="mensaje"
                      className="block text-xs font-medium text-foreground mb-1.5"
                    >
                      ¿Cómo podemos ayudarte? <span className="text-destructive">*</span>
                    </label>
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      rows={3}
                      required
                      placeholder="Cuéntanos sobre los perfiles o vacantes que buscas cubrir..."
                      className="w-full px-3.5 py-2.5 bg-surface-container-lowest border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30 focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-medium mt-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="size-4 border-2 border-current/30 border-t-current rounded-full animate-spin mr-2" />
                        Enviando solicitud…
                      </>
                    ) : (
                      <>
                        Enviar mensaje
                        <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="ml-1.5" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </m.div>
        </div>
      </div>
    </section>
  )
}
