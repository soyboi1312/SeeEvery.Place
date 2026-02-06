import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Travel Community - See Every Place',
  description:
    'Join the See Every Place travel community. See leaderboards, discover fellow travelers, and share your travel stats with explorers around the world.',
  openGraph: {
    title: 'Travel Community - See Every Place',
    description:
      'Join the See Every Place travel community. See leaderboards, discover fellow travelers, and share your travel stats.',
  },
  alternates: {
    canonical: '/community',
  },
}

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return children
}
