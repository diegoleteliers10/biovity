"use client"

import { Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMemo, useState } from "react"
import type { Post } from "@/lib/types/posts"
import { Input } from "../ui/input"
import { PostCard } from "./PostCard"

interface BlogGridProps {
  posts: Post[]
}

export function BlogGrid({ posts }: BlogGridProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPosts = useMemo(() => {
    return posts.filter((post) =>
      post.frontmatter.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [posts, searchTerm])

  return (
    <div className="flex flex-col gap-16">
      <div className="mb-8 flex justify-center">
        <div className="relative max-w-lg w-full">
          <HugeiconsIcon
            icon={Search01Icon}
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <Input
            type="text"
            placeholder="Buscar artículos..."
            className="pl-11 pr-4 py-2 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
        {filteredPosts.length === 0 && (
          <p className="col-span-full text-center text-gray-500">No se encontraron artículos.</p>
        )}
      </div>
    </div>
  )
}
