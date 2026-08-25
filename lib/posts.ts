import fs from "node:fs"
import path from "node:path"
import { Result as R, Result } from "better-result"
import { glob } from "glob"
import matter from "gray-matter"
import { NotFoundError, ParseError } from "@/lib/errors"
import type { CapsuleFrontmatter, CapsuleMeta } from "@/lib/types/capsulas"
import type { Post } from "@/lib/types/posts"

const POSTS_PATH = path.join(process.cwd(), "content/blog")
const CAPSULES_PATH = path.join(process.cwd(), "content/capsulas")

export type { CapsuleMeta, Post }

export async function getPostBySlug(
  slug: string
): Promise<Result<Post, NotFoundError | ParseError>> {
  const filePath = path.join(POSTS_PATH, `${slug}.mdx`)

  const exists = fs.existsSync(filePath)
  if (!exists) {
    return R.err(new NotFoundError({ resource: "Post", id: slug }))
  }

  return R.tryPromise({
    try: async () => {
      const fileContent = fs.readFileSync(filePath, "utf-8")
      const { data, content } = matter(fileContent)
      return {
        slug,
        content,
        frontmatter: data as Post["frontmatter"],
      } satisfies Post
    },
    catch: (cause) => new ParseError({ message: `Failed to read post "${slug}"`, cause }),
  })
}

export async function getAllPosts(): Promise<Result<Post[], NotFoundError | ParseError>> {
  const files = await glob(path.join(POSTS_PATH, "*.mdx"))

  const results = await Promise.all(
    files.map(async (file) => {
      const slug = path.basename(file, ".mdx")
      return await getPostBySlug(slug)
    })
  )

  const posts: Post[] = []
  let firstError: NotFoundError | ParseError | null = null
  for (const result of results) {
    if (Result.isOk(result)) {
      posts.push(result.value)
    } else if (!firstError) {
      firstError = result.error
    }
  }

  if (posts.length === 0 && firstError) {
    return R.err(firstError)
  }

  return R.ok(
    posts.sort(
      (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
    )
  )
}

export async function getCapsulesByCategory(
  category?: string
): Promise<Result<CapsuleMeta[], NotFoundError | ParseError>> {
  const pattern = category
    ? path.join(CAPSULES_PATH, category, "*/index.mdx")
    : path.join(CAPSULES_PATH, "*/index.mdx")

  const files = await glob(pattern)

  const results = await Promise.all(
    files.map(async (file) => {
      const slug = path.basename(path.dirname(file))
      const cat = path.basename(path.dirname(path.dirname(file)))
      return await getCapsuleBySlug(cat, slug)
    })
  )

  const capsules: CapsuleMeta[] = []
  let firstError: NotFoundError | ParseError | null = null
  for (const result of results) {
    if (Result.isOk(result)) {
      capsules.push(result.value)
    } else if (!firstError) {
      firstError = result.error
    }
  }

  if (capsules.length === 0 && firstError) {
    return R.err(firstError)
  }

  return R.ok(
    capsules.sort(
      (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
    )
  )
}

export async function getCapsuleBySlug(
  category: string,
  slug: string
): Promise<Result<CapsuleMeta, NotFoundError | ParseError>> {
  const filePath = path.join(CAPSULES_PATH, category, slug, "index.mdx")

  const exists = fs.existsSync(filePath)
  if (!exists) {
    return R.err(new NotFoundError({ resource: "Capsule", id: `${category}/${slug}` }))
  }

  return R.tryPromise({
    try: async () => {
      const fileContent = fs.readFileSync(filePath, "utf-8")
      const { data, content } = matter(fileContent)
      return {
        slug,
        category,
        content,
        frontmatter: data as CapsuleFrontmatter,
      } satisfies CapsuleMeta
    },
    catch: (cause) =>
      new ParseError({ message: `Failed to read capsule "${category}/${slug}"`, cause }),
  })
}
