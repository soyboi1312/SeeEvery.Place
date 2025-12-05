'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useDarkMode } from '@/lib/hooks/useDarkMode';

export default function AboutPage() {
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
                See Every Place
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
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">About See Every Place</h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Track your adventures, build your bucket list, and share beautiful maps with friends and family.
          </p>

          {/* The Story Section */}
          <section className="mb-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 md:p-8 border border-blue-100 dark:border-blue-800">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">✨</span> Why We Built This
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                It started with a simple question: <em>&quot;How many countries have I actually visited?&quot;</em>
              </p>
              <p>
                After a road trip through the Southwest, I realized I couldn&apos;t remember which national parks
                we&apos;d stopped at versus which ones we just drove past. The photos were scattered across phones
                and cloud folders. The memories were starting to blur together.
              </p>
              <p>
                I wanted something simple - a visual way to see where I&apos;d been and dream about where I&apos;d go next.
                Not another app that wanted my email, credit card, or to post on my behalf. Just a beautiful map
                that showed my journey.
              </p>
              <p>
                <strong className="text-gray-800 dark:text-white">So I built one.</strong> And now I&apos;m sharing it with you.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                See Every Place is free, works offline, and your data stays on your device.
                No sign-up required. No tracking. Just you and your adventures.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">What is See Every Place?</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              See Every Place is a free travel tracking app that helps you visualize everywhere you have been
              and everywhere you want to go. Whether you are a seasoned globetrotter or just starting your
              travel journey, See Every Place makes it easy to keep track of your adventures.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Track countries, US states, national parks, state parks, UNESCO World Heritage Sites, mountain peaks,
              world-class museums, sports stadiums, Formula 1 circuits, marathon races, major airports, ski resorts,
              theme parks, and legendary surf spots - all in one place.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="text-3xl mb-3">🌍</div>
                <h3 className="font-bold text-gray-800 dark:text-white mb-2">Interactive Maps</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  See your travels come to life on beautiful interactive world and US maps with countries
                  and states colored by visit status.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-bold text-gray-800 dark:text-white mb-2">Track Everything</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Go beyond countries - track parks, UNESCO sites, mountains, museums,
                  stadiums, airports, ski resorts, theme parks, and surf spots.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="text-3xl mb-3">🎨</div>
                <h3 className="font-bold text-gray-800 dark:text-white mb-2">Shareable Graphics</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Generate beautiful, customizable graphics to share your travel stats on social media
                  or with friends.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="text-3xl mb-3">✨</div>
                <h3 className="font-bold text-gray-800 dark:text-white mb-2">Bucket List</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Plan your future adventures by adding destinations to your bucket list and watch
                  your dreams become reality.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Categories</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3 text-gray-600 dark:text-gray-300">
                <h3 className="font-semibold text-gray-800 dark:text-white text-sm uppercase tracking-wide">Destinations</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3">
                    <span className="text-xl">🌍</span>
                    <span><strong className="text-gray-800 dark:text-white">Countries</strong> - All 197 countries worldwide</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-xl">🇺🇸</span>
                    <span><strong className="text-gray-800 dark:text-white">US States</strong> - 50 states plus DC and territories</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-xl">✈️</span>
                    <span><strong className="text-gray-800 dark:text-white">Airports</strong> - Major hubs from JFK to Changi</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-3 text-gray-600 dark:text-gray-300">
                <h3 className="font-semibold text-gray-800 dark:text-white text-sm uppercase tracking-wide">Nature</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3">
                    <span className="text-xl">🏞️</span>
                    <span><strong className="text-gray-800 dark:text-white">National Parks</strong> - America&apos;s natural treasures</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-xl">🌲</span>
                    <span><strong className="text-gray-800 dark:text-white">State Parks</strong> - Hidden gems across all 50 states</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-xl">🏔️</span>
                    <span><strong className="text-gray-800 dark:text-white">5000m+ Peaks</strong> - World&apos;s highest mountains</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-xl">⛰️</span>
                    <span><strong className="text-gray-800 dark:text-white">US 14ers</strong> - Peaks over 14,000 feet</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-xl">⛷️</span>
                    <span><strong className="text-gray-800 dark:text-white">Ski Resorts</strong> - Whistler, Zermatt, Niseko & more</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-xl">🌊</span>
                    <span><strong className="text-gray-800 dark:text-white">Surfing Reserves</strong> - Legendary breaks worldwide</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-3 text-gray-600 dark:text-gray-300">
                <h3 className="font-semibold text-gray-800 dark:text-white text-sm uppercase tracking-wide">Sports</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3">
                    <span className="text-xl">🏟️</span>
                    <span><strong className="text-gray-800 dark:text-white">Stadiums</strong> - MLB, NFL, NBA, NHL, Soccer, Cricket, Rugby, Tennis</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-xl">🏎️</span>
                    <span><strong className="text-gray-800 dark:text-white">F1 Tracks</strong> - Formula 1 race circuits worldwide</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-xl">🏃</span>
                    <span><strong className="text-gray-800 dark:text-white">Marathons</strong> - World Marathon Majors</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-3 text-gray-600 dark:text-gray-300">
                <h3 className="font-semibold text-gray-800 dark:text-white text-sm uppercase tracking-wide">Culture</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3">
                    <span className="text-xl">🏛️</span>
                    <span><strong className="text-gray-800 dark:text-white">UNESCO Sites</strong> - 200 World Heritage locations</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-xl">🎨</span>
                    <span><strong className="text-gray-800 dark:text-white">Museums</strong> - World-class art and history</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-xl">🎢</span>
                    <span><strong className="text-gray-800 dark:text-white">Theme Parks</strong> - Disney, Universal & more</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Privacy</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Your data is stored locally on your device by default. We respect your privacy and
              don&apos;t track your travels unless you choose to sign in to sync across devices.
              When you do sign in, your data is anonymized, encrypted, and never sold to third parties.
              Read our full <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</Link>.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Contact</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Have questions, feedback, or suggestions? Reach out to us at{' '}
              <a href="mailto:hello@seeevery.place" className="text-blue-600 dark:text-blue-400 hover:underline">
                hello@seeevery.place
              </a>.
            </p>
          </section>

          <section className="text-center py-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all"
            >
              Start Tracking Your Travels
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
            <Link href="/suggest" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Suggest</Link>
          </div>
          <p>Made with love for travelers everywhere</p>
        </div>
      </footer>
    </div>
  );
}
