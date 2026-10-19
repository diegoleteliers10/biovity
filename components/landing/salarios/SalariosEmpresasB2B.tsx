"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  SALARY_BENCHMARKS,
  SALARY_CAREER_VALUES,
  type SalaryAmount,
  type SalaryCareerValue,
} from "@/lib/data/salarios-benchmark"
import { CARRERAS_STEM_CHILE } from "@/lib/data/salarios-data"
import { formatCurrencyCLP } from "@/lib/utils"

export function SalariosEmpresasB2B() {
  const [career, setCareer] = useState<SalaryCareerValue>("quimica_farmacia")
  const benchmark = SALARY_BENCHMARKS[career]
  const options = CARRERAS_STEM_CHILE.filter((item) =>
    SALARY_CAREER_VALUES.some((value) => value === item.value)
  )
  const handleCareerChange = (value: string) => {
    const matchingCareer = SALARY_CAREER_VALUES.find((careerValue) => careerValue === value)
    if (matchingCareer) setCareer(matchingCareer)
  }

  return (
    <section className="bg-surface-container-low py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Referencias para equipos de contratación
          </h2>
        </div>
        <Card className="border-0 bg-surface-container-lowest p-2 shadow-none sm:p-4">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Consulta los datos disponibles por carrera
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="max-w-md">
              <label htmlFor="salary-employer-career" className="mb-2 block text-sm font-medium">
                Carrera o profesión
              </label>
              <Select value={career} onValueChange={handleCareerChange}>
                <SelectTrigger
                  id="salary-employer-career"
                  className="h-11 w-full bg-surface-container-low"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {benchmark.official ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <EmployerMetric
                  kind="range"
                  label="Primer año · P10 a P90"
                  low={benchmark.official.firstYear.p10}
                  high={benchmark.official.firstYear.p90}
                  note="Ingreso bruto mensual de titulados 2021–2023"
                />
                <EmployerMetric
                  kind="amount"
                  label="Cuarto año · promedio"
                  amount={benchmark.official.fourthYear}
                  note="Ingreso bruto mensual de titulados 2018–2020"
                />
                <div className="sm:col-span-2">
                  <a
                    href={benchmark.official.firstYear.average.source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-secondary underline underline-offset-2"
                  >
                    Fuente: {benchmark.official.firstYear.average.source.name}
                  </a>
                </div>
              </div>
            ) : benchmark.marketProxy ? (
              <p className="rounded-lg bg-surface-container-low p-4 text-sm text-muted-foreground">
                Esta carrera no tiene una cifra oficial comparable. Hay una referencia de Data
                Scientist de Robert Half, que no equivale directamente a Bioinformática.
              </p>
            ) : (
              <p className="rounded-lg bg-surface-container-low p-4 text-sm text-muted-foreground">
                Aún no tenemos datos confiables para esta carrera.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

type EmployerMetricProps =
  | { kind: "range"; label: string; low: SalaryAmount; high: SalaryAmount; note: string }
  | { kind: "amount"; label: string; amount: SalaryAmount; note: string }

function EmployerMetric(props: EmployerMetricProps) {
  const text =
    props.kind === "amount"
      ? formatCurrencyCLP(props.amount.amountClp)
      : `${formatCurrencyCLP(props.low.amountClp)} a ${formatCurrencyCLP(props.high.amountClp)}`

  return (
    <div className="rounded-xl bg-surface-container-low p-4 sm:p-5">
      <p className="text-sm font-medium text-muted-foreground">{props.label}</p>
      <p className="mt-2 text-xl font-semibold">
        {text} <span className="text-xs font-normal">Bruto</span>
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{props.note}</p>
    </div>
  )
}
