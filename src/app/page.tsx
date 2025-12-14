'use client';

import { useState, useEffect, useMemo, useCallback, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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

// Preload AuthModal chunk on hover to reduce perceived latency
const preloadAuthModal = () => import('@/components/AuthModal');

import MapErrorBoundary from '@/components/MapErrorBoundary';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';

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

// Isolated component for URL param syncing - allows SSR of main content
function URLSync({ onCategoryChange }: { onCategoryChange: (cat: Category) => void }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const category = searchParams.get('category');
    if (category && category in categoryLabels) {
      onCategoryChange(category as Category);
    }
  }, [searchParams, onCategoryChange]);

  return null;
}

function HomeContent() {
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

  // Skeletons to prevent Layout Shift (CLS)
  // Heights and layouts must EXACTLY match actual components
  const LoadingSkeletons = () => (
    <div className="space-y-6 animate-pulse">
      {/* QuickStats Skeleton - matches grid-cols-1 md:grid-cols-3 gap-4 mb-6 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Card 1: Countries - taller due to expand button */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-5">
            <div className="flex justify-between items-start mb-2">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg" />
              <div className="w-12 h-6 bg-gray-100 dark:bg-gray-700 rounded-full" />
            </div>
            <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded mt-2" />
            <div className="h-9 w-20 bg-gray-200 dark:bg-gray-700 rounded mt-2" />
            <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full mt-3" />
          </div>
          <div className="h-9 border-t border-gray-100 dark:border-gray-700" />
        </div>
        {/* Card 2: States */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-start mb-2">
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-lg" />
            <div className="w-12 h-6 bg-gray-100 dark:bg-gray-700 rounded-full" />
          </div>
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mt-2" />
          <div className="h-9 w-20 bg-gray-200 dark:bg-gray-700 rounded mt-2" />
          <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full mt-3" />
        </div>
        {/* Card 3: Points of Interest */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-start mb-2">
            <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-lg" />
            <div className="w-12 h-6 bg-gray-100 dark:bg-gray-700 rounded-full" />
          </div>
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mt-2" />
          <div className="h-9 w-20 bg-gray-200 dark:bg-gray-700 rounded mt-2" />
          <div className="h-3 w-40 bg-gray-100 dark:bg-gray-700 rounded mt-3" />
        </div>
      </div>

      {/* Map Skeleton */}
      <div className="w-full bg-blue-50/50 dark:bg-slate-800/50 rounded-2xl overflow-hidden border border-blue-100 dark:border-slate-700 shadow-inner">
        <div className="aspect-[16/9] w-full max-h-[500px] bg-blue-100/50 dark:bg-slate-700/50" />
      </div>

      {/* CategoryTabs Skeleton - TWO levels like actual component */}
      <div className="space-y-4">
        {/* Level 1: Meta-Groups */}
        <div className="flex justify-center overflow-x-auto">
          <div className="inline-flex bg-white dark:bg-gray-800 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-700 gap-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 w-10 sm:w-28 bg-gray-100 dark:bg-gray-700 rounded-xl shrink-0" />
            ))}
          </div>
        </div>
        {/* Level 2: Category Pills */}
        <div className="w-full overflow-x-auto py-2">
          <div className="flex justify-start sm:justify-center gap-3 px-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-[100px] shrink-0 h-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700" />
            ))}
          </div>
        </div>
      </div>

      {/* SelectionList Skeleton - Card structure with header, controls, list */}
      <div className="rounded-lg border-0 shadow-lg overflow-hidden bg-background">
        {/* Header with gradient */}
        <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="h-8 w-40 bg-white/20 rounded mb-3" />
          <div className="flex gap-3">
            <div className="h-6 w-28 bg-white/20 rounded-full" />
            <div className="h-6 w-28 bg-white/20 rounded-full" />
          </div>
        </div>
        {/* Controls area */}
        <div className="p-4 border-b bg-muted/30 space-y-4">
          <div className="h-10 w-full bg-gray-100 dark:bg-gray-800 rounded-md" />
          <div className="flex gap-1.5 p-1 bg-muted rounded-lg w-full sm:w-fit overflow-x-auto">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 w-16 sm:w-20 bg-gray-200 dark:bg-gray-700 rounded-md shrink-0" />
            ))}
          </div>
        </div>
        {/* List items */}
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-11 bg-gray-100 dark:bg-gray-800 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 overflow-x-hidden">
      <Header
        onSignIn={() => setShowAuthModal(true)}
        onSignOut={signOut}
        isSignedIn={!!user}
        userEmail={user?.email}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        isAdmin={isAdmin}
        syncStatus={isSyncing ? 'syncing' : 'idle'}
        onPreloadAuth={preloadAuthModal}
      />

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 flex-grow">
        {/* Hero Section - NOW RENDERS IMMEDIATELY FOR FAST LCP */}
        <div className="text-center py-4 sm:py-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Track Your Adventures.
            <span className="block text-lg sm:text-xl font-normal text-gray-600 dark:text-gray-300 mt-2">
              The free travel tracker for pure exploration.
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto mt-3">
            Track countries, parks, peaks, and more. Share your map and stats.
            <br className="hidden sm:block" />
            <span className="font-medium"> Not your photo gallery.</span>
          </p>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto mt-2">
            No account needed to get started!
          </p>
        </div>

        {/* URL param sync - isolated in Suspense to allow SSR of Hero */}
        <Suspense fallback={null}>
          <URLSync onCategoryChange={handleCategoryChange} />
        </Suspense>

        {/* Render Skeletons or Content */}
        {!isLoaded ? (
          <LoadingSkeletons />
        ) : (
          <div className="animate-fade-in space-y-6">
            <QuickStats
              selections={selections}
              onCategoryClick={handleCategoryChange}
            />

            <MapErrorBoundary>
              <MapVisualization
                category={activeCategory}
                selections={selections}
                onToggle={handleToggle}
                items={currentItems}
              />
            </MapErrorBoundary>

            <CategoryTabs
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
              stats={allStats}
            />

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
          </div>
        )}

        {/* Floating Share Button */}
        <Button
          onClick={() => setShowShareCard(true)}
          className="fixed bottom-6 right-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all z-30 font-semibold h-auto"
          aria-label="Share or download your travel map"
        >
          <Share2 className="w-5 h-5" />
          <span>Share Map</span>
        </Button>

      </div>

      {/* Shared Footer */}
      <Footer
        user={user}
        onSignIn={() => setShowAuthModal(true)}
        onSignInHover={preloadAuthModal}
      />

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
  return <HomeContent />;
}
