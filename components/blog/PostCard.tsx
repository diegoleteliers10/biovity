import Link from "next/link"
import type { Post } from "@/lib/types/posts"
import { formatFechaLarga } from "@/lib/utils"

type PostCardProps = {
  post: Post
  featured?: boolean
}

const formatPostDate = (date: string) => formatFechaLarga(`${date}T12:00:00Z`)

export function PostCard({ post, featured = false }: PostCardProps) {
  if (featured) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group grid overflow-hidden rounded-2xl border border-border bg-surface-container-lowest transition-colors duration-300 hover:border-secondary/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring motion-reduce:transition-none md:grid-cols-12"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-primary md:col-span-7 md:aspect-auto md:min-h-[26rem]">
          <svg
            aria-hidden="true"
            viewBox="0 0 800 600"
            className="absolute inset-0 h-full w-full transition-transform duration-700 ease-out motion-reduce:transition-none motion-safe:group-hover:scale-[1.025]"
            fill="none"
          >
            <path
              d="M0 118H800M0 482H800M118 0V600M682 0V600"
              stroke="var(--primary-foreground)"
              strokeOpacity=".12"
            />
            <path
              d="M0 150H800M0 450H800M150 0V600M650 0V600"
              stroke="var(--primary-foreground)"
              strokeOpacity=".06"
            />
            <rect
              x="178"
              y="63"
              width="444"
              height="474"
              rx="7"
              fill="var(--surface-container-lowest)"
              transform="rotate(-3 178 63)"
            />
            <path d="M199 109L604 88" stroke="var(--border)" strokeWidth="2" />
            <circle cx="222" cy="132" r="7" fill="var(--secondary)" />
            <circle cx="244" cy="131" r="7" fill="var(--accent)" />
            <circle cx="266" cy="130" r="7" fill="var(--surface-container-highest)" />
            <path
              d="M213 183H488M213 203H558"
              stroke="var(--foreground)"
              strokeOpacity=".78"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <path
              d="M213 246H536M213 268H494M213 290H548M213 312H442"
              stroke="var(--muted-foreground)"
              strokeOpacity=".48"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <rect
              x="213"
              y="350"
              width="154"
              height="102"
              rx="4"
              fill="var(--surface-container-low)"
            />
            <path
              d="M229 426L263 394L289 410L322 372L350 387"
              stroke="var(--secondary)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="229" cy="426" r="5" fill="var(--secondary)" />
            <circle cx="263" cy="394" r="5" fill="var(--secondary)" />
            <circle cx="289" cy="410" r="5" fill="var(--secondary)" />
            <circle cx="322" cy="372" r="5" fill="var(--secondary)" />
            <circle cx="350" cy="387" r="5" fill="var(--secondary)" />
            <path
              d="M395 366H550M395 389H528M395 412H544M395 435H501"
              stroke="var(--muted-foreground)"
              strokeOpacity=".42"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M178 63L196 537"
              stroke="var(--primary-foreground)"
              strokeOpacity=".35"
              strokeWidth="2"
            />
          </svg>
          <span className="absolute left-4 top-4 rounded-full bg-surface-container-lowest/95 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-foreground sm:left-6 sm:top-6">
            Lectura destacada
          </span>
        </div>
        <div className="flex flex-col justify-between gap-10 p-6 sm:p-8 md:col-span-5 md:p-10 lg:p-12">
          <div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground">
              <time dateTime={post.frontmatter.date}>{formatPostDate(post.frontmatter.date)}</time>
              <span aria-hidden="true" className="text-secondary">
                /
              </span>
              <span>{post.frontmatter.author}</span>
            </div>
            <h2 className="mt-6 text-3xl font-semibold leading-[1.05] tracking-tight text-foreground text-balance transition-colors duration-200 group-hover:text-secondary motion-reduce:transition-none sm:text-4xl">
              {post.frontmatter.title}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
              {post.frontmatter.excerpt}
            </p>
          </div>
          <span className="inline-flex items-center gap-3 text-sm font-medium text-secondary">
            Leer artículo
            <span
              aria-hidden="true"
              className="text-lg transition-transform duration-200 motion-reduce:transition-none motion-safe:group-hover:translate-x-1"
            >
              →
            </span>
          </span>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid gap-3 border-b border-border py-5 transition-colors duration-200 hover:border-secondary/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring motion-reduce:transition-none sm:gap-6 sm:py-6 md:grid-cols-12 md:items-start"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-muted-foreground sm:text-xs md:col-span-3 md:flex-col md:items-start md:gap-2 md:pt-1">
        <time dateTime={post.frontmatter.date}>{formatPostDate(post.frontmatter.date)}</time>
        <span aria-hidden="true" className="text-secondary md:hidden">
          /
        </span>
        <span className="truncate">{post.frontmatter.author}</span>
      </div>
      <div className="min-w-0 md:col-span-9">
        <h3 className="mt-2 text-lg font-semibold leading-snug tracking-tight text-foreground transition-colors duration-200 group-hover:text-secondary motion-reduce:transition-none sm:text-xl">
          {post.frontmatter.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {post.frontmatter.excerpt}
        </p>
      </div>
    </Link>
  )
}
