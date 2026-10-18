"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { type ReactNode, useRef } from "react"

gsap.registerPlugin(useGSAP, ScrollTrigger)

export function CompaniesMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const media = gsap.matchMedia()
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-company-heading]", {
          x: -18,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
          clearProps: "transform,opacity",
        })
        gsap.from("[data-company-notes]", {
          y: 10,
          opacity: 0,
          duration: 0.4,
          delay: 0.12,
          ease: "power2.out",
          clearProps: "transform,opacity",
        })
        gsap.from("[data-company-board]", {
          y: 18,
          opacity: 0,
          duration: 0.48,
          delay: 0.18,
          ease: "power2.out",
          clearProps: "transform,opacity",
        })
        gsap.utils.toArray<HTMLElement>("[data-company-reveal]").forEach((element) => {
          gsap.from(element, {
            y: 12,
            opacity: 0,
            duration: 0.4,
            ease: "power2.out",
            clearProps: "transform,opacity",
            scrollTrigger: { trigger: element, start: "top 92%", once: true },
          })
        })
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
