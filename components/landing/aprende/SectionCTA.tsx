import Link from "next/link"
import { Button } from "@/components/ui/button"

export function SectionCTA() {
  return (
    <section className="bg-primary py-16 text-primary-foreground dark:bg-primary-container dark:text-foreground sm:py-20 lg:py-24">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-7 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div data-learn-reveal>
          <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground/70 dark:text-foreground/70">
            Empieza con una cápsula
          </p>
          <h2 className="max-w-2xl text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Lleva tus conocimientos científicos a la práctica.
          </h2>
        </div>
        <div data-learn-reveal>
          <Button asChild variant="secondary" className="h-11 rounded-lg px-6 text-sm font-medium">
            <Link href="/learn/bioinformatica/analisis-secuencias-adn-python">
              Explorar bioinformática
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
