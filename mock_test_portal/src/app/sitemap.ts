import { MetadataRoute } from 'next'
import { fetchLiveQuizzes, fetchLiveCategories } from '@/services/api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bhartimocktest.in'

  // Fetch all dynamic categories
  const categories = await fetchLiveCategories()
  const categoryUrls = categories.map((cat) => ({
    url: `${baseUrl}/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // Fetch all dynamic mock tests
  const tests = await fetchLiveQuizzes()
  const testUrls = tests.map((test) => ({
    url: `${baseUrl}/${test.categorySlug}/${test.testSlug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'hourly', // Home page gets new updates frequently
      priority: 1,
    },
    ...categoryUrls,
    ...testUrls,
  ]
}
