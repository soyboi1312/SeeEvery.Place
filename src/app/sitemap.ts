import { MetadataRoute } from 'next'

const categories = [
  'countries',
  'states',
  'nationalParks',
  'stateParks',
  'unesco',
  'fiveKPeaks',
  'fourteeners',
  'museums',
  'mlbStadiums',
  'nflStadiums',
  'nbaStadiums',
  'nhlStadiums',
  'soccerStadiums',
  'f1Tracks',
  'marathons',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://seeevery.place'

  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/track/${category}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...categoryPages,
  ]
}
