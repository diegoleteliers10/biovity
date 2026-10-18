import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CTANosotros() {
  return (
    <section className="bg-surface-container-lowest pb-20 pt-28 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 border-t border-border/60 pt-8 sm:pt-12 lg:grid-cols-12 lg:items-end">
          <div data-about-reveal className="lg:col-span-8">
            <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-wider text-secondary">
              El siguiente paso
            </p>
            <h2 className="max-w-4xl text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-6xl">
              La ciencia avanza con las personas que la hacen.
            </h2>
          </div>
          <div
            data-about-reveal
            className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:flex-col"
          >
            <Button asChild className="h-11 rounded-lg px-6 text-sm font-medium">
              <Link href="/register/professional">
                Crear perfil profesional
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={16}
                  className="ml-2"
                  aria-hidden="true"
                />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-lg border-border/50 bg-surface-container-lowest px-6 text-sm font-medium hover:bg-surface-container-low"
            >
              <Link href="/register/organization">Soy una organización</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
