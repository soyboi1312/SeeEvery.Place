'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDarkMode } from '@/lib/hooks/useDarkMode';
import { useAuth } from '@/lib/hooks/useAuth';
import { ActivityFeed } from '@/components/ActivityFeed';
import { Leaderboard } from '@/components/Leaderboard';
import AuthModal from '@/components/AuthModal';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Users, LogIn } from 'lucide-react';

export default function CommunityPage() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-border sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 transition-transform group-hover:scale-110 duration-200">
              <Image src="/logo.svg" alt="See Every Place Logo" fill className="object-contain" priority />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-foreground leading-none">
                SeeEvery<span className="text-blue-500">.</span>Place<span className="text-[10px] align-super text-muted-foreground">™</span>
              </h1>
              <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase hidden sm:block">
                Free Travel Tracker
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            {!loading && !user && (
              <Button variant="outline" onClick={() => setShowAuthModal(true)}>
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
            <Button asChild>
              <Link href="/">Start Mapping</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Page Title */}
      <div className="bg-white/50 dark:bg-slate-900/50 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-foreground">
              Community
            </h1>
          </div>
          <p className="text-muted-foreground">
            Discover where others are traveling and track your ranking.
          </p>
        </div>
      </div>

      {/* Login Prompt for non-authenticated users */}
      {!loading && !user && (
        <div className="max-w-6xl mx-auto px-4 pt-6">
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-100">
                Sign in to follow travelers and see your friends&apos; activity
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Track your ranking, compete with friends, and join the community.
              </p>
            </div>
            <Button onClick={() => setShowAuthModal(true)} className="shrink-0">
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column: Activity Feed */}
          <div className="lg:col-span-2 space-y-6">
            <ActivityFeed
              defaultType="global"
              showTabs={true}
            />
          </div>

          {/* Sidebar: Leaderboard */}
          <div className="space-y-6">
            <div className="lg:sticky lg:top-20">
              <Leaderboard
                limit={10}
                defaultType="global"
                showPeriodTabs={true}
                showTypeTabs={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-background/50">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <div className="flex justify-center gap-4 mb-2">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>•</span>
            <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
            <span>•</span>
            <Link href="/suggest" className="hover:text-foreground transition-colors">Suggest</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
          <p>See Every Place - Free Travel Tracker</p>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}
