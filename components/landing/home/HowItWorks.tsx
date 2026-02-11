"use client"

import { ChevronRight } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { STEPS_HOME } from "@/lib/data/home-data"
import { LANDING_ANIMATION, getSpringTransition, getTransition } from "@/lib/animations"

export function HowItWorks() {
  const reducedMotion = useReducedMotion()
  const t = (delay = 0) => getTransition({ delay, reducedMotion })
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion, snappy: true })

  const StepCard = ({ step, index }: { step: (typeof STEPS_HOME)[0]; index: number }) => {
    const isEven = index % 2 === 0
    const IconComponent = step.icon
    const cardDelay = index * LANDING_ANIMATION.chainStagger
    return (
      <motion.div
        className={`flex items-center w-full group ${!isEven ? "justify-start" : "justify-end"}`}
        initial={{ opacity: 0, x: isEven ? -40 : 40, scale: 0.96 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
        transition={ts(cardDelay)}
      >
        <div
          className={`w-full md:w-1/2 p-4 ${!isEven ? "md:pr-8 lg:pr-16 md:text-right" : "md:pl-8 lg:pl-16 md:text-left"}`}
        >
          <div className="transform transition-transform duration-500 group-hover:scale-105 bg-gray-50 p-6 rounded-xl shadow-md border border-gray-100">
            {/* Mobile step indicator */}
            <div className="flex items-center mb-4 md:hidden">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md ring-2 ring-white mr-3">
                <IconComponent className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                Paso {step.number}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h3>
            <p className="text-gray-500">{step.description}</p>
          </div>
        </div>
      </motion.div>
    )
  }

  const RoadmapLine = () => (
    <div
      className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-1 bg-none hidden md:block"
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        width="2"
        height="100%"
        viewBox="0 0 2 1200"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Roadmap dashed connecting line</title>
        {Array.from({ length: 30 }).map((_, idx) => {
          const dashHeight = 25
          const dashGap = 15
          const y = idx * (dashHeight + dashGap)
          return (
            <rect
              key={idx}
              x="0"
              y={y}
              width="2"
              height={dashHeight}
              rx="1"
              fill="url(#line-gradient)"
            />
          )
        })}
        <defs>
          <linearGradient id="line-gradient" x1="0" y1="0" x2="0" y2="1200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#BFDBFE" />
            <stop offset="100%" stopColor="#C4B5FD" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )

  const StepMarker = ({ index }: { index: number }) => {
    const IconComponent = STEPS_HOME[index].icon
    const topPosition = `${(index / (STEPS_HOME.length - 1)) * 85 + 7.5}%`
    // Markers appear AFTER their corresponding step card (chain effect)
    const markerDelay = index * LANDING_ANIMATION.chainStagger + LANDING_ANIMATION.duration + 0.08
    return (
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center justify-center"
        style={{ top: topPosition }}
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0, rotate: -120 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
        transition={ts(markerDelay)}
      >
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg ring-4 ring-white">
          <IconComponent className="w-8 h-8 text-white" />
        </div>
      </motion.div>
    )
  }

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={t(0)}
          className="text-center mb-20"
        >
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={t(0)}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight font-rubik text-balance"
          >
            Tu Camino hacia el Éxito Profesional
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={t(LANDING_ANIMATION.sequenceDelay)}
            className="text-xl text-gray-500 max-w-3xl mx-auto text-pretty"
          >
            En solo 4 simples pasos, estarás más cerca del trabajo de tus sueños en el sector
            biotecnológico.
          </motion.p>
        </motion.div>

        <div className="relative">
          <RoadmapLine />
          <div className="relative z-10 flex flex-col gap-8 md:gap-0">
            {STEPS_HOME.map((step, index) => (
              <StepCard step={step} index={index} key={step.number} />
            ))}
          </div>
          <div className="hidden md:block">
            {STEPS_HOME.map((step) => (
              <StepMarker key={step.number} index={parseInt(step.number) - 1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
