import fs from "fs"
import { glob } from "glob"
import matter from "gray-matter"
import path from "path"
import type { Post } from "@/lib/types/posts"

const POSTS_PATH = path.join(process.cwd(), "content/blog")

export type { Post }

export async function getPostBySlug(slug: string): Promise<Post> {
  const filePath = path.join(POSTS_PATH, `${slug}.mdx`)

  if (!fs.existsSync(filePath)) {
    throw new Error(`Post with slug "${slug}" not found`)
  }

  const fileContent = fs.readFileSync(filePath, "utf-8")
  const { data, content } = matter(fileContent)

  return {
    slug,
    content,
    frontmatter: data as Post["frontmatter"],
  }
}

export async function getAllPosts(): Promise<Post[]> {
  const files = await glob(path.join(POSTS_PATH, "*.mdx"))

  const posts = await Promise.all(
    files.map(async (file) => {
      const slug = path.basename(file, ".mdx")
      return await getPostBySlug(slug)
    })
  )

  return posts.sort(
    (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  )
}
