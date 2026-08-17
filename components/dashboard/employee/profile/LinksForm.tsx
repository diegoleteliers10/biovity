"use client"

import { Cancel01Icon, GithubIcon, Globe02Icon, LinkedinIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { EditableCard } from "./EditableCard"
import { useProfileContext } from "./profile-context"

type LinkInfo = { label: string; Icon: typeof GithubIcon }

const getLinkInfo = (url: string): LinkInfo => {
  try {
    const host = new URL(url).hostname.toLowerCase()
    if (host.includes("linkedin")) return { label: "LinkedIn", Icon: LinkedinIcon }
    if (host.includes("github")) return { label: "GitHub", Icon: GithubIcon }
    if (host.includes("portfolio") || host.includes("personal"))
      return { label: "Portfolio", Icon: Globe02Icon }
    return { label: host.replace("www.", ""), Icon: Globe02Icon }
  } catch {
    return { label: url, Icon: Globe02Icon }
  }
}

export function LinksForm() {
  const { resume, resumeFormData, isEditing, handleResumeArrayChange } = useProfileContext()

  return (
    <EditableCard>
      <CardContent className="pl-0">
        {isEditing ? (
          <div className="space-y-4">
            {(resumeFormData.links.length > 0 ? resumeFormData.links : [{ url: "" }]).map(
              (link, i) => (
                <div key={`link-edit-${link.url || "new"}`} className="flex gap-2">
                  <Input
                    value={link.url}
                    onChange={(e) =>
                      handleResumeArrayChange("links", (arr) => {
                        const next = [...arr]
                        next[i] = { url: e.target.value }
                        return next
                      })
                    }
                    placeholder="https://linkedin.com/in/..."
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleResumeArrayChange("links", (arr) => arr.filter((_, j) => j !== i))
                    }
                    aria-label="Eliminar"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} size={16} />
                  </Button>
                </div>
              )
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleResumeArrayChange("links", (arr) => [...arr, { url: "" }])}
            >
              Agregar enlace
            </Button>
          </div>
        ) : (resume?.links?.length ?? 0) > 0 ? (
          <ul className="space-y-2">
            {(resume?.links ?? []).map((link, _i) => {
              const { label, Icon } = getLinkInfo(link.url)
              const IconComponent = Icon
              return (
                <li key={`link-display-${link.url}`}>
                  <Link
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:underline text-sm"
                  >
                    <HugeiconsIcon icon={IconComponent} size={14} />
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="text-muted-foreground text-sm">
            Agrega enlaces a LinkedIn, portfolio, GitHub u otros
          </p>
        )}
      </CardContent>
    </EditableCard>
  )
}
