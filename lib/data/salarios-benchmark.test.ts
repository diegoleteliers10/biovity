import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { SALARY_BENCHMARKS, SALARY_CAREER_VALUES, salaryBenchmarkFor } from "./salarios-benchmark"
import { CARRERAS_STEM_CHILE } from "./salarios-data"

describe("salary career benchmarks", () => {
  it("has an explicit benchmark state for each salary career", () => {
    assert.equal(SALARY_CAREER_VALUES.length, 12)
    assert.deepEqual(
      new Set(CARRERAS_STEM_CHILE.map((career) => career.value)),
      new Set(SALARY_CAREER_VALUES)
    )

    for (const careerValue of SALARY_CAREER_VALUES) {
      const benchmark = salaryBenchmarkFor(careerValue)
      assert.equal(benchmark.careerValue, careerValue)
      assert.notEqual(benchmark.careerLabel, "")
      assert.ok(
        benchmark.official !== null ||
          benchmark.marketProxy !== null ||
          careerValue === "acuicultura"
      )
    }
  })

  it("does not map Bioinformatics or Aquaculture to another official career", () => {
    assert.equal(SALARY_BENCHMARKS.bioinformatica.official, null)
    assert.equal(SALARY_BENCHMARKS.acuicultura.official, null)
    assert.equal(
      SALARY_BENCHMARKS.bioinformatica.marketProxy?.label.startsWith("Data scientist"),
      true
    )
    assert.equal(SALARY_BENCHMARKS.acuicultura.marketProxy, null)
  })

  it("maps the official career names explicitly", () => {
    assert.equal(SALARY_BENCHMARKS.bioquimica.official?.mifuturoCareer, "Bioquímica")
    assert.equal(
      SALARY_BENCHMARKS.ing_biotecnologia.official?.mifuturoCareer,
      "Ingeniería en Biotecnología y Bioingeniería"
    )
    assert.equal(
      SALARY_BENCHMARKS.ing_ambiental.official?.mifuturoCareer,
      "Ingeniería Civil Ambiental"
    )
  })
})
