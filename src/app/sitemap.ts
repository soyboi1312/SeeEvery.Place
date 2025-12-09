import { MetadataRoute } from 'next'
import { nationalParks } from '@/data/nationalParks'
import { nationalMonuments } from '@/data/nationalMonuments'
import { stateParks } from '@/data/stateParks'
import { weirdAmericana } from '@/data/weirdAmericana'

const categories = [
  'countries',
  'states',
  'nationalParks',
  'nationalMonuments',
  'stateParks',
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
  'airports',
  'skiResorts',
  'themeParks',
  'surfingReserves',
  'weirdAmericana',
]

// State-filterable categories with their data sources
const stateFilterableCategories = [
  { category: 'nationalParks', data: nationalParks },
  { category: 'nationalMonuments', data: nationalMonuments },
  { category: 'stateParks', data: stateParks },
  { category: 'weirdAmericana', data: weirdAmericana },
]

// Get unique states from a data source
function getUniqueStates(items: { state: string }[]): string[] {
  const states = new Set<string>()
  items.forEach(item => {
    // Handle multi-state items like "WY/MT/ID"
    if (item.state.includes('/')) {
      item.state.split('/').forEach(s => states.add(s.trim().toLowerCase()))
    } else {
      states.add(item.state.toLowerCase())
    }
  })
  return Array.from(states)
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://seeevery.place'

  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/track/${category}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }))

  // Generate state-level pages for SEO
  const statePages: MetadataRoute.Sitemap = []
  stateFilterableCategories.forEach(({ category, data }) => {
    const states = getUniqueStates(data)
    states.forEach(state => {
      statePages.push({
        url: `${baseUrl}/track/${category}/${state}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })
    })
  })

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
      url: `${baseUrl}/suggest`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...categoryPages,
    ...statePages,
  ]
}
