import type { ReactNode } from "react"

export type LegalDocumentSection = {
  id: string
  title: string
}

type LegalDocumentLayoutProps = {
  children: ReactNode
  lastUpdated: {
    dateTime: string
    label: string
  }
  sections: readonly LegalDocumentSection[]
  title: string
  variant: "cookies" | "privacy" | "terms"
}

const SectionLinks = ({
  sections,
  variant,
}: {
  sections: readonly LegalDocumentSection[]
  variant: LegalDocumentLayoutProps["variant"]
}) => (
  <nav aria-label="Secciones del documento">
    {variant === "cookies" && (
      <ul className="flex flex-wrap gap-x-6 gap-y-2">
        {sections.map((section, index) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <span className="text-xs tabular-nums text-secondary">{index + 1}</span>
              {section.title}
            </a>
          </li>
        ))}
      </ul>
    )}

    {variant === "privacy" && (
      <ul className="space-y-1">
        {sections.map((section, index) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-container-lowest hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <span className="text-xs tabular-nums text-secondary">{index + 1}</span>
              {section.title}
            </a>
          </li>
        ))}
      </ul>
    )}

    {variant === "terms" && (
      <ol className="grid gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
        {sections.map((section, index) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="group flex min-h-14 items-center gap-3 rounded-lg px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <span className="text-xs tabular-nums text-primary-foreground/70">{index + 1}</span>
              <span>{section.title}</span>
            </a>
          </li>
        ))}
      </ol>
    )}
  </nav>
)

export function LegalDocumentLayout({
  children,
  lastUpdated,
  sections,
  title,
  variant,
}: LegalDocumentLayoutProps) {
  return (
    <main className="min-h-svh bg-surface-container-low pb-20 pt-32 sm:pb-24 sm:pt-36 lg:pb-28 lg:pt-40">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 grid gap-6 sm:mb-12 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-end">
          <h1 className="max-w-5xl text-balance text-4xl font-semibold leading-[1.04] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground lg:pb-1">
            Última actualización: <time dateTime={lastUpdated.dateTime}>{lastUpdated.label}</time>
          </p>
        </header>

        {variant === "cookies" && (
          <div className="mb-8 rounded-xl bg-surface-container-highest px-5 py-3 sm:px-7">
            <SectionLinks sections={sections} variant={variant} />
          </div>
        )}

        {variant === "terms" && (
          <div className="mb-8 rounded-xl bg-primary px-4 py-4 text-primary-foreground sm:px-6">
            <SectionLinks sections={sections} variant={variant} />
          </div>
        )}

        <div
          className={
            variant === "privacy"
              ? "grid items-start gap-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10"
              : ""
          }
        >
          {variant === "privacy" && (
            <aside className="rounded-xl bg-surface-container-highest p-4 sm:p-5 lg:sticky lg:top-28">
              <p className="mb-3 px-3 text-sm font-semibold text-foreground">En este documento</p>
              <SectionLinks sections={sections} variant={variant} />
            </aside>
          )}

          <article className="min-w-0 rounded-xl bg-surface-container-lowest p-5 text-base leading-relaxed text-foreground sm:p-8 lg:p-10">
            <div className="space-y-10 [&_h2]:scroll-mt-32 [&_p]:leading-7 [&_section]:scroll-mt-32 [&_section]:space-y-3">
              {children}
            </div>
          </article>
        </div>
      </div>
    </main>
  )
}
