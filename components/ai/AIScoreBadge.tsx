"use client"

import { AlertCircleIcon, CheckmarkCircle02Icon, Clock01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { domAnimation, LazyMotion, m } from "framer-motion"
import type { CandidateScore } from "@/app/api/ai/score-candidates/route"
import { cn } from "@/lib/utils"

type Props = { score: CandidateScore }

export function AIScoreBadge({ score }: Props) {
  const ready = score.status === "ready" && score.score !== null
  const icon = ready
    ? CheckmarkCircle02Icon
    : score.status === "failed"
      ? AlertCircleIcon
      : Clock01Icon
  const color = ready
    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
    : score.status === "failed"
      ? "bg-red-100 text-red-700 border-red-200"
      : "bg-slate-100 text-slate-700 border-slate-200"
  const label = ready
    ? `Compatibilidad: ${score.score}/100`
    : score.status === "insufficient"
      ? "Datos insuficientes"
      : score.status === "failed"
        ? "Análisis no disponible"
        : "Análisis pendiente"

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium cursor-pointer",
        color
      )}
    >
      <HugeiconsIcon icon={icon} size={10} />
      {label}
    </span>
  )
}

export function AIScoreBadgeSkeleton() {
  return (
    <LazyMotion features={domAnimation}>
      <m.span
        animate={{ backgroundPosition: ["200% center", "-200% center"] }}
        className="inline-flex rounded-full border w-36 h-5 px-4 py-1 text-xs font-medium bg-muted/90 relative overflow-hidden"
        transition={{ duration: 4, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
        style={{
          backgroundImage:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)",
          backgroundSize: "200% 100%",
          backgroundPosition: "200% center",
        }}
      />
    </LazyMotion>
  )
}
