import Image from "next/image"
import Link from "next/link"
import type { Post } from "@/lib/types/posts"
import { formatFechaLarga } from "@/lib/utils"

type PostCardProps = {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <div className="overflow-hidden rounded-xl bg-surface-container-lowest border border-border transition-all duration-200 hover:border-secondary/40 h-full flex flex-col justify-between">
        <div>
          <div className="relative w-full aspect-video bg-surface-container-low overflow-hidden">
            <Image
              src={post.frontmatter.featuredImage}
              alt={post.frontmatter.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-foreground group-hover:text-secondary transition-colors duration-200 leading-snug tracking-tight">
              {post.frontmatter.title}
            </h2>
            <p className="mt-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed text-pretty line-clamp-3">
              {post.frontmatter.excerpt}
            </p>
          </div>
        </div>

        <div className="px-6 pb-6 pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground font-mono">
          <span>{formatFechaLarga(post.frontmatter.date)}</span>
          <span className="text-secondary font-medium group-hover:translate-x-0.5 transition-transform">
            Leer artículo &rarr;
          </span>
        </div>
      </div>
    </Link>
  )
}
