"use client"

import DOMPurify from "dompurify"
import parse from "html-react-parser"

type HtmlContentProps = {
  html: string
  className?: string
}

const CONTENT_CSS = `
  .job-description {
    font-size: 0.9375rem;
    line-height: 1.75;
    color: var(--muted-foreground);
  }
  .job-description p {
    margin: 0 0 1rem;
  }
  .job-description p:last-child {
    margin-bottom: 0;
  }
  .job-description ul,
  .job-description ol {
    padding-left: 1.5rem;
    margin: 0.5rem 0 1rem;
  }
  .job-description ul { list-style-type: disc; }
  .job-description ol { list-style-type: decimal; }
  .job-description li {
    margin: 0.25rem 0;
  }
  .job-description li::marker {
    color: var(--secondary);
  }
  .job-description blockquote {
    border-left: 3px solid var(--secondary);
    padding-left: 1rem;
    margin: 1rem 0;
    color: var(--muted-foreground);
    font-style: italic;
  }
  .job-description code {
    background: var(--muted);
    padding: 0.1rem 0.4rem;
    border-radius: 0.25rem;
    font-size: 0.85em;
    font-family: monospace;
  }
  .job-description pre {
    background: var(--muted);
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    overflow-x: auto;
    margin: 1rem 0;
  }
  .job-description pre code {
    background: transparent;
    padding: 0;
  }
  .job-description strong {
    font-weight: 600;
    color: var(--foreground);
  }
  .job-description em {
    font-style: italic;
  }
  .job-description h1,
  .job-description h2,
  .job-description h3,
  .job-description h4 {
    font-weight: 600;
    line-height: 1.3;
    margin: 1.25rem 0 0.5rem;
    color: var(--foreground);
  }
  .job-description h1 { font-size: 1.5em; }
  .job-description h2 { font-size: 1.3em; }
  .job-description h3 { font-size: 1.15em; }
  .job-description h4 { font-size: 1em; }
  .job-description a {
    color: var(--secondary);
    text-decoration: underline;
  }
  .job-description hr {
    border: none;
    border-top: 1px solid var(--border);
    margin: 1.5rem 0;
  }
  .job-description table {
    border-collapse: collapse;
    width: 100%;
    margin: 1rem 0;
  }
  .job-description th,
  .job-description td {
    border: 1px solid var(--border);
    padding: 0.5rem 0.75rem;
    text-align: left;
  }
  .job-description th {
    background: var(--muted);
    font-weight: 600;
  }
`

export function HtmlContent({ html, className }: HtmlContentProps) {
  if (!html) {
    return (
      <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground/95 md:text-[15px]">
        Sin descripción.
      </p>
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dompurify = DOMPurify as any
  const sanitizeFn = dompurify.default?.sanitize ?? dompurify.sanitize
  const sanitizedHtml =
    typeof sanitizeFn === "function" ? sanitizeFn(html, { USE_PROFILES: { html: true } }) : html
  const parsedContent = parse(sanitizedHtml)

  return (
    <>
      <style suppressHydrationWarning>{CONTENT_CSS}</style>
      <div className={`job-description ${className ?? ""}`}>{parsedContent}</div>
    </>
  )
}
