"use client"

import {
  ArrowRight01Icon,
  Linkedin02Icon,
  Mail01Icon,
  SparklesIcon,
  UserMultiple02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import Image from "next/image"
import Link from "next/link"
import { getSpringTransition, getTransition, LANDING_ANIMATION } from "@/lib/animations"

export function Equipo() {
  const reducedMotion = useReducedMotion()
  const t = (delay = 0) => getTransition({ delay, reducedMotion })
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })

  return (
    <section className="py-20 md:py-28 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <m.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={t(0)}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-3 block">
            Liderazgo & Ecosistema
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4 tracking-tight text-balance">
            Quiénes construyen <span className="text-accent font-semibold">Biovity</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty">
            Una plataforma desarrollada desde la intersección entre biociencias, ingeniería de
            software y compromiso con la comunidad científica.
          </p>
        </m.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-stretch">
          {/* Founder Profile Card - Structured with border */}
          <m.div
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={ts(0)}
            className="lg:col-span-6 bg-surface-container-lowest rounded-xl p-6 sm:p-8 border border-border flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="size-24 rounded-2xl overflow-hidden border border-border">
                  <Image
                    src="/avatarMe.jpeg"
                    alt="Diego Letelier, Fundador de Biovity"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Diego Letelier</h3>
                  <p className="text-xs font-mono font-medium text-secondary uppercase tracking-wider">
                    Fundador & Lead Developer
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Santiago, Chile</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-6 text-pretty">
                Desarrollador de software e innovador en biotecnología. Creó Biovity con el objetivo
                de dotar a la comunidad científica chilena de herramientas de datos y empleo que
                estén al nivel de los principales hubs de innovación global.
              </p>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {["Biotecnología", "Data Analytics", "Full-Stack", "Ecosistema STEM"].map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-surface-container-low text-muted-foreground border border-border"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <a
                href="https://linkedin.com/in/diegoleteliers10"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-medium text-primary hover:text-secondary transition-colors"
                aria-label="Perfil de LinkedIn de Diego Letelier"
              >
                <HugeiconsIcon icon={Linkedin02Icon} size={16} />
                <span>linkedin.com/in/diegoleteliers10</span>
              </a>

              <a
                href="mailto:contacto@biovity.cl"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Enviar correo a Diego Letelier"
              >
                <HugeiconsIcon icon={Mail01Icon} size={15} />
                <span>Contacto</span>
              </a>
            </div>
          </m.div>

          {/* Ecosystem / Community Card - Seamless borderless surface */}
          <m.div
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={ts(LANDING_ANIMATION.stagger)}
            className="lg:col-span-6 bg-surface-container-lowest rounded-xl p-6 sm:p-8 flex flex-col justify-between"
          >
            <div>
              <div className="size-10 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary mb-5">
                <HugeiconsIcon icon={UserMultiple02Icon} size={20} />
              </div>

              <h3 className="text-xl font-semibold text-foreground mb-2">
                Impulsado por la comunidad
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 text-pretty">
                Biovity no es solo una plataforma tecnológica; es una iniciativa colaborativa donde
                participan científicos, universidades, centros de I+D y empresas que apuestan por la
                transparencia.
              </p>

              <div className="space-y-3.5 mb-6">
                <div className="flex items-start gap-3">
                  <HugeiconsIcon
                    icon={SparklesIcon}
                    size={16}
                    className="text-secondary shrink-0 mt-0.5"
                  />
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground font-medium">Dataset Colaborativo:</strong>{" "}
                    Más de 500 profesionales han compartido sus salarios de forma altruista.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <HugeiconsIcon
                    icon={SparklesIcon}
                    size={16}
                    className="text-secondary shrink-0 mt-0.5"
                  />
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground font-medium">Feedback Continuo:</strong>{" "}
                    Consultamos regularmente a investigadores para afinar los filtros y taxonomías
                    científicas.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <Link
                href="/empresas#contacto"
                className="inline-flex items-center gap-2 text-xs font-medium text-secondary hover:text-secondary/80 transition-colors"
              >
                <span>¿Representas una institución o empresa bio? Conversemos</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
              </Link>
            </div>
          </m.div>
        </div>
      </div>
    </section>
  )
}
