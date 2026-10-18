import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SALARY_BENCHMARKS, SALARY_CAREER_VALUES } from "@/lib/data/salarios-benchmark"
import { formatCurrencyCLP } from "@/lib/utils"

export function SalariosUpskilling() {
  return (
    <section className="bg-surface-container-low py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Referencias de mercado para cargos senior
          </h2>
        </div>
        <p className="mb-6 max-w-3xl text-sm text-muted-foreground">
          Estas cifras describen cargos publicados por fuentes de mercado. No representan un
          promedio senior de toda la carrera.
        </p>
        <div className="grid gap-4 lg:grid-cols-2">
          {SALARY_CAREER_VALUES.map((careerValue) => {
            const benchmark = SALARY_BENCHMARKS[careerValue]
            const reference = benchmark.seniorMarket
            if (!reference) return null
            return (
              <Card
                key={careerValue}
                className="border border-border bg-surface-container-lowest p-2 shadow-none sm:p-4"
              >
                <CardHeader>
                  <CardTitle className="text-base font-semibold">{reference.role}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Referencia vinculada a {benchmark.careerLabel}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <MarketAmount
                      label="Mínimo"
                      amount={reference.values.low.amountClp}
                      basis={reference.values.low.basis}
                    />
                    <MarketAmount
                      label="Mediana"
                      amount={reference.values.median.amountClp}
                      basis={reference.values.median.basis}
                    />
                    <MarketAmount
                      label="Máximo"
                      amount={reference.values.high.amountClp}
                      basis={reference.values.high.basis}
                    />
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground">
                    Fuente:{" "}
                    <a
                      href={reference.values.median.source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="underline underline-offset-2"
                    >
                      {reference.values.median.source.name}
                    </a>{" "}
                    · {reference.values.median.source.year}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function MarketAmount({ label, amount, basis }: { label: string; amount: number; basis: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold">{formatCurrencyCLP(amount)}</p>
      <p className="text-xs text-muted-foreground">
        {basis === "bruto" ? "Bruto" : basis === "liquido" ? "Líquido" : "Base no especificada"}
      </p>
    </div>
  )
}
