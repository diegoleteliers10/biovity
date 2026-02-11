"use client"

import { ChevronRight } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { Button } from "../../ui/button"
import { LANDING_ANIMATION, getSpringTransition, getTransition } from "@/lib/animations"
import { Card } from "../../ui/card"
import { CATEGORIES_HOME } from "@/lib/data/home-data"

export function Categories() {
  const reducedMotion = useReducedMotion()
  const t = (delay = 0) => getTransition({ delay, reducedMotion })
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={t(0)}
          className="text-center mb-16"
        >
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={t(0)}
            className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 text-balance"
          >
            Explora Oportunidades
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={t(LANDING_ANIMATION.sequenceDelay)}
            className="text-xl text-gray-500 max-w-2xl mx-auto text-pretty"
          >
            Encuentra tu próximo desafío profesional en las áreas más innovadoras de la ciencia
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {CATEGORIES_HOME.map((category, index) => {
            const IconComponent = category.icon
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 32, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
                transition={ts(index * LANDING_ANIMATION.chainStagger)}
              >
                <Card className="group p-6 cursor-pointer border-0 bg-white">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`flex-shrink-0 w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center shadow-lg`}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">
                        {category.title}
                      </h3>
                      <div className="flex items-center">
                        <span className="text-gray-500 text-sm">{category.positions}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            variant="outline"
            className="border-gray-300 hover:border-gray-400 hover:bg-gray-100 transition-all px-8 py-3"
          >
            Ver todas las especialidades
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}
