"use client"

import { ArrowRight, Check } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { useState } from "react"
import { Button } from "../../ui/button"
import { PLANES_EMPRESAS } from "@/lib/data/empresas-data"
import { LANDING_ANIMATION, getSpringTransition, getTransition } from "@/lib/animations"

export function Pricing() {
  const [isAnual, setIsAnual] = useState(false)
  const reducedMotion = useReducedMotion()
  const t = (delay = 0) => getTransition({ delay, reducedMotion })
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })

  const getPrice = (price: string) => {
    if (price === "0" || price === "Personalizado") return price
    const numPrice = parseInt(price.replace(".", ""))
    if (isAnual) {
      const anualPrice = Math.round(numPrice * 0.8)
      return anualPrice.toLocaleString("es-CL")
    }
    return price
  }

  return (
    <section className="py-24 bg-white" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={t(0)}
          className="text-center mb-8"
        >
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={t(0)}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight"
          >
            Planes simples y transparentes
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={t(LANDING_ANIMATION.sequenceDelay)}
            className="text-xl text-gray-500 max-w-3xl mx-auto"
          >
            Elige el plan que mejor se adapte a las necesidades de tu empresa.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={ts(LANDING_ANIMATION.sequenceDelay * 2)}
          className="flex items-center justify-center gap-4 mb-12 relative"
        >
          <span className={`text-sm font-medium ${!isAnual ? "text-gray-900" : "text-gray-500"}`}>
            Mensual
          </span>
          <button
            type="button"
            onClick={() => setIsAnual(!isAnual)}
            className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
              isAnual ? "bg-blue-600" : "bg-gray-300"
            }`}
            aria-label={isAnual ? "Cambiar a mensual" : "Cambiar a anual"}
          >
            <span
              className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                isAnual ? "translate-x-7" : "translate-x-0"
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${isAnual ? "text-gray-900" : "text-gray-500"}`}>
            Anual
          </span>
          <span
            className={`absolute left-1/2 translate-x-24 sm:translate-x-28 text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full transition-opacity duration-300 ${
              isAnual ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            Ahorra 20%
          </span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLANES_EMPRESAS.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 36, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
              transition={ts(index * LANDING_ANIMATION.chainStagger)}
              className={`relative rounded-2xl p-6 flex flex-col ${
                plan.highlighted
                  ? "bg-gray-900 text-white ring-2 ring-blue-500 shadow-xl"
                  : "bg-white border border-gray-200 shadow-sm"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold text-white bg-blue-600 px-3 py-1 rounded-full">
                  {plan.badge}
                </span>
              )}

              <div className="mb-6">
                <h3
                  className={`text-xl font-bold mb-2 ${
                    plan.highlighted ? "text-white" : "text-gray-900"
                  }`}
                >
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 flex-wrap">
                  {plan.price !== "Personalizado" && (
                    <span
                      className={`text-sm ${plan.highlighted ? "text-gray-400" : "text-gray-500"}`}
                    >
                      $
                    </span>
                  )}
                  <span
                    className={`font-bold ${
                      plan.highlighted ? "text-white" : "text-gray-900"
                    } ${plan.price === "Personalizado" ? "text-2xl" : "text-4xl"}`}
                  >
                    {getPrice(plan.price)}
                  </span>
                  {plan.period && (
                    <span
                      className={`text-sm ${plan.highlighted ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {plan.period}
                    </span>
                  )}
                </div>
                <p
                  className={`text-sm mt-2 ${plan.highlighted ? "text-gray-400" : "text-gray-500"}`}
                >
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check
                      className={`w-5 h-5 flex-shrink-0 ${
                        plan.highlighted ? "text-blue-400" : "text-green-500"
                      }`}
                    />
                    <span
                      className={`text-sm ${plan.highlighted ? "text-gray-300" : "text-gray-600"}`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full h-12 font-semibold ${
                  plan.highlighted
                    ? "bg-white text-gray-900 hover:bg-gray-100"
                    : plan.isEnterprise
                      ? "bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
                asChild
              >
                <a href={plan.href}>
                  {plan.cta}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Todos los precios en CLP. IVA no incluido. Cancela cuando quieras.
        </p>
      </div>
    </section>
  )
}
