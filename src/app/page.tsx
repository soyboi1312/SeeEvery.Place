'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
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

export default function Home() {
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">🗺️</div>
          <p className="text-gray-500">Loading your travels...</p>
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
      />

      {/* Cloud Sync Indicator - positioned near user menu */}
      {isSyncing && (
        <div className="fixed top-16 right-4 z-50 animate-fade-in">
          <div className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Syncing...
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Hero Section */}
        <div className="text-center py-4 sm:py-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Track Your Adventures.
            <span className="block text-lg sm:text-xl font-normal text-gray-600 dark:text-gray-300 mt-2">
              The free travel tracker with shareable profiles.
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto mt-3">
            Track countries, parks, peaks, and more. Share your journey with friends.
            No account needed to get started!
          </p>
        </div>

        {/* Quick Stats */}
        <QuickStats
          selections={selections}
          onCategoryClick={handleCategoryChange}
        />

        {/* Map Visualization */}
        <div className="animate-fade-in">
          <MapVisualization
            category={activeCategory}
            selections={selections}
            onToggle={handleToggle}
            items={currentItems}
          />
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

        {/* Footer */}
        <footer className="py-8 text-gray-500 dark:text-gray-400 text-sm">
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
