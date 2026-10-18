import { Button } from "@/components/ui/button"
import { LearnHeroFigure } from "./LearnHeroFigure"

export function SectionHero() {
  return (
    <section
      aria-labelledby="learn-heading"
      className="overflow-hidden bg-surface-container-lowest pb-12 pt-32 sm:pb-16 sm:pt-36 lg:pt-40"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-4xl text-center">
          <p className="mb-5 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
            Aprendizaje aplicado · Biovity
          </p>
          <h1
            id="learn-heading"
            data-learn-heading
            className="text-balance text-4xl font-semibold leading-[1.04] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Aprende con <span className="text-accent">datos biológicos.</span>
          </h1>
          <p
            data-learn-description
            className="mx-auto mb-5 mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:mb-6 sm:mt-4 sm:text-lg"
          >
            Cápsulas prácticas de bioinformática e inteligencia artificial para biotecnología. Lee,
            practica y comprueba lo que aprendiste.
          </p>
          <div data-learn-actions className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild className="h-11 rounded-lg px-6 text-sm font-medium">
              <a href="#capsulas">Explorar cápsulas</a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-lg border-border/50 bg-surface-container-lowest px-6 text-sm font-medium hover:bg-surface-container-low"
            >
              <a href="#recorrido">Ver cómo funciona</a>
            </Button>
          </div>
        </header>

        <figure data-learn-figure className="mx-auto mt-6 max-w-[52rem] sm:mt-7 lg:mt-6">
          <LearnHeroFigure />
          <figcaption className="mt-1 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground sm:text-xs">
            Una cápsula: contenido, práctica, quiz y certificado
          </figcaption>
        </figure>

        <div className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-x-6 gap-y-2 border-t border-border/50 pt-5 font-mono text-xs uppercase tracking-wide text-muted-foreground sm:mt-9">
          <span>Bioinformática</span>
          <span>IA y biotech</span>
          <span>Python y Biopython</span>
        </div>
      </div>
    </section>
  )
}
