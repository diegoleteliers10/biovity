"use client"

import { ArrowRight01Icon, Briefcase01Icon, FileAddIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import * as m from "motion/react-m"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function ConsejosCTA() {
  const ease = [0.23, 1, 0.32, 1] as const

  return (
    <section className="py-20 md:py-28 bg-surface-container-lowest relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 via-transparent to-accent/10 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-4">
            <HugeiconsIcon icon={Briefcase01Icon} className="size-4" />
            <span>Da el siguiente paso</span>
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight text-balance">
            ¿Listo para impulsar tu carrera en <span className="text-accent">Biociencias</span>?
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed text-pretty">
            Crea tu perfil profesional en Biovity, sube tu CV optimizado y accede a las mejores ofertas laborales en empresas líderes de biotecnología, química y farmacia en Chile.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto px-8" asChild>
              <Link href="/register" className="inline-flex items-center justify-center gap-2">
                <HugeiconsIcon icon={FileAddIcon} className="size-5" />
                <span>Crear Perfil & Subir CV</span>
              </Link>
            </Button>

            <Button size="lg" variant="outline" className="w-full sm:w-auto px-8" asChild>
              <Link href="/trabajos" className="inline-flex items-center justify-center gap-2">
                <span>Buscar empleos en ciencias</span>
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-5" />
              </Link>
            </Button>
          </div>
        </m.div>
      </div>
    </section>
  )
}
