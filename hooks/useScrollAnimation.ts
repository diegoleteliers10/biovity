"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useRef } from "react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

type UseScrollAnimationOptions = {
  readonly trigger?: string | React.RefObject<HTMLElement>
  readonly start?: string
  readonly end?: string
  readonly stagger?: number
  readonly delay?: number
}

export const useScrollAnimation = ({
  trigger,
  start = "top 80%",
  end = "bottom 20%",
  stagger = 0.1,
  delay = 0,
}: UseScrollAnimationOptions = {}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const element = trigger
        ? typeof trigger === "string"
          ? document.querySelector(trigger)
          : trigger.current
        : containerRef.current

      if (!element) return

      const children = element.querySelectorAll("[data-animate]")

      gsap.fromTo(
        children,
        {
          opacity: 0,
          y: 50,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start,
            end,
            toggleActions: "play none none none",
          },
        }
      )
    },
    { scope: containerRef }
  )

  return containerRef
}

export const useFadeInUp = (delay = 0) => {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (!ref.current) return

      gsap.fromTo(
        ref.current,
        {
          opacity: 0,
          y: 60,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      )
    },
    { scope: ref }
  )

  return ref
}

export const useStaggerCards = (delay = 0) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!containerRef.current) return

      const cards = containerRef.current.querySelectorAll("[data-card]")

      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 80,
          scale: 0.9,
          rotationX: -15,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          duration: 0.8,
          stagger: 0.15,
          delay,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      )
    },
    { scope: containerRef }
  )

  return containerRef
}
