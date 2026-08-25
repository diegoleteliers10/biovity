"use client"

import { ArrowRight01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { useState } from "react"
import { getSpringTransition, getTransition, LANDING_ANIMATION } from "@/lib/animations"
import { PLANES_EMPRESAS } from "@/lib/data/empresas-data"
import { Button } from "../../ui/button"

export function Pricing() {
  const [isAnual, setIsAnual] = useState(false)
  const reducedMotion = useReducedMotion()
  const t = (delay = 0) => getTransition({ delay, reducedMotion })
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })

  const getPrice = (price: string) => {
    if (price === "0" || price === "Personalizado") return price
    const numPrice = parseInt(price.replace(".", ""), 10)
    if (isAnual) {
      const anualPrice = Math.round(numPrice * 0.8)
      return anualPrice.toLocaleString("es-CL")
    }
    return price
  }

  return (
    <section className="py-20 md:py-28 bg-surface-container-lowest" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <m.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={t(0)}
          className="text-center mb-12 max-w-3xl mx-auto"
        >
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-3 block">
            Planes & Precios
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4 tracking-tight text-balance">
            Planes transparentes para cada <span className="text-accent font-semibold">etapa</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty">
            Desde vacantes puntuales hasta soluciones integrales para equipos de reclutamiento
            activo.
          </p>
        </m.div>

        {/* Monthly / Annual Billing Toggle */}
        <m.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={ts(LANDING_ANIMATION.sequenceDelay)}
          className="flex items-center justify-center gap-3.5 mb-14"
        >
          <button
            type="button"
            onClick={() => setIsAnual(false)}
            className={`text-sm transition-colors cursor-pointer ${
              !isAnual
                ? "text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Mensual
          </button>

          <button
            type="button"
            role="switch"
            aria-checked={isAnual}
            onClick={() => setIsAnual(!isAnual)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              isAnual
                ? "bg-secondary border-secondary"
                : "bg-neutral-200 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600"
            }`}
            aria-label={isAnual ? "Cambiar a facturación mensual" : "Cambiar a facturación anual"}
          >
            <span
              className={`pointer-events-none inline-block size-5 rounded-full bg-white shadow-md ring-1 ring-black/10 transition-transform duration-200 ease-in-out ${
                isAnual ? "translate-x-[21px]" : "translate-x-0.5"
              }`}
            />
          </button>

          <button
            type="button"
            onClick={() => setIsAnual(true)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span
              className={`text-sm transition-colors ${
                isAnual
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Anual
            </span>
            <span className="text-[11px] font-mono font-semibold text-accent bg-accent/15 border border-accent/20 px-2 py-0.5 rounded-full">
              -20% dto
            </span>
          </button>
        </m.div>

        {/* Pricing Cards Grid - Alternating borderless with highlighted border */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch">
          {PLANES_EMPRESAS.map((plan, index) => (
            <m.div
              key={plan.name}
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
              transition={ts(index * LANDING_ANIMATION.chainStagger)}
              className={`relative rounded-xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 ${
                plan.highlighted
                  ? "bg-surface-container-low border-2 border-secondary"
                  : "bg-surface-container-low hover:bg-surface-container-highest/60"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="text-[11px] font-mono font-semibold text-secondary-foreground bg-secondary px-3 py-1 rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div>
                <div className="mb-6 pb-6 border-b border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-1.5">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground min-h-[32px]">{plan.description}</p>

                  <div className="mt-4 flex items-baseline gap-1">
                    {plan.price !== "Personalizado" && (
                      <span className="text-sm font-semibold text-muted-foreground">$</span>
                    )}
                    <span
                      className={`font-bold tracking-tight text-foreground ${
                        plan.price === "Personalizado" ? "text-2xl" : "text-3xl sm:text-4xl"
                      }`}
                    >
                      {getPrice(plan.price)}
                    </span>
                    {plan.period && (
                      <span className="text-xs text-muted-foreground font-medium">
                        {plan.period}
                      </span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <HugeiconsIcon
                        icon={Tick02Icon}
                        size={16}
                        className="text-secondary shrink-0 mt-0.5"
                      />
                      <span className="text-xs sm:text-sm text-muted-foreground leading-snug">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                className={`w-full h-10 rounded-lg text-sm font-medium ${
                  plan.highlighted
                    ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    : plan.isEnterprise
                      ? "bg-surface-container-lowest border border-border text-foreground hover:bg-surface-container-highest/50"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
                asChild
              >
                <a href={plan.href}>
                  {plan.cta}
                  <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="ml-1.5" />
                </a>
              </Button>
            </m.div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Precios expresados en CLP. No incluyen IVA. Puedes cancelar o modificar tu plan en
          cualquier momento.
        </p>
      </div>
    </section>
  )
}
