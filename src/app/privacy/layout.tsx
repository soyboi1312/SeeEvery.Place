import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - See Every Place',
  description:
    'Privacy policy for See Every Place. Learn how we handle your data, what information we collect, and how we protect your privacy.',
  openGraph: {
    title: 'Privacy Policy - See Every Place',
    description:
      'Privacy policy for See Every Place. Learn how we handle your data and protect your privacy.',
  },
  alternates: {
    canonical: '/privacy',
  },
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children
}
