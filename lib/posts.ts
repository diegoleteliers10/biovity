import { Result as R, Result } from "better-result"
import fs from "fs"
import { glob } from "glob"
import matter from "gray-matter"
import path from "path"
import { NotFoundError, ParseError } from "@/lib/errors"
import type { Post } from "@/lib/types/posts"

const POSTS_PATH = path.join(process.cwd(), "content/blog")

export type { Post }

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
