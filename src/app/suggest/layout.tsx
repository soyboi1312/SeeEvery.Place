import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Suggest a Feature - See Every Place',
  description:
    'Suggest new categories, features, or improvements for See Every Place. Vote on community ideas and help shape the future of the travel tracker.',
  openGraph: {
    title: 'Suggest a Feature - See Every Place',
    description:
      'Suggest new categories, features, or improvements for See Every Place. Vote on community ideas.',
  },
  alternates: {
    canonical: '/suggest',
  },
}

export default function SuggestLayout({ children }: { children: React.ReactNode }) {
  return children
}
