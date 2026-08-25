"use client"

import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type ColorToken = {
  name: string
  role: string
  hex: string
  rgb: string
  cssVar: string
  bgClass: string
  textLight?: boolean
  description: string
}

const BRAND_COLORS: ColorToken[] = [
  {
    name: "Deep Slate Navy",
    role: "Primary",
    hex: "#00374a",
    rgb: "0, 55, 74",
    cssVar: "--primary",
    bgClass: "bg-[#00374a]",
    textLight: true,
    description:
      "Botones principales, encabezados corporativos, elementos estructurales de alto peso.",
  },
  {
    name: "Emerald Green",
    role: "Secondary",
    hex: "#006b5e",
    rgb: "0, 107, 94",
    cssVar: "--secondary",
    bgClass: "bg-[#006b5e]",
    textLight: true,
    description:
      "Eyebrows en mayúsculas, estados activos, checks de verificación y llamados a la acción secundarios.",
  },
  {
    name: "Biovity Violet",
    role: "Accent",
    hex: "#8483d4",
    rgb: "132, 131, 212",
    cssVar: "--accent",
    bgClass: "bg-[#8483d4]",
    textLight: true,
    description:
      "Acentos en palabras clave de títulos (<span>), badges de IA, descuentos e inteligencia.",
  },
  {
    name: "Slate Gray",
    role: "Muted Text",
    hex: "#71787d",
    rgb: "113, 120, 125",
    cssVar: "--muted-foreground",
    bgClass: "bg-[#71787d]",
    textLight: true,
    description: "Párrafos descriptivos, subtítulos, etiquetas secundarias y metadatos de apoyo.",
  },
]

const SURFACE_COLORS: ColorToken[] = [
  {
    name: "Surface Lowest (White)",
    role: "Canvas / Raised Cards",
    hex: "#ffffff",
    rgb: "255, 255, 255",
    cssVar: "--surface-container-lowest",
    bgClass: "bg-white border border-border/40",
    textLight: false,
    description: "Fondo principal de la aplicación, tarjetas sobre fondos low y modales flotantes.",
  },
  {
    name: "Surface Low",
    role: "Tonal Sections",
    hex: "#f3f3f5",
    rgb: "243, 243, 245",
    cssVar: "--surface-container-low",
    bgClass: "bg-[#f3f3f5] border border-border/30",
    textLight: false,
    description: "Secciones alternadas, tarjetas de estadísticas y contenedores de formularios.",
  },
  {
    name: "Surface Highest",
    role: "Interactive Chips",
    hex: "#e2e2e4",
    rgb: "226, 226, 228",
    cssVar: "--surface-container-highest",
    bgClass: "bg-[#e2e2e4]",
    textLight: false,
    description:
      "Hover states, chips inactivos, divisores sutiles y pastillas de fondo secundario.",
  },
]

export function MarcaColors() {
  const [copiedHex, setCopiedHex] = useState<string | null>(null)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedHex(text)
    setTimeout(() => setCopiedHex(null), 2000)
  }

  return (
    <section className="py-20 md:py-28 bg-surface-container-lowest" id="colores">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-3 block">
            Paleta Cromática
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4 tracking-tight text-balance">
            Colores de Marca &{" "}
            <span className="text-accent font-semibold">Superficies Tonales</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty">
            Haz clic en cualquier muestra de color para copiar su valor HEX o variable CSS al
            portapapeles.
          </p>
        </div>

        {/* Brand Colors */}
        <div className="mb-14">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <span>Colores Principales</span>
            <span className="text-xs font-mono text-muted-foreground font-normal">
              (Core Brand Identity)
            </span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {BRAND_COLORS.map((color) => (
              <ColorCard
                key={color.hex}
                color={color}
                isCopied={copiedHex === color.hex}
                onCopy={() => handleCopy(color.hex)}
              />
            ))}
          </div>
        </div>

        {/* Tonal Surfaces */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <span>Superficies Tonales</span>
            <span className="text-xs font-mono text-muted-foreground font-normal">
              (Tonal Layering System)
            </span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {SURFACE_COLORS.map((color) => (
              <ColorCard
                key={color.hex}
                color={color}
                isCopied={copiedHex === color.hex}
                onCopy={() => handleCopy(color.hex)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ColorCard({
  color,
  isCopied,
  onCopy,
}: {
  color: ColorToken
  isCopied: boolean
  onCopy: () => void
}) {
  return (
    <Card className="rounded-xl border border-border/40 bg-surface-container-low shadow-none overflow-hidden transition-all hover:border-secondary/40">
      <div
        className={`h-28 w-full p-4 flex flex-col justify-between cursor-pointer group relative ${color.bgClass}`}
        onClick={onCopy}
        role="button"
        tabIndex={0}
        aria-label={`Copiar color ${color.name} ${color.hex}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onCopy()
          }
        }}
      >
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-full ${
              color.textLight
                ? "bg-white/20 text-white backdrop-blur-xs"
                : "bg-black/10 text-foreground"
            }`}
          >
            {color.role}
          </span>
          <div
            className={`size-7 rounded-md flex items-center justify-center transition-transform group-hover:scale-110 ${
              color.textLight ? "bg-white/20 text-white" : "bg-black/10 text-foreground"
            }`}
          >
            <HugeiconsIcon icon={isCopied ? Tick02Icon : Copy01Icon} size={14} />
          </div>
        </div>
        <span
          className={`text-lg font-mono font-bold tracking-wider ${
            color.textLight ? "text-white" : "text-foreground"
          }`}
        >
          {color.hex}
        </span>
      </div>

      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base font-semibold text-foreground flex items-center justify-between">
          <span>{color.name}</span>
        </CardTitle>
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <span>RGB({color.rgb})</span>
          <span>•</span>
          <span className="text-secondary">{color.cssVar}</span>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-1">
        <p className="text-xs text-muted-foreground leading-relaxed text-pretty">
          {color.description}
        </p>
      </CardContent>
    </Card>
  )
}
