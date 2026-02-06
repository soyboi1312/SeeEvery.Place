import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About See Every Place - Free Travel Tracking App',
  description:
    'Learn about See Every Place, the free travel tracker that helps you map countries, states, national parks, stadiums, and museums. Track your bucket list and share your travel map.',
  openGraph: {
    title: 'About See Every Place - Free Travel Tracking App',
    description:
      'Learn about See Every Place, the free travel tracker that helps you map countries, states, national parks, stadiums, and museums.',
  },
  alternates: {
    canonical: '/about',
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
