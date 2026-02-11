"use client"

import { useRef } from "react"
import { motion, useReducedMotion } from "motion/react"
import { LANDING_ANIMATION, getTransition } from "@/lib/animations"

type UseScrollAnimationOptions = {
  readonly trigger?: string | React.RefObject<HTMLElement>
  readonly stagger?: number
  readonly delay?: number
}

export const useScrollAnimation = ({
  trigger,
  stagger = LANDING_ANIMATION.stagger,
  delay = 0,
}: UseScrollAnimationOptions = {}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const t = (d: number) => getTransition({ delay: d, reducedMotion })

  return {
    containerRef,
    AnimationWrapper: ({ children }: { children: React.ReactNode }) => (
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
        transition={t(delay)}
      >
        {children}
      </motion.div>
    ),
  }
}

export const useFadeInUp = (delay = 0) => {
  const ref = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const t = getTransition({ delay: delay * LANDING_ANIMATION.stagger, reducedMotion })

  return {
    ref,
    MotionElement: motion.div,
    motionProps: {
      initial: { opacity: 0, y: 60 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: LANDING_ANIMATION.viewportMargin },
      transition: t,
    },
  }
}

export const useStaggerCards = (delay = 0) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const t = (d: number) => getTransition({ delay: d, reducedMotion })

  return {
    containerRef,
    CardMotionWrapper: ({ children, index }: { children: React.ReactNode; index: number }) => (
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
        transition={t(delay + index * LANDING_ANIMATION.stagger)}
      >
        {children}
      </motion.div>
    ),
  }
}
