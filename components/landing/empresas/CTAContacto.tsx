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
    // TODO: Send data to API
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  return (
    <section id="contacto" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <m.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={ts(0)}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight text-balance">
              ¿Listo para encontrar tu próximo talento?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed text-pretty">
              Comienza gratis o habla con nuestro equipo para encontrar el plan perfecto para tu
              empresa.
            </p>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Mail01Icon} className="w-5 h-5 text-secondary" />
                <span className="text-foreground">empresas@biovity.cl</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-12">
              <HugeiconsIcon icon={CallIcon} className="w-5 h-5 text-secondary" />
              <span className="text-foreground">+56 9 1234 5678</span>
            </div>

            <Button size="lg" variant="outline" asChild>
              <Link href="/register/organization">
                Comienza gratis
                <HugeiconsIcon icon={ArrowRight01Icon} className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </m.div>

          <m.div
            initial={{ opacity: 0, x: 40, scale: 0.98 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={ts(LANDING_ANIMATION.stagger)}
            className="space-y-4"
          >
            <m.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
              transition={ts(LANDING_ANIMATION.sequenceDelay * 2)}
            >
              {isSubmitted ? (
                <div className="bg-white rounded-2xl p-8 border border-border/10 text-center">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">¡Mensaje enviado!</h3>
                  <p className="text-muted-foreground text-pretty">
                    Nos pondremos en contacto contigo pronto. Gracias por tu interés en Biovity.
                  </p>
                </div>
              ) : (
                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="bg-white rounded-2xl p-8 border border-border/10"
                >
                  <h3 className="text-2xl font-bold text-foreground mb-6">Contacta con ventas</h3>

                  {Object.keys(errors).length > 0 && (
                    <div role="alert" className="mb-4 p-3 bg-accent/5 border border-accent/20 rounded-lg">
                      <p className="text-sm text-accent">{Object.values(errors)[0]}</p>
                    </div>
                  )}

                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="nombre"
                          className="block text-sm font-medium text-foreground mb-1"
                        >
                          Nombre
                        </label>
                        <div className="relative">
                          <HugeiconsIcon
                            icon={UserIcon}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
                          />
                          <Input
                            id="nombre"
                            name="nombre"
                            required
                            placeholder="Tu nombre"
                            className={`pl-10 h-12 bg-muted/20 border-border/30 focus:bg-white focus:border-secondary ${errors.nombre ? "border-accent" : ""}`}
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="apellido"
                          className="block text-sm font-medium text-foreground mb-1"
                        >
                          Apellido
                        </label>
                        <Input
                          id="apellido"
                          name="apellido"
                          required
                          placeholder="Tu apellido"
                          className="h-12 bg-muted/20 border-border/30 focus:bg-white focus:border-secondary"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-foreground mb-1"
                      >
                        Email corporativo
                      </label>
                      <div className="relative">
                        <HugeiconsIcon
                          icon={Mail01Icon}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
                        />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder="tu@empresa.cl"
                          className="pl-10 h-12 bg-muted/20 border-border/30 focus:bg-white focus:border-secondary"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="empresa"
                        className="block text-sm font-medium text-foreground mb-1"
                      >
                        Empresa
                      </label>
                      <div className="relative">
                        <HugeiconsIcon
                          icon={Building02Icon}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
                        />
                        <Input
                          id="empresa"
                          name="empresa"
                          required
                          placeholder="Nombre de tu empresa"
                          className="pl-10 h-12 bg-muted/20 border-border/30 focus:bg-white focus:border-secondary"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="telefono"
                        className="block text-sm font-medium text-foreground mb-1"
                      >
                        Teléfono (opcional)
                      </label>
                      <div className="relative">
                        <HugeiconsIcon
                          icon={CallIcon}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
                        />
                        <Input
                          id="telefono"
                          name="telefono"
                          type="tel"
                          placeholder="+56 9 1234 5678"
                          className="pl-10 h-12 bg-muted/20 border-border/30 focus:bg-white focus:border-secondary"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="mensaje"
                        className="block text-sm font-medium text-foreground mb-1"
                      >
                        ¿Cómo podemos ayudarte?
                      </label>
                      <textarea
                        id="mensaje"
                        name="mensaje"
                        rows={3}
                        placeholder="Cuéntanos sobre tus necesidades de contratación..."
                        className="w-full px-4 py-3 bg-muted/20 border border-border/30 rounded-lg focus:bg-white focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 resize-none"
                      />
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full h-12">
                      {isSubmitting ? (
                        <>
                          <span className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin mr-2" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          Enviar mensaje
                          <HugeiconsIcon icon={ArrowRight01Icon} className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </m.div>
          </m.div>
        </div>
      </div>
    </section>
  )
}
