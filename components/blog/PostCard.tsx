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
      <div className="overflow-hidden rounded-xl bg-white border border-border/10 transition-all duration-300 group-hover:shadow-ambient group-hover:border-secondary/20">
        <div className="relative w-full aspect-video">
          <Image
            src={post.frontmatter.featuredImage}
            alt={post.frontmatter.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-foreground group-hover:text-secondary transition-colors duration-300">
            {post.frontmatter.title}
          </h2>
          <p className="mt-2 text-muted-foreground">{post.frontmatter.excerpt}</p>
          <div className="mt-4 flex items-center">
            <p className="text-sm text-muted-foreground">
              {formatFechaLarga(post.frontmatter.date)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
