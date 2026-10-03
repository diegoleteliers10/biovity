import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function SalariosMetodologia() {
  return (
    <section className="py-24 md:py-36 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="rounded-xl border border-border bg-surface-container-lowest shadow-none p-6 sm:p-8 md:p-10">
          <CardHeader className="px-0 pt-0 pb-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
              Cómo interpretar los rangos salariales
            </h2>
          </CardHeader>
          <CardContent className="px-0 pb-0 space-y-4 text-muted-foreground text-sm sm:text-base leading-relaxed text-pretty">
            <p>
              Los rangos y simulaciones de esta página son orientativos. No representan una encuesta
              salarial verificada ni garantizan una remuneración. Compara cada oferta según sus
              responsabilidades, experiencia requerida, ubicación y beneficios.
            </p>
            <p>
              Los montos se muestran en pesos chilenos (CLP). Confirma con la empresa si una oferta
              corresponde a sueldo bruto o líquido antes de comparar los valores.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
