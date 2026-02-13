"use client"

import { Linkedin02Icon, TwitterIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function SocialShare({ className }: { className?: string }) {
  const pathname = usePathname()
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://biovity.cl"}${pathname}`

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url
    )}&text=Mira este artículo de Biovity:`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-sm font-medium">Compartir:</span>
      <Button asChild variant="outline" size="icon-sm">
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Compartir en Twitter"
        >
          <HugeiconsIcon icon={TwitterIcon} className="h-4 w-4" />
        </a>
      </Button>
      <Button asChild variant="outline" size="icon-sm">
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Compartir en LinkedIn"
        >
          <HugeiconsIcon icon={Linkedin02Icon} className="h-4 w-4" />
        </a>
      </Button>
    </div>
  )
}
