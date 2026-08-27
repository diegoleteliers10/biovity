"use client"

import {
  Building06Icon,
  Location05Icon,
  Search01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Hero() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [location, setLocation] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set("q", query.trim())
    if (location.trim()) params.set("ubicacion", location.trim())

    const searchString = params.toString()
    router.push(`/trabajos${searchString ? `?${searchString}` : ""}`)
  }

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-surface-container-lowest via-surface-container-low/40 to-surface-container-lowest py-32 sm:py-44 lg:py-56">
      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Mobile: lightweight GPU-free CSS radial gradient */}
        <div className="md:hidden absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(132,131,212,0.12)_0%,transparent_60%),radial-gradient(ellipse_at_70%_35%,rgba(0,107,94,0.12)_0%,transparent_60%)]" />

        {/* Desktop: rich Gaussian blur glows */}
        <div className="hidden md:block absolute top-[10%] left-[20%] w-[32rem] h-[32rem] rounded-full bg-[#8483d4]/15 blur-[120px]" />
        <div className="hidden md:block absolute top-[18%] right-[18%] w-[36rem] h-[36rem] rounded-full bg-[#006b5e]/15 blur-[130px]" />
        <div className="hidden md:block absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[48rem] h-[22rem] rounded-full bg-[#00374a]/10 blur-[100px]" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #00374a 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Heading */}
          <h1 className="motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-4 motion-safe:zoom-in-95 motion-safe:duration-500 motion-safe:fill-mode-both text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-foreground mb-6 sm:mb-8 tracking-tight leading-[1.12] text-balance">
            Donde el talento científico conecta con{" "}
            <span className="text-secondary underline decoration-secondary/30 decoration-wavy decoration-from-font">
              biotecnología
            </span>{" "}
            e <span className="text-accent">innovación I+D</span>
          </h1>

          {/* Subtitle */}
          <p className="motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-4 motion-safe:duration-500 motion-safe:delay-100 motion-safe:fill-mode-both text-base sm:text-lg md:text-xl text-muted-foreground mb-10 sm:mb-14 max-w-2xl mx-auto leading-relaxed text-pretty">
            Encuentra ofertas laborales verificadas con salarios transparentes en biotecnología,
            bioquímica, química, laboratorios clínicos y centros de investigación en Chile.
          </p>

          {/* Main Interactive Search Console */}
          <div className="motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-4 motion-safe:zoom-in-95 motion-safe:duration-500 motion-safe:delay-200 motion-safe:fill-mode-both max-w-3xl mx-auto mb-8 sm:mb-12">
            <form
              onSubmit={handleSearch}
              className="rounded-2xl border-2 border-border/80 bg-surface-container-lowest p-2.5 sm:p-3 shadow-lg shadow-black/[0.03] backdrop-blur-sm transition-all focus-within:border-secondary/50 focus-within:shadow-secondary/5"
            >
              <div className="flex flex-col sm:flex-row gap-2.5">
                {/* Field 1: Query */}
                <div className="flex-1 relative">
                  <HugeiconsIcon
                    icon={Search01Icon}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary size-5"
                    strokeWidth={1.75}
                  />
                  <Input
                    aria-label="Buscar cargo o habilidad"
                    placeholder="Cargo, técnica (PCR, HPLC) o especialidad"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-11 h-12 bg-transparent border-0 text-sm focus-visible:ring-0 focus-visible:bg-surface-container-low/40 rounded-xl"
                  />
                </div>

                <div className="hidden sm:block w-px bg-border my-2" />

                {/* Field 2: Location */}
                <div className="flex-1 relative">
                  <HugeiconsIcon
                    icon={Location05Icon}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-accent size-5"
                    strokeWidth={1.75}
                  />
                  <Input
                    aria-label="Buscar región o modalidad"
                    placeholder="Región (Santiago, Valparaíso, Biobío, Remoto)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-11 h-12 bg-transparent border-0 text-sm focus-visible:ring-0 focus-visible:bg-surface-container-low/40 rounded-xl"
                  />
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  size="lg"
                  className="h-12 px-8 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm w-full sm:w-auto shrink-0 shadow-sm transition-all hover:scale-[1.02]"
                >
                  <HugeiconsIcon
                    icon={Search01Icon}
                    size={18}
                    strokeWidth={1.75}
                    className="mr-1.5"
                  />
                  Buscar Empleos
                </Button>
              </div>
            </form>
          </div>

          {/* Quick links to professional and company registration */}
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 text-xs sm:text-sm">
            <Link
              href="/salarios"
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-secondary font-medium transition-colors"
            >
              <HugeiconsIcon icon={SparklesIcon} size={15} className="text-secondary" />
              Explorar Estudio Salarial 2026
            </Link>
            <span className="text-border hidden sm:inline">·</span>
            <Link
              href="/empresas"
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-accent font-medium transition-colors"
            >
              <HugeiconsIcon icon={Building06Icon} size={15} className="text-accent" />
              Publicar ofertas para empresas
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
