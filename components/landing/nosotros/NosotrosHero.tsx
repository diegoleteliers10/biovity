"use client"

import { motion, useReducedMotion } from "motion/react"
import { LANDING_ANIMATION, getSpringTransition, getTransition } from "@/lib/animations"

export function NosotrosHero() {
  const reducedMotion = useReducedMotion()
  const t = (delay = 0) => getTransition({ delay, reducedMotion })
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={ts(0)}
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight font-rubik text-balance"
          >
            Conectando el Talento Científico de Chile
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={ts(LANDING_ANIMATION.sequenceDelay)}
            className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed text-pretty"
          >
            Nuestra misión es crear una comunidad que conecte profesionales y estudiantes en biotecnología,
            química, farmacia y ciencias de la salud con las mejores oportunidades del mercado laboral.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={ts(LANDING_ANIMATION.sequenceDelay * 2)}
            className="flex flex-wrap justify-center gap-8 md:gap-12 max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={ts(LANDING_ANIMATION.sequenceDelay * 3)}
              className="text-center"
            >
              <p className="text-3xl font-bold text-gray-900 mb-1">+500</p>
              <p className="text-sm text-gray-500">profesionalesactivos</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={ts(LANDING_ANIMATION.sequenceDelay * 3 + LANDING_ANIMATION.stagger)}
              className="text-center"
            >
              <p className="text-3xl font-bold text-gray-900 mb-1">2026</p>
              <p className="text-sm text-gray-500">fundada</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
