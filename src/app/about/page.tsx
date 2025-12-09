'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useDarkMode } from '@/lib/hooks/useDarkMode';

export default function AboutPage() {
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
                SeeEvery<span className="text-accent-500">.</span>Place<span className="text-[10px] align-super text-primary-400">™</span>
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
              className="p-2 rounded-lg bg-primary-50 dark:bg-slate-800 text-primary-600 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-slate-700 transition-colors"
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
          <h1 className="text-4xl font-bold text-primary-900 dark:text-white mb-6">About See Every Place</h1>

          <p className="text-xl text-primary-600 dark:text-primary-300 mb-8">
            Track your adventures, build your bucket list, and share beautiful maps with friends and family.
          </p>

          {/* What is it - First so users know what they're reading about */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-4">What is See Every Place?</h2>
            <p className="text-primary-600 dark:text-primary-300 mb-4">
              See Every Place is a free travel tracking app that helps you visualize everywhere you&apos;ve been
              and everywhere you want to go. Whether you&apos;re a seasoned globetrotter or just starting your
              travel journey, See Every Place makes it easy to keep track of your adventures.
            </p>
            <p className="text-primary-600 dark:text-primary-300">
              Track far more than just countries. From national parks and mountain peaks to stadiums and weird
              roadside attractions, we help you capture the full detail of your journey.
            </p>
          </section>

          {/* The Story Section - Personal "I" voice for authenticity */}
          <section className="mb-12 bg-primary-50/50 dark:bg-primary-900/20 rounded-2xl p-6 md:p-8 border border-black/5 dark:border-white/10">
            <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">✨</span> The Story
            </h2>
            <div className="space-y-4 text-primary-600 dark:text-primary-300">
              <p>
                Memories fade faster than we&apos;d like. I wanted a way to hold onto the places I&apos;ve seen, not just the countries, but the mountain peaks and the random roadside attractions that made the trip special.
              </p>
              <p>
                Existing tools felt too generic. They didn&apos;t capture the detail of the journey, or they locked everything behind a login screen and wanted my email, credit card, or to post on my behalf.
              </p>
              <p>
                I wanted something simple, a visual way to see where I&apos;d been and dream about where I&apos;d go next. Just a beautiful map that showed my journey.
              </p>
              <p>
                <strong className="text-primary-900 dark:text-white">So I built one.</strong> And now I&apos;m sharing it with you.
              </p>
              <p className="text-sm text-primary-500 dark:text-primary-400 pt-2 border-t border-black/5 dark:border-white/10">
                See Every Place is free, works offline, and your data stays on your device.
                No sign-up required. No tracking. Just you and your adventures.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-4">Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-premium border border-black/5 dark:border-white/10">
                <div className="text-3xl mb-3">🌍</div>
                <h3 className="font-bold text-primary-900 dark:text-white mb-2">Interactive Maps</h3>
                <p className="text-primary-600 dark:text-primary-300 text-sm">
                  See your travels come to life on beautiful interactive world and US maps with countries
                  and states colored by visit status.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-premium border border-black/5 dark:border-white/10">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-bold text-primary-900 dark:text-white mb-2">Track Everything</h3>
                <p className="text-primary-600 dark:text-primary-300 text-sm">
                  Go beyond countries - track parks, mountains, museums,
                  stadiums, airports, ski resorts, theme parks, and surf spots.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-premium border border-black/5 dark:border-white/10">
                <div className="text-3xl mb-3">🎨</div>
                <h3 className="font-bold text-primary-900 dark:text-white mb-2">Shareable Graphics</h3>
                <p className="text-primary-600 dark:text-primary-300 text-sm">
                  Generate beautiful, customizable graphics to share your travel stats on social media
                  or with friends.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-premium border border-black/5 dark:border-white/10">
                <div className="text-3xl mb-3">✨</div>
                <h3 className="font-bold text-primary-900 dark:text-white mb-2">Bucket List</h3>
                <p className="text-primary-600 dark:text-primary-300 text-sm">
                  Plan your future adventures by adding destinations to your bucket list and watch
                  your dreams become reality.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-4">Categories</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3 text-primary-600 dark:text-primary-300">
                <h3 className="font-semibold text-primary-900 dark:text-white text-sm uppercase tracking-wide">Destinations</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3">
                    <span className="text-xl">🌍</span>
                    <span><strong className="text-primary-900 dark:text-white">Countries</strong> - All 197 countries worldwide</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-xl">🇺🇸</span>
                    <span><strong className="text-primary-900 dark:text-white">US States</strong> - 50 states plus DC and territories</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-xl">✈️</span>
                    <span><strong className="text-primary-900 dark:text-white">Airports</strong> - Major hubs from JFK to Changi</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-3 text-primary-600 dark:text-primary-300">
                <h3 className="font-semibold text-primary-900 dark:text-white text-sm uppercase tracking-wide">Nature</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3">
                    <span className="text-xl">🏞️</span>
                    <span><strong className="text-primary-900 dark:text-white">National Parks</strong> - America&apos;s natural treasures</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-xl">🌲</span>
                    <span><strong className="text-primary-900 dark:text-white">State Parks</strong> - Hidden gems across all 50 states</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-xl">🏔️</span>
                    <span><strong className="text-primary-900 dark:text-white">5000m+ Peaks</strong> - World&apos;s highest mountains</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-xl">⛰️</span>
                    <span><strong className="text-primary-900 dark:text-white">US 14ers</strong> - Peaks over 14,000 feet</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-xl">⛷️</span>
                    <span><strong className="text-primary-900 dark:text-white">Ski Resorts</strong> - Whistler, Zermatt, Niseko & more</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-xl">🌊</span>
                    <span><strong className="text-primary-900 dark:text-white">Surfing Reserves</strong> - Legendary breaks worldwide</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-3 text-primary-600 dark:text-primary-300">
                <h3 className="font-semibold text-primary-900 dark:text-white text-sm uppercase tracking-wide">Sports</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3">
                    <span className="text-xl">🏟️</span>
                    <span><strong className="text-primary-900 dark:text-white">Stadiums</strong> - MLB, NFL, NBA, NHL, Soccer, Cricket, Rugby, Tennis</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-xl">🏎️</span>
                    <span><strong className="text-primary-900 dark:text-white">F1 Tracks</strong> - Formula 1 race circuits worldwide</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-xl">🏃</span>
                    <span><strong className="text-primary-900 dark:text-white">Marathons</strong> - World Marathon Majors</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-3 text-primary-600 dark:text-primary-300">
                <h3 className="font-semibold text-primary-900 dark:text-white text-sm uppercase tracking-wide">Culture</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3">
                    <span className="text-xl">🎨</span>
                    <span><strong className="text-primary-900 dark:text-white">Museums</strong> - World-class art and history</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-xl">🎢</span>
                    <span><strong className="text-primary-900 dark:text-white">Theme Parks</strong> - Disney, Universal & more</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-xl">🗿</span>
                    <span><strong className="text-primary-900 dark:text-white">Weird Americana</strong> - Quirky roadside attractions</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-4">Privacy</h2>
            <p className="text-primary-600 dark:text-primary-300">
              Your data belongs to you. It lives on your device. I don&apos;t track your travels, and I never sell your data.
              Sync is optional. If you choose to sign in to access your data across devices, it&apos;s encrypted end-to-end.
              Read the full <Link href="/privacy" className="text-primary-700 dark:text-primary-400 hover:underline">Privacy Policy</Link>.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-4">Contact</h2>
            <p className="text-primary-600 dark:text-primary-300">
              Have questions, feedback, or suggestions? Reach out at{' '}
              <a href="mailto:hello@seeevery.place" className="text-primary-700 dark:text-primary-400 hover:underline">
                hello@seeevery.place
              </a>.
            </p>
          </section>

          {/* What's Next Section */}
          <section className="mb-12 bg-accent-50/50 dark:bg-accent-900/20 rounded-2xl p-6 md:p-8 border border-black/5 dark:border-white/10">
            <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">🚀</span> What&apos;s Next?
            </h2>
            <div className="space-y-4 text-primary-600 dark:text-primary-300">
              <p>
                I&apos;m constantly adding new maps and markers, and I let the community decide what comes first.
              </p>
              <p>
                Visit the{' '}
                <Link href="/suggest" className="text-primary-700 dark:text-primary-400 hover:underline font-medium">
                  Suggestions Page
                </Link>{' '}
                to see what I&apos;m working on, vote for your favorite categories, or submit a new idea. If enough people want it, I&apos;ll build it.
              </p>
            </div>
          </section>

          <section className="text-center py-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary-700 hover:bg-primary-800 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all"
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
