import type { FAQItem } from "@/lib/types/empresas"

export const SALARIES_UPDATED_AT = "octubre 2026"
export const SALARY_CAREER_VALUES = [
  "bioinformatica",
  "ing_biotecnologia",
  "quimica_farmacia",
  "ing_civil_quimica",
  "ing_alimentos",
  "tec_medica",
  "bioquimica",
  "ing_ambiental",
  "agronomia",
  "medicina",
  "veterinaria",
  "acuicultura",
] as const

export type SalaryCareerValue = (typeof SALARY_CAREER_VALUES)[number]
export type SalaryBasis = "bruto" | "liquido" | "no especificado"
export type SalarySourceType = "oficial" | "reclutadora" | "avisos" | "comunidad"

export type SalarySource = {
  name: string
  type: SalarySourceType
  year: string
  url: string
  cohort?: string
  sampleSize?: number
}

export type SalaryAmount = {
  amountClp: number
  statistic: "promedio" | "mínimo" | "mediana" | "máximo" | "P10" | "P25" | "P50" | "P75" | "P90"
  basis: SalaryBasis
  source: SalarySource
}

export type OfficialCareerData = {
  mifuturoCareer: string
  firstYear: {
    average: SalaryAmount
    p10: SalaryAmount
    p50: SalaryAmount
    p90: SalaryAmount
    employmentRatePercent: number
  }
  fourthYear: SalaryAmount
}

export type MarketSalaryReference = {
  role: string
  values: {
    low: SalaryAmount
    median: SalaryAmount
    high: SalaryAmount
  }
}

export type MarketPercentileReference = {
  label: string
  p25: SalaryAmount
  p50: SalaryAmount
  p75: SalaryAmount
}

export type CareerSalaryBenchmark = {
  careerValue: SalaryCareerValue
  careerLabel: string
  official: OfficialCareerData | null
  seniorMarket: MarketSalaryReference | null
  marketProxy: MarketPercentileReference | null
}

const MIFUTURO_SOURCE = {
  name: "MiFuturo.cl · Mineduc y SII",
  type: "oficial",
  year: "ingresos SII 2022–2024",
  cohort:
    "1er año: titulados 2021–2023. 4º año: titulados 2018–2020. Montos mensuales brutos en pesos de septiembre de 2025.",
  url: "https://www.mifuturo.cl/buscador-de-estadisticas-por-carrera/",
} satisfies SalarySource

const mifuturoAmount = (amountClp: number, statistic: SalaryAmount["statistic"]): SalaryAmount => ({
  amountClp,
  statistic,
  basis: "bruto",
  source: MIFUTURO_SOURCE,
})

const officialCareer = (args: {
  mifuturoCareer: string
  firstYearAverage: number
  p10: number
  p50: number
  p90: number
  employmentRatePercent: number
  fourthYearAverage: number
}): OfficialCareerData => ({
  mifuturoCareer: args.mifuturoCareer,
  firstYear: {
    average: mifuturoAmount(args.firstYearAverage, "promedio"),
    p10: mifuturoAmount(args.p10, "P10"),
    p50: mifuturoAmount(args.p50, "P50"),
    p90: mifuturoAmount(args.p90, "P90"),
    employmentRatePercent: args.employmentRatePercent,
  },
  fourthYear: mifuturoAmount(args.fourthYearAverage, "promedio"),
})

const marketAmount = (args: {
  amountClp: number
  statistic: SalaryAmount["statistic"]
  basis: SalaryBasis
  source: SalarySource
}): SalaryAmount => args

const marketSource = (args: SalarySource): SalarySource => args

export const SALARY_BENCHMARKS = {
  bioinformatica: {
    careerValue: "bioinformatica",
    careerLabel: "Bioinformática",
    official: null,
    seniorMarket: null,
    marketProxy: {
      label: "Data scientist · referencia de mercado, no equivalente directo",
      p25: marketAmount({
        amountClp: 3_144_272,
        statistic: "P25",
        basis: "no especificado",
        source: marketSource({
          name: "Robert Half Chile · Guía Salarial 2026",
          type: "reclutadora",
          year: "2026",
          url: "https://www.roberthalf.com/cl/es/vacantes-detalles/data-scientist",
        }),
      }),
      p50: marketAmount({
        amountClp: 3_550_000,
        statistic: "P50",
        basis: "no especificado",
        source: marketSource({
          name: "Robert Half Chile · Guía Salarial 2026",
          type: "reclutadora",
          year: "2026",
          url: "https://www.roberthalf.com/cl/es/vacantes-detalles/data-scientist",
        }),
      }),
      p75: marketAmount({
        amountClp: 4_260_000,
        statistic: "P75",
        basis: "no especificado",
        source: marketSource({
          name: "Robert Half Chile · Guía Salarial 2026",
          type: "reclutadora",
          year: "2026",
          url: "https://www.roberthalf.com/cl/es/vacantes-detalles/data-scientist",
        }),
      }),
    },
  },
  ing_biotecnologia: {
    careerValue: "ing_biotecnologia",
    careerLabel: "Ingeniería en Biotecnología",
    official: officialCareer({
      mifuturoCareer: "Ingeniería en Biotecnología y Bioingeniería",
      firstYearAverage: 932_699,
      p10: 557_921,
      p50: 838_715,
      p90: 1_324_728,
      employmentRatePercent: 62.9,
      fourthYearAverage: 1_336_460,
    }),
    seniorMarket: null,
    marketProxy: null,
  },
  quimica_farmacia: {
    careerValue: "quimica_farmacia",
    careerLabel: "Química y Farmacia",
    official: officialCareer({
      mifuturoCareer: "Química y Farmacia",
      firstYearAverage: 2_011_053,
      p10: 1_306_484,
      p50: 2_010_767,
      p90: 2_690_122,
      employmentRatePercent: 98.5,
      fourthYearAverage: 2_368_256,
    }),
    seniorMarket: null,
    marketProxy: null,
  },
  ing_civil_quimica: {
    careerValue: "ing_civil_quimica",
    careerLabel: "Ingeniería Civil Química",
    official: officialCareer({
      mifuturoCareer: "Ingeniería Civil Química",
      firstYearAverage: 1_535_618,
      p10: 671_986,
      p50: 1_318_280,
      p90: 2_527_592,
      employmentRatePercent: 81.8,
      fourthYearAverage: 2_481_356,
    }),
    seniorMarket: {
      role: "Ingeniero/a de procesos senior · alimentos y manufactura",
      values: {
        low: marketAmount({
          amountClp: 2_500_000,
          statistic: "mínimo",
          basis: "bruto",
          source: marketSource({
            name: "Michael Page Chile · Guía Salarial 2027, datos 2026",
            type: "reclutadora",
            year: "2026",
            url: "https://www.michaelpage.cl/guia-salarial/ingenier%C3%ADa-y-manufactura/alimentos-y-manufactura-ingeniero-de-procesos-senior",
          }),
        }),
        median: marketAmount({
          amountClp: 3_425_000,
          statistic: "mediana",
          basis: "bruto",
          source: marketSource({
            name: "Michael Page Chile · Guía Salarial 2027, datos 2026",
            type: "reclutadora",
            year: "2026",
            url: "https://www.michaelpage.cl/guia-salarial/ingenier%C3%ADa-y-manufactura/alimentos-y-manufactura-ingeniero-de-procesos-senior",
          }),
        }),
        high: marketAmount({
          amountClp: 4_500_000,
          statistic: "máximo",
          basis: "bruto",
          source: marketSource({
            name: "Michael Page Chile · Guía Salarial 2027, datos 2026",
            type: "reclutadora",
            year: "2026",
            url: "https://www.michaelpage.cl/guia-salarial/ingenier%C3%ADa-y-manufactura/alimentos-y-manufactura-ingeniero-de-procesos-senior",
          }),
        }),
      },
    },
    marketProxy: null,
  },
  ing_alimentos: {
    careerValue: "ing_alimentos",
    careerLabel: "Ingeniería en Alimentos",
    official: officialCareer({
      mifuturoCareer: "Ingeniería en Alimentos",
      firstYearAverage: 1_154_875,
      p10: 589_416,
      p50: 891_077,
      p90: 1_451_578,
      employmentRatePercent: 74,
      fourthYearAverage: 1_480_333,
    }),
    seniorMarket: {
      role: "Jefe/a de calidad · alimentos y manufactura",
      values: {
        low: marketAmount({
          amountClp: 3_000_000,
          statistic: "mínimo",
          basis: "bruto",
          source: marketSource({
            name: "Michael Page Chile · Guía Salarial 2027, datos 2026",
            type: "reclutadora",
            year: "2026",
            url: "https://www.michaelpage.cl/guia-salarial/ingenier%C3%ADa-y-manufactura/alimentos-y-manufactura-jefe-de-calidad",
          }),
        }),
        median: marketAmount({
          amountClp: 3_950_000,
          statistic: "mediana",
          basis: "bruto",
          source: marketSource({
            name: "Michael Page Chile · Guía Salarial 2027, datos 2026",
            type: "reclutadora",
            year: "2026",
            url: "https://www.michaelpage.cl/guia-salarial/ingenier%C3%ADa-y-manufactura/alimentos-y-manufactura-jefe-de-calidad",
          }),
        }),
        high: marketAmount({
          amountClp: 5_000_000,
          statistic: "máximo",
          basis: "bruto",
          source: marketSource({
            name: "Michael Page Chile · Guía Salarial 2027, datos 2026",
            type: "reclutadora",
            year: "2026",
            url: "https://www.michaelpage.cl/guia-salarial/ingenier%C3%ADa-y-manufactura/alimentos-y-manufactura-jefe-de-calidad",
          }),
        }),
      },
    },
    marketProxy: null,
  },
  tec_medica: {
    careerValue: "tec_medica",
    careerLabel: "Tecnología Médica",
    official: officialCareer({
      mifuturoCareer: "Tecnología Médica",
      firstYearAverage: 1_226_007,
      p10: 583_052,
      p50: 968_085,
      p90: 1_661_451,
      employmentRatePercent: 71.4,
      fourthYearAverage: 1_750_943,
    }),
    seniorMarket: null,
    marketProxy: null,
  },
  bioquimica: {
    careerValue: "bioquimica",
    careerLabel: "Bioquímica",
    official: officialCareer({
      mifuturoCareer: "Bioquímica",
      firstYearAverage: 1_059_559,
      p10: 598_509,
      p50: 932_599,
      p90: 1_471_132,
      employmentRatePercent: 64.3,
      fourthYearAverage: 1_458_953,
    }),
    seniorMarket: null,
    marketProxy: null,
  },
  ing_ambiental: {
    careerValue: "ing_ambiental",
    careerLabel: "Ingeniería Ambiental",
    official: officialCareer({
      mifuturoCareer: "Ingeniería Civil Ambiental",
      firstYearAverage: 1_348_586,
      p10: 768_424,
      p50: 1_349_105,
      p90: 1_896_719,
      employmentRatePercent: 84.2,
      fourthYearAverage: 2_119_848,
    }),
    seniorMarket: null,
    marketProxy: null,
  },
  agronomia: {
    careerValue: "agronomia",
    careerLabel: "Agronomía",
    official: officialCareer({
      mifuturoCareer: "Agronomía",
      firstYearAverage: 1_236_432,
      p10: 589_905,
      p50: 1_063_960,
      p90: 2_136_224,
      employmentRatePercent: 68.2,
      fourthYearAverage: 1_729_270,
    }),
    seniorMarket: null,
    marketProxy: null,
  },
  medicina: {
    careerValue: "medicina",
    careerLabel: "Medicina",
    official: officialCareer({
      mifuturoCareer: "Medicina",
      firstYearAverage: 2_758_297,
      p10: 1_054_500,
      p50: 2_478_340,
      p90: 3_880_990,
      employmentRatePercent: 90.9,
      fourthYearAverage: 3_719_393,
    }),
    seniorMarket: null,
    marketProxy: null,
  },
  veterinaria: {
    careerValue: "veterinaria",
    careerLabel: "Medicina Veterinaria",
    official: officialCareer({
      mifuturoCareer: "Medicina Veterinaria",
      firstYearAverage: 1_035_456,
      p10: 562_193,
      p50: 892_275,
      p90: 1_560_141,
      employmentRatePercent: 65.9,
      fourthYearAverage: 1_379_385,
    }),
    seniorMarket: null,
    marketProxy: null,
  },
  acuicultura: {
    careerValue: "acuicultura",
    careerLabel: "Acuicultura e Ingeniería Acuícola",
    official: null,
    seniorMarket: null,
    marketProxy: null,
  },
} satisfies Record<SalaryCareerValue, CareerSalaryBenchmark>

export const salaryBenchmarkFor = (career: SalaryCareerValue): CareerSalaryBenchmark =>
  SALARY_BENCHMARKS[career]

const quimicaFarmacia = SALARY_BENCHMARKS.quimica_farmacia.official

export const FAQS_SALARIOS: FAQItem[] = [
  {
    question: "¿Qué muestran las cifras de MiFuturo?",
    answer: quimicaFarmacia
      ? `Para Química y Farmacia, MiFuturo informa un promedio mensual bruto de ${quimicaFarmacia.firstYear.average.amountClp.toLocaleString("es-CL")} en el primer año y ${quimicaFarmacia.fourthYear.amountClp.toLocaleString("es-CL")} al cuarto año. Son cohortes distintas, no una predicción individual.`
      : "MiFuturo muestra ingresos declarados por titulados. Consulta las cifras y cohortes disponibles en la tabla.",
  },
  {
    question: "¿Las cifras son brutas o líquidas?",
    answer:
      "Las cifras de MiFuturo son brutas y corresponden a ingresos mensuales estimados desde datos anuales del SII. Las referencias de reclutadoras indican su base cuando la fuente la publica. Los datos de la comunidad Biovity no separan sueldo bruto y líquido.",
  },
  {
    question: "¿Todas las carreras tienen datos comparables?",
    answer:
      "No. MiFuturo no publica una fila directa para Bioinformática ni Acuicultura en estos datos. Bioinformática muestra una referencia de Data Scientist de Robert Half. Acuicultura no tiene datos suficientes para mostrar una cifra.",
  },
  {
    question: "¿Qué significa empleabilidad al primer año?",
    answer:
      "Es la proporción de titulados de la cohorte que MiFuturo identifica con ingresos iguales o superiores al mínimo. Quienes siguen estudios de postgrado cuentan como no empleados en esta medición.",
  },
]

export const SALARY_SOURCES = Array.from(
  new Map(
    SALARY_CAREER_VALUES.flatMap((careerValue) => {
      const benchmark = SALARY_BENCHMARKS[careerValue]
      const sources = [
        benchmark.official?.firstYear.average.source,
        benchmark.marketProxy?.p50.source,
        benchmark.seniorMarket?.values.median.source,
      ]
      return sources.flatMap((source) => (source ? [[source.url, source] as const] : []))
    })
  ).values()
)
