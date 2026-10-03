"use client"

import type { UseInViewOptions } from "motion/react"
import { useInView, useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { type ReactNode, useRef } from "react"
import { getSpringTransition, getTransition, LANDING_ANIMATION } from "@/lib/animations"
import { cn } from "@/lib/utils"

export type RevealProps = {
  children: ReactNode
  className?: string
  /** Vertical travel in px. 0 disables the translate. */
  y?: number
  /** Starting scale. Undefined disables the scale component. */
  scale?: number
  delay?: number
  /** Spring easing instead of the default tween. */
  spring?: boolean
  /** Viewport margin. Defaults to starting slightly before the element is in view. */
  margin?: UseInViewOptions["margin"]
  /** Reveal once, then stop tracking. Default true. */
  once?: boolean
}

/**
 * Scroll reveal for landing sections. Animates opacity and transform only, both
 * of which the compositor handles without layout.
 *
 * Travel is the cost knob. A moving element becomes a composited layer sized to
 * its whole box, so translating a 600 px product frame asks the compositor to
 * hold a viewport-sized bitmap and re-raster it as it moves. Pass y={0} for
 * those and let opacity carry the entrance. Keep travel for headings and cards,
 * where the layer is small.
 *
 * The observer comes from Motion's useInView, matching what whileInView used, so
 * reveal behaviour and pooled observer count stay exactly as they were.
 *
 * Do not put content-visibility on these sections. It skips rendering for an
 * off-screen subtree, which also skips that subtree's hydration, so a revealed
 * section never mounts and stays at its server-rendered opacity:0 forever.
 */
export function Reveal({
  children,
  className,
  y = 20,
  scale,
  delay = 0,
  spring = false,
  margin = LANDING_ANIMATION.viewportMargin,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const isInView = useInView(ref, { margin, once })
  const reducedMotion = useReducedMotion()
  const isReduced = Boolean(reducedMotion)

  // A scale animation allocates the same layer as a translate, so cards that
  // scale get a shorter travel.
  const travel = isReduced || y === 0 ? 0 : scale != null ? Math.min(y, 10) : y

  return (
    <m.div
      ref={ref}
      className={cn(className)}
      initial={
        isReduced
          ? false
          : { opacity: 0, ...(travel > 0 && { y: travel }), ...(scale != null && { scale }) }
      }
      animate={
        isReduced
          ? { opacity: 1, y: 0, scale: 1 }
          : isInView
            ? { opacity: 1, y: 0, scale: 1 }
            : { opacity: 0, y: travel > 0 ? travel : 0, scale: scale ?? 1 }
      }
      transition={
        spring
          ? getSpringTransition({ delay, reducedMotion, isMobile: false })
          : getTransition({ delay, reducedMotion, isMobile: false })
      }
    >
      {children}
    </m.div>
  )
}
