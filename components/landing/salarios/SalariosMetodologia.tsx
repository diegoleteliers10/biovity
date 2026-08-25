import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function SalariosMetodologia() {
  return (
    <section className="py-20 md:py-28 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="rounded-xl border border-border bg-surface-container-lowest shadow-none p-6 sm:p-8 md:p-10">
          <CardHeader className="px-0 pt-0 pb-4">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-2 block">
              Rigor & Fuentes
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
              Metodología de Análisis Salarial
            </h2>
          </CardHeader>
          <CardContent className="px-0 pb-0 space-y-4 text-muted-foreground text-sm sm:text-base leading-relaxed text-pretty">
            <p>
              Nuestros modelos estadísticos combinan datos abiertos de mercado laboral, encuestas
              colaborativas anonimizadas e información de fuentes públicas chilenas:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 my-4">
              {["Mifuturo.cl", "Indeed Chile", "Glassdoor", "Paylab Chile", "Robert Half"].map(
                (source) => (
                  <div
                    key={source}
                    className="bg-surface-container-low rounded-lg p-3 text-center text-xs font-medium text-foreground border border-border"
                  >
                    {source}
                  </div>
                )
              )}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Los montos se normalizan en pesos chilenos líquidos mensuales (CLP) y se actualizan
              trimestralmente con las contribuciones verificadas de la comunidad Biovity.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
