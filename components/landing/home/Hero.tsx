"use client"

import {
  ArrowUpRight01Icon,
  Building06Icon,
  Location05Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { HeroIllustration } from "@/components/landing/home/HeroIllustration"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LANDING_ANIMATION } from "@/lib/animations"

const ease = LANDING_ANIMATION.easeOut

export function Hero() {
  const router = useRouter()
  const reducedMotion = Boolean(useReducedMotion())
  const [query, setQuery] = useState("")
  const [location, setLocation] = useState("")

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set("q", query.trim())
    if (location.trim()) params.set("ubicacion", location.trim())

    const searchString = params.toString()
    router.push(`/jobs${searchString ? `?${searchString}` : ""}`)
  }

  const reveal = (delay: number) => ({
    initial: reducedMotion ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reducedMotion ? 0 : 0.55, delay: reducedMotion ? 0 : delay, ease },
  })

  return (
    <section className="relative overflow-hidden bg-surface-container-lowest pb-16 pt-32 sm:pb-20 sm:pt-36 lg:pb-24 lg:pt-40">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
        <div className="relative z-10 lg:col-span-6">
          <m.p
            {...reveal(0)}
            className="mb-5 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-secondary"
          >
            Oportunidades en ciencias · Chile
          </m.p>
          <m.h1
            {...reveal(0.08)}
            className="mb-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Tu carrera científica puede <span className="text-accent">llegar más lejos.</span>
          </m.h1>
          <m.p
            {...reveal(0.16)}
            className="mb-8 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Encuentra empleos en biotecnología, bioquímica, química, salud e investigación.
          </m.p>

          <m.div {...reveal(0.24)} className="mb-6 max-w-3xl">
            <form
              onSubmit={handleSearch}
              className="rounded-xl border border-border/50 bg-surface-container-low p-2"
            >
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative min-w-0 flex-1">
                  <HugeiconsIcon
                    icon={Search01Icon}
                    aria-hidden="true"
                    className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    aria-label="Buscar cargo o habilidad"
                    placeholder="Cargo, técnica o especialidad"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="h-11 rounded-lg border-border/50 bg-surface-container-lowest pl-10 text-sm"
                  />
                </div>
                <div className="relative min-w-0 flex-1">
                  <HugeiconsIcon
                    icon={Location05Icon}
                    aria-hidden="true"
                    className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    aria-label="Buscar región o modalidad"
                    placeholder="Región, ciudad o remoto"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    className="h-11 rounded-lg border-border/50 bg-surface-container-lowest pl-10 text-sm"
                  />
                </div>
                <Button
                  type="submit"
                  className="h-11 w-full shrink-0 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 sm:w-auto"
                >
                  <HugeiconsIcon icon={Search01Icon} size={16} aria-hidden="true" />
                  Buscar empleos
                </Button>
              </div>
            </form>
          </m.div>

          <m.div {...reveal(0.32)} className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
            <Link
              href="/salaries"
              className="group inline-flex min-h-11 items-center gap-2 font-medium text-secondary transition-colors hover:text-primary"
            >
              Explorar salarios por carrera
              <HugeiconsIcon
                icon={ArrowUpRight01Icon}
                size={16}
                aria-hidden="true"
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href="/companies"
              className="inline-flex min-h-11 items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <HugeiconsIcon icon={Building06Icon} size={16} aria-hidden="true" />
              Soy una organización
            </Link>
          </m.div>
        </div>

        <m.div
          className="relative lg:col-span-6"
          initial={reducedMotion ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reducedMotion ? 0 : 0.7, delay: reducedMotion ? 0 : 0.12, ease }}
        >
          <HeroIllustration />
        </m.div>
      </div>
    </section>
  )
}
