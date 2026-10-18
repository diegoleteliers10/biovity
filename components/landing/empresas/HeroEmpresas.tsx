import { ArrowDown01Icon, ArrowRight01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HiringBrief } from "./HiringBrief"

export function HeroEmpresas() {
  return (
    <section
      aria-labelledby="companies-heading"
      className="overflow-hidden bg-surface-container-lowest pb-12 pt-32 sm:pb-16 sm:pt-36 lg:pt-40"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 max-w-5xl sm:mb-12">
          <p className="mb-5 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
            Para quienes contratan en ciencias · Chile
          </p>
          <h1
            id="companies-heading"
            data-company-heading
            className="max-w-5xl text-balance text-4xl font-semibold leading-[1.04] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            El talento que tu <span className="text-accent">ciencia necesita.</span>
          </h1>
        </header>

        <div className="grid items-start gap-8 border-t border-border/50 pt-8 lg:grid-cols-12 lg:gap-10 lg:pt-10">
          <div data-company-notes className="lg:col-span-4 lg:pt-2">
            <p className="mb-7 max-w-md text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Conecta con profesionales de biociencias. Publica tus ofertas, evalúa perfiles
              técnicos y coordina cada etapa con tu equipo.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Button asChild className="h-11 rounded-lg px-6 text-sm font-medium">
                <Link href="/register/organization">
                  Publicar una oferta
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={16}
                    className="ml-2"
                    aria-hidden="true"
                  />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-lg border-border/50 bg-surface-container-lowest px-6 text-sm font-medium hover:bg-surface-container-low"
              >
                <a href="#demo-reclutamiento">
                  Explorar la plataforma
                  <HugeiconsIcon
                    icon={ArrowDown01Icon}
                    size={16}
                    className="ml-2"
                    aria-hidden="true"
                  />
                </a>
              </Button>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-1.5">
                <HugeiconsIcon icon={Tick02Icon} size={14} aria-hidden="true" />
                Plan gratuito disponible
              </li>
              <li className="flex items-center gap-1.5">
                <HugeiconsIcon icon={Tick02Icon} size={14} aria-hidden="true" />
                Sin tarjeta de crédito
              </li>
            </ul>
          </div>
          <div data-company-board className="min-w-0 lg:col-span-8">
            <HiringBrief />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-border/50 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">Un espacio para equipos que trabajan en</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-foreground">
            <li>Laboratorios</li>
            <li>Biotecnología</li>
            <li>Industria</li>
            <li>Centros de I+D</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
