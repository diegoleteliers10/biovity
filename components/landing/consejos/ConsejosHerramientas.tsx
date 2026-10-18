"use client"

import { ArrowRight01Icon, File02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import Link from "next/link"
import { getTransition } from "@/lib/animations"
import { CONSEJOS_HERRAMIENTAS } from "@/lib/data/consejos-carrera-data"

export function ConsejosHerramientas() {
  const reducedMotion = useReducedMotion()
  const transition = (delay = 0) => getTransition({ delay, reducedMotion })

  return (
    <section className="bg-surface-container-low py-16 sm:py-20 md:py-28">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-12 md:gap-12 lg:px-8">
        <m.div
          initial={{ opacity: 1, y: reducedMotion ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -50px 0px" }}
          transition={transition()}
          className="md:col-span-4"
        >
          <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
            Material de apoyo
          </p>
          <h2 className="text-3xl font-semibold leading-[1.05] tracking-tight text-foreground text-balance sm:text-4xl">
            Herramientas para tu carrera
          </h2>
        </m.div>

        <div className="divide-y divide-border border-y border-border md:col-span-8">
          {CONSEJOS_HERRAMIENTAS.map((tool, index) => (
            <m.article
              key={tool.id}
              initial={{ opacity: 1, x: reducedMotion ? 0 : 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "0px 0px -40px 0px" }}
              transition={transition(index * 0.05)}
              className="group grid gap-4 py-5 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-5"
            >
              <div className="flex size-11 items-center justify-center rounded-lg bg-surface-container-lowest text-secondary">
                <HugeiconsIcon icon={File02Icon} size={20} aria-hidden="true" />
              </div>
              <div>
                <p className="mb-1 font-mono text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
                  {tool.tag}
                </p>
                <h3 className="text-base font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-secondary sm:text-lg">
                  {tool.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {tool.description}
                </p>
              </div>
              <Link
                href="/register"
                className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-secondary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:justify-self-end"
              >
                {tool.buttonText}
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={16}
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
                />
              </Link>
            </m.article>
          ))}
        </div>
      </div>
    </section>
  )
}
