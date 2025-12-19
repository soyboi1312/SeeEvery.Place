'use client';

import { useState } from 'react';
import { useDarkMode } from '@/lib/hooks/useDarkMode';
import { useAuth } from '@/lib/hooks/useAuth';
import { ActivityFeed } from '@/components/ActivityFeed';
import { Leaderboard } from '@/components/Leaderboard';
import { UserSearch } from '@/components/UserSearch';
import { NotificationsDropdown } from '@/components/NotificationsDropdown';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import { Button } from '@/components/ui/button';
import { Users, LogIn, Loader2, Lock } from 'lucide-react';

export default function CommunityPage() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { user, loading, signOut, isAdmin, username } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Shared Header */}
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

      {/* Page Title */}
      <div className="bg-white/50 dark:bg-slate-900/50 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-foreground">
              Community
            </h1>
            {!loading && user && (
              <div className="ml-auto">
                <NotificationsDropdown />
              </div>
            )}
          </div>
          <p className="text-muted-foreground">
            Discover where others are traveling and track your ranking.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 flex-grow w-full">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : !user ? (
          /* Locked State */
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 bg-white/50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-6 rounded-full ring-8 ring-blue-50 dark:ring-blue-900/10">
              <Lock className="w-10 h-10 text-blue-500" />
            </div>
            <div className="space-y-2 max-w-md">
              <h2 className="text-2xl font-bold">Community Access Locked</h2>
              <p className="text-muted-foreground">
                Sign in to view the global activity feed, search for other travelers, and see your ranking on the leaderboard.
              </p>
            </div>
            <Button onClick={() => setShowAuthModal(true)} size="lg" className="px-8">
              <LogIn className="w-4 h-4 mr-2" />
              Sign In to View
            </Button>
          </div>
        ) : (
          /* Authenticated Content */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Column: User Search + Activity Feed */}
            <div className="lg:col-span-2 space-y-6">
              {/* User Search */}
              <div>
                <h2 className="text-lg font-semibold mb-3">Find Travelers</h2>
                <ErrorBoundary
                  fallbackTitle="Search unavailable"
                  fallbackMessage="Unable to load user search. Please try again."
                >
                  <UserSearch />
                </ErrorBoundary>
              </div>

              {/* Activity Feed */}
              <ErrorBoundary
                fallbackTitle="Feed unavailable"
                fallbackMessage="Unable to load activity feed. Please try again."
              >
                <ActivityFeed
                  defaultType="global"
                  showTabs={true}
                />
              </ErrorBoundary>
            </div>

            {/* Sidebar: Leaderboard */}
            <div className="space-y-6">
              <div className="lg:sticky lg:top-20">
                <ErrorBoundary
                  fallbackTitle="Leaderboard unavailable"
                  fallbackMessage="Unable to load leaderboard. Please try again."
                >
                  <Leaderboard
                    limit={10}
                    defaultType="global"
                    showPeriodTabs={true}
                    showTypeTabs={true}
                  />
                </ErrorBoundary>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Shared Footer */}
      <Footer user={user} onSignIn={() => setShowAuthModal(true)} />

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}
