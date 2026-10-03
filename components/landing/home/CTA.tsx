"use client"

import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/ui/scroll-reveal"
import { LANDING_ANIMATION } from "@/lib/animations"

export function CTA() {
  return (
    <section className="py-28 md:py-40 bg-surface-container-low">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Reveal>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-5 leading-tight tracking-tight text-balance">
            Empieza tu próxima etapa en la{" "}
            <span className="text-accent font-semibold">ciencia</span>
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground mb-10 leading-relaxed max-w-xl mx-auto text-pretty">
            Profesionales y empresas, en un solo lugar.
          </p>
        </Reveal>

        <Reveal
          delay={LANDING_ANIMATION.sequenceDelay}
          scale={0.98}
          spring
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
        >
          <Button
            size="lg"
            className="w-full sm:w-auto h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-medium"
            asChild
          >
            <Link href="/register/professional">
              Crear cuenta gratis
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="ml-1.5" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto h-11 px-6 bg-surface-container-lowest border-border hover:bg-surface-container-low rounded-lg text-sm font-medium"
            asChild
          >
            <Link href="/register/organization">Soy empresa</Link>
          </Button>
        </Reveal>

        <Reveal delay={LANDING_ANIMATION.sequenceDelay * 2}>
          <Link
            href="/jobs?experiencia=junior"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-secondary font-medium transition-colors"
          >
            ¿Estudiante o recién graduado? Explora prácticas y vacantes junior
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="shrink-0" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
