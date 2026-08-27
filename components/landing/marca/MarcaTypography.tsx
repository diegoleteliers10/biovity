"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function MarcaTypography() {
  return (
    <section className="py-20 md:py-28 bg-surface-container-low" id="tipografia">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-3 block">
            Tipografía & Escala
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4 tracking-tight text-balance">
            Estructura & <span className="text-accent font-semibold">Jerarquía Tipográfica</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty">
            Combinamos <strong>Geist Sans</strong> para una legibilidad contemporánea en titulares e
            interfaces, con <strong>Geist Mono</strong> para datos técnicos, cifras y etiquetas.
          </p>
        </div>

        {/* Font Families Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
          {/* Geist Sans */}
          <Card className="rounded-xl border-0 shadow-none bg-surface-container-lowest p-6 sm:p-8">
            <CardHeader className="p-0 mb-6">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-1 block">
                Fuente Primaria • Sans
              </span>
              <CardTitle className="text-3xl font-bold text-foreground tracking-tight">
                Geist Sans
              </CardTitle>
              <p className="text-xs text-muted-foreground font-mono mt-1">
                Weights: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
              </p>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <p className="text-2xl font-semibold text-foreground tracking-tight">
                Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Ññ Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz
              </p>
              <p className="text-base text-muted-foreground font-medium">
                0123456789 • ¿?!¡ @#$%&/()=+
              </p>
              <div className="pt-4 border-t border-border text-xs text-muted-foreground leading-relaxed">
                Utilizada en títulos hero, encabezados de secciones, textos de botones, nombres de
                puestos y contenido editorial general.
              </div>
            </CardContent>
          </Card>

          {/* Geist Mono */}
          <Card className="rounded-xl border-0 shadow-none bg-surface-container-lowest p-6 sm:p-8">
            <CardHeader className="p-0 mb-6">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-1 block">
                Fuente Técnica • Monospace
              </span>
              <CardTitle className="text-3xl font-bold font-mono text-foreground tracking-tight">
                Geist Mono
              </CardTitle>
              <p className="text-xs text-muted-foreground font-mono mt-1">
                Weights: 500 (Medium), 600 (SemiBold), 700 (Bold)
              </p>
            </CardHeader>
            <CardContent className="p-0 space-y-4 font-mono">
              <p className="text-2xl font-semibold text-foreground tracking-tight">
                Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Ññ Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz
              </p>
              <p className="text-base text-muted-foreground">
                0123456789 • [CLP] {`{API}`} $40.000/mes
              </p>
              <div className="pt-4 border-t border-border text-xs text-muted-foreground leading-relaxed font-sans">
                Utilizada en etiquetas de categoría (eyebrows), cifras estadísticas, monedas, fechas
                y metadata técnica de laboratorio.
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Specimen Scale Table */}
        <Card className="rounded-xl border-0 shadow-none bg-surface-container-lowest p-6 sm:p-8">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-xl font-semibold text-foreground tracking-tight">
              Escala de Jerarquías en Producción
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-8">
            {/* Display Hero */}
            <div className="pb-6 border-b border-border">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-2">
                <span>DISPLAY HERO (h1)</span>
                <span>text-3xl sm:text-5xl lg:text-6xl • font-semibold</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground tracking-tight">
                Software ATS y Reclutamiento <span className="text-accent">Científico</span>
              </h1>
            </div>

            {/* Section Heading */}
            <div className="pb-6 border-b border-border">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-2">
                <span>SECTION HEADING (h2)</span>
                <span>text-2xl sm:text-3xl md:text-4xl • font-semibold</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
                Conectamos el talento con la <span className="text-accent">industria</span>
              </h2>
            </div>

            {/* Eyebrow Label */}
            <div className="pb-6 border-b border-border">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-2">
                <span>EYEBROW TAG (Monospace Green)</span>
                <span>text-xs • font-mono • font-semibold • uppercase • tracking-wider</span>
              </div>
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary">
                OPORTUNIDADES LABORALES • CHILE 2026
              </span>
            </div>

            {/* Body Text */}
            <div className="pb-6 border-b border-border">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-2">
                <span>BODY / DESCRIPTIONS</span>
                <span>text-base sm:text-lg • text-muted-foreground • leading-relaxed</span>
              </div>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
                Centraliza candidatos, evalúa habilidades de laboratorio con scoring de IA y reduce
                tus tiempos de contratación técnica en un 60%.
              </p>
            </div>

            {/* Metric Numbers */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-2">
                <span>METRIC VALUE</span>
                <span>text-2xl sm:text-3xl • font-bold • font-sans • tracking-tight</span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                  +1.200
                </span>
                <span className="text-sm font-medium text-foreground">
                  Científicos postulando activamente
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
