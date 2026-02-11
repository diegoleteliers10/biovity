/**
 * Shared animation configuration for landing page entrance effects.
 * Premium spring + tween mix for polished, organic feel.
 * Respects prefers-reduced-motion when passed reducedMotion=true.
 */

export const LANDING_ANIMATION = {
  /** Main entrance duration - refined for tween fallback */
  duration: 0.5,
  /** Reduced motion duration - instant for accessibility */
  durationReduced: 0.01,
  /** Stagger delay between items in a list/grid */
  stagger: 0.08,
  /** Delay for sequential elements (e.g. h1 -> p -> cta) */
  sequenceDelay: 0.12,
  /** Stagger for chain-like sequences (cards one after another) */
  chainStagger: 0.28,
  /** Viewport margin so elements start animating slightly before fully in view */
  viewportMargin: "0px 0px -80px 0px",
  /** Easing for entrance - ease-out feels natural */
  ease: "easeOut" as const,
  /** Spring config: subtle organic bounce for cards and key elements */
  spring: { type: "spring" as const, stiffness: 90, damping: 18 },
  /** Spring config: snappier for markers/icons */
  springSnappy: { type: "spring" as const, stiffness: 120, damping: 20 },
} as const

export const getTransition = (options: {
  delay?: number
  duration?: number
  reducedMotion?: boolean | null
}) => {
  const { delay = 0, duration = LANDING_ANIMATION.duration, reducedMotion } = options
  const prefersReduced = Boolean(reducedMotion)
  return {
    delay,
    duration: prefersReduced ? LANDING_ANIMATION.durationReduced : duration,
    ease: LANDING_ANIMATION.ease,
  }
}

/** Spring transition with delay - for cards, markers, organic entrances */
export const getSpringTransition = (options: {
  delay?: number
  reducedMotion?: boolean | null
  snappy?: boolean
}) => {
  const { delay = 0, reducedMotion, snappy = false } = options
  const prefersReduced = Boolean(reducedMotion)
  if (prefersReduced) {
    return { delay, duration: LANDING_ANIMATION.durationReduced, ease: "easeOut" as const }
  }
  const spring = snappy ? LANDING_ANIMATION.springSnappy : LANDING_ANIMATION.spring
  return { delay, ...spring }
}
