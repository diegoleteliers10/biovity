import { Linkedin02Icon, Mail01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"

export function Equipo() {
  return (
    <section className="bg-surface-container-low pb-20 pt-28 sm:py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:gap-14 lg:px-8">
        <div
          data-about-reveal
          className="relative aspect-[4/3] overflow-hidden rounded-xl sm:aspect-[16/9] lg:col-span-5 lg:aspect-[4/5]"
        >
          <Image
            src="/avatarMe.jpeg"
            alt="Diego Letelier, fundador de Biovity"
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover object-top"
          />
        </div>
        <div data-about-reveal className="lg:col-span-6 lg:col-start-7">
          <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-wider text-secondary">
            Quién está detrás
          </p>
          <h2 className="mb-5 text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Un proyecto nacido desde la ciencia y el desarrollo de software.
          </h2>
          <h3 className="mb-1 text-lg font-semibold text-foreground">Diego Letelier</h3>
          <p className="mb-5 font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Fundador · Santiago, Chile
          </p>
          <p className="mb-7 max-w-xl text-base leading-relaxed text-muted-foreground">
            Creó Biovity para acercar oportunidades laborales, información salarial y herramientas
            de selección a las áreas científicas.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-border/60 pt-5">
            <a
              href="https://linkedin.com/in/diegoleteliers10"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <HugeiconsIcon icon={Linkedin02Icon} size={17} aria-hidden="true" />
              LinkedIn
            </a>
            <a
              href="mailto:dleteliers@biovity.cl"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <HugeiconsIcon icon={Mail01Icon} size={17} aria-hidden="true" />
              Contactar
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
