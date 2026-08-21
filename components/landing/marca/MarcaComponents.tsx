"use client"

import {
  ArrowDown01Icon,
  ArrowRight01Icon,
  Search01Icon,
  SparklesIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export function MarcaComponents() {
  const [isAnualDemo, setIsAnualDemo] = useState(false)

  return (
    <section className="py-20 md:py-28 bg-surface-container-low" id="componentes">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-3 block">
            Biblioteca de Componentes
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4 tracking-tight text-balance">
            Patrones & Componentes <span className="text-accent font-semibold">Interactivos</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty">
            Muestrario funcional de los elementos UI estandarizados que componen las interfaces de Biovity.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 1. Botones */}
          <Card className="rounded-xl border-0 shadow-none bg-surface-container-lowest p-6 sm:p-8">
            <CardHeader className="p-0 mb-5">
              <span className="text-xs font-mono text-secondary uppercase font-semibold">
                01 • Botones & Acciones
              </span>
              <CardTitle className="text-xl font-semibold text-foreground">
                Variantes de Botones
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Button className="h-11 px-5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-medium">
                  Primary Button
                  <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="ml-1.5" />
                </Button>

                <Button className="h-11 px-5 bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-lg text-sm font-medium">
                  Secondary CTA
                  <HugeiconsIcon icon={Tick02Icon} size={16} className="ml-1.5" />
                </Button>

                <Button
                  variant="outline"
                  className="h-11 px-5 bg-surface-container-lowest border-border/60 hover:bg-surface-container-low rounded-lg text-sm font-medium"
                >
                  Outline Button
                </Button>

                <Button
                  variant="ghost"
                  className="h-11 px-4 text-muted-foreground hover:text-foreground rounded-lg text-sm font-medium"
                >
                  Ghost Action
                </Button>
              </div>
              <p className="text-xs text-muted-foreground pt-2">
                Estandarizados con altura <code>h-11</code>, esquinas <code>rounded-lg</code> y transiciones suaves.
              </p>
            </CardContent>
          </Card>

          {/* 2. Switch Toggle */}
          <Card className="rounded-xl border-0 shadow-none bg-surface-container-lowest p-6 sm:p-8">
            <CardHeader className="p-0 mb-5">
              <span className="text-xs font-mono text-secondary uppercase font-semibold">
                02 • Controles de Selección
              </span>
              <CardTitle className="text-xl font-semibold text-foreground">
                Interruptor Mensual / Anual
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <div className="flex items-center gap-3.5 p-4 rounded-xl bg-surface-container-low border border-border/30 w-fit">
                <button
                  type="button"
                  onClick={() => setIsAnualDemo(false)}
                  className={`text-sm transition-colors cursor-pointer ${
                    !isAnualDemo ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Mensual
                </button>

                <button
                  type="button"
                  role="switch"
                  aria-checked={isAnualDemo}
                  onClick={() => setIsAnualDemo(!isAnualDemo)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    isAnualDemo
                      ? "bg-secondary border-secondary"
                      : "bg-neutral-200 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600"
                  }`}
                  aria-label="Alternar modo"
                >
                  <span
                    className={`pointer-events-none inline-block size-5 rounded-full bg-white shadow-md ring-1 ring-black/10 transition-transform duration-200 ease-in-out ${
                      isAnualDemo ? "translate-x-[21px]" : "translate-x-0.5"
                    }`}
                  />
                </button>

                <button
                  type="button"
                  onClick={() => setIsAnualDemo(true)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <span
                    className={`text-sm transition-colors ${
                      isAnualDemo ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Anual
                  </span>
                  <span className="text-[11px] font-mono font-semibold text-accent bg-accent/15 border border-accent/20 px-2 py-0.5 rounded-full">
                    -20% dto
                  </span>
                </button>
              </div>
              <p className="text-xs text-muted-foreground pt-2">
                Pista gris de alto contraste para el estado inactivo y verde esmeralda para el estado activo.
              </p>
            </CardContent>
          </Card>

          {/* 3. Métricas Cards */}
          <Card className="rounded-xl border-0 shadow-none bg-surface-container-lowest p-6 sm:p-8">
            <CardHeader className="p-0 mb-5">
              <span className="text-xs font-mono text-secondary uppercase font-semibold">
                03 • Estadísticas & Cifras
              </span>
              <CardTitle className="text-xl font-semibold text-foreground">
                Tarjetas Métricas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-container-low rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-foreground mb-0.5 tracking-tight">
                    +150
                  </p>
                  <p className="text-xs font-medium text-foreground">
                    Empresas activas
                  </p>
                </div>
                <div className="bg-surface-container-low rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-foreground mb-0.5 tracking-tight">
                    98.4%
                  </p>
                  <p className="text-xs font-medium text-foreground">
                    Satisfacción ATS
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground pt-4">
                Tipografía Satoshi bold, contenedor tonal `surface-container-low` sin bordes y texto centrado.
              </p>
            </CardContent>
          </Card>

          {/* 4. Badges & Chips */}
          <Card className="rounded-xl border-0 shadow-none bg-surface-container-lowest p-6 sm:p-8">
            <CardHeader className="p-0 mb-5">
              <span className="text-xs font-mono text-secondary uppercase font-semibold">
                04 • Micro-etiquetas & Badges
              </span>
              <CardTitle className="text-xl font-semibold text-foreground">
                Píldoras de Estado
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-mono font-semibold text-secondary bg-secondary/10 border border-secondary/20 px-2.5 py-1 rounded-full">
                  Paso 01
                </span>
                <span className="text-xs font-mono font-semibold text-accent bg-accent/10 border border-accent/25 px-2.5 py-1 rounded-full">
                  Paso 03
                </span>
                <Badge variant="secondary" className="bg-accent/15 text-accent border-0 text-[11px] px-2.5 py-0.5 font-mono">
                  <HugeiconsIcon icon={SparklesIcon} size={12} className="mr-1" />
                  AI Match
                </Badge>
                <span className="text-xs font-mono font-semibold text-secondary-foreground bg-secondary px-3 py-1 rounded-full">
                  Recomendado
                </span>
              </div>
              <p className="text-xs text-muted-foreground pt-2">
                Utilizados para números de paso, estados inteligentes y recomendaciones.
              </p>
            </CardContent>
          </Card>

          {/* 5. Inputs & Selects Group (Full Width) */}
          <Card className="rounded-xl border-0 shadow-none bg-surface-container-lowest p-6 sm:p-8 lg:col-span-2">
            <CardHeader className="p-0 mb-5">
              <span className="text-xs font-mono text-secondary uppercase font-semibold">
                05 • Formularios & Filtros
              </span>
              <CardTitle className="text-xl font-semibold text-foreground">
                Barra de Búsqueda Homogénea (Regla de Misma Altura h-11)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                <div className="relative flex-1 w-full">
                  <Input
                    placeholder="Buscar por cargo, técnica o especialidad..."
                    className="h-11 bg-surface-container-low border-border/40 pl-10 pr-4 text-sm rounded-lg w-full"
                  />
                  <HugeiconsIcon
                    icon={Search01Icon}
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                </div>

                <div className="relative w-full sm:w-56">
                  <select
                    className="h-11 w-full appearance-none rounded-lg border border-border/40 bg-surface-container-low px-3.5 pr-9 text-xs sm:text-sm text-foreground focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
                    aria-label="Filtrar por región"
                  >
                    <option>Todas las regiones</option>
                    <option>Región Metropolitana</option>
                    <option>Antofagasta</option>
                    <option>Valparaíso</option>
                  </select>
                  <HugeiconsIcon
                    icon={ArrowDown01Icon}
                    size={16}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                </div>

                <Button className="h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-medium w-full sm:w-auto shrink-0">
                  Explorar Ofertas
                </Button>
              </div>
              <p className="text-xs text-muted-foreground pt-2">
                Todos los controles en una misma fila conservan la altura <code>h-11</code> para evitar desalineaciones en la cuadrícula visual.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
