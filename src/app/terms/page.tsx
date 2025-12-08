'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useDarkMode } from '@/lib/hooks/useDarkMode';

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold text-primary-900 dark:text-white mb-6">Terms of Service</h1>

          <p className="text-lg text-primary-600 dark:text-primary-300 mb-8">
            Last updated: December 2025
          </p>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-primary-600 dark:text-primary-300 mb-4">
              By accessing or using See Every Place™ (&quot;the Service&quot;), you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use the Service.
            </p>
            <p className="text-primary-600 dark:text-primary-300">
              We reserve the right to update these terms at any time. Continued use of the Service after changes
              constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-4">2. Description of Service</h2>
            <p className="text-primary-600 dark:text-primary-300 mb-4">
              See Every Place™ is a free travel tracking application that allows users to track visited locations,
              create bucket lists, and share their travel progress. The Service includes:
            </p>
            <ul className="text-primary-600 dark:text-primary-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Interactive maps for tracking countries, states, parks, mountains, and other destinations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Local storage for anonymous usage</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Optional cloud sync with account creation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Community suggestion features</span>
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-4">3. Eligibility &amp; User Accounts</h2>
            <p className="text-primary-600 dark:text-primary-300 mb-4">
              You must be at least 13 years of age to create an account. If you are under 18, you may use the Service only with the involvement of a parent or guardian.
            </p>
            <p className="text-primary-600 dark:text-primary-300 mb-4">
              Account creation is optional. If you create an account:
            </p>
            <ul className="text-primary-600 dark:text-primary-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>You are responsible for maintaining the security of your account credentials</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>You must provide accurate information during registration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>You are responsible for all activity that occurs under your account</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>You must notify us immediately of any unauthorized use</span>
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-4">4. User-Generated Content</h2>
            <p className="text-primary-600 dark:text-primary-300 mb-4">
              When you submit public content to See Every Place™ (such as category suggestions, public votes, or general feedback):
            </p>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-premium border border-black/5 dark:border-white/10 mb-4">
              <ul className="text-primary-600 dark:text-primary-300 space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>You grant us a perpetual, worldwide, royalty-free license to use, modify, and incorporate your submissions into the Service</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>You represent that you have the right to submit such content</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>You waive any claims of ownership over suggestions that are implemented as features</span>
                </li>
              </ul>
            </div>
            <p className="text-primary-600 dark:text-primary-300 text-sm">
              This ensures we can freely implement community suggestions without legal complications.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-4">5. Prohibited Uses</h2>
            <p className="text-primary-600 dark:text-primary-300 mb-4">You agree not to:</p>
            <ul className="text-primary-600 dark:text-primary-300 space-y-2">
              <li className="flex items-start gap-3">
                <span className="text-red-500 text-xl">✗</span>
                <span>Use the Service for any illegal purpose</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 text-xl">✗</span>
                <span>Submit spam, offensive content, or malicious suggestions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 text-xl">✗</span>
                <span>Attempt to gain unauthorized access to our systems</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 text-xl">✗</span>
                <span>Interfere with or disrupt the Service</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 text-xl">✗</span>
                <span>Scrape or harvest data from the Service without permission</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 text-xl">✗</span>
                <span>Impersonate others or misrepresent your affiliation</span>
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-4">6. Account Termination</h2>
            <p className="text-primary-600 dark:text-primary-300 mb-4">
              We reserve the right to suspend or terminate your account at any time, with or without notice, for:
            </p>
            <ul className="text-primary-600 dark:text-primary-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Violation of these Terms of Service</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Abuse of the suggestion or voting system</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Any conduct we deem harmful to other users or the Service</span>
              </li>
            </ul>
            <p className="text-primary-600 dark:text-primary-300 mt-4">
              You may delete your account at any time through the app settings.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-4">7. Disclaimer of Warranties</h2>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
              <p className="text-gray-700 dark:text-gray-300 mb-4 font-medium">
                THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                We do not warrant that:
              </p>
              <ul className="text-gray-600 dark:text-gray-300 text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>The Service will be uninterrupted, secure, or error-free</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>Location data (coordinates, trail information, etc.) is accurate or complete</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>Your data will never be lost (always maintain your own backups)</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-4">8. Limitation of Liability</h2>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                <strong>Important:</strong> See Every Place™ provides location and travel information for reference purposes only.
              </p>
              <ul className="text-gray-600 dark:text-gray-300 space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span><strong className="text-primary-900 dark:text-white">Outdoor Activities:</strong> Information about mountains, hiking trails, ski resorts, and other outdoor destinations is for general reference. Always verify conditions, obtain proper permits, and exercise appropriate caution. We are not responsible for injuries, accidents, or deaths resulting from reliance on our data.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span><strong className="text-primary-900 dark:text-white">Travel Decisions:</strong> We are not responsible for travel decisions made based on the Service, including but not limited to flight bookings, accommodations, or itinerary planning.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span><strong className="text-primary-900 dark:text-white">Data Loss:</strong> We are not liable for loss of your travel tracking data due to technical issues, account deletion, or service discontinuation.</span>
                </li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300 mt-4 text-sm">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, SEE EVERY PLACE™ SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-4">9. Indemnification</h2>
            <p className="text-primary-600 dark:text-primary-300">
              You agree to indemnify and hold harmless See Every Place™, its operators, and affiliates from any claims,
              damages, losses, or expenses arising from your use of the Service or violation of these Terms.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-4">10. Intellectual Property</h2>
            <p className="text-primary-600 dark:text-primary-300 mb-4">
              The See Every Place™ name, logo, and original content are protected by trademark and copyright law.
            </p>
            <ul className="text-primary-600 dark:text-primary-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Map data is sourced from Natural Earth and public domain sources</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Location data has been compiled from various public sources</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>The Service uses open-source libraries under their respective licenses</span>
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-4">11. Governing Law</h2>
            <p className="text-primary-600 dark:text-primary-300">
              These Terms shall be governed by and construed in accordance with the laws of the United States,
              without regard to conflict of law principles. Any disputes shall be resolved in the appropriate courts.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-4">12. Contact Us</h2>
            <p className="text-primary-600 dark:text-primary-300">
              If you have questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:hello@seeevery.place" className="text-primary-700 dark:text-primary-400 hover:underline">
                hello@seeevery.place
              </a>.
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
            <Link href="/privacy" className="hover:text-primary-700 dark:hover:text-primary-200 transition-colors">Privacy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-primary-700 dark:hover:text-primary-200 transition-colors">Terms</Link>
            <span>•</span>
            <Link href="/suggest" className="hover:text-primary-700 dark:hover:text-primary-200 transition-colors">Suggest</Link>
          </div>
          <p>See Every Place - Free Travel Tracker</p>
        </div>
      </footer>
    </div>
  );
}
