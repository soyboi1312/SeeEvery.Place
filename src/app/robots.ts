import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://seeevery.place'

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/track/',
          '/about',
          '/privacy',
          '/terms',
          '/suggest',
          '/u/', // Public user profiles
        ],
        disallow: [
          '/admin/',
          '/admin',
          '/api/',
          '/auth/',
          '/settings',
          '/newsletter/confirmed',
          '/newsletter/unsubscribed',
          '/newsletter/error',
          '/_next/', // Next.js internals
          '/geo/', // GeoJSON data files
        ],
      },
      {
        // Block AI training crawlers
        userAgent: ['GPTBot', 'ChatGPT-User', 'CCBot', 'anthropic-ai'],
        disallow: ['/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
