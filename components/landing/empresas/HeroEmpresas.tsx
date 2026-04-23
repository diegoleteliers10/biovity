"use client"

import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import * as m from "motion/react-m"
import Link from "next/link"
import { HERO_STATS_EMPRESAS } from "@/lib/data/empresas-data"
import { Button } from "../../ui/button"

export function HeroEmpresas() {
  const ease = [0.23, 1, 0.32, 1] as const

  const scrollToContacto = () => {
    const contactSection = document.getElementById("contacto")
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative min-h-svh sm:h-svh w-full flex items-center justify-center overflow-hidden lg:contain-paint">
      <div className="absolute inset-0 bg-gradient-to-br from-[#f9f9fb] via-[#f3f3f5] to-[#f9f9fb] pointer-events-none">
        <div className="absolute top-[20%] left-[12%] h-[16rem] w-[16rem] rounded-full bg-[#00374a]/18 blur-2xl will-change-transform sm:top-[5%] sm:left-[10%] sm:h-[22rem] sm:w-[22rem] sm:bg-[#00374a]/25 sm:blur-3xl"></div>
        <div className="absolute top-[15%] right-[15%] w-[18rem] h-[18rem] bg-[#00374a]/20 rounded-full blur-2xl will-change-transform hidden sm:block"></div>
        <div className="absolute top-[55%] left-[5%] w-[20rem] h-[20rem] bg-[#006b5e]/30 rounded-full blur-3xl will-change-transform hidden sm:block"></div>
        <div className="absolute top-[65%] right-[10%] w-[24rem] h-[24rem] bg-[#006b5e]/25 rounded-full blur-2xl will-change-transform hidden sm:block"></div>
        <div className="absolute bottom-[15%] left-[25%] w-[19rem] h-[19rem] bg-[#8483d4]/25 rounded-full blur-3xl will-change-transform hidden sm:block"></div>
        <div className="absolute top-[35%] right-[30%] w-[16rem] h-[16rem] bg-[#8483d4]/20 rounded-full blur-2xl will-change-transform hidden sm:block"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 pt-20 md:pt-24">
        <div className="text-center max-w-4xl mx-auto">
          <m.h1
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-foreground mb-4 md:mb-6 leading-tight px-2 text-balance"
          >
            Conecta con el nuevo
            <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
              {" "}
              talento científico{" "}
            </span>
            de Chile
          </m.h1>

          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12, ease }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed font-sans px-4 text-pretty"
          >
            Simplifica tu proceso de reclutamiento y accede a profesionales cualificados en
            biotecnología, bioquímica, química e ingeniería química.
          </m.p>

          <m.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.24, ease }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Button size="lg" className="h-14 px-8 text-lg" asChild>
              <Link href="/register/organization">
                Comienza gratis
                <HugeiconsIcon icon={ArrowRight01Icon} className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-lg"
              onClick={scrollToContacto}
            >
              Hablar con ventas
            </Button>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.36, ease }}
            className="flex flex-wrap justify-center gap-8 md:gap-12"
          >
            {HERO_STATS_EMPRESAS.map((stat, index) => {
              const iconColor =
                index % 3 === 0
                  ? "text-accent"
                  : index % 3 === 1
                    ? "text-secondary"
                    : "text-muted-foreground"
              return (
                <m.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.36 + index * 0.08, ease }}
                  className="flex items-center gap-3"
                >
                  <div className="w-12 h-12 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center">
                    <HugeiconsIcon icon={stat.icon} size={28} className={iconColor} />
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </m.div>
              )
            })}
          </m.div>
        </div>
      </div>
    </section>
  )
}