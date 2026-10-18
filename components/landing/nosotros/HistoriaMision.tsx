export function HistoriaMision() {
  return (
    <section
      id="origen"
      className="scroll-mt-24 bg-surface-container-low pb-20 pt-28 sm:py-24 lg:py-32"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8">
        <div data-about-reveal className="lg:col-span-5">
          <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-wider text-secondary">
            El origen
          </p>
          <h2 className="max-w-xl text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Un conocimiento especializado necesita una búsqueda igual de precisa.
          </h2>
        </div>
        <div
          data-about-reveal
          className="space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg lg:col-span-6 lg:col-start-7"
        >
          <p>
            Encontrar trabajo en ciencias implica hablar de técnicas, áreas de estudio y experiencia
            que no siempre caben en una categoría general.
          </p>
          <p>
            Biovity nació para reunir esas oportunidades en un espacio dedicado a biotecnología,
            bioquímica, química, salud e investigación en Chile.
          </p>
          <p className="font-medium text-foreground">
            Queremos que profesionales y organizaciones puedan encontrarse con más contexto y
            transparencia.
          </p>
        </div>
        <div className="grid gap-0 border-t border-border/60 sm:grid-cols-3 lg:col-span-12 lg:mt-10">
          <article
            data-about-reveal
            className="border-b border-border/60 py-6 sm:border-r sm:px-6 sm:first:pl-0"
          >
            <p className="mb-2 font-mono text-xs uppercase tracking-wider text-secondary">Misión</p>
            <p className="text-sm leading-relaxed text-foreground">
              Acercar talento científico a oportunidades laborales relevantes.
            </p>
          </article>
          <article data-about-reveal className="border-b border-border/60 py-6 sm:border-r sm:px-6">
            <p className="mb-2 font-mono text-xs uppercase tracking-wider text-secondary">Visión</p>
            <p className="text-sm leading-relaxed text-foreground">
              Ser un espacio de referencia para el trabajo científico en Chile.
            </p>
          </article>
          <article data-about-reveal className="border-b border-border/60 py-6 sm:pl-6">
            <p className="mb-2 font-mono text-xs uppercase tracking-wider text-secondary">
              Principios
            </p>
            <p className="text-sm leading-relaxed text-foreground">
              Especialización, información clara y respeto por los datos.
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}
