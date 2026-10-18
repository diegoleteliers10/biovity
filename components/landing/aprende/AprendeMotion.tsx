"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { type ReactNode, useRef } from "react"

gsap.registerPlugin(useGSAP, ScrollTrigger)

export function AprendeMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const media = gsap.matchMedia()
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-learn-heading]", {
          y: 16,
          opacity: 0,
          duration: 0.48,
          ease: "power2.out",
          clearProps: "transform,opacity",
        })
        gsap.from("[data-learn-description], [data-learn-actions]", {
          y: 10,
          opacity: 0,
          duration: 0.38,
          delay: 0.12,
          stagger: 0.07,
          ease: "power2.out",
          clearProps: "transform,opacity",
        })
        gsap.from("[data-learn-figure]", {
          y: 16,
          scale: 0.98,
          opacity: 0,
          duration: 0.65,
          delay: 0.2,
          ease: "power2.out",
          clearProps: "transform,opacity",
        })

        gsap.utils.toArray<HTMLElement>("[data-learn-reveal]").forEach((element) => {
          gsap.from(element, {
            y: 12,
            opacity: 0,
            duration: 0.42,
            ease: "power2.out",
            clearProps: "transform,opacity",
            scrollTrigger: { trigger: element, start: "top 91%", once: true },
          })
        })

        const thread = scope.current?.querySelector<SVGPathElement>("[data-learn-thread]")
        if (thread) {
          const threadLength = thread.getTotalLength()
          gsap.fromTo(
            thread,
            {
              strokeDasharray: `${threadLength} ${threadLength}`,
              strokeDashoffset: threadLength,
            },
            {
              strokeDasharray: `${threadLength} ${threadLength}`,
              strokeDashoffset: 0,
              duration: 1.2,
              delay: 0.25,
              ease: "power2.out",
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
