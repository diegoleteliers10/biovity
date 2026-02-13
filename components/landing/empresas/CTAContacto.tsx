"use client"

import { ArrowRight, Building2, Mail, Phone, Send, User } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { useRef, useState } from "react"
import { validateOrganizationContact } from "@/lib/validations"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { LANDING_ANIMATION, getSpringTransition } from "@/lib/animations"

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
    <section
      id="contacto"
      className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={ts(0)}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight text-balance">
              ¿Listo para encontrar tu próximo talento?
            </h2>
            <p className="text-xl text-gray-400 mb-8 leading-relaxed text-pretty">
              Comienza gratis o habla con nuestro equipo para encontrar el plan perfecto para tu
              empresa.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button
                size="lg"
                className="h-14 px-8 bg-white text-gray-900 hover:bg-gray-100 text-lg"
                asChild
              >
                <a href="/register/organization">
                  Comienza gratis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.98 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={ts(LANDING_ANIMATION.stagger)}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 text-gray-400">
              <Mail className="w-5 h-5" />
              <span>empresas@biovity.cl</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <Phone className="w-5 h-5" />
              <span>+56 9 1234 5678</span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
              transition={ts(LANDING_ANIMATION.sequenceDelay * 2)}
            >
              {isSubmitted ? (
                <div className="bg-white rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Mensaje enviado!</h3>
                  <p className="text-gray-500 text-pretty">
                    Nos pondremos en contacto contigo pronto. Gracias por tu interés en Biovity.
                  </p>
                </div>
              ) : (
                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="bg-white rounded-2xl p-8 shadow-xl"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Contacta con ventas</h3>

                  {Object.keys(errors).length > 0 && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{Object.values(errors)[0]}</p>
                    </div>
                  )}

                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="nombre"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Nombre
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            id="nombre"
                            name="nombre"
                            required
                            placeholder="Tu nombre"
                            className={`pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white ${errors.nombre ? "border-red-500" : ""}`}
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="apellido"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Apellido
                        </label>
                        <Input
                          id="apellido"
                          name="apellido"
                          required
                          placeholder="Tu apellido"
                          className="h-12 bg-gray-50 border-gray-200 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email corporativo
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder="tu@empresa.cl"
                          className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="empresa"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Empresa
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="empresa"
                          name="empresa"
                          required
                          placeholder="Nombre de tu empresa"
                          className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="telefono"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Teléfono (opcional)
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="telefono"
                          name="telefono"
                          type="tel"
                          placeholder="+56 9 1234 5678"
                          className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="mensaje"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        ¿Cómo podemos ayudarte?
                      </label>
                      <textarea
                        id="mensaje"
                        name="mensaje"
                        rows={3}
                        placeholder="Cuéntanos sobre tus necesidades de contratación..."
                        className="w-full px-4 py-3 bg-gray-50 border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-semibold transition-all duration-200"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          Enviar mensaje
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
