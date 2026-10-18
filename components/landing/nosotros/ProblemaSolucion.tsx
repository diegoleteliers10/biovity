import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"

const paths = [
  {
    label: "Para profesionales",
    title: "Empleos en ciencias",
    description: "Explora vacantes por especialidad, área y ubicación.",
    href: "/jobs",
  },
  {
    label: "Información salarial",
    title: "Referencias con fuente",
    description: "Consulta los datos disponibles y cómo se calcularon.",
    href: "/salaries",
  },
  {
    label: "Para organizaciones",
    title: "Búsqueda especializada",
    description: "Publica ofertas y organiza tus procesos de selección.",
    href: "/companies",
  },
]

export function ProblemaSolucion() {
  return (
    <section className="scroll-mt-32 bg-surface-container-lowest pb-20 pt-28 sm:py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8">
        <div data-about-reveal className="lg:col-span-5">
          <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-wider text-secondary">
            Lo que conectamos
          </p>
          <h2 className="max-w-xl text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Cada etapa necesita información útil.
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
            Biovity reúne herramientas para quienes buscan oportunidades y para los equipos que
            necesitan talento científico.
          </p>
        </div>
        <ol className="relative lg:col-span-6 lg:col-start-7">
          <svg
            aria-hidden="true"
            viewBox="0 0 1 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute left-[5px] top-10 h-[calc(100%-5rem)] w-px overflow-visible"
          >
            <path
              data-about-thread
              d="M 0.5 0 V 100"
              fill="none"
              stroke="var(--secondary)"
              strokeWidth="1"
            />
          </svg>
          {paths.map((item) => (
            <li key={item.href} data-about-reveal className="relative border-b border-border/60">
              <Link
                href={item.href}
                className="group flex min-h-32 items-start gap-5 py-6 pl-9 pr-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 12 12"
                  className="absolute left-0 top-[27px] size-3"
                >
                  <circle
                    cx="6"
                    cy="6"
                    r="4.5"
                    fill="var(--surface-container-lowest)"
                    stroke="var(--secondary)"
                    strokeWidth="2"
                  />
                </svg>
                <span className="min-w-0 flex-1">
                  <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {item.label}
                  </span>
                  <span className="mb-1 block text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-secondary">
                    {item.title}
                  </span>
                  <span className="block text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </span>
                </span>
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={18}
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-muted-foreground transition-transform duration-150 group-hover:translate-x-1 group-hover:text-secondary"
                />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
