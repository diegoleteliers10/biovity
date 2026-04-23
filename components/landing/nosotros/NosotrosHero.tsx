"use client"

export function NosotrosHero() {
  return (
    <section className="relative min-h-svh sm:h-svh w-full flex items-center justify-center overflow-hidden contain-paint">
      <div className="absolute inset-0 bg-gradient-to-br from-[#f9f9fb] via-[#f3f3f5] to-[#f9f9fb] pointer-events-none">
        <div className="absolute top-[5%] left-[10%] w-[22rem] h-[22rem] bg-[#00374a]/25 rounded-full blur-3xl will-change-transform"></div>
        <div className="absolute top-[15%] right-[15%] w-[18rem] h-[18rem] bg-[#00374a]/20 rounded-full blur-2xl will-change-transform hidden sm:block"></div>
        <div className="absolute top-[55%] left-[5%] w-[20rem] h-[20rem] bg-[#006b5e]/30 rounded-full blur-3xl will-change-transform"></div>
        <div className="absolute top-[65%] right-[10%] w-[24rem] h-[24rem] bg-[#006b5e]/25 rounded-full blur-2xl will-change-transform hidden sm:block"></div>
        <div className="absolute bottom-[15%] left-[25%] w-[19rem] h-[19rem] bg-[#8483d4]/25 rounded-full blur-3xl will-change-transform"></div>
        <div className="absolute top-[35%] right-[30%] w-[16rem] h-[16rem] bg-[#8483d4]/20 rounded-full blur-2xl will-change-transform hidden sm:block"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 pt-20 md:pt-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-foreground mb-4 md:mb-6 leading-tight px-2 text-balance hero-animate-h1">
            Conectando el{" "}
            <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
              Talento Científico
            </span>{" "}
            de Chile
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4 text-pretty hero-animate-p">
            Creamos una comunidad que conecta profesionales y estudiantes en biociencias con
            oportunidades significativas en Chile.
          </p>

          <div className="flex flex-wrap justify-center gap-8 md:gap-12 max-w-4xl mx-auto hero-animate-stats">
            <div className="text-center" style={{ animationDelay: "0.36s" }}>
              <p className="text-3xl font-bold text-foreground mb-1">+500</p>
              <p className="text-sm text-muted-foreground">profesionales activos</p>
            </div>
            <div className="text-center" style={{ animationDelay: "0.44s" }}>
              <p className="text-3xl font-bold text-foreground mb-1">2026</p>
              <p className="text-sm text-muted-foreground">fundada</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}