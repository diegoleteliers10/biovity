import type { MDXComponents } from "mdx/types"
import { codeToHtml } from "shiki"
import { CopyButton } from "./copy-button"

const LANGUAGE_LABELS: Record<string, string> = {
  python: "Python",
  py: "Python",
  r: "R",
  bash: "Terminal",
  sh: "Terminal",
  shell: "Terminal",
  json: "JSON",
  yaml: "YAML",
  sql: "SQL",
  js: "JavaScript",
  javascript: "JavaScript",
  ts: "TypeScript",
  typescript: "TypeScript",
}

async function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const html = await codeToHtml(code.trim(), {
    lang: lang === "py" ? "python" : lang,
    theme: "github-light",
  })

  const label = LANGUAGE_LABELS[lang] ?? lang.toUpperCase()

  return (
    <div className="my-6 rounded-xl border border-border/40 bg-surface-container-lowest overflow-hidden shadow-none">
      <div className="flex items-center justify-between px-4 py-2 bg-surface-container-low border-b border-border/40">
        <span className="text-xs font-mono font-medium text-muted-foreground">{label}</span>
        <CopyButton text={code.trim()} />
      </div>
      <div
        className="overflow-x-auto text-sm leading-relaxed [&_pre]:!bg-transparent [&_pre]:!p-4 [&_pre]:!m-0"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-secondary/10 text-secondary px-1.5 py-0.5 rounded text-sm font-mono font-medium">
      {children}
    </code>
  )
}

function Callout({
  type = "info",
  children,
}: {
  type?: "info" | "tip" | "warning"
  children: React.ReactNode
}) {
  const styles = {
    info: "border-l-secondary bg-secondary/5",
    tip: "border-l-accent bg-accent/5",
    warning: "border-l-amber-500 bg-amber-50",
  }

  const labels = {
    info: "Nota",
    tip: "Consejo",
    warning: "Importante",
  }

  return (
    <div className={`my-6 border-l-4 rounded-r-xl px-5 py-4 ${styles[type]}`}>
      <p className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground mb-2">
        {labels[type]}
      </p>
      <div className="text-sm text-foreground leading-relaxed">{children}</div>
    </div>
  )
}

function StepHeader({ number, title }: { number: number; title: string }) {
  return (
    <div className="flex items-center gap-3 my-8">
      <span className="flex-shrink-0 size-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-bold">
        {number}
      </span>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
    </div>
  )
}

export function createCapsuleComponents(modules: { slug: string }[]): MDXComponents {
  return {
    Callout,
    h2: ({ children, ...props }) => {
      const text = typeof children === "string" ? children : ""
      const moduleMatch = text.match(/^Módulo (\d+)/)
      if (moduleMatch) {
        const slug = modules[Number(moduleMatch[1]) - 1]?.slug
        return (
          <h2
            id={slug}
            className="text-2xl sm:text-3xl font-semibold text-foreground mt-12 mb-4 tracking-tight text-balance scroll-mt-24"
            {...props}
          >
            {children}
          </h2>
        )
      }
      return (
        <h2
          className="text-2xl sm:text-3xl font-semibold text-foreground mt-12 mb-4 tracking-tight text-balance"
          {...props}
        >
          {children}
        </h2>
      )
    },
    h3: ({ children, ...props }) => {
      const text = typeof children === "string" ? children : ""
      const stepMatch = text.match(/^Paso (\d+):?\s*(.*)/)
      if (stepMatch) {
        return <StepHeader number={Number(stepMatch[1])} title={stepMatch[2]} />
      }
      return (
        <h3 className="text-xl font-semibold text-foreground mt-8 mb-3" {...props}>
          {children}
        </h3>
      )
    },
    p: ({ children, ...props }) => (
      <p className="mb-4 leading-7 text-foreground/90" {...props}>
        {children}
      </p>
    ),
    ul: ({ children, ...props }) => (
      <ul className="list-none mb-4 space-y-2 ml-1 text-foreground/90" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol
        className="list-none mb-4 space-y-2 ml-1 text-foreground/90 counter-reset-[step]"
        {...props}
      >
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li
        className="flex gap-3 before:content-['▸'] before:text-secondary before:mt-px before:shrink-0"
        {...props}
      >
        <span>{children}</span>
      </li>
    ),
    strong: ({ children, ...props }) => (
      <strong className="font-semibold text-foreground" {...props}>
        {children}
      </strong>
    ),
    em: ({ children, ...props }) => (
      <em className="italic text-muted-foreground" {...props}>
        {children}
      </em>
    ),
    a: ({ children, href, ...props }) => (
      <a
        href={href}
        className="text-secondary hover:text-secondary/80 underline underline-offset-4 decoration-secondary/30"
        {...props}
      >
        {children}
      </a>
    ),
    blockquote: ({ children, ...props }) => (
      <blockquote
        className="border-l-4 border-secondary/50 pl-4 italic my-4 text-muted-foreground"
        {...props}
      >
        {children}
      </blockquote>
    ),
    code: ({ children, ...props }) => {
      if (typeof children === "string" && !children.includes("\n")) {
        return <InlineCode>{children}</InlineCode>
      }
      return <code {...props}>{children}</code>
    },
    pre: ({ children }) => {
      const codeElement = children as React.ReactElement<{ children?: string; className?: string }>
      const codeString = codeElement?.props?.children ?? ""
      const className = codeElement?.props?.className ?? ""
      const lang = className.replace("language-", "") || "text"

      return <CodeBlock code={codeString} lang={lang} />
    },
    hr: () => <hr className="my-12 border-border/40" />,
  }
}

export { CopyButton }
