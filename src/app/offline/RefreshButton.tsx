'use client'

import { RefreshCw } from 'lucide-react'

export function RefreshButton() {
  return (
    <button
      onClick={() => window.location.reload()}
      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
    >
      <RefreshCw className="w-5 h-5" />
      Try Again
    </button>
  )
}
