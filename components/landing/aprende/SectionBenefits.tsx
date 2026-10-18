const STEPS = [
  {
    number: "01",
    title: "Entiende el método",
    description: "Revisa conceptos y ejemplos aplicados a las ciencias biológicas.",
  },
  {
    number: "02",
    title: "Practica con código",
    description: "Sigue ejercicios para trabajar con datos biológicos.",
  },
  {
    number: "03",
    title: "Comprueba lo aprendido",
    description: "Responde un quiz al terminar cada cápsula.",
  },
  {
    number: "04",
    title: "Obtén tu certificado",
    description: "Aprueba el quiz y descarga tu certificado en PDF.",
  },
] as const

export function SectionBenefits() {
  return (
    <section id="recorrido" className="relative bg-surface-container-low py-20 sm:py-24 lg:py-32">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div data-learn-reveal className="mb-12 grid gap-5 lg:mb-16 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
              Un recorrido breve y práctico
            </p>
            <h2 className="max-w-3xl text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              De la primera idea a una habilidad que puedes{" "}
              <span className="text-accent">mostrar.</span>
            </h2>
          </div>
          <p className="max-w-lg text-pretty text-base leading-relaxed text-muted-foreground lg:col-span-4 lg:col-start-9">
            Cada cápsula combina contenido, práctica y evaluación en un mismo lugar.
          </p>
        </div>

        <ol className="grid border-t border-border/60 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <li
              key={step.number}
              data-learn-reveal
              className="relative border-b border-border/60 py-6 pr-6 sm:py-8 lg:border-b-0 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
            >
              <span className="mb-8 block font-mono text-xs text-secondary">{step.number}</span>
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 h-px w-10 bg-secondary"
                style={{ transformOrigin: "left" }}
              />
              <h3 className="mb-2 text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
