import { Briefcase, Building2, TrendingUp, Users } from "lucide-react"
import { Card } from "../../ui/card"

export function Stats() {
  const stats = [
    {
      icon: Users,
      number: "2,847",
      label: "Profesionales activos",
      growth: "+12% este mes",
    },
    {
      icon: Briefcase,
      number: "15,200",
      label: "Ofertas de empleo",
      growth: "+8% este mes",
    },
    {
      icon: Building2,
      number: "1,420",
      label: "Empresas registradas",
      growth: "+15% este mes",
    },
    {
      icon: TrendingUp,
      number: "89%",
      label: "Tasa de colocación",
      growth: "Promedio anual",
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const IconComponent = stat.icon
            return (
              <Card
                key={stat.label}
                className="p-6 text-center hover:shadow-lg transition-shadow border border-gray-100"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-100 to-green-100 rounded-lg mb-4">
                  <IconComponent className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 mb-2">{stat.label}</div>
                <div className="text-sm text-green-600 font-medium">{stat.growth}</div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
