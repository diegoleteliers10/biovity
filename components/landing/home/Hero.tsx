"use client"

import { Briefcase01Icon, Location05Icon, Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "../../ui/button"
import { Card } from "../../ui/card"
import { Input } from "../../ui/input"

export function Hero() {
  return (
    <section className="relative min-h-svh sm:h-svh flex items-center justify-center overflow-hidden contain-paint">
      <div className="absolute inset-0 bg-gradient-to-br from-[#f9f9fb] via-[#f3f3f5] to-[#f9f9fb] pointer-events-none">
        <div className="absolute top-[5%] left-[10%] w-[22rem] h-[22rem] bg-[#00374a]/25 rounded-full blur-3xl will-change-transform"></div>
        <div className="absolute top-[15%] right-[15%] w-[18rem] h-[18rem] bg-[#00374a]/20 rounded-full blur-2xl will-change-transform hidden sm:block"></div>
        <div className="absolute top-[55%] left-[5%] w-[20rem] h-[20rem] bg-[#006b5e]/30 rounded-full blur-3xl will-change-transform"></div>
        <div className="absolute top-[65%] right-[10%] w-[24rem] h-[24rem] bg-[#006b5e]/25 rounded-full blur-2xl will-change-transform hidden sm:block"></div>
        <div className="absolute bottom-[15%] left-[25%] w-[19rem] h-[19rem] bg-[#8483d4]/25 rounded-full blur-3xl will-change-transform"></div>
        <div className="absolute top-[35%] right-[30%] w-[16rem] h-[16rem] bg-[#8483d4]/20 rounded-full blur-2xl will-change-transform hidden sm:block"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 pt-safe-top md:pt-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1
            style={{
              animation: "hero-entrance-h1 0.5s cubic-bezier(0.23, 1, 0.32, 1) both",
            }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-foreground mb-4 md:mb-6 leading-tight px-2 text-balance"
          >
            Donde el talento y la
            <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
              {" "}
              ciencia{" "}
            </span>
            se encuentran
          </h1>

          <p
            style={{
              animation: "hero-entrance-p 0.5s cubic-bezier(0.23, 1, 0.32, 1) 0.12s both",
            }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4 text-pretty"
          >
            Ayudamos a profesionales y estudiantes a encontrar trabajo y oportunidades en
            biotecnología, bioquímica, química, ingeniería química y salud.
          </p>

          <div
            style={{
              animation: "hero-entrance-card 0.5s cubic-bezier(0.23, 1, 0.32, 1) 0.24s both",
            }}
          >
            <Card className="p-4 sm:p-6 max-w-4xl mx-auto bg-white/90 backdrop-blur-sm w-full px-4 sm:px-6 border border-border/10">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1 relative">
                  <HugeiconsIcon
                    icon={Briefcase01Icon}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5"
                  />
                  <Input
                    placeholder="¿Qué puesto buscas?"
                    className="pl-10 h-12 bg-white border border-border/20 focus:border-secondary focus:ring-secondary/20 transition-colors"
                  />
                </div>
                <div className="flex-1 relative">
                  <HugeiconsIcon
                    icon={Location05Icon}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5"
                  />
                  <Input
                    placeholder="¿Dónde?"
                    className="pl-10 h-12 bg-white border border-border/20 focus:border-secondary focus:ring-secondary/20 transition-colors"
                  />
                </div>
                <Button variant="secondary" size="lg" className="h-12 px-8 w-full sm:w-auto">
                  <HugeiconsIcon icon={Search01Icon} className="w-5 h-5" />
                  Buscar
                </Button>
              </div>
            </Card>

            <div className="flex flex-wrap justify-center gap-3 mt-6 md:mt-8 px-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs sm:text-sm text-muted-foreground"
              >
                <HugeiconsIcon icon={Briefcase01Icon} className="w-4 h-4 mr-2" />
                Para Profesionales
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs sm:text-sm text-muted-foreground"
              >
                <HugeiconsIcon icon={Search01Icon} className="w-4 h-4 mr-2" />
                Para Empresas
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}