"use client"

import { ArrowRight01Icon, CheckmarkCircle02Icon, Location01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
  getSpringTransition,
  getTransition,
  LANDING_ANIMATION,
  LANDING_ANIMATION_MOBILE,
} from "@/lib/animations"
import { BENEFITS_FOR_STUDENTS } from "@/lib/data/home-data"

export function ForStudents() {
  const reducedMotion = useReducedMotion()
  const isMobile = useMediaQuery("(max-width: 767px)")
  const isReduced = Boolean(reducedMotion)

  const viewportMargin = isMobile
    ? LANDING_ANIMATION_MOBILE.viewportMargin
    : LANDING_ANIMATION.viewportMargin
  const yOffset = isReduced ? 0 : isMobile ? 16 : 24

  const t = (delay = 0) => getTransition({ delay, reducedMotion, isMobile })
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion, isMobile })

  return (
    <section className="py-20 md:py-28 bg-surface-container-lowest">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <m.div
          initial={isReduced ? false : { opacity: 0, y: isMobile ? 16 : 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: viewportMargin }}
          transition={t(0)}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-3 block">
            Estudiantes & Nuevos Graduados
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4 tracking-tight text-balance">
            Inicia tu carrera científica en{" "}
            <span className="text-accent font-semibold">las mejores manos</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty">
            Encuentra prácticas profesionales, tesinas remuneradas y primeros empleos diseñados
            específicamente para graduados y estudiantes en Chile.
          </p>
        </m.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto items-stretch">
          {/* Left: Benefits summary card */}
          <m.div
            initial={isReduced ? false : { opacity: 0, y: yOffset, x: isMobile ? 0 : -24 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true, margin: viewportMargin }}
            transition={ts(0)}
            className="bg-surface-container-low rounded-xl p-6 sm:p-8 md:p-10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-3 pb-5 mb-6 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">
                  Beneficios para Jóvenes Investigadores
                </h3>
                <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-surface-container-highest text-muted-foreground">
                  Acceso directo
                </span>
              </div>

              <div className="space-y-6">
                {BENEFITS_FOR_STUDENTS.map((benefit, index) => {
                  const isViolet = index % 2 === 1
                  return (
                    <div key={benefit.title} className="flex items-start gap-4">
                      <div
                        className={`size-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          isViolet ? "bg-accent/15 text-accent" : "bg-secondary/15 text-secondary"
                        }`}
                      >
                        <HugeiconsIcon icon={benefit.icon} size={16} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-1">
                          {benefit.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-pretty">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-border">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-medium"
              >
                <Link href="/trabajos?experiencia=junior">
                  Explorar vacantes junior y prácticas
                  <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="ml-1.5" />
                </Link>
              </Button>
            </div>
          </m.div>

          {/* Right: Verified Candidate Profile Card */}
          <m.div
            initial={isReduced ? false : { opacity: 0, y: yOffset, x: isMobile ? 0 : 24 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true, margin: viewportMargin }}
            transition={ts(isMobile ? LANDING_ANIMATION_MOBILE.stagger : LANDING_ANIMATION.stagger)}
            className="bg-surface-container-low rounded-xl p-6 sm:p-8 md:p-10 border border-secondary/40 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-secondary/5 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between gap-3 pb-5 mb-6 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">Perfil Técnico Biovity</h3>
                <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-secondary/15 text-secondary border border-secondary/20">
                  Candidato verificado
                </span>
              </div>

              {/* Profile Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className="size-12 shrink-0 rounded-xl bg-secondary/15 border border-secondary/30 flex items-center justify-center text-secondary font-bold text-base font-mono">
                  SA
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-semibold text-foreground text-sm sm:text-base truncate">
                      Sofía Alarcón
                    </h4>
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      size={16}
                      className="text-secondary shrink-0"
                    />
                  </div>
                  <p className="text-muted-foreground text-xs font-medium">
                    Ingeniería Civil en Biotecnología
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground/80 mt-0.5">
                    <HugeiconsIcon icon={Location01Icon} size={12} className="shrink-0" />
                    <span>Santiago, Chile</span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-secondary/10 text-secondary border border-secondary/20">
                  ● Disponible para Práctica / I+D
                </span>
              </div>

              {/* Skills */}
              <div className="mb-4">
                <h5 className="text-[11px] font-mono font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Técnicas Experimentales
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 text-xs font-mono rounded-lg bg-surface-container-lowest border border-border text-foreground">
                    qPCR / RT-PCR
                  </span>
                  <span className="px-2.5 py-1 text-xs font-mono rounded-lg bg-surface-container-lowest border border-border text-foreground">
                    Cultivo Celular
                  </span>
                  <span className="px-2.5 py-1 text-xs font-mono rounded-lg bg-surface-container-lowest border border-border text-foreground">
                    HPLC & Cromatografía
                  </span>
                  <span className="px-2.5 py-1 text-xs font-mono rounded-lg bg-surface-container-lowest border border-border text-foreground">
                    CRISPR-Cas9
                  </span>
                </div>
              </div>

              {/* Thesis */}
              <div className="p-3 bg-surface-container-lowest rounded-lg border border-border text-xs text-foreground leading-relaxed">
                <strong className="font-semibold text-secondary block mb-0.5">
                  Tesis de Grado:
                </strong>
                Optimización de vectores de expresión recombinante en{" "}
                <em className="italic">E. coli</em>.
              </div>
            </div>

            {/* Profile Bar */}
            <div className="mt-6 pt-4 border-t border-border relative z-10">
              <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
                <span className="text-muted-foreground">Completitud del perfil</span>
                <span className="font-bold text-secondary">95%</span>
              </div>
              <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-secondary rounded-full" style={{ width: "95%" }} />
              </div>
            </div>
          </m.div>
        </div>
      </div>
    </section>
  )
}
