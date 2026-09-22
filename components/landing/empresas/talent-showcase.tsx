"use client"

import { Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { TalentTable } from "@/components/dashboard/organization/TalentTable"
import { DemoHeader } from "@/components/landing/demo/demo-header"
import { ProductShot } from "@/components/landing/demo/product-shot"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useMediaQuery } from "@/hooks/use-media-query"
import { getTransition, LANDING_ANIMATION, LANDING_ANIMATION_MOBILE } from "@/lib/animations"
import type * as ChatsHooks from "@/lib/api/use-chats"
import { DEMO_TALENT_USERS } from "@/lib/data/demo/organization-demo"

const idleChatMutation = {
  isPending: false,
  mutate: () => {},
} as unknown as ReturnType<typeof ChatsHooks.useCreateOrFindChatMutation>

/**
 * Talent-pool visualization for the companies landing: the real TalentTable
 * (hover cards, selection, pagination chrome) over local fixture users.
 */
export function TalentShowcase() {
  const { push } = useRouter()
  const reducedMotion = useReducedMotion()
  const isMobile = useMediaQuery("(max-width: 767px)")
  const isReduced = Boolean(reducedMotion)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const viewportMargin = isMobile
    ? LANDING_ANIMATION_MOBILE.viewportMargin
    : LANDING_ANIMATION.viewportMargin
  const t = (delay = 0) => getTransition({ delay, reducedMotion, isMobile })

  const handleCta = () => {
    toast.info("Crea la cuenta de tu organización para explorar el talento real.", {
      description:
        "Filtra por profesión, habilidades y ubicación, y escríbele directo al candidato.",
      action: {
        label: "Publicar una oferta",
        onClick: () => push("/register/organization"),
      },
    })
  }

  const handleSelectToggle = (userId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(userId)) {
        next.delete(userId)
      } else {
        next.add(userId)
      }
      return next
    })
  }

  return (
    <section className="w-full bg-surface-container-low py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <m.div
          initial={isReduced ? false : { opacity: 0, y: isMobile ? 16 : 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: viewportMargin }}
          transition={t()}
          className="mb-10 text-center md:mb-12"
        >
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-3 block">
            Pool de talento
          </span>
          <h2 className="text-2xl font-semibold text-foreground mb-4 tracking-tight text-balance sm:text-3xl md:text-4xl">
            Explora el talento <span className="text-accent font-semibold">científico</span> de
            Chile
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-0 max-w-3xl mx-auto leading-relaxed text-pretty">
            Busca por profesión, habilidades y ubicación dentro del pool de profesionales de
            Biovity, revisa su perfil con un clic y escríbele directamente.
          </p>
        </m.div>

        <m.div
          initial={isReduced ? false : { opacity: 0, y: isMobile ? 16 : 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: viewportMargin }}
          transition={t(0.1)}
          className="mx-auto max-w-6xl"
        >
          <ProductShot
            url="biovity.cl/dashboard/talent"
            height="h-auto"
            caption="Vista: Explorar Talento · perfiles ilustrativos"
          >
            <div className="flex flex-col gap-4 p-4 sm:p-6">
              <DemoHeader
                title="Explorar Talento"
                subtitle="Encuentra profesionales según tus necesidades."
                unreadNotifications={3}
              />

              {/* Search bar replica — mirrors the real TalentSearchBar row */}
              <div className="flex items-center gap-2">
                <div className="relative min-w-0 flex-1">
                  <Input
                    placeholder="Buscar por nombre, profesión o habilidad..."
                    aria-label="Buscar talento (demo)"
                    className="h-11 bg-surface-container-low pl-10 text-sm"
                  />
                  <HugeiconsIcon
                    icon={Search01Icon}
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
                <Button variant="outline" className="h-11 shrink-0 px-4 text-sm font-medium">
                  Filtros
                </Button>
              </div>

              <TalentTable
                users={DEMO_TALENT_USERS}
                recruiterId="demo-recruiter"
                createChatMutation={idleChatMutation}
                onRowClick={handleCta}
                currentPage={1}
                totalPages={1}
                total={DEMO_TALENT_USERS.length}
                onPrevPage={() => {}}
                onNextPage={() => {}}
                selectedIds={selectedIds}
                onSelectToggle={handleSelectToggle}
                onSelectAll={() => setSelectedIds(new Set(DEMO_TALENT_USERS.map((u) => u.id)))}
                onDeselectAll={() => setSelectedIds(new Set())}
              />
            </div>
          </ProductShot>
        </m.div>
      </div>
    </section>
  )
}

export default TalentShowcase
