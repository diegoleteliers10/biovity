"use client"

import { Briefcase01Icon, Location05Icon, Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { motion, useReducedMotion } from "motion/react"
import { LANDING_ANIMATION, getSpringTransition, getTransition } from "@/lib/animations"
import { Button } from "../../ui/button"
import { Card } from "../../ui/card"
import { Input } from "../../ui/input"

export function Hero() {
  const reducedMotion = useReducedMotion()
  const t = (delay = 0) => getTransition({ delay, reducedMotion })
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })
  return (
    <section className="relative h-dvh w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-green-50 pointer-events-none">
        {/* Blue-Cyan: 3 circles, blur for soft essence */}
        <div className="absolute top-[12%] left-[5%] w-[19rem] h-[19rem] bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-20 blur-2xl"></div>
        <div className="absolute top-[8%] right-[6%] w-[18rem] h-[18rem] bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-18 blur-2xl"></div>
        <div className="absolute top-[48%] left-[50%] w-[21rem] h-[21rem] bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-12 blur-3xl"></div>
        {/* Green-Emerald: 3 circles, blur for soft essence */}
        <div className="absolute top-[75%] left-[4%] w-[20rem] h-[20rem] bg-gradient-to-br from-green-400 to-emerald-400 rounded-full opacity-21 blur-2xl"></div>
        <div className="absolute top-[62%] right-[5%] w-[19rem] h-[19rem] bg-gradient-to-br from-green-400 to-emerald-400 rounded-full opacity-17 blur-2xl"></div>
        <div className="absolute top-[28%] left-[18%] w-[17rem] h-[17rem] bg-gradient-to-br from-green-400 to-emerald-400 rounded-full opacity-18 blur-2xl"></div>
        {/* Violet-Purple: 3 circles, blur for soft essence */}
        <div className="absolute top-[22%] right-[22%] w-[18rem] h-[18rem] bg-gradient-to-br from-violet-400 to-purple-400 rounded-full opacity-19 blur-2xl"></div>
        <div className="absolute top-[65%] left-[35%] w-[17rem] h-[17rem] bg-gradient-to-br from-violet-400 to-purple-400 rounded-full opacity-18 blur-2xl"></div>
        <div className="absolute top-[72%] right-[18%] w-[19rem] h-[19rem] bg-gradient-to-br from-violet-400 to-purple-400 rounded-full opacity-20 blur-2xl"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 pt-20 md:pt-24">
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={ts(0)}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-gray-900 mb-4 md:mb-6 leading-tight px-2 text-balance"
          >
            Donde el talento y la
            <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              {" "}
              ciencia{" "}
            </span>
            se encuentran
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={ts(LANDING_ANIMATION.sequenceDelay)}
            className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4 text-pretty"
          >
            Ayudamos a profesionales y estudiantes a encontrar trabajo y oportunidades en
            biotecnología, bioquímica, química, ingeniería química y salud.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={ts(LANDING_ANIMATION.sequenceDelay * 2)}
          >
            <Card className="p-4 sm:p-6 max-w-4xl mx-auto shadow-lg border-0 bg-white/80 backdrop-blur-sm w-full px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1 relative">
                  <HugeiconsIcon icon={Briefcase01Icon} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="¿Qué puesto buscas?"
                    className="pl-10 h-12 border-0 bg-gray-50 focus:bg-white transition-colors"
                  />
                </div>
                <div className="flex-1 relative">
                  <HugeiconsIcon icon={Location05Icon} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="¿Dónde?"
                    className="pl-10 h-12 border-0 bg-gray-50 focus:bg-white transition-colors"
                  />
                </div>
                <Button
                  size="lg"
                  className="h-12 px-6 sm:px-8 bg-gray-900 hover:bg-gray-800 text-white border-0 shadow-sm hover:shadow-md transition-all w-full sm:w-auto"
                >
                  <HugeiconsIcon icon={Search01Icon} className="w-5 h-5 mr-2" />
                  Buscar
                </Button>
              </div>
            </Card>

            <div className="flex flex-wrap justify-center gap-3 mt-6 md:mt-8 px-4">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/50 hover:bg-white text-xs sm:text-sm"
              >
                <HugeiconsIcon icon={Briefcase01Icon} className="w-4 h-4 mr-2" />
                Para Profesionales
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/50 hover:bg-white text-xs sm:text-sm"
              >
                <HugeiconsIcon icon={Search01Icon} className="w-4 h-4 mr-2" />
                Para Empresas
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
