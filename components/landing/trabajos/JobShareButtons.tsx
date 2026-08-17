"use client"

import {
  Copy01Icon,
  Linkedin02Icon,
  Share01Icon,
  TwitterIcon,
  WhatsappIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export type JobShareProps = {
  jobId: string
  jobTitle: string
  organizationName?: string
  location?: string
  salary?: string
  className?: string
  variant?: "dropdown" | "pills" | "compact"
}

export function JobShareButtons({
  jobId,
  jobTitle,
  organizationName = "Biovity",
  location = "Chile",
  salary = "A convenir",
  className,
  variant = "dropdown",
}: JobShareProps) {
  const [copied, setCopied] = useState(false)

  const origin = typeof window !== "undefined" ? window.location.origin : "https://biovity.cl"
  const jobUrl = `${origin}/trabajos/${jobId}`

  const whatsappMessage = `🔬 *Oferta de empleo en Biovity*
📌 *${jobTitle}* ${organizationName ? `en ${organizationName}` : ""}
📍 Ubicación: ${location}
💰 Rango salarial: ${salary}

👉 Postula o revisa todos los detalles aquí:
${jobUrl}`

  const tweetMessage = `🔬 Nueva oferta laboral en Biovity: ${jobTitle} en ${organizationName} (${location}). Revisa los detalles y postula:`

  const handleShareWhatsapp = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const handleShareLinkedin = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}`
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const handleShareTwitter = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetMessage)}&url=${encodeURIComponent(jobUrl)}`
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(jobUrl)
      setCopied(true)
      toast.success("Enlace copiado al portapapeles")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("No se pudo copiar el enlace")
    }
  }

  if (variant === "pills") {
    return (
      <div className={cn("flex flex-wrap items-center gap-2", className)}>
        <span className="text-xs font-medium text-muted-foreground mr-1">Compartir:</span>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleShareWhatsapp}
          className="gap-1.5 text-xs border-emerald-500/20 bg-emerald-500/5 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400 cursor-pointer"
        >
          <HugeiconsIcon
            icon={WhatsappIcon}
            size={15}
            className="text-emerald-600 dark:text-emerald-400"
          />
          WhatsApp
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleShareLinkedin}
          className="gap-1.5 text-xs border-blue-500/20 bg-blue-500/5 text-blue-700 hover:bg-blue-500/10 dark:text-blue-400 cursor-pointer"
        >
          <HugeiconsIcon
            icon={Linkedin02Icon}
            size={15}
            className="text-blue-600 dark:text-blue-400"
          />
          LinkedIn
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleShareTwitter}
          className="gap-1.5 text-xs border-slate-500/20 bg-slate-500/5 text-slate-700 hover:bg-slate-500/10 dark:text-slate-300 cursor-pointer"
        >
          <HugeiconsIcon
            icon={TwitterIcon}
            size={15}
            className="text-slate-600 dark:text-slate-300"
          />
          X / Twitter
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="gap-1.5 text-xs cursor-pointer"
        >
          <HugeiconsIcon icon={Copy01Icon} size={15} />
          {copied ? "¡Copiado!" : "Copiar Enlace"}
        </Button>
      </div>
    )
  }

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={handleShareWhatsapp}
          title="Compartir en WhatsApp"
          aria-label="Compartir en WhatsApp"
          className="hover:bg-emerald-500/10 hover:text-emerald-600 cursor-pointer"
        >
          <HugeiconsIcon icon={WhatsappIcon} size={16} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={handleShareLinkedin}
          title="Compartir en LinkedIn"
          aria-label="Compartir en LinkedIn"
          className="hover:bg-blue-500/10 hover:text-blue-600 cursor-pointer"
        >
          <HugeiconsIcon icon={Linkedin02Icon} size={16} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={handleShareTwitter}
          title="Compartir en Twitter"
          aria-label="Compartir en Twitter"
          className="hover:bg-slate-500/10 cursor-pointer"
        >
          <HugeiconsIcon icon={TwitterIcon} size={16} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={handleCopyLink}
          title="Copiar enlace"
          aria-label="Copiar enlace"
          className="cursor-pointer"
        >
          <HugeiconsIcon icon={Copy01Icon} size={16} />
        </Button>
      </div>
    )
  }

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-1.5 cursor-pointer">
            <HugeiconsIcon icon={Share01Icon} size={15} />
            Compartir
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel className="text-xs">Compartir oferta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleShareWhatsapp} className="cursor-pointer gap-2 text-xs">
            <HugeiconsIcon icon={WhatsappIcon} size={16} className="text-emerald-600" />
            WhatsApp
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleShareLinkedin} className="cursor-pointer gap-2 text-xs">
            <HugeiconsIcon icon={Linkedin02Icon} size={16} className="text-blue-600" />
            LinkedIn
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleShareTwitter} className="cursor-pointer gap-2 text-xs">
            <HugeiconsIcon icon={TwitterIcon} size={16} className="text-slate-700" />X (Twitter)
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleCopyLink}
            className="cursor-pointer gap-2 text-xs font-medium"
          >
            <HugeiconsIcon icon={Copy01Icon} size={16} />
            {copied ? "¡Enlace Copiado!" : "Copiar Enlace"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
