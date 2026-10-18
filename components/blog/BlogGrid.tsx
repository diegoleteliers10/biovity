"use client"

import { Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMemo, useState } from "react"
import type { Post } from "@/lib/types/posts"
import { Input } from "../ui/input"
import { PostCard } from "./PostCard"

type BlogGridProps = {
  posts: Post[]
}

export function BlogGrid({ posts }: BlogGridProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPosts = useMemo(() => {
    const query = searchTerm.trim().toLocaleLowerCase("es-CL")
    if (!query) return posts

    return posts.filter(({ frontmatter }) =>
      [frontmatter.title, frontmatter.excerpt, frontmatter.author]
        .join(" ")
        .toLocaleLowerCase("es-CL")
        .includes(query)
    )
  }, [posts, searchTerm])

  const [featuredPost, ...archivePosts] = filteredPosts

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Artículos del blog">
      <div className="mb-7 flex flex-col gap-5 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Archivo editorial
          </p>
          <p className="mt-2 text-sm text-foreground" aria-live="polite">
            {filteredPosts.length} {filteredPosts.length === 1 ? "artículo" : "artículos"}
          </p>
        </div>
        <search className="relative block w-full sm:max-w-sm">
          <HugeiconsIcon
            icon={Search01Icon}
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            aria-label="Buscar artículos"
            type="search"
            placeholder="Buscar por tema o autor"
            className="h-12 w-full rounded-full border-border bg-surface-container-lowest pl-11 pr-5 text-sm placeholder:text-muted-foreground transition-colors motion-reduce:transition-none focus-visible:ring-secondary"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </search>
      </div>

      {featuredPost ? (
        <div className="flex flex-col gap-12 md:gap-16">
          <div>
            <PostCard post={featuredPost} featured />
          </div>

          {archivePosts.length > 0 && (
            <div className="grid gap-8 md:grid-cols-12 md:gap-12">
              <div className="md:col-span-4">
                <h2 className="max-w-xs text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl">
                  Más lecturas para seguir explorando.
                </h2>
              </div>
              <div className="md:col-span-8">
                {archivePosts.map((post) => (
                  <div key={post.slug}>
                    <PostCard post={post} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid min-h-64 place-items-center border-y border-border py-16 text-center">
          <p className="text-base text-muted-foreground">
            No encontramos artículos con esa búsqueda.
          </p>
        </div>
      )}
    </section>
  )
}
