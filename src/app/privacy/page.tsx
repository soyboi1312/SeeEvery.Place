'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useDarkMode } from '@/lib/hooks/useDarkMode';

export default function PrivacyPage() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 transition-transform group-hover:scale-110 duration-200">
              <Image src="/logo.svg" alt="See Every Place Logo" fill className="object-contain" priority />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-none">
                SeeEvery<span className="text-purple-500">.</span>Place<span className="text-[10px] align-super">™</span>
              </h1>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-wider uppercase hidden sm:block">
                Free Travel Tracker
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
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
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all text-sm"
            >
              Start Mapping
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <article className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">Privacy Policy</h1>

          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Last updated: December 2025
          </p>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Overview</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              See Every Place is committed to protecting your privacy. This policy explains what data we collect,
              how we use it, and your rights regarding your personal information.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <strong className="text-gray-800 dark:text-white">The short version:</strong> Your travel data is stored locally
              on your device by default. If you create an account, your data is encrypted and synced securely.
              We never sell your data to third parties.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Data We Collect</h2>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
              <h3 className="font-bold text-gray-800 dark:text-white mb-3">Without an Account (Local Storage)</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                If you use See Every Place without signing in, all your data is stored locally in your browser.
                We do not have access to this data, and it never leaves your device.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-gray-800 dark:text-white mb-3">With an Account</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                When you create an account, we collect:
              </p>
              <ul className="text-gray-600 dark:text-gray-300 text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span><strong className="text-gray-800 dark:text-white">Email address</strong> - Used for authentication and account recovery</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span><strong className="text-gray-800 dark:text-white">Travel selections</strong> - Your visited/bucket list items, synced across devices</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">How We Use Your Data</h2>
            <ul className="text-gray-600 dark:text-gray-300 space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-green-500 text-xl">✓</span>
                <span>To provide and maintain the See Every Place service</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 text-xl">✓</span>
                <span>To sync your travel data across your devices</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 text-xl">✓</span>
                <span>To send important account-related emails (password resets, security alerts)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 text-xl">✗</span>
                <span>We do <strong>not</strong> sell your data to third parties</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 text-xl">✗</span>
                <span>We do <strong>not</strong> use your data for advertising</span>
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Data Storage & Security</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Account data is stored securely using Supabase, which provides:
            </p>
            <ul className="text-gray-600 dark:text-gray-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Encryption in transit (TLS/SSL) and at rest</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Secure authentication with password hashing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Row-level security ensuring you can only access your own data</span>
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Cookies</h2>
            <p className="text-gray-600 dark:text-gray-300">
              We use essential cookies for authentication purposes only. These cookies keep you signed in
              and are required for the app to function. We do not use tracking cookies or third-party
              advertising cookies.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Your Rights</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">You have the right to:</p>
            <ul className="text-gray-600 dark:text-gray-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong className="text-gray-800 dark:text-white">Access your data</strong> - View all data associated with your account</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong className="text-gray-800 dark:text-white">Export your data</strong> - Download your travel selections</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong className="text-gray-800 dark:text-white">Delete your data</strong> - Request complete deletion of your account and all associated data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong className="text-gray-800 dark:text-white">Opt out</strong> - Use See Every Place without an account (local storage only)</span>
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Third-Party Services</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              See Every Place uses the following third-party services:
            </p>
            <ul className="text-gray-600 dark:text-gray-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong className="text-gray-800 dark:text-white">Supabase</strong> - Authentication and database hosting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong className="text-gray-800 dark:text-white">Cloudflare</strong> - Website hosting and security</span>
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Contact Us</h2>
            <p className="text-gray-600 dark:text-gray-300">
              If you have questions about this privacy policy or want to exercise your data rights,
              please contact us at{' '}
              <a href="mailto:hello@seeevery.place" className="text-blue-600 dark:text-blue-400 hover:underline">
                hello@seeevery.place
              </a>.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Changes to This Policy</h2>
            <p className="text-gray-600 dark:text-gray-300">
              We may update this privacy policy from time to time. We will notify users of any material
              changes by posting the new policy on this page with an updated revision date.
            </p>
          </section>

          <section className="text-center py-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all"
            >
              Back to See Every Place
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </section>
        </article>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <div className="flex justify-center gap-4 mb-2">
            <Link href="/about" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">About</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Privacy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Terms</Link>
            <span>•</span>
            <Link href="/suggest" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Suggest</Link>
          </div>
          <p>Made with love for travelers everywhere</p>
        </div>
      </footer>
    </div>
  );
}
