"use client"

import { ArrowRight } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { Button } from "../../ui/button"
import { HERO_STATS_EMPRESAS } from "@/lib/data/empresas-data"
import { LANDING_ANIMATION, getSpringTransition, getTransition } from "@/lib/animations"

const ICON_COLOR_CLASSES = [
  "text-violet-500",
  "text-emerald-500",
  "text-blue-500",
] as const

export function HeroEmpresas() {
  const reducedMotion = useReducedMotion()
  const t = (delay = 0) => getTransition({ delay, reducedMotion })
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })

  const scrollToContacto = () => {
    const contactSection = document.getElementById("contacto")
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative min-h-dvh w-full flex items-center justify-center overflow-hidden">
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
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight font-rubik px-2 text-balance"
          >
            Conecta con el nuevo
            <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent font-rubik">
              {" "}
              talento científico{" "}
            </span>
            de Chile
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={ts(LANDING_ANIMATION.sequenceDelay)}
            className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed font-sans px-4 text-pretty"
          >
            Simplifica tu proceso de reclutamiento y accede a profesionales cualificados en
            biotecnología, bioquímica, química e ingeniería química.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={ts(LANDING_ANIMATION.sequenceDelay * 2)}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Button
              size="lg"
              className="h-14 px-8 bg-gray-900 hover:bg-gray-800 text-white border-0 shadow-lg hover:shadow-xl transition-all text-lg"
              asChild
            >
              <a href="/register/organization">
                Comienza gratis
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 bg-white/50 hover:bg-white border-2 border-gray-200 text-gray-900 text-lg"
              onClick={scrollToContacto}
            >
              Hablar con ventas
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={ts(LANDING_ANIMATION.sequenceDelay * 3)}
            className="flex flex-wrap justify-center gap-8 md:gap-12"
          >
            {HERO_STATS_EMPRESAS.map((stat, index) => {
              const IconComponent = stat.icon
              const iconColor = ICON_COLOR_CLASSES[index % 3]
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={ts(LANDING_ANIMATION.sequenceDelay * 3 + index * LANDING_ANIMATION.stagger)}
                  className="flex items-center gap-3"
                >
                  <div className="w-12 h-12 rounded-full backdrop-blur-sm flex items-center justify-center">
                    <IconComponent className={`w-7 h-7 ${iconColor}`} />
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
