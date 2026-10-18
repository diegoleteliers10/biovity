"use client"

import { useGSAP } from "@gsap/react"
import { Chemistry01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import gsap from "gsap"
import { useRef, useState } from "react"
import { HIRING_BRIEFS } from "@/lib/data/companies-landing"

gsap.registerPlugin(useGSAP)

export function HiringBrief() {
  const [selected, setSelected] = useState<(typeof HIRING_BRIEFS)[number]>(HIRING_BRIEFS[0])
  const scope = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const media = gsap.matchMedia()
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-brief-detail]", {
          y: 8,
          opacity: 0,
          stagger: 0.04,
          duration: 0.3,
          ease: "power2.out",
          clearProps: "transform,opacity",
        })
      })
      return () => media.revert()
    },
    { scope, dependencies: [selected.id], revertOnUpdate: true }
  )

  return (
    <div
      ref={scope}
      className="grid min-w-0 gap-6 rounded-xl border border-border/50 bg-surface-container-low p-5 sm:p-7 lg:grid-cols-12 lg:gap-8"
    >
      <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-5 lg:col-span-12">
        <p className="font-mono text-xs font-semibold uppercase tracking-wider text-secondary">
          Cada búsqueda tiene su ciencia
        </p>
        <HugeiconsIcon
          icon={Chemistry01Icon}
          size={24}
          aria-hidden="true"
          className="shrink-0 text-primary"
        />
      </div>
      <fieldset className="min-w-0 lg:col-span-3 lg:border-r lg:border-border/60 lg:pr-5">
        <legend className="mb-3 text-xs font-medium text-muted-foreground lg:mb-4">
          Explora una especialidad
        </legend>
        <div className="flex flex-wrap gap-1 lg:flex-col">
          {HIRING_BRIEFS.map((brief) => (
            <button
              key={brief.id}
              type="button"
              aria-pressed={selected.id === brief.id}
              onClick={() => setSelected(brief)}
              className={`min-h-11 rounded-lg border px-3 text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:bg-surface-container-highest lg:flex lg:items-center lg:justify-between lg:text-left ${selected.id === brief.id ? "border-secondary/30 bg-secondary/10 text-foreground" : "border-transparent text-muted-foreground hover:bg-surface-container-highest/50 hover:text-foreground"}`}
            >
              {brief.label}
            </button>
          ))}
        </div>
      </fieldset>
      <div
        aria-live="polite"
        aria-atomic="true"
        className="min-h-64 min-w-0 sm:min-h-60 lg:col-span-9"
      >
        <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
          <div>
            <p data-brief-detail className="mb-3 font-mono text-xs text-muted-foreground">
              Ejemplo de vacante
            </p>
            <h2
              data-brief-detail
              className="mb-2 text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl"
            >
              {selected.title}
            </h2>
            <p data-brief-detail className="mb-6 text-sm text-muted-foreground">
              {selected.profession}
            </p>
          </div>
        </div>
        <ul
          data-brief-detail
          className="mb-6 flex flex-wrap gap-2"
          aria-label="Criterios técnicos del ejemplo"
        >
          {selected.criteria.map((criterion) => (
            <li
              key={criterion}
              className="rounded-md border border-border/50 bg-surface-container-lowest px-3 py-2 text-xs font-medium text-foreground"
            >
              {criterion}
            </li>
          ))}
        </ul>
        <p data-brief-detail className="text-sm leading-relaxed text-muted-foreground">
          {selected.focus}
        </p>
      </div>
      <div className="flex items-center gap-2 border-t border-border/60 pt-5 text-xs font-medium text-secondary lg:col-span-12">
        <HugeiconsIcon icon={Tick02Icon} size={16} aria-hidden="true" />
        Tú defines los criterios. Tu equipo decide.
      </div>
    </div>
  )
}
