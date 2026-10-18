import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const ABOUT_ROUTES = [
  { label: "Empleos en ciencias", href: "/jobs", action: "Ver ofertas" },
  { label: "Referencias salariales", href: "/salaries", action: "Consultar datos" },
  { label: "Selección especializada", href: "/companies", action: "Ver herramientas" },
]

export function NosotrosHero() {
  return (
    <section
      aria-labelledby="about-heading"
      className="overflow-hidden bg-surface-container-lowest pb-14 pt-32 sm:pb-20 sm:pt-36 lg:pt-40"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-5xl">
          <p className="mb-6 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
            Nosotros · Biovity · Chile
          </p>
          <h1
            id="about-heading"
            data-about-statement
            className="max-w-5xl text-balance text-4xl font-semibold leading-[1.04] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            La ciencia merece <span className="text-accent">un espacio propio.</span>
          </h1>
        </header>

        <p
          data-about-detail
          className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          Biovity conecta a profesionales de biociencias con oportunidades laborales y acerca a las
          organizaciones al talento que necesitan.
        </p>

        <div className="relative mt-10 sm:mt-12">
          <svg
            aria-hidden="true"
            viewBox="0 0 1200 30"
            className="absolute inset-x-0 top-0 hidden h-8 w-full overflow-visible md:block"
            preserveAspectRatio="none"
          >
            <path
              data-about-hero-thread
              d="M 12 15 H 1188"
              fill="none"
              stroke="var(--secondary)"
              strokeWidth="1.5"
            />
            <circle cx="12" cy="15" r="4" fill="var(--secondary)" />
            <circle cx="600" cy="15" r="4" fill="var(--secondary)" />
            <circle cx="1188" cy="15" r="4" fill="var(--secondary)" />
          </svg>
          <svg
            aria-hidden="true"
            viewBox="0 0 20 320"
            className="absolute bottom-3 left-0 top-2 h-[calc(100%-1.5rem)] w-5 overflow-visible md:hidden"
            preserveAspectRatio="none"
          >
            <path
              data-about-hero-thread
              d="M 10 4 V 316"
              fill="none"
              stroke="var(--secondary)"
              strokeWidth="1.5"
            />
          </svg>
          <ol className="grid gap-3 md:grid-cols-3 md:gap-6 md:pt-8">
            {ABOUT_ROUTES.map((route) => (
              <li key={route.href} data-about-route className="relative min-w-0">
                <Link
                  href={route.href}
                  className="group flex min-h-16 items-center gap-4 border-b border-border/50 pb-4 pl-8 transition-colors duration-150 hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring md:block md:border-t md:pt-5 md:pl-0"
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-1/2 size-2 -translate-y-1/2 rounded-full bg-secondary md:hidden"
                  />
                  <span className="min-w-0 flex-1 md:block">
                    <span className="block text-base font-semibold text-foreground sm:text-lg">
                      {route.label}
                    </span>
                    <span className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors duration-150 group-hover:text-secondary">
                      {route.action}
                      <HugeiconsIcon icon={ArrowRight01Icon} size={14} aria-hidden="true" />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>

        <div data-about-actions className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button asChild className="h-11 rounded-lg px-6 text-sm font-medium">
            <Link href="/jobs">Explorar empleos</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-11 rounded-lg border-border/50 bg-surface-container-lowest px-6 text-sm font-medium hover:bg-surface-container-low"
          >
            <a href="#origen">Conocer nuestra historia</a>
          </Button>
        </div>

        <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2 border-t border-border/50 pt-5 font-mono text-xs uppercase tracking-wide text-muted-foreground sm:mt-12">
          <span>Biotecnología</span>
          <span>Bioquímica</span>
          <span>Química</span>
          <span>Investigación</span>
        </div>
      </div>
    </section>
  )
}
