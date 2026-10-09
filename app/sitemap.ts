import { Result } from "better-result"
import type { MetadataRoute } from "next"
import { getJobs, type Job } from "@/lib/api/jobs"
import { getPublicOrganizations } from "@/lib/api/organizations"
import { APRENDE_CATEGORIES } from "@/lib/data/aprende-data"
import { getAllPosts, getCapsulesByCategory } from "@/lib/posts"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://biovity.cl"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/companies`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/recruiting`,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/jobs`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/salaries`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/about`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/plans`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/blog`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/career-tips`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/waitlist`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/terms`,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${siteUrl}/privacy`,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${siteUrl}/cookies`,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ]

  const learningUrls: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/learn` },
    { url: `${siteUrl}/brand` },
    { url: `${siteUrl}/share-salary` },
    ...APRENDE_CATEGORIES.map((category) => ({ url: `${siteUrl}/learn/${category.slug}` })),
  ]
  const capsulesResult = await getCapsulesByCategory()
  const capsuleUrls: MetadataRoute.Sitemap = Result.isOk(capsulesResult)
    ? capsulesResult.value.map((capsule) => ({
        url: `${siteUrl}/learn/${capsule.category}/${capsule.slug}`,
        lastModified: new Date(capsule.frontmatter.date),
      }))
    : []

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
      url: `${siteUrl}/jobs/${job.id}`,
      lastModified: new Date(job.updatedAt),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }))

  const orgsResult = await getPublicOrganizations({ limit: 100 })
  const companyUrls: MetadataRoute.Sitemap = Result.isOk(orgsResult)
    ? orgsResult.value.data
        .filter((org) => Boolean(org.slug))
        .map((org) => ({
          url: `${siteUrl}/companies/${org.slug}`,
          lastModified: new Date(org.createdAt),
          changeFrequency: "weekly" as const,
          priority: 0.6,
        }))
    : []

  return [...staticPages, ...learningUrls, ...capsuleUrls, ...blogUrls, ...jobUrls, ...companyUrls]
}
