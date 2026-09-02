import { Result } from "better-result"
import type { MetadataRoute } from "next"
import { getJobs, type Job } from "@/lib/api/jobs"
import { getAllPosts } from "@/lib/posts"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://biovity.cl"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/empresas`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/reclutamiento`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/trabajos`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/salarios`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/nosotros`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/planes`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/consejos-carrera`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/lista-espera`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/terminos`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${siteUrl}/privacidad`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${siteUrl}/cookies`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ]

  const postsResult = await getAllPosts()
  const posts = Result.isOk(postsResult) ? postsResult.value : []

  const blogUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.frontmatter.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  const jobsResult = await getJobs({ status: "active", limit: 100 })
  let activeJobs: Job[] = []
  if (Result.isOk(jobsResult)) {
    activeJobs = [...jobsResult.value.data]
    const totalPages = jobsResult.value.totalPages
    for (let page = 2; page <= totalPages; page++) {
      const pageResult = await getJobs({ status: "active", limit: 100, page })
      if (Result.isOk(pageResult)) activeJobs = [...activeJobs, ...pageResult.value.data]
    }
  }

  const jobUrls: MetadataRoute.Sitemap = activeJobs
    .filter((job) => job.status === "active")
    .map((job) => ({
      url: `${siteUrl}/trabajos/${job.id}`,
      lastModified: new Date(job.updatedAt),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }))

  return [...staticPages, ...blogUrls, ...jobUrls]
}
