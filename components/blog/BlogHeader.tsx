"use client"

import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { getSpringTransition, getTransition, LANDING_ANIMATION } from "@/lib/animations"

export function BlogHeader() {
  const reducedMotion = useReducedMotion()
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })
  const _t = (delay = 0) => getTransition({ delay, reducedMotion })

  return (
    <div className="py-16 text-center">
      <m.h1
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={ts(0)}
        className="text-5xl font-semibold text-foreground text-balance"
      >
        Nuestro Blog
      </m.h1>
      <m.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={ts(LANDING_ANIMATION.sequenceDelay)}
        className="mt-4 text-lg text-muted-foreground px-4 text-pretty"
      >
        Noticias y artículos del mundo de la biotecnología y ciencias.
      </m.p>
    </div>
  )
}
