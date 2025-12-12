import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://seeevery.place'

  return {
    rules: {
      userAgent: '*',
      disallow: [
        '/admin/',
        '/admin',
        '/api/',
        '/auth/',
        '/settings',
        '/newsletter/confirmed',
        '/newsletter/unsubscribed',
        '/newsletter/error',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
