"use client"

import { Cancel01Icon, CheckmarkCircle02Icon, Target02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { motion } from "motion/react"
import type { CandidateScore } from "@/app/api/ai/score-candidates/route"
import { cn } from "@/lib/utils"

type Props = {
  score: CandidateScore
}

export function AIScoreBadge({ score }: Props) {
  const color =
    score.score >= 75
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : score.score >= 50
        ? "bg-amber-100 text-amber-700 border-amber-200"
        : "bg-red-100 text-red-700 border-red-200"

  const recIcon =
    score.recommendation === "Avanzar"
      ? CheckmarkCircle02Icon
      : score.recommendation === "Evaluar"
        ? Target02Icon
        : Cancel01Icon

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium cursor-pointer",
        color
      )}
    >
      <HugeiconsIcon icon={recIcon} size={10} />
      {score.score}%
    </span>
  )
}

export function AIScoreBadgeSkeleton() {
  return (
    <motion.span
      animate={{ backgroundPosition: ["200% center", "-200% center"] }}
      className="inline-flex rounded-full border w-14 h-5 px-4 py-1 text-xs font-medium bg-muted/90 relative overflow-hidden"
      transition={{ duration: 4, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
      style={{
        backgroundImage:
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)",
        backgroundSize: "200% 100%",
        backgroundPosition: "200% center",
      }}
    ></motion.span>
  )
}
