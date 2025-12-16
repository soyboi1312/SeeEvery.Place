'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useDarkMode } from '@/lib/hooks/useDarkMode';
import { useAuth } from '@/lib/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function AboutPage() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { user, signOut, isAdmin, username } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800">
      <Header
        onSignIn={() => setShowAuthModal(true)}
        onSignOut={signOut}
        isSignedIn={!!user}
        userEmail={user?.email}
        username={username}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        isAdmin={isAdmin}
        syncStatus="idle"
      />

      <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8 flex-grow">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Map Your World
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            A private, simple way to keep track of everywhere you have been.
          </p>
        </div>

        {/* The Story Section */}
        <div className="bg-white dark:bg-black/20 rounded-2xl p-8 shadow-sm border border-black/5 dark:border-white/10 mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Our Story
          </h2>

          <div className="space-y-4 text-gray-600 dark:text-gray-300">
            <p>
              It started with the realization that memories fade faster than we&apos;d like. We wanted a way to hold onto the places we&apos;ve seen. not just the countries, but the mountain peaks, the national parks, and those random roadside attractions that made the trip special.
            </p>
            <p>
              Existing tools felt too generic. They didn&apos;t capture the detail of the journey, or they locked everything behind a login screen.
            </p>
            <p>
              We wanted something simple; a visual way to see where we&apos;d been and dream about where we&apos;d go next.
              Not another app that wanted our email, credit card, or to post on our behalf. Just a beautiful map
              that showed our journey.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-white">So we built one.</strong> And now we&apos;re sharing it with you.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 pt-2 border-t border-black/5 dark:border-white/10">
              See Every Place is free, works offline, and your data stays on your device.
              No sign-up required. No tracking. Just you and your adventures.
            </p>
          </div>
        </div>

        {/* Values / Philosophy Section */}
        <div className="grid gap-8 md:grid-cols-2 mb-12">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Privacy First
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Your location data is yours. It never leaves your browser unless you explicitly choose to export it. No hidden tracking scripts or data selling.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Built for Detail
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Most maps only scratch the surface. We let you track the details that matter, from city streets to remote hiking trails.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Offline Ready
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Travel often means losing signal. We designed this to work perfectly whether you are in a cafe with WiFi or a tent in the wilderness.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Open & Free
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              We built this because we needed it. It is free to use, open source, and built for the community of travelers who love maps as much as we do.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-8">
          <Button asChild size="lg" className="gap-2">
            <Link href="/">
              Start Mapping
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>

      <Footer user={user} onSignIn={() => setShowAuthModal(true)} showCategoryDirectory={false} />

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}
