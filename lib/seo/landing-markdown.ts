import { PLANES_EMPRESAS } from "@/lib/data/empresas-data"
import {
  SALARIES_UPDATED_AT,
  SALARY_BENCHMARKS,
  SALARY_CAREER_VALUES,
} from "@/lib/data/salarios-benchmark"

export function pricingMarkdown() {
  return PLANES_EMPRESAS.map((plan) => {
    const price =
      plan.price === "Personalizado" ? "Precio personalizado" : `$${plan.price} CLP ${plan.period}`
    return `## ${plan.name}\n\n${price}\n\n${plan.description}\n\n${plan.features.map((feature) => `- ${feature}`).join("\n")}\n\n[${plan.cta}](https://biovity.cl${plan.href})`
  }).join("\n\n")
}

export function salariesMarkdown() {
  return (
    SALARY_CAREER_VALUES.map((careerValue) => {
      const career = SALARY_BENCHMARKS[careerValue]
      if (!career.official) {
        if (!career.marketProxy) return `- ${career.careerLabel}: sin datos suficientes.`
        const reference = career.marketProxy
        return `- ${career.careerLabel}: referencia de Data Scientist, no equivalente directo. P25 ${formatSalary(reference.p25.amountClp)} (${reference.p25.basis}), P50 ${formatSalary(reference.p50.amountClp)} (${reference.p50.basis}), P75 ${formatSalary(reference.p75.amountClp)} (${reference.p75.basis}). Fuente: [${reference.p50.source.name}](${reference.p50.source.url}), ${reference.p50.source.year}.`
      }
      const firstYear = career.official.firstYear
      const fourthYear = career.official.fourthYear
      return `- ${career.careerLabel}: promedio del primer año ${formatSalary(firstYear.average.amountClp)} bruto mensual, titulados 2021–2023; percentiles brutos P10 ${formatSalary(firstYear.p10.amountClp)}, P50 ${formatSalary(firstYear.p50.amountClp)} y P90 ${formatSalary(firstYear.p90.amountClp)}; empleabilidad al primer año ${firstYear.employmentRatePercent}%. Promedio del cuarto año ${formatSalary(fourthYear.amountClp)} bruto mensual, titulados 2018–2020. Fuente: [${firstYear.average.source.name}](${firstYear.average.source.url}).`
    }).join("\n") +
    `\n\nActualizado: ${SALARIES_UPDATED_AT}. Montos mensuales brutos de MiFuturo en pesos de septiembre de 2025.`
  )
}

const formatSalary = (amountClp: number) => `$${amountClp.toLocaleString("es-CL")} CLP`
