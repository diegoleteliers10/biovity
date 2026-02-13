"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

type LogoProps = {
  readonly size?: "sm" | "md" | "lg" | "xl"
  readonly className?: string
  readonly showText?: boolean
  readonly textSize?: "sm" | "md" | "lg"
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-20 h-20",
}

const textSizeClasses = {
  sm: "text-sm",
  md: "text-lg",
  lg: "text-xl",
}

export function Logo({ size = "lg", className, showText = false, textSize = "lg" }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        <Image
          src="/logoIconBiovity.png"
          alt="Biovity Logo"
          width={80}
          height={80}
          className="w-full h-full object-contain"
          priority
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={cn("font-bold text-foreground", textSizeClasses[textSize])}>
            Biovity
          </span>
          <span className="text-xs text-muted-foreground">Dashboard</span>
        </div>
      )}
    </div>
  )
}
