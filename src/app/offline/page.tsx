// src/app/offline/page.tsx
import { WifiOff, Home } from 'lucide-react'
import Link from 'next/link'
import { RefreshButton } from './RefreshButton'

export const metadata = {
  title: 'Offline - See Every Place',
  description: 'You are currently offline',
}

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30">
          <WifiOff className="w-10 h-10 text-blue-600 dark:text-blue-400" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          You&apos;re offline
        </h1>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          No worries! Your travel data is saved locally.
          Reconnect to sync with the cloud and access all features.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <RefreshButton />

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
        </div>

        {/* Helpful tip */}
        <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          Tip: Your visited places and bucket list are available offline!
        </p>
      </div>
    </div>
  )
}
