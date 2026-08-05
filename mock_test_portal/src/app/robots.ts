import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // Use the custom domain if available, otherwise fallback
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bhartimocktest.in'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/private/'], // Prevent crawling of private/admin routes if any
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
