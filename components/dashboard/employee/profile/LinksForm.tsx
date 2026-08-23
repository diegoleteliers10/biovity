"use client"

import {
  Cancel01Icon,
  GithubIcon,
  Globe02Icon,
  LinkSquare01Icon,
  LinkedinIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EditableCard } from "./EditableCard"
import { EmptyListState } from "./EmptyListState"
import { useProfileContext } from "./profile-context"

type LinkInfo = { label: string; Icon: typeof GithubIcon }

const getLinkInfo = (url: string): LinkInfo => {
  const cleanUrl = url.trim().toLowerCase()
  if (cleanUrl.includes("linkedin")) return { label: "LinkedIn", Icon: LinkedinIcon }
  if (cleanUrl.includes("github")) return { label: "GitHub", Icon: GithubIcon }
  if (cleanUrl.includes("portfolio") || cleanUrl.includes("personal"))
    return { label: "Portfolio", Icon: Globe02Icon }
  try {
    const host = new URL(url.startsWith("http") ? url : `https://${url}`).hostname.toLowerCase()
    return { label: host.replace("www.", ""), Icon: Globe02Icon }
  } catch {
    return { label: url, Icon: Globe02Icon }
  }
}

export function LinksForm() {
  const { resume, resumeFormData, isEditing, handleResumeArrayChange } = useProfileContext()

  return (
    <EditableCard>
      {isEditing ? (
        <div className="space-y-3">
          {(resumeFormData.links.length > 0 ? resumeFormData.links : [{ url: "" }]).map(
            (link, i) => (
              <div key={`link-edit-${link.url || "new"}-${i}`} className="flex gap-2 items-center">
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
                  className="h-9 rounded-lg border-border/40 bg-surface-container-lowest text-xs sm:text-sm flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-9 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
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
            className="h-9 px-3 rounded-lg border border-border/40 bg-surface-container-lowest hover:bg-surface-container-low text-xs font-medium text-foreground transition-colors"
            onClick={() => handleResumeArrayChange("links", (arr) => [...arr, { url: "" }])}
          >
            Agregar enlace
          </Button>
        </div>
      ) : (resume?.links?.length ?? 0) > 0 ? (
        <ul className="space-y-2">
          {(resume?.links ?? []).map((link) => {
            const { label, Icon } = getLinkInfo(link.url)
            const href = link.url.startsWith("http") ? link.url : `https://${link.url}`
            return (
              <li key={`link-display-${link.url}`}>
                <Link
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium"
                >
                  <HugeiconsIcon icon={Icon} size={16} className="text-muted-foreground" />
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      ) : (
        <EmptyListState
          icon={LinkSquare01Icon}
          message="Agrega enlaces a LinkedIn, portfolio, GitHub u otros"
        />
      )}
    </EditableCard>
  )
}
