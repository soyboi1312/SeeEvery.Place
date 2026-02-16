import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - See Every Place',
  description:
    'Terms of service for See Every Place. Read our terms and conditions for using the free travel tracking application.',
  openGraph: {
    title: 'Terms of Service - See Every Place',
    description:
      'Terms of service for See Every Place. Read our terms and conditions.',
  },
  alternates: {
    canonical: '/terms',
  },
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children
}
