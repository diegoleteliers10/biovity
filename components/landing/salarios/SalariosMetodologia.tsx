import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SalariosMetodologia() {
  return (
    <section className="py-16 md:py-24 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="rounded-xl border border-border/10 bg-surface-container-lowest shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground">Metodología</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              La investigación se basó en la síntesis de datos de mercado de consultoras
              especializadas, portales de empleo y estadísticas oficiales chilenas:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
              <li>Mifuturo.cl</li>
              <li>Indeed Chile</li>
              <li>Glassdoor</li>
              <li>Paylab</li>
              <li>Robert Half</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Los sueldos se expresan en valores brutos mensuales (CLP) y se segmentan por nivel de
              experiencia (Junior: 0-2 años; Senior: 5+ años), industria, región y nivel educativo.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
