'use client';

import { useState, useEffect, useMemo, useCallback, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import CategoryTabs from '@/components/CategoryTabs';
import SelectionList from '@/components/SelectionList';
import QuickStats from '@/components/QuickStats';

// Dynamically import heavy modals to reduce initial bundle size
// ShareCard imports all category data files (~100KB+ of coordinates/names)
// AuthModal imports Supabase auth logic
const ShareCard = dynamic(() => import('@/components/ShareCard'), {
  loading: () => null,
  ssr: false,
});
const AuthModal = dynamic(() => import('@/components/AuthModal'), {
  loading: () => null,
  ssr: false,
});

import MapErrorBoundary from '@/components/MapErrorBoundary';

const MapVisualization = dynamic(() => import('@/components/MapVisualization'), {
  loading: () => (
    <div className="w-full bg-blue-50/50 dark:bg-slate-800/50 rounded-2xl overflow-hidden border border-blue-100 dark:border-slate-700 shadow-inner mb-6">
      <div className="aspect-[16/9] w-full max-h-[500px] animate-pulse bg-blue-100/50 dark:bg-slate-700/50" />
    </div>
  ),
  ssr: false,
});

import { Category, UserSelections, emptySelections, Status, categoryLabels } from '@/lib/types';
import {
  loadSelections,
  saveSelections,
  getSelectionStatus,
  toggleSelection,
  setSelectionStatus,
  getStats,
  applyCityRelatedSelections,
  preloadCityData,
} from '@/lib/storage';
import { useAuth } from '@/lib/hooks/useAuth';
import { useDarkMode } from '@/lib/hooks/useDarkMode';
import { useCloudSync } from '@/lib/hooks/useCloudSync';
import { createClient } from '@/lib/supabase/client';
import { categoryTotals, categoryTitles, getCategoryItemsAsync, type CategoryItem } from '@/lib/categoryUtils';

function HomeContent() {
  const searchParams = useSearchParams();
  const [selections, setSelections] = useState<UserSelections>(emptySelections);
  const [activeCategory, setActiveCategory] = useState<Category>('countries');
  const [showShareCard, setShowShareCard] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentItems, setCurrentItems] = useState<CategoryItem[]>([]);
  const [profileData, setProfileData] = useState<{ isPublic: boolean; username: string | null }>({ isPublic: false, username: null });
  const { user, signOut, isAdmin } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // Cloud sync hook - handles all sync logic
  const { isSyncing } = useCloudSync({
    user,
    selections,
    setSelections,
    isLoaded,
  });

  const handleCategoryChange = useCallback((category: Category) => {
    setActiveCategory(category);
  }, []);

  // Sync activeCategory with URL search params (for Explore dropdown navigation)
  useEffect(() => {
    const category = searchParams.get('category');
    if (category && category in categoryLabels) {
      setActiveCategory(category as Category);
    }
  }, [searchParams]);

  // Load selections from localStorage on mount (async for lazy-loaded migrations)
  useEffect(() => {
    loadSelections().then(saved => {
      setSelections(saved);
      setIsLoaded(true);
    });
  }, []);

  // Fetch profile data for share modal (public profile link)
  useEffect(() => {
    if (!user) {
      setProfileData({ isPublic: false, username: null });
      return;
    }

    const fetchProfile = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('profiles')
        .select('is_public, username')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfileData({ isPublic: data.is_public || false, username: data.username });
      }
    };

    fetchProfile();
  }, [user]);

  // Track pending save for beforeunload handler
  const pendingSaveRef = useRef<NodeJS.Timeout | null>(null);
  const selectionsRef = useRef(selections);
  selectionsRef.current = selections;

  // Save selections whenever they change (local storage)
  // DEBOUNCED: Waits 1000ms after last change to avoid freezing UI on rapid clicks
  useEffect(() => {
    if (!isLoaded) return;

    pendingSaveRef.current = setTimeout(() => {
      saveSelections(selections);
      pendingSaveRef.current = null;
    }, 1000);

    return () => {
      if (pendingSaveRef.current) {
        clearTimeout(pendingSaveRef.current);
      }
    };
  }, [selections, isLoaded]);

  // Save immediately on page unload to prevent data loss
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (pendingSaveRef.current) {
        clearTimeout(pendingSaveRef.current);
        saveSelections(selectionsRef.current);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Updated handleToggle to support lazy loaded city data
  const handleToggle = useCallback(async (id: string, currentStatus: Status) => {
    // 1. Immediate optimistic update for responsiveness
    setSelections(prev => {
      return toggleSelection(prev, activeCategory, id, currentStatus);
    });

    // 2. Check if we need to apply city-related logic (visited status only)
    const nextStatus = currentStatus === 'unvisited' ? 'visited' : currentStatus === 'visited' ? 'bucketList' : null;

    if (nextStatus === 'visited' && (activeCategory === 'usCities' || activeCategory === 'worldCities')) {
      // Load the data dynamically if needed
      await preloadCityData();

      // Apply the related updates (now that data is loaded, applyCityRelatedSelections will work)
      setSelections(prev => applyCityRelatedSelections(prev, activeCategory, id, nextStatus));
    }
  }, [activeCategory]);

  // Updated handleSetStatus to support lazy loaded city data
  const handleSetStatus = useCallback(async (id: string, status: Status | null) => {
    // 1. Immediate update
    setSelections(prev => {
      return setSelectionStatus(prev, activeCategory, id, status);
    });

    // 2. City logic
    if (status === 'visited' && (activeCategory === 'usCities' || activeCategory === 'worldCities')) {
      await preloadCityData();
      setSelections(prev => applyCityRelatedSelections(prev, activeCategory, id, status));
    }
  }, [activeCategory]);

  const getStatus = useCallback((id: string): Status => {
    return getSelectionStatus(selections, activeCategory, id);
  }, [selections, activeCategory]);

  const handleClearAll = useCallback(() => {
    setSelections(prev => ({
      ...prev,
      [activeCategory]: [],
    }));
  }, [activeCategory]);

  // Load items for the active category asynchronously (code-split)
  useEffect(() => {
    getCategoryItemsAsync(activeCategory).then(setCurrentItems);
  }, [activeCategory]);

  const currentStats = useMemo(() => {
    return getStats(selections, activeCategory, categoryTotals[activeCategory]);
  }, [selections, activeCategory]);

  const allStats = useMemo(() => {
    return Object.fromEntries(
      (Object.keys(categoryTotals) as Category[]).map(cat => [
        cat,
        getStats(selections, cat, categoryTotals[cat]),
      ])
    ) as Record<Category, { visited: number; total: number; bucketList: number; percentage: number }>;
  }, [selections]);

  if (!isLoaded) {
    // Page Skeleton - matches the actual layout for smooth transition
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Header Skeleton */}
        <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-200/60 dark:border-slate-700/60 sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 py-2 sm:py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
              <div className="flex flex-col gap-1">
                <div className="w-32 h-5 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
                <div className="w-20 h-2 bg-gray-200 dark:bg-slate-700 rounded animate-pulse hidden sm:block" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse" />
              <div className="w-20 h-10 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse" />
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
          {/* Hero Skeleton */}
          <div className="text-center py-4 sm:py-8">
            <div className="w-80 h-8 bg-gray-200 dark:bg-slate-700 rounded mx-auto mb-4 animate-pulse" />
            <div className="w-64 h-5 bg-gray-200 dark:bg-slate-700 rounded mx-auto mb-2 animate-pulse" />
            <div className="w-96 h-4 bg-gray-200 dark:bg-slate-700 rounded mx-auto animate-pulse" />
          </div>

          {/* Quick Stats Skeleton */}
          <div className="flex flex-wrap justify-center gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-24 h-16 bg-gray-200 dark:bg-slate-700 rounded-xl animate-pulse" />
            ))}
          </div>

          {/* Map Skeleton */}
          <div className="w-full bg-blue-50/50 dark:bg-slate-800/50 rounded-2xl overflow-hidden border border-blue-100 dark:border-slate-700 shadow-inner">
            <div className="aspect-[16/9] w-full max-h-[500px] bg-gray-200 dark:bg-slate-700 animate-pulse" />
            <div className="flex justify-center gap-6 py-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-slate-600 animate-pulse" />
                  <div className="w-12 h-3 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Category Tabs Skeleton */}
          <div className="flex flex-wrap justify-center gap-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-24 h-10 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse" />
            ))}
          </div>

          {/* List Skeleton */}
          <div className="space-y-3">
            <div className="w-48 h-6 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mx-auto" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    // UPDATED: Clean background removed gradient
    // Note: Removed transition-colors to fix non-composited animation (Lighthouse CLS)
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header
        onSignIn={() => setShowAuthModal(true)}
        onSignOut={signOut}
        isSignedIn={!!user}
        userEmail={user?.email}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        isAdmin={isAdmin}
        syncStatus={isSyncing ? 'syncing' : 'idle'}
      />

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Hero Section */}
        <div className="text-center py-4 sm:py-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Track Your Adventures.
            <span className="block text-lg sm:text-xl font-normal text-gray-600 dark:text-gray-300 mt-2">
              The free travel tracker with shareable maps and profiles.
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto mt-3">
            Track countries, parks, peaks, and more. Share your journey with friends.
          </p>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto mt-2">
            No account needed to get started!
          </p>
        </div>

        {/* Quick Stats */}
        <QuickStats
          selections={selections}
          onCategoryClick={handleCategoryChange}
        />

        {/* Map Visualization - wrapped in error boundary for graceful fallback */}
        <div className="animate-fade-in">
          <MapErrorBoundary>
            <MapVisualization
              category={activeCategory}
              selections={selections}
              onToggle={handleToggle}
              items={currentItems}
            />
          </MapErrorBoundary>
        </div>

        {/* Category Tabs - below map */}
        <CategoryTabs
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          stats={allStats}
        />

        {/* Selection List */}
        <SelectionList
          items={currentItems}
          getStatus={getStatus}
          onToggle={handleToggle}
          onSetStatus={handleSetStatus}
          onClearAll={handleClearAll}
          groupBy="group"
          showSearch={true}
          title={categoryTitles[activeCategory]}
          stats={currentStats}
          category={activeCategory}
        />

        {/* Floating Share Button - Updated to be more explicit */}
        <button
          onClick={() => setShowShareCard(true)}
          className="fixed bottom-20 right-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg flex items-center gap-2 hover:shadow-xl hover:scale-105 transition-all z-30 font-semibold"
          aria-label="Share or download your travel map"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span>Share Map</span>
        </button>

        {/* Footer - pb-24 adds clearance for the floating Share Map button on mobile */}
        <footer className="py-8 pb-24 text-gray-500 dark:text-gray-400 text-sm">
          {/* Category Directory - Internal Links for SEO */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mb-8">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 text-center">
              Track Your Adventures
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-left">
              {(Object.keys(categoryLabels) as Category[]).map((cat) => (
                <Link
                  key={cat}
                  href={`/track/${cat}`}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Track {categoryLabels[cat]}
                </Link>
              ))}
            </div>
          </div>

          <div className="text-center">
            <p>
              Made by people who really like maps.
            </p>
            <p className="mt-1">
              {user ? (
                <>Signed in as {user.email}. Your data syncs across devices.</>
              ) : (
                <>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Sign in
                  </button>{' '}
                  to sync across devices.
                </>
              )}
            </p>
            <div className="mt-3 flex justify-center gap-4">
              <Link href="/about" className="text-blue-600 dark:text-blue-400 hover:underline">
                About
              </Link>
              <span>•</span>
              <Link href="/suggest" className="text-blue-600 dark:text-blue-400 hover:underline">
                Suggest
              </Link>
              <span>•</span>
              <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                Privacy
              </Link>
              <span>•</span>
              <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                Terms
              </Link>
            </div>
          </div>
        </footer>
      </div>

      {/* Share Card Modal */}
      {showShareCard && (
        <ShareCard
          selections={selections}
          category={activeCategory}
          onClose={() => setShowShareCard(false)}
          isPublicProfile={profileData.isPublic}
          username={profileData.username}
        />
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50/30 dark:from-slate-900 dark:to-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
