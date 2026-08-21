"use client"

import { Building05Icon, UserIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRef } from "react"
import { Circle } from "@/components/common/Circle"
import { AnimatedBeam } from "@/components/ui/animated-beam"

export function AdnBeam() {
  const containerRef = useRef<HTMLDivElement>(null)
  const div1Ref = useRef<HTMLDivElement>(null)
  const div2Ref = useRef<HTMLDivElement>(null)

  return (
    <div
      className="relative flex w-full max-w-[850px] items-center justify-between overflow-hidden py-8 px-6 sm:px-16"
      ref={containerRef}
    >
      <div className="flex size-full items-center justify-between z-10">
        {/* Circle 1 - Candidate */}
        <div className="flex flex-col items-center gap-3">
          <Circle
            ref={div1Ref}
            className="size-20 border-2 border-secondary/30 bg-surface-container-lowest text-secondary shadow-sm hover:scale-105 transition-transform"
          >
            <HugeiconsIcon icon={UserIcon} size={38} className="text-secondary" strokeWidth={1.5} />
          </Circle>
          <span className="text-xs font-mono font-semibold text-secondary uppercase tracking-wider">
            Talento Científico
          </span>
        </div>

        {/* Circle 2 - Organization */}
        <div className="flex flex-col items-center gap-3">
          <Circle
            ref={div2Ref}
            className="size-20 border-2 border-accent/30 bg-surface-container-lowest text-accent shadow-sm hover:scale-105 transition-transform"
          >
            <HugeiconsIcon icon={Building05Icon} size={38} className="text-accent" strokeWidth={1.5} />
          </Circle>
          <span className="text-xs font-mono font-semibold text-accent uppercase tracking-wider">
            Empresa / Centro I+D
          </span>
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div2Ref}
        startXOffset={40}
        endXOffset={-40}
        startYOffset={-10}
        endYOffset={10}
        curvature={-60}
        gradientStartColor="#006b5e"
        gradientStopColor="#8483d4"
        duration={4}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div2Ref}
        startXOffset={40}
        endXOffset={-40}
        startYOffset={10}
        endYOffset={-10}
        curvature={60}
        reverse
        gradientStartColor="#8483d4"
        gradientStopColor="#006b5e"
        duration={4}
      />
    </div>
  )
}
