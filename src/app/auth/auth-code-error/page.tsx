'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useDarkMode } from '@/lib/hooks/useDarkMode';

export default function AuthCodeErrorPage() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-black/5 dark:border-white/10 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 transition-transform group-hover:scale-110 duration-200">
              <Image src="/logo.svg" alt="See Every Place Logo" fill className="object-contain" priority />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-primary-900 dark:text-white leading-none">
                SeeEvery<span className="text-accent-500">.</span>Place<span className="text-[10px] align-super">™</span>
              </h1>
              <span className="text-[10px] text-primary-500 dark:text-primary-400 font-medium tracking-wider uppercase hidden sm:block">
                Free Travel Tracker
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-primary-50 dark:bg-slate-800 text-primary-600 dark:text-primary-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <Link
              href="/"
              className="px-4 py-2 bg-primary-700 hover:bg-primary-800 text-white rounded-lg font-medium hover:shadow-lg transition-all text-sm"
            >
              Go Home
            </Link>
          </div>
        </div>
      </header>

      {/* Error Content */}
      <main className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
          {/* Error Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-primary-900 dark:text-white mb-4">
            Authentication Error
          </h1>

          <p className="text-primary-600 dark:text-primary-300 mb-6">
            We couldn&apos;t complete the sign-in process. This can happen if:
          </p>

          <ul className="text-left text-primary-600 dark:text-primary-300 mb-8 space-y-2 max-w-md mx-auto">
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <span>The authentication link expired</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <span>The link was already used</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <span>There was a temporary network issue</span>
            </li>
          </ul>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-primary-700 hover:bg-primary-800 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
            >
              Continue Without Account
            </Link>
          </div>

          <p className="mt-8 text-sm text-primary-500 dark:text-primary-400">
            Your travel data is saved locally and will sync once you sign in successfully.
          </p>
        </div>
      </main>
    </div>
  );
}
