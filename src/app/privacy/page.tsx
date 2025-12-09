'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useDarkMode } from '@/lib/hooks/useDarkMode';

export default function PrivacyPage() {
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
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-primary-50 dark:bg-slate-800 text-primary-600 dark:text-primary-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
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
              Start Mapping
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <article className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-primary-900 dark:text-white mb-6">Privacy Policy</h1>

          <p className="text-lg text-primary-600 dark:text-primary-300 mb-8">
            Last updated: December 2025
          </p>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-4">Overview</h2>
            <p className="text-primary-600 dark:text-primary-300 mb-4">
              See Every Place is committed to protecting your privacy. This policy explains what data we collect,
              how we use it, and your rights regarding your personal information.
            </p>
            <p className="text-primary-600 dark:text-primary-300">
              <strong className="text-primary-900 dark:text-white">The short version:</strong> Your travel data is stored locally
              on your device by default and is private. If you create an account, your data is encrypted and synced securely.
              You can optionally enable a public profile to share your travels with others.
              We never sell your data to third parties.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-4">Data We Collect</h2>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-premium border border-black/5 dark:border-white/10 mb-4">
              <h3 className="font-bold text-primary-900 dark:text-white mb-3">Without an Account (Local Storage)</h3>
              <p className="text-primary-600 dark:text-primary-300 text-sm">
                If you use See Every Place without signing in, all your data is stored locally in your browser.
                We do not have access to this data, and it never leaves your device. Please note that clearing your browser cache will delete this data.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-premium border border-black/5 dark:border-white/10 mb-4">
              <h3 className="font-bold text-primary-900 dark:text-white mb-3">With an Account</h3>
              <p className="text-primary-600 dark:text-primary-300 text-sm mb-3">
                When you create an account, we collect:
              </p>
              <ul className="text-primary-600 dark:text-primary-300 text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span><strong className="text-primary-900 dark:text-white">Email address</strong> - Used for authentication and account recovery</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span><strong className="text-primary-900 dark:text-white">Travel selections</strong> - Your visited/bucket list items, synced across devices. Private by default.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span><strong className="text-primary-900 dark:text-white">Profile information</strong> - Optional username, display name, and bio if you choose to provide them</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span><strong className="text-primary-900 dark:text-white">Achievements</strong> - Badges and XP earned through your travel progress</span>
                </li>
              </ul>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800 mb-4">
              <h3 className="font-bold text-primary-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="text-amber-500">⚠️</span> Public Profiles
              </h3>
              <p className="text-primary-600 dark:text-primary-300 text-sm mb-3">
                <strong className="text-primary-900 dark:text-white">Important:</strong> If you enable a public profile, the following information becomes visible to anyone on the internet:
              </p>
              <ul className="text-primary-600 dark:text-primary-300 text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>Your username and profile URL (seeevery.place/u/yourname)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>Your display name and bio (if provided)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>Your travel statistics and visited locations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>Your achievements and XP level</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>Your travel map visualization</span>
                </li>
              </ul>
              <p className="text-primary-600 dark:text-primary-300 text-sm mt-3">
                Public profiles are <strong className="text-primary-900 dark:text-white">disabled by default</strong>. You must explicitly enable this feature in your profile settings. You can disable it at any time to make your profile private again.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-premium border border-black/5 dark:border-white/10">
              <h3 className="font-bold text-primary-900 dark:text-white mb-3">Category Suggestions</h3>
              <p className="text-primary-600 dark:text-primary-300 text-sm mb-3">
                When you submit a category suggestion, we collect:
              </p>
              <ul className="text-primary-600 dark:text-primary-300 text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span><strong className="text-primary-900 dark:text-white">IP address (hashed)</strong> - Your IP is cryptographically hashed before storage for anti-spam rate limiting. We never store your raw IP address. Hash data is automatically deleted after 90 days.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span><strong className="text-primary-900 dark:text-white">Email address (optional)</strong> - Only if you choose to provide it for follow-up communication about your suggestion</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-4">How We Use Your Data</h2>
            <ul className="text-primary-600 dark:text-primary-300 space-y-3">
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
            <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-4">Data Storage & Security</h2>
            <p className="text-primary-600 dark:text-primary-300 mb-4">
              Account data is stored securely using Supabase, which provides:
            </p>
            <ul className="text-primary-600 dark:text-primary-300 space-y-2">
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
            <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-4">Cookies</h2>
            <p className="text-primary-600 dark:text-primary-300">
              We use essential cookies for authentication purposes only. These cookies keep you signed in
              and are required for the app to function. We do not use tracking cookies or third-party
              advertising cookies.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-4">Your Rights</h2>
            <p className="text-primary-600 dark:text-primary-300 mb-4">You have the right to:</p>
            <ul className="text-primary-600 dark:text-primary-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong className="text-primary-900 dark:text-white">Access your data</strong> - View all data associated with your account</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong className="text-primary-900 dark:text-white">Export your data</strong> - Download your travel selections</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong className="text-primary-900 dark:text-white">Delete your data</strong> - Request complete deletion of your account and all associated data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong className="text-primary-900 dark:text-white">Opt out</strong> - Use See Every Place without an account (local storage only)</span>
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-4">Third-Party Services</h2>
            <p className="text-primary-600 dark:text-primary-300 mb-4">
              See Every Place uses the following third-party services:
            </p>
            <ul className="text-primary-600 dark:text-primary-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong className="text-primary-900 dark:text-white">Supabase</strong> - Authentication and database hosting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong className="text-primary-900 dark:text-white">Cloudflare</strong> - Website hosting and security</span>
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-4">Contact Us</h2>
            <p className="text-primary-600 dark:text-primary-300">
              If you have questions about this privacy policy or want to exercise your data rights,
              please contact us at{' '}
              <a href="mailto:hello@seeevery.place" className="text-primary-700 dark:text-primary-400 hover:underline">
                hello@seeevery.place
              </a>.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-4">Changes to This Policy</h2>
            <p className="text-primary-600 dark:text-primary-300">
              We may update this privacy policy from time to time. We will notify users of any material
              changes by posting the new policy on this page with an updated revision date.
            </p>
          </section>

          <section className="text-center py-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary-700 hover:bg-primary-800 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all"
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
      <footer className="border-t border-black/5 dark:border-white/10 bg-white/50 dark:bg-slate-900/50">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-primary-500 dark:text-primary-400">
          <div className="flex justify-center gap-4 mb-2">
            <Link href="/about" className="hover:text-primary-700 dark:hover:text-primary-200 transition-colors">About</Link>
            <span>•</span>
            <Link href="/suggest" className="hover:text-primary-700 dark:hover:text-primary-200 transition-colors">Suggest</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-primary-700 dark:hover:text-primary-200 transition-colors">Privacy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-primary-700 dark:hover:text-primary-200 transition-colors">Terms</Link>
          </div>
          <p>See Every Place - Free Travel Tracker</p>
        </div>
      </footer>
    </div>
  );
}
