"use client"

// THROW. EXCEPTIONAL CASE
// REASON: DOM measurement (getBoundingClientRect, ResizeObserver) requires
// access to the mounted DOM. No declarative React primitive covers this use case.
import { useInView, useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { type RefObject, useEffect, useId, useState } from "react"
import { cn } from "@/lib/utils"

export type AnimatedBeamProps = {
  className?: string
  containerRef: RefObject<HTMLElement | null>
  fromRef: RefObject<HTMLElement | null>
  toRef: RefObject<HTMLElement | null>
  curvature?: number
  reverse?: boolean
  pathColor?: string
  pathWidth?: number
  pathOpacity?: number
  gradientStartColor?: string
  gradientStopColor?: string
  delay?: number
  duration?: number
  startXOffset?: number
  startYOffset?: number
  endXOffset?: number
  endYOffset?: number
}

export const AnimatedBeam: React.FC<AnimatedBeamProps> = ({
  className,
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  duration = Math.random() * 3 + 4,
  delay = 0,
  pathColor = "gray",
  pathWidth = 2,
  pathOpacity = 0.2,
  gradientStartColor = "#2563eb",
  gradientStopColor = "#059669",
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
}) => {
  const id = useId()
  const [pathD, setPathD] = useState("")
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 })
  const reducedMotion = useReducedMotion()
  // The sweep repaints the whole stroke on every frame. Pause it while the beam
  // is off-screen so it never competes with the scroll it sits inside.
  const inView = useInView(containerRef, { margin: "120px 0px" })

  const gradientCoordinates = reverse
    ? {
        x1: ["90%", "-10%"],
        x2: ["100%", "0%"],
        y1: ["0%", "0%"],
        y2: ["0%", "0%"],
      }
    : {
        x1: ["10%", "110%"],
        x2: ["0%", "100%"],
        y1: ["0%", "0%"],
        y2: ["0%", "0%"],
      }

  useEffect(() => {
    const updatePath = () => {
      if (containerRef.current && fromRef.current && toRef.current) {
        const container = containerRef.current
        const rectContainer = container.getBoundingClientRect()
        const rectA = fromRef.current.getBoundingClientRect()
        const rectB = toRef.current.getBoundingClientRect()

        const scaleX =
          container.offsetWidth && rectContainer.width
            ? rectContainer.width / container.offsetWidth
            : 1
        const scaleY =
          container.offsetHeight && rectContainer.height
            ? rectContainer.height / container.offsetHeight
            : 1

        const svgWidth = container.offsetWidth || rectContainer.width
        const svgHeight = container.offsetHeight || rectContainer.height
        setSvgDimensions({ width: svgWidth, height: svgHeight })

        const startX =
          (rectA.left - rectContainer.left) / scaleX + rectA.width / scaleX / 2 + startXOffset
        const startY =
          (rectA.top - rectContainer.top) / scaleY + rectA.height / scaleY / 2 + startYOffset
        const endX =
          (rectB.left - rectContainer.left) / scaleX + rectB.width / scaleX / 2 + endXOffset
        const endY =
          (rectB.top - rectContainer.top) / scaleY + rectB.height / scaleY / 2 + endYOffset

        const midX = (startX + endX) / 2
        const midY = (startY + endY) / 2

        const dx = endX - startX
        const dy = endY - startY
        const len = Math.sqrt(dx * dx + dy * dy) || 1
        const perpX = (-dy / len) * Math.abs(curvature)
        const perpY = (dx / len) * Math.abs(curvature)

        const sign = curvature >= 0 ? 1 : -1
        const c1x = midX - dx * 0.25 + perpX * sign
        const c1y = midY - dy * 0.25 + perpY * sign
        const c2x = midX + dx * 0.25 - perpX * sign
        const c2y = midY + dy * 0.25 - perpY * sign

        const d = `M ${startX},${startY} C ${c1x},${c1y} ${c2x},${c2y} ${endX},${endY}`
        setPathD(d)
      }
    }

    const resizeObserver = new ResizeObserver(() => updatePath())
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }
    if (fromRef.current) {
      resizeObserver.observe(fromRef.current)
    }
    if (toRef.current) {
      resizeObserver.observe(toRef.current)
    }
    window.addEventListener("resize", updatePath)

    updatePath()

    // ResizeObserver already covers the late reflows these timeouts were
    // chasing (fonts, images, dynamic viewports), so they only duplicated work.
    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("resize", updatePath)
    }
  }, [containerRef, fromRef, toRef, curvature, startXOffset, startYOffset, endXOffset, endYOffset])

  return (
    <svg
      fill="none"
      width={svgDimensions.width}
      height={svgDimensions.height}
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "pointer-events-none absolute top-0 left-0 w-full h-full transform-gpu stroke-2",
        className
      )}
      viewBox={`0 0 ${svgDimensions.width || 1} ${svgDimensions.height || 1}`}
    >
      <title className="sr-only">Animated connection beam</title>
      <path
        d={pathD}
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        strokeLinecap="round"
      />
      <path
        d={pathD}
        strokeWidth={pathWidth}
        stroke={`url(#${id})`}
        strokeOpacity="1"
        strokeLinecap="round"
      />
      <defs>
        <m.linearGradient
          className="transform-gpu"
          id={id}
          gradientUnits={"userSpaceOnUse"}
          initial={{
            x1: "0%",
            x2: "0%",
            y1: "0%",
            y2: "0%",
          }}
          animate={
            inView && !reducedMotion
              ? {
                  x1: gradientCoordinates.x1,
                  x2: gradientCoordinates.x2,
                  y1: gradientCoordinates.y1,
                  y2: gradientCoordinates.y2,
                }
              : {
                  x1: "45%",
                  x2: "35%",
                  y1: gradientCoordinates.y1[0],
                  y2: gradientCoordinates.y2[0],
                }
          }
          transition={{
            delay,
            duration,
            ease: [0.16, 1, 0.3, 1],
            repeat: inView && !reducedMotion ? Infinity : 0,
            repeatDelay: 0,
          }}
        >
          <stop stopColor={gradientStartColor} stopOpacity="0"></stop>
          <stop stopColor={gradientStartColor}></stop>
          <stop offset="32.5%" stopColor={gradientStopColor}></stop>
          <stop offset="100%" stopColor={gradientStopColor} stopOpacity="0"></stop>
        </m.linearGradient>
      </defs>
    </svg>
  )
}
