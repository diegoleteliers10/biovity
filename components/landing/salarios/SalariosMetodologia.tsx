import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { FAQS_SALARIOS, SALARIES_UPDATED_AT, SALARY_SOURCES } from "@/lib/data/salarios-benchmark"

export function SalariosMetodologia() {
  return (
    <section className="bg-surface-container-low py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Card className="border-0 bg-surface-container-lowest p-4 shadow-none sm:p-8">
          <CardHeader className="px-0 pt-0">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Fuentes y metodología
            </h2>
          </CardHeader>
          <CardContent className="space-y-6 px-0 pb-0 text-sm leading-relaxed text-muted-foreground">
            <p>
              Actualizado: {SALARIES_UPDATED_AT}. Los montos de MiFuturo son ingresos mensuales
              brutos, derivados de ingresos anuales del SII y expresados en pesos de septiembre de
              2025. El promedio del primer año corresponde a titulados de 2021–2023. El promedio del
              cuarto año corresponde a titulados de 2018–2020.
            </p>
            <p>
              MiFuturo considera titulados de hasta 30 años con ingresos iguales o superiores al
              sueldo mínimo. Quienes cursan estudios de postgrado cuentan como no empleados en la
              tasa de empleabilidad. La empleabilidad no equivale a una garantía de empleo.
            </p>
            <p>
              Las referencias de mercado vienen de guías de reclutadoras. Pueden describir cargos
              cercanos, y la página los identifica como referencias o proxies. Los datos anónimos de
              la comunidad Biovity requieren al menos 10 respuestas. El sistema no registra si esos
              montos son brutos o líquidos.
            </p>
            <p>
              No aplicamos ajustes numéricos por industria o región. Las cifras disponibles no
              permiten calcular esos factores de forma comparable. Cada sueldo depende también del
              cargo, responsabilidades y beneficios.
            </p>
            <div className="rounded-xl bg-surface-container-low p-4 sm:p-6">
              <h3 className="mb-3 text-base font-semibold text-foreground">Preguntas frecuentes</h3>
              <div className="space-y-4">
                {FAQS_SALARIOS.map((faq) => (
                  <article key={faq.question}>
                    <h4 className="font-medium text-foreground">{faq.question}</h4>
                    <p className="mt-1">{faq.answer}</p>
                  </article>
                ))}
              </div>
            </div>
            <div className="rounded-xl bg-surface-container-low p-4 sm:p-6">
              <h3 className="mb-3 text-base font-semibold text-foreground">Fuentes consultadas</h3>
              <ul className="list-inside list-disc space-y-2">
                {SALARY_SOURCES.map((source) => (
                  <li key={source.url}>
                    <a
                      className="underline underline-offset-2"
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {source.name}
                    </a>
                    {` · ${source.year} · ${source.type}`}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
