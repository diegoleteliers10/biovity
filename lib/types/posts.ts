export type Post = {
  slug: string
  content: string
  frontmatter: {
    title: string
    date: string
    excerpt: string
    featuredImage: string
    author: string
  }
}
