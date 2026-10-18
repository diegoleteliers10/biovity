"use client"

import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { useState } from "react"
import { getTransition, LANDING_ANIMATION } from "@/lib/animations"
import { PLANES_EMPRESAS } from "@/lib/data/empresas-data"

const formatDiscountReference = (price: string) => {
  if (price === "0" || price === "Personalizado") return price
  const monthlyPrice = Number(price.replaceAll(".", ""))
  return Math.round(monthlyPrice * 0.8).toLocaleString("es-CL")
}

export function PlansPricing() {
  const [billing, setBilling] = useState<"monthly" | "discountReference">("monthly")
  const reducedMotion = useReducedMotion()

  return (
    <section className="bg-surface-container-low py-16 sm:py-20 md:py-28" id="pricing">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 flex flex-col gap-8 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold text-secondary">Planes para empresas</p>
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Contrata talento científico <span className="text-accent">a tu ritmo</span>
            </h1>
          </div>
          <fieldset className="inline-flex w-fit items-center gap-1 rounded-lg border border-border bg-surface-container-lowest p-1">
            <legend className="sr-only">Vista de precios</legend>
            <button
              aria-pressed={billing === "monthly"}
              className={`min-h-11 rounded-md px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${billing === "monthly" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setBilling("monthly")}
              type="button"
            >
              Mensual
            </button>
            <button
              aria-pressed={billing === "discountReference"}
              className={`min-h-11 rounded-md px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${billing === "discountReference" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setBilling("discountReference")}
              type="button"
            >
              Referencia · 20% menos
            </button>
          </fieldset>
        </header>

        <ol className="space-y-2">
          {PLANES_EMPRESAS.map((plan, index) => {
            const showDiscountReference =
              billing === "discountReference" &&
              plan.price !== "0" &&
              plan.price !== "Personalizado"
            const price = showDiscountReference ? formatDiscountReference(plan.price) : plan.price

            return (
              <m.li
                className={`grid gap-7 py-8 md:grid-cols-[minmax(11rem,0.8fr)_minmax(0,1.6fr)_minmax(12rem,0.8fr)] md:items-start md:gap-10 md:py-10 ${plan.highlighted ? "rounded-xl bg-secondary/10 px-5 sm:px-7" : "rounded-xl px-5"}`}
                initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                key={plan.name}
                transition={getTransition({ delay: index * 0.07, reducedMotion })}
                viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                      {plan.name}
                    </h2>
                    {plan.badge && (
                      <span className="rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-secondary-foreground">
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                    {plan.description}
                  </p>
                </div>

                <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                  {plan.features.map((feature) => (
                    <li
                      className="flex gap-3 text-base leading-relaxed text-foreground"
                      key={feature}
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-secondary"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col items-start gap-5 md:items-end">
                  <div className="md:text-right">
                    <p className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                      {price === "Personalizado" ? price : `$${price}`}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {showDiscountReference ? "referencia mensual" : plan.period}
                    </p>
                  </div>
                  <a
                    className={`inline-flex min-h-11 items-center justify-center rounded-lg px-5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${plan.highlighted ? "bg-secondary text-secondary-foreground hover:bg-secondary/90" : plan.isEnterprise ? "border border-border bg-surface-container-lowest text-foreground hover:bg-surface-container-highest" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
                    href={plan.href}
                  >
                    {plan.cta}
                    <span aria-hidden="true" className="ml-2">
                      ↗
                    </span>
                  </a>
                </div>
              </m.li>
            )
          })}
        </ol>

        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
          Precios expresados en CLP. No incluyen IVA. Puedes cancelar o modificar tu plan en
          cualquier momento. La referencia aplica 20% menos al precio mensual. No define la
          periodicidad de cobro.
        </p>
      </div>
    </section>
  )
}
