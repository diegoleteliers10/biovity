"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function MarcaLogo() {
  return (
    <section className="py-20 md:py-28 bg-surface-container-lowest" id="logo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-3 block">
            Identidad Visual
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4 tracking-tight text-balance">
            Logotipo & <span className="text-accent font-semibold">Símbolo de Marca</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty">
            El símbolo de Biovity evoca una molécula y una red biológica en constante evolución.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Light Background Version */}
          <Card className="rounded-xl border border-border/40 bg-surface-container-low shadow-none p-8 flex flex-col items-center justify-center text-center">
            <div className="h-40 flex items-center justify-center gap-3">
              <div className="size-20 relative">
                <Image
                  src="/logoIconBiovity.png"
                  alt="Biovity Isotipo Claro"
                  width={80}
                  height={80}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-3xl font-bold tracking-tight text-[#00374a]">Biovity</span>
            </div>
            <div className="w-full pt-4 border-t border-border/60 flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span>Versión Positiva (Fondo Claro)</span>
              <span className="text-secondary font-semibold">Uso Principal</span>
            </div>
          </Card>

          {/* Dark Background Version */}
          <Card className="rounded-xl border-0 shadow-none bg-neutral-900 text-white p-8 flex flex-col items-center justify-center text-center">
            <div className="h-40 flex items-center justify-center gap-3">
              <div className="size-20 relative">
                <Image
                  src="/logoIconBiovity.png"
                  alt="Biovity Isotipo Oscuro"
                  width={80}
                  height={80}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-3xl font-bold tracking-tight text-white">Biovity</span>
            </div>
            <div className="w-full pt-4 border-t border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-400">
              <span>Versión Negativa (Fondo Oscuro)</span>
              <span className="text-accent font-semibold">Footer / Dark Mode</span>
            </div>
          </Card>
        </div>

        {/* Guidelines */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="rounded-xl border border-border/40 bg-surface-container-low shadow-none p-6">
            <CardHeader className="p-0 mb-3">
              <CardTitle className="text-base font-semibold text-foreground">
                Área de Protección
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 text-xs text-muted-foreground leading-relaxed">
              Mantener siempre un margen libre equivalente al 50% de la altura del isotipo alrededor
              del logotipo completo para garantizar legibilidad.
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-border/40 bg-surface-container-low shadow-none p-6">
            <CardHeader className="p-0 mb-3">
              <CardTitle className="text-base font-semibold text-foreground">
                Uso Correcto
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 text-xs text-muted-foreground leading-relaxed">
              Utilizar sobre fondos con alto contraste (`surface-container-lowest`,
              `surface-container-low` o fondos oscuros sólidos `neutral-900`).
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-border/40 bg-surface-container-low shadow-none p-6">
            <CardHeader className="p-0 mb-3">
              <CardTitle className="text-base font-semibold text-foreground">
                Uso Incorrecto
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 text-xs text-muted-foreground leading-relaxed">
              No alterar las proporciones, no aplicar sombras duras ni distorsionar los colores
              institucionales del símbolo o la tipografía.
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
