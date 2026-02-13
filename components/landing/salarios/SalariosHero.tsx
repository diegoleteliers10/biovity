"use client"

import { TrendingUp } from "lucide-react"
import { motion } from "motion/react"
import { SALARIOS_HERO_STATS } from "@/lib/data/salarios-data"

export function SalariosHero() {
  return (
    <section className="relative min-h-dvh w-full flex items-center justify-center overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight text-balance"
          >
            Estudio de{" "}
            <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              Salarios en Biociencias
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.2, ease: "easeOut" }}
            className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed font-sans text-pretty"
          >
            Análisis completo de remuneraciones en el sector de biociencias en Chile. Datos
            segmentados por carrera, industria, región y nivel educativo (2024-2025).
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.2, ease: "easeOut" }}
            className="text-center text-sm text-gray-500 mb-12"
          >
            <TrendingUp className="w-5 h-5 text-blue-600 inline-block mr-2" />
            <span>Datos actualizados 2024-2025</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.2, ease: "easeOut" }}
            className="grid grid-cols-3 gap-8 md:gap-12 max-w-4xl mx-auto"
          >
            {SALARIOS_HERO_STATS.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.05 + index * 0.03, duration: 0.2, ease: "easeOut" }}
                  className="text-center"
                >
                  <div className="mx-auto mb-3 flex justify-center">
                    <IconComponent className="w-10 h-10" style={{ color: stat.color }} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
