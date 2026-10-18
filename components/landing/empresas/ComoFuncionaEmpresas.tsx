import { HugeiconsIcon } from "@hugeicons/react"
import { PASOS_EMPRESAS } from "@/lib/data/empresas-data"

export function ComoFuncionaEmpresas() {
  return (
    <section
      aria-labelledby="companies-process-heading"
      className="bg-surface-container-lowest py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          data-company-reveal
          className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between md:mb-16"
        >
          <h2
            id="companies-process-heading"
            className="max-w-2xl text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl"
          >
            De una vacante a <span className="text-accent">tu próximo equipo.</span>
          </h2>
          <a
            href="#contacto"
            className="w-fit rounded-sm py-2 text-sm font-medium text-secondary underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            Conversemos sobre tu búsqueda
          </a>
        </div>
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {PASOS_EMPRESAS.map((paso, index) => (
            <li
              key={paso.title}
              data-company-reveal
              className="relative border-t border-border/60 pt-5 lg:pr-8"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="font-mono text-sm font-medium tabular-nums text-secondary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <HugeiconsIcon
                  icon={paso.icon}
                  size={20}
                  className="text-primary"
                  aria-hidden="true"
                />
              </div>
              <h3 className="mb-2 text-lg font-semibold tracking-tight text-foreground">
                {paso.title}
              </h3>
              <p className="text-base leading-relaxed text-muted-foreground">{paso.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
