import Image from "next/image"
import Link from "next/link"
import type { Post } from "@/lib/types/posts"

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <div className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 group-hover:shadow-xl">
        <div className="relative w-full aspect-video">
          <Image
            src={post.frontmatter.featuredImage}
            alt={post.frontmatter.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
            {post.frontmatter.title}
          </h2>
          <p className="mt-2 text-gray-600">{post.frontmatter.excerpt}</p>
          <div className="mt-4 flex items-center">
            <p className="text-sm text-gray-500">
              {new Date(post.frontmatter.date).toLocaleDateString("es-CL", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
