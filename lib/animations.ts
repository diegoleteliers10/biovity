/**
 * Shared animation configuration for landing page entrance effects.
 * Premium spring + tween mix for polished, organic feel.
 * Respects prefers-reduced-motion when passed reducedMotion=true.
 */

export const LANDING_ANIMATION = {
  /** Main entrance duration */
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
  /** Custom ease-out for UI interactions */
  easeOut: [0.23, 1, 0.32, 1] as [number, number, number, number],
  /** Custom ease-in-out for on-screen movement */
  easeInOut: [0.77, 0, 0.175, 1] as [number, number, number, number],
  /** Easing for entrance */
  ease: "easeOut" as const,
  /** Spring config: subtle organic bounce for cards and key elements */
  spring: { type: "spring" as const, stiffness: 90, damping: 18 },
  /** Spring config: snappier for markers/icons */
  springSnappy: { type: "spring" as const, stiffness: 120, damping: 20 },
} as const

/** Mobile-tuned overrides: fast, responsive and GPU-friendly */
export const LANDING_ANIMATION_MOBILE = {
  duration: 0.35,
  stagger: 0.04,
  sequenceDelay: 0.06,
  chainStagger: 0.06,
  viewportMargin: "0px 0px -20px 0px",
  spring: { type: "spring" as const, stiffness: 160, damping: 22 },
  springSnappy: { type: "spring" as const, stiffness: 180, damping: 24 },
} as const

export const getTransition = (options: {
  delay?: number
  duration?: number
  reducedMotion?: boolean | null
  isMobile?: boolean
}) => {
  const { delay = 0, duration = LANDING_ANIMATION.duration, reducedMotion, isMobile } = options
  const prefersReduced = Boolean(reducedMotion)
  if (prefersReduced) {
    return { delay, duration: LANDING_ANIMATION.durationReduced, ease: LANDING_ANIMATION.easeOut }
  }
  const effectiveDuration = isMobile ? LANDING_ANIMATION_MOBILE.duration : duration
  return {
    delay,
    duration: effectiveDuration,
    ease: LANDING_ANIMATION.easeOut,
  }
}

/** Spring transition with delay - for cards, markers, organic entrances */
export const getSpringTransition = (options: {
  delay?: number
  reducedMotion?: boolean | null
  snappy?: boolean
  isMobile?: boolean
}) => {
  const { delay = 0, reducedMotion, snappy = false, isMobile } = options
  const prefersReduced = Boolean(reducedMotion)
  if (prefersReduced) {
    return { delay, duration: LANDING_ANIMATION.durationReduced, ease: "easeOut" as const }
  }
  if (isMobile) {
    return {
      delay,
      ...(snappy ? LANDING_ANIMATION_MOBILE.springSnappy : LANDING_ANIMATION_MOBILE.spring),
    }
  }
  const spring = snappy ? LANDING_ANIMATION.springSnappy : LANDING_ANIMATION.spring
  return { delay, ...spring }
}
