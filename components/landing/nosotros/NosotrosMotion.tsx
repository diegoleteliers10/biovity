"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { type ReactNode, useRef } from "react"

gsap.registerPlugin(useGSAP, ScrollTrigger)

const ROUTE_THREAD_LENGTH = 100

export function NosotrosMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const media = gsap.matchMedia()
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-about-statement]", {
          y: 18,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
          clearProps: "transform,opacity",
        })
        gsap.from("[data-about-detail]", {
          x: -12,
          opacity: 0,
          duration: 0.42,
          delay: 0.12,
          ease: "power2.out",
          clearProps: "transform,opacity",
        })
        gsap.from("[data-about-route]", {
          x: 12,
          opacity: 0,
          duration: 0.4,
          delay: 0.18,
          stagger: 0.08,
          ease: "power2.out",
          clearProps: "transform,opacity",
        })
        gsap.from("[data-about-actions]", {
          y: 10,
          opacity: 0,
          duration: 0.38,
          delay: 0.4,
          ease: "power2.out",
          clearProps: "transform,opacity",
        })

        const heroThreads = scope.current?.querySelectorAll<SVGPathElement>(
          "[data-about-hero-thread]"
        )
        heroThreads?.forEach((heroThread) => {
          const threadLength = heroThread.getTotalLength()
          gsap.fromTo(
            heroThread,
            {
              strokeDasharray: `${threadLength} ${threadLength}`,
              strokeDashoffset: threadLength,
            },
            { strokeDashoffset: 0, duration: 0.8, delay: 0.3, ease: "power2.out" }
          )
        })

        gsap.utils.toArray<HTMLElement>("[data-about-reveal]").forEach((element) => {
          gsap.from(element, {
            y: 12,
            opacity: 0,
            duration: 0.45,
            ease: "power2.out",
            clearProps: "transform,opacity",
            scrollTrigger: { trigger: element, start: "top 90%", once: true },
          })
        })

        const thread = scope.current?.querySelector<SVGPathElement>("[data-about-thread]")
        const route = thread?.closest("ol")
        if (thread && route) {
          gsap.fromTo(
            thread,
            {
              strokeDasharray: `${ROUTE_THREAD_LENGTH} ${ROUTE_THREAD_LENGTH}`,
              strokeDashoffset: ROUTE_THREAD_LENGTH,
            },
            {
              strokeDashoffset: 0,
              ease: "none",
              scrollTrigger: {
                trigger: route,
                start: "top 75%",
                end: "bottom 50%",
                scrub: 0.4,
              },
            }
          )
        }
      })

      return () => media.revert()
    },
    { scope }
  )

  return (
    <main ref={scope} className="relative flex min-w-0 flex-col">
      {children}
    </main>
  )
}
