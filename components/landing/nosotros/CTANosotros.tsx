"use client"

import { ArrowRight } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import Link from "next/link"
import { Button } from "../../ui/button"
import { LANDING_ANIMATION, getSpringTransition, getTransition } from "@/lib/animations"

export function CTANosotros() {
  const reducedMotion = useReducedMotion()
  const t = (delay = 0) => getTransition({ delay, reducedMotion })
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })
  return (
    <section
      id="contacto"
      className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={t(0)}
            className="mb-12"
          >
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
              transition={t(0)}
              className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight text-balance"
            >
              ¿Listo para unirte a BioVity?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
              transition={t(LANDING_ANIMATION.sequenceDelay)}
              className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed text-pretty"
            >
              Ya seas un profesional buscando oportunidades o una empresa buscando talento, BioVity
              está aquí para conectar.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={ts(LANDING_ANIMATION.sequenceDelay * 2)}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 bg-white/10 hover:bg-white/20 text-white border-white/20 text-lg w-full sm:w-auto"
              asChild
            >
              <Link href="/trabajos">
                <span>Buscar Empleos</span>
              </Link>
            </Button>
            <Button
              size="lg"
              className="h-14 px-8 bg-white text-gray-900 hover:bg-gray-100 text-lg w-full sm:w-auto"
              asChild
            >
              <Link href="/register/organization">
                <span>
                  Publicar Oferta
                  <ArrowRight className="w-5 h-5 ml-2" />
                </span>
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
