"use client"

import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { type UseQueryResult, useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getSalaryStats, type SalaryStats } from "@/lib/api/salaries"
import {
  SALARIES_UPDATED_AT,
  SALARY_BENCHMARKS,
  SALARY_CAREER_VALUES,
  type SalaryAmount,
  type SalaryCareerValue,
  salaryBenchmarkFor,
} from "@/lib/data/salarios-benchmark"
import { CARRERAS_STEM_CHILE } from "@/lib/data/salarios-data"
import { formatCurrencyCLP } from "@/lib/utils"

type CommunityStatsState =
  | { kind: "unavailable" }
  | { kind: "below-threshold"; count: number }
  | { kind: "published"; stats: SalaryStats }

const formatAmount = (amount: SalaryAmount) => formatCurrencyCLP(amount.amountClp)

export function SalariosInteractiveFilter() {
  const [career, setCareer] = useState<SalaryCareerValue>("bioinformatica")
  const benchmark = salaryBenchmarkFor(career)
  const selectedCareer = CARRERAS_STEM_CHILE.find((item) => item.value === career)

  const communityQuery = useQuery({
    queryKey: ["salary-stats", career],
    queryFn: async () => {
      const result = await getSalaryStats({ profession: career })
      if (result.isErr()) return { kind: "unavailable" as const }
      if (result.value.count < 10) {
        return { kind: "below-threshold" as const, count: result.value.count }
      }
      return { kind: "published" as const, stats: result.value }
    },
    staleTime: 5 * 60 * 1000,
  })

  const handleCareerChange = (value: string) => {
    const matchingCareer = SALARY_CAREER_VALUES.find((careerValue) => careerValue === value)
    if (matchingCareer) setCareer(matchingCareer)
  }

  return (
    <section className="bg-surface-container-lowest py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl lg:mb-12">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Referencias salariales por carrera
          </h2>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(17rem,0.72fr)_minmax(0,1.28fr)] lg:gap-8">
          <Card className="border-0 bg-surface-container-low p-2 shadow-none sm:p-4 lg:sticky lg:top-28">
            <CardHeader className="gap-2">
              <CardTitle className="text-xl font-semibold">Selecciona una carrera</CardTitle>
              <CardDescription>
                Los filtros de industria y región no ajustan estas cifras.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <label htmlFor="salary-career" className="mb-2 block text-sm font-medium">
                Carrera o profesión
              </label>
              <Select value={career} onValueChange={handleCareerChange}>
                <SelectTrigger id="salary-career" className="h-11 w-full bg-surface-container-low">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CARRERAS_STEM_CHILE.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button asChild className="mt-5 w-full">
                <Link href="/share-salary">
                  Compartir sueldo
                  <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 bg-surface-container-low p-2 shadow-none sm:p-4">
            <CardHeader className="gap-2">
              <CardTitle className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {selectedCareer?.label}
              </CardTitle>
              <CardDescription>Actualizado: {SALARIES_UPDATED_AT}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {benchmark.official ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <OfficialMetric
                    heading="Ingreso promedio · 1er año"
                    amount={benchmark.official.firstYear.average}
                    cohort="Titulados 2021–2023"
                  />
                  <OfficialMetric
                    heading="Ingreso promedio · 4º año"
                    amount={benchmark.official.fourthYear}
                    cohort="Titulados 2018–2020"
                  />
                  <div className="rounded-xl bg-surface-container-lowest p-4 sm:col-span-2 sm:p-5">
                    <h3 className="mb-3 text-sm font-semibold">
                      Distribución al primer año · bruto
                    </h3>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <Percentile label="P10" amount={benchmark.official.firstYear.p10} />
                      <Percentile label="P50" amount={benchmark.official.firstYear.p50} />
                      <Percentile label="P90" amount={benchmark.official.firstYear.p90} />
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">
                      Empleabilidad al primer año:{" "}
                      {benchmark.official.firstYear.employmentRatePercent}%
                    </p>
                    <SourceLink source={benchmark.official.firstYear.average.source} />
                  </div>
                </div>
              ) : benchmark.marketProxy ? (
                <div className="rounded-xl bg-surface-container-lowest p-4 sm:p-5">
                  <p className="mb-1 text-sm font-semibold text-secondary">
                    MiFuturo no publica una cifra directa para Bioinformática
                  </p>
                  <p className="mb-3 text-sm text-muted-foreground">
                    Referencia de mercado · no es un dato directo de la carrera
                  </p>
                  <h3 className="mb-4 font-semibold">{benchmark.marketProxy.label}</h3>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <Percentile label="P25" amount={benchmark.marketProxy.p25} />
                    <Percentile label="P50" amount={benchmark.marketProxy.p50} />
                    <Percentile label="P75" amount={benchmark.marketProxy.p75} />
                  </div>
                  <SourceLink source={benchmark.marketProxy.p50.source} />
                </div>
              ) : (
                <p className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                  Aún no tenemos datos confiables para esta carrera.
                </p>
              )}

              <CommunityData careerLabel={benchmark.careerLabel} query={communityQuery} />
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 sm:mt-20">
          <h3 className="mb-5 text-2xl font-semibold tracking-tight sm:text-3xl">
            Comparación por carrera
          </h3>
          <div className="overflow-x-auto rounded-xl bg-surface-container-low p-2 sm:p-3">
            <table className="w-full min-w-[720px] text-left text-sm text-foreground">
              <thead className="bg-surface-container-lowest text-xs text-muted-foreground">
                <tr>
                  <th className="rounded-l-lg px-4 py-4 font-medium">Carrera</th>
                  <th className="px-4 py-4 font-medium">Promedio · 1er año</th>
                  <th className="px-4 py-4 font-medium">Promedio · 4º año</th>
                  <th className="rounded-r-lg px-4 py-4 font-medium">Empleabilidad · 1er año</th>
                </tr>
              </thead>
              <tbody>
                {SALARY_CAREER_VALUES.map((careerValue) => {
                  const item = SALARY_BENCHMARKS[careerValue]
                  return (
                    <tr
                      key={careerValue}
                      className="transition-colors duration-150 hover:bg-surface-container-highest/50"
                    >
                      <th scope="row" className="px-4 py-4 font-medium">
                        {item.careerLabel}
                      </th>
                      {item.official ? (
                        <>
                          <td className="px-4 py-4">
                            {formatAmount(item.official.firstYear.average)}
                            <BasisLabel basis={item.official.firstYear.average.basis} />
                          </td>
                          <td className="px-4 py-4">
                            {formatAmount(item.official.fourthYear)}
                            <BasisLabel basis={item.official.fourthYear.basis} />
                          </td>
                          <td className="px-4 py-4">
                            {item.official.firstYear.employmentRatePercent}%
                          </td>
                        </>
                      ) : (
                        <td colSpan={3} className="px-4 py-4 text-muted-foreground">
                          {item.marketProxy
                            ? "Referencia de Data Scientist, no equivalente directo"
                            : "Sin datos suficientes"}
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Fuente de los datos disponibles: MiFuturo.cl. Montos mensuales brutos en pesos de
            septiembre de 2025.
          </p>
        </div>
      </div>
    </section>
  )
}

function OfficialMetric({
  heading,
  amount,
  cohort,
}: {
  heading: string
  amount: SalaryAmount
  cohort: string
}) {
  return (
    <div className="rounded-xl bg-surface-container-lowest p-4 sm:p-5">
      <h3 className="text-sm font-medium text-muted-foreground">{heading}</h3>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{formatAmount(amount)}</p>
      <BasisLabel basis={amount.basis} />
      <p className="mt-2 text-xs text-muted-foreground">{cohort}</p>
      <SourceLink source={amount.source} />
    </div>
  )
}

function Percentile({ label, amount }: { label: string; amount: SalaryAmount }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-semibold">{formatAmount(amount)}</p>
      <BasisLabel basis={amount.basis} />
    </div>
  )
}

function BasisLabel({ basis }: { basis: SalaryAmount["basis"] }) {
  return (
    <span className="ml-2 text-xs text-muted-foreground">
      {basis === "bruto" ? "Bruto" : basis === "liquido" ? "Líquido" : "Base no especificada"}
    </span>
  )
}

function SourceLink({ source }: { source: SalaryAmount["source"] }) {
  return (
    <p className="mt-3 text-xs text-muted-foreground">
      Fuente:{" "}
      <a
        className="underline underline-offset-2"
        href={source.url}
        target="_blank"
        rel="noreferrer"
      >
        {source.name}
      </a>{" "}
      · {source.year}
    </p>
  )
}

function CommunityData({
  careerLabel,
  query,
}: {
  careerLabel: string
  query: UseQueryResult<CommunityStatsState, Error>
}) {
  if (query.data?.kind === "published") {
    const { stats } = query.data
    const trust =
      stats.count >= 100
        ? "Muestra amplia"
        : stats.count >= 30
          ? "Muestra intermedia"
          : "Muestra inicial"
    return (
      <div className="rounded-xl bg-surface-container-lowest p-4 sm:p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-semibold">Datos de la comunidad Biovity</h3>
          <span className="text-xs text-muted-foreground">
            {trust} · n={stats.count}
          </span>
        </div>
        <p className="mt-3 text-sm">
          Mediana {formatCurrencyCLP(stats.median)} · P25 {formatCurrencyCLP(stats.p25)} · P75{" "}
          {formatCurrencyCLP(stats.p75)}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {careerLabel} · CLP mensuales · base bruto/líquido no especificada · todos los niveles de
          experiencia.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">Actualizado: {SALARIES_UPDATED_AT}</p>
      </div>
    )
  }

  if (query.isLoading) return null

  if (query.isError || query.data?.kind === "unavailable") {
    return (
      <div className="rounded-xl bg-surface-container-lowest p-4 sm:p-5">
        <h3 className="font-semibold">Datos de la comunidad Biovity</h3>
        <p className="mt-1 text-sm text-muted-foreground">No pudimos consultar esta muestra.</p>
        <Button variant="outline" size="sm" asChild className="mt-3">
          <Link href="/share-salary">Compartir mi sueldo</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-surface-container-lowest p-4 sm:p-5">
      <h3 className="font-semibold">Datos de la comunidad Biovity</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Aún no hay una muestra de 10 respuestas para esta carrera.
      </p>
      <Button variant="outline" size="sm" asChild className="mt-3">
        <Link href="/share-salary">Compartir mi sueldo</Link>
      </Button>
    </div>
  )
}
