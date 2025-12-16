'use client';

import { useState, useEffect, useMemo, useCallback, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
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
import { Share2, Trophy } from 'lucide-react';

const MapVisualization = dynamic(() => import('@/components/MapVisualization'), {
  loading: () => (
    <div className="w-full bg-blue-50/50 dark:bg-slate-800/50 rounded-2xl overflow-hidden border border-blue-100 dark:border-slate-700 shadow-inner mb-6">
      <div className="aspect-[16/9] w-full max-h-[500px] animate-pulse bg-blue-100/50 dark:bg-slate-700/50" />
    </div>
  ),
  ssr: false,
});

import { Category, UserSelections, emptySelections, Status, categoryLabels, Selection } from '@/lib/types';
import {
  loadSelections,
  saveSelections,
  saveSelectionsAsync,
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
  const { user, signOut, isAdmin, username } = useAuth();
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
  // Uses async version to avoid 20-50ms UI stutters during JSON stringification
  useEffect(() => {
    if (!isLoaded) return;

    pendingSaveRef.current = setTimeout(async () => {
      await saveSelectionsAsync(selections);
      pendingSaveRef.current = null;
    }, 1000);

    return () => {
      if (pendingSaveRef.current) {
        clearTimeout(pendingSaveRef.current);
      }
    };
  }, [selections, isLoaded]);

  // Save immediately on page unload to prevent data loss
  // Uses both beforeunload (desktop) and visibilitychange (mobile) for reliability
  // Mobile Safari and other browsers often terminate without firing beforeunload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (pendingSaveRef.current) {
        clearTimeout(pendingSaveRef.current);
        saveSelections(selectionsRef.current);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handleBeforeUnload();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
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

  // Updated handleSetStatus to support lazy loaded city data, visited dates, and notes
  const handleSetStatus = useCallback(async (id: string, status: Status | null, visitedDate?: string, notes?: string) => {
    // 1. Immediate update
    setSelections(prev => {
      return setSelectionStatus(prev, activeCategory, id, status, visitedDate, notes);
    });

    // 2. City logic
    if (status === 'visited' && (activeCategory === 'usCities' || activeCategory === 'worldCities')) {
      await preloadCityData();
      setSelections(prev => applyCityRelatedSelections(prev, activeCategory, id, status));
    }
  }, [activeCategory]);

  // Create O(1) lookup maps for the active category's selections
  // This fixes O(N*M) complexity when filtering large lists (e.g., 2000 cities × 500 selections)
  const selectionLookup = useMemo(() => {
    const categorySelections = selections[activeCategory] || [];
    const map = new Map<string, Selection>();
    for (const sel of categorySelections) {
      if (!sel.deleted) {
        map.set(sel.id, sel);
      }
    }
    return map;
  }, [selections, activeCategory]);

  // O(1) status lookup (was O(N) with array.find)
  const getStatus = useCallback((id: string): Status => {
    const selection = selectionLookup.get(id);
    return selection?.status || 'unvisited';
  }, [selectionLookup]);

  // O(1) visited date lookup
  const getVisitedDate = useCallback((id: string): string | undefined => {
    return selectionLookup.get(id)?.visitedDate;
  }, [selectionLookup]);

  // O(1) notes lookup
  const getNotes = useCallback((id: string): string | undefined => {
    return selectionLookup.get(id)?.notes;
  }, [selectionLookup]);

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
  const LoadingSkeletons = () => (
    <div className="space-y-6 animate-pulse">
      {/* QuickStats Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700/50" />
        ))}
      </div>

      {/* Map Skeleton */}
      <div className="w-full bg-blue-50/50 dark:bg-slate-800/50 rounded-2xl overflow-hidden border border-blue-100 dark:border-slate-700 shadow-inner">
        <div className="aspect-[16/9] w-full max-h-[500px] bg-blue-100/50 dark:bg-slate-700/50" />
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-24 h-10 bg-gray-200 dark:bg-slate-700 rounded-lg shrink-0" />
        ))}
      </div>

      {/* List Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 dark:bg-slate-800 rounded-lg" />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header
        onSignIn={() => setShowAuthModal(true)}
        onSignOut={signOut}
        isSignedIn={!!user}
        userEmail={user?.email}
        username={username}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        isAdmin={isAdmin}
        syncStatus={isSyncing ? 'syncing' : 'idle'}
        onPreloadAuth={preloadAuthModal}
      />

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 flex-grow w-full overflow-hidden">
        {/* Hero Section - NOW RENDERS IMMEDIATELY FOR FAST LCP */}
        <div className="text-center py-4 sm:py-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Turn the World Into Your Quest Log.
            <span className="block text-lg sm:text-xl font-normal text-gray-600 dark:text-gray-300 mt-2">
              The free travel tracker that gamifies exploration.
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto mt-3">
            Track countries, parks, peaks, and more. Unlock achievements, earn XP, and complete your bucket list.
            <br className="hidden sm:block" />
            <span className="font-medium"> No itineraries. No dates. Just the thrill of completing the set.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
            <p className="text-gray-600 dark:text-gray-300 sm:self-center">
              No account needed to get started!
            </p>
            <Button asChild variant="outline" className="gap-2 border-amber-400 dark:border-amber-600 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20">
              <Link href="/trips">
                <Trophy className="w-4 h-4" />
                My Quests
              </Link>
            </Button>
          </div>
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
              getVisitedDate={getVisitedDate}
              getNotes={getNotes}
              onToggle={handleToggle}
              onSetStatus={handleSetStatus}
              onClearAll={handleClearAll}
              groupBy="group"
              showSearch={true}
              title={categoryTitles[activeCategory]}
              stats={currentStats}
              category={activeCategory}
              isAuthenticated={!!user}
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
