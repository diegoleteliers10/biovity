"use client"

import * as m from "motion/react-m"

export function NosotrosHero() {
  const ease = [0.23, 1, 0.32, 1] as const

  return (
    <section className="relative min-h-svh sm:h-svh w-full flex items-center justify-center overflow-hidden lg:contain-paint">
      <div className="absolute inset-0 bg-gradient-to-br from-[#f9f9fb] via-[#f3f3f5] to-[#f9f9fb] pointer-events-none">
        <div className="absolute top-[20%] left-[12%] size-[16rem] rounded-full bg-[#00374a]/18 blur-2xl will-change-transform sm:top-[5%] sm:left-[10%] sm:size-[22rem] sm:bg-[#00374a]/25 sm:blur-3xl"></div>
        <div className="absolute top-[15%] right-[15%] size-[18rem] bg-[#00374a]/20 rounded-full blur-2xl will-change-transform hidden sm:block"></div>
        <div className="absolute top-[55%] left-[5%] size-[20rem] bg-[#006b5e]/30 rounded-full blur-3xl will-change-transform hidden sm:block"></div>
        <div className="absolute top-[65%] right-[10%] size-[24rem] bg-[#006b5e]/25 rounded-full blur-2xl will-change-transform hidden sm:block"></div>
        <div className="absolute bottom-[15%] left-[25%] size-[19rem] bg-[#8483d4]/25 rounded-full blur-3xl will-change-transform hidden sm:block"></div>
        <div className="absolute top-[35%] right-[30%] size-[16rem] bg-[#8483d4]/20 rounded-full blur-2xl will-change-transform hidden sm:block"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 pt-20 md:pt-24">
        <div className="text-center max-w-4xl mx-auto">
          <m.h1
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-foreground mb-4 md:mb-6 leading-tight px-2 text-balance"
          >
            Conectando el <span className="text-accent font-semibold">Talento Científico</span> de
            Chile
          </m.h1>

          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12, ease }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4 text-pretty"
          >
            Creamos una comunidad que conecta profesionales y estudiantes en biociencias con
            oportunidades significativas en Chile.
          </m.p>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24, ease }}
            className="flex flex-wrap justify-center gap-8 md:gap-12 max-w-4xl mx-auto"
          >
            <m.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.36, ease }}
              className="text-center"
            >
              <p className="text-3xl font-bold text-foreground mb-1">+500</p>
              <p className="text-sm text-muted-foreground">profesionales activos</p>
            </m.div>
            <m.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.44, ease }}
              className="text-center"
            >
              <p className="text-3xl font-bold text-foreground mb-1">2026</p>
              <p className="text-sm text-muted-foreground">fundada</p>
            </m.div>
          </m.div>
        </div>
      </div>
    </section>
  )
}
