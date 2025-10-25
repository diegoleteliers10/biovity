import {
  Atom,
  ChevronRight,
  FlaskConical,
  Microscope,
  Pill,
  Stethoscope,
  TestTube,
} from "lucide-react"
import { Button } from "../../ui/button"
import { Card } from "../../ui/card"

export function Categories() {
  const categories = [
    {
      icon: Microscope,
      title: "Biotecnología",
      positions: "345 empleos",
      growth: "+12%",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: TestTube,
      title: "Bioquímica",
      positions: "278 empleos",
      growth: "+8%",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Atom,
      title: "Química",
      positions: "412 empleos",
      growth: "+15%",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: FlaskConical,
      title: "Ingeniería Química",
      positions: "189 empleos",
      growth: "+6%",
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: Stethoscope,
      title: "Salud y Medicina",
      positions: "567 empleos",
      growth: "+18%",
      color: "from-red-500 to-red-600",
    },
    {
      icon: Pill,
      title: "I+D Farmacéutica",
      positions: "234 empleos",
      growth: "+10%",
      color: "from-teal-500 to-teal-600",
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explora Oportunidades por Especialidad
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Encuentra tu próximo desafío profesional en las áreas más innovadoras de la ciencia
          </p>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <Card
                key={category.title}
                className="group p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white hover:-translate-y-1"
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`flex-shrink-0 w-12 h-12 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center`}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {category.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">{category.positions}</span>
                      <span className="text-green-600 font-medium text-sm">{category.growth}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              </Card>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" variant="outline">
            Ver todas las especialidades
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}
