import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://seeevery.place'),
  alternates: {
    canonical: './',
  },
  title: 'See Every Place - Track Your World Travels & Bucket List',
  description: 'Map countries, states, national parks, stadiums, and museums. Track where you have been and see every place you want to go. Free travel tracking app.',
  keywords: [
    'travel tracker',
    'countries visited map',
    'travel map',
    'scratch map',
    'bucket list',
    'countries visited',
    'US states visited',
    'national parks checklist',
    'UNESCO world heritage sites',
    'travel bucket list',
    'where have I been',
    'travel goals',
    'visited countries',
    'travel statistics',
    'see every place',
  ],
  authors: [{ name: 'See Every Place' }],
  creator: 'See Every Place',
  publisher: 'See Every Place',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'See Every Place - Track Your Travels & Create Beautiful Maps',
    description: 'Map countries, states, national parks, UNESCO sites and more. Track your adventures and share beautiful travel graphics with friends.',
    type: 'website',
    locale: 'en_US',
    siteName: 'See Every Place',
    images: [
      {
        url: '/opengraph-image.webp',
        width: 1200,
        height: 630,
        alt: 'See Every Place - Track Your Travels',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'See Every Place - Track Your Travels & Create Beautiful Maps',
    description: 'Map countries, states, national parks, UNESCO sites and more. Track your adventures and share beautiful travel graphics.',
    images: ['/opengraph-image.webp'],
  },
  category: 'travel',
  classification: 'Travel Tracking Application',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'See Every Place',
  applicationCategory: 'TravelApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  description: 'Free travel tracking app to map countries visited, US states, national parks, and adventures.',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '120',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="See Every Place" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="font-sans antialiased bg-white dark:bg-gray-900">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}
