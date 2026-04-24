"use client"

import { Menu01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useSidebar } from "@/components/animate-ui/components/radix/sidebar"
import { Button } from "@/components/ui/button"

export function MobileMenuButton() {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      aria-label="Abrir menú"
      className="lg:hidden shrink-0"
    >
      <HugeiconsIcon icon={Menu01Icon} size={24} strokeWidth={1.5} />
    </Button>
  )
}
