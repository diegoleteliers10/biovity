"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CONCLUSIONES_SALARIOS } from "@/lib/data/salarios-data"

export function SalariosConclusiones() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              Conclusiones
            </span>{" "}
            y Tendencias
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              El sector de biociencias en Chile está marcado por una polarización significativa en
              las remuneraciones. Nuestro análisis exhaustivo revela patrones claros que pueden
              guiar tanto a profesionales como a empresas en la toma de decisiones estratégicas.
            </p>
            <p>
              A continuación, presentamos los principales hallazgos y recomendaciones basados en los
              datos recopilados de múltiples fuentes confiables del mercado laboral chileno.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {CONCLUSIONES_SALARIOS.map((conclusionItem, index) => {
            const IconComponent = conclusionItem.icon
            return (
              <Card
                key={index}
                className={`border-0 shadow-lg ${conclusionItem.bgColor} hover:shadow-xl transition-shadow`}
              >
                <CardHeader>
                  <div className="grid grid-cols-[auto_1fr] gap-3 mb-2">
                    <div
                      className={`p-3 rounded-lg ${conclusionItem.bgColor} ${conclusionItem.color}`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <CardTitle className={conclusionItem.color}>{conclusionItem.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{conclusionItem.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900">Metodología</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              La investigación se basó en la síntesis de datos de mercado de consultoras
              especializadas, portales de empleo y estadísticas oficiales chilenas:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Mifuturo.cl</li>
              <li>Indeed Chile</li>
              <li>Glassdoor</li>
              <li>Paylab</li>
              <li>Robert Half</li>
            </ul>
            <p className="text-sm text-gray-600 mt-4">
              Los sueldos se expresan en valores brutos mensuales (CLP) y se segmentan por nivel de
              experiencia (Junior: 0-2 años; Senior: 5+ años), industria, región y nivel educativo.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
