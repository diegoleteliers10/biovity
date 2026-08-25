"use client"

import { ColorsIcon, HierarchyIcon, Layers01Icon, SparklesIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const PRINCIPLES = [
  {
    icon: Layers01Icon,
    title: "The Curated Organism",
    subtitle: "Rigor biológico y sofisticación",
    description:
      "Rechazamos las plantillas rígidas y saturadas de SaaS genérico. Cada sección respira con espacio deliberado, emulando la precisión milimétrica de un laboratorio y la pureza editorial.",
  },
  {
    icon: HierarchyIcon,
    title: "Jerarquía Tonal Sin Bordes Pesados",
    subtitle: "Tonal Depth vs. Heavy Lines",
    description:
      "La profundidad visual se construye apilando superficies sutiles (surface-container-low, lowest y highest) en lugar de encerrar cada módulo en bordes negros o grises pesados.",
  },
  {
    icon: ColorsIcon,
    title: "Color Estratégico y con Propósito",
    subtitle: "«Si todo tiene color, nada destaca»",
    description:
      "La base neutra y sobria permite que el Verde Esmeralda (acciones y verificaciones) y el Violeta (términos clave y acentos de inteligencia) capturen la atención inmediata.",
  },
  {
    icon: SparklesIcon,
    title: "Uniformidad y Precisión Dimensional",
    subtitle: "Consistencia milimétrica en UI",
    description:
      "Inputs, selectores y botones comparten alturas estandarizadas (h-11) y curvaturas coherentes, asegurando una experiencia táctil y visual armoniosa.",
  },
]

export function MarcaPrinciples() {
  const reducedMotion = useReducedMotion()

  return (
    <section className="py-20 md:py-28 bg-surface-container-low" id="principios">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-3 block">
            Filosofía & Principios
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4 tracking-tight text-balance">
            La esencia de <span className="text-accent font-semibold">Biovity</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty">
            Cuatro pilares innegociables que guían cada decisión de producto, interfaz y
            comunicación.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PRINCIPLES.map((p, idx) => (
            <m.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -40px 0px" }}
              transition={{
                duration: reducedMotion ? 0.01 : 0.4,
                delay: idx * 0.08,
                ease: "easeOut",
              }}
            >
              <Card className="rounded-xl border-0 shadow-none bg-surface-container-lowest p-6 sm:p-8 h-full transition-colors hover:bg-white">
                <CardHeader className="p-0 mb-4">
                  <div className="size-11 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary mb-4">
                    <HugeiconsIcon icon={p.icon} size={22} />
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground tracking-tight">
                    {p.title}
                  </CardTitle>
                  <p className="text-xs font-mono text-secondary font-medium mt-1">{p.subtitle}</p>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
                    {p.description}
                  </p>
                </CardContent>
              </Card>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  )
}
