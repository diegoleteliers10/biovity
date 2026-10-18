import { HugeiconsIcon } from "@hugeicons/react"
import { BENEFICIOS_EMPRESAS } from "@/lib/data/empresas-data"

export function PropuestaValor() {
  return (
    <section
      aria-labelledby="companies-value-heading"
      className="bg-surface-container-low py-20 md:py-28"
    >
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        <div data-company-reveal className="lg:col-span-4">
          <h2
            id="companies-value-heading"
            className="text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl"
          >
            La especialidad <span className="text-accent">cambia la búsqueda.</span>
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            Un CV no se resume en un cargo. Las técnicas, la formación y la experiencia también
            cuentan.
          </p>
        </div>
        <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:col-span-8">
          {BENEFICIOS_EMPRESAS.map((beneficio) => (
            <article
              key={beneficio.title}
              data-company-reveal
              className="border-t border-border/60 pt-5"
            >
              <HugeiconsIcon
                icon={beneficio.icon}
                size={24}
                className="mb-3 text-secondary"
                aria-hidden="true"
              />
              <h3 className="mb-2 text-lg font-semibold tracking-tight text-foreground">
                {beneficio.title}
              </h3>
              <p className="text-base leading-relaxed text-muted-foreground">
                {beneficio.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
