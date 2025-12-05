'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import CategoryTabs from '@/components/CategoryTabs';
import SelectionList from '@/components/SelectionList';
import QuickStats from '@/components/QuickStats';
import ShareCard from '@/components/ShareCard';
import AuthModal from '@/components/AuthModal';

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
} from '@/lib/storage';
import { useAuth } from '@/lib/hooks/useAuth';
import { useDarkMode } from '@/lib/hooks/useDarkMode';
import { loadFromCloud, mergeSelectionsFromCloud, syncToCloud } from '@/lib/sync';
import { categoryTotals, categoryTitles, getCategoryItems } from '@/lib/categoryUtils';

export default function Home() {
  const [selections, setSelections] = useState<UserSelections>(emptySelections);
  const [activeCategory, setActiveCategory] = useState<Category>('countries');
  const [showShareCard, setShowShareCard] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const { user, signOut } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // Track which user we've synced for to prevent duplicate syncs
  const lastSyncedUserId = useRef<string | null>(null);
  // Track if initial sync is complete
  const initialSyncComplete = useRef(false);

  const handleCategoryChange = useCallback((category: Category) => {
    setActiveCategory(category);
  }, []);

  // Load selections from localStorage on mount
  useEffect(() => {
    const saved = loadSelections();
    setSelections(saved);
    setIsLoaded(true);
  }, []);

  // Save selections whenever they change (local storage)
  useEffect(() => {
    if (isLoaded) {
      saveSelections(selections);
    }
  }, [selections, isLoaded]);

  // Cloud sync: fetch and merge when user signs in
  // This effect handles the initial sync on login
  useEffect(() => {
    // Wait for local data to load first
    if (!isLoaded) return;

    // No user = no cloud sync needed
    if (!user) {
      lastSyncedUserId.current = null;
      initialSyncComplete.current = false;
      return;
    }

    // Skip if we've already synced for this user
    if (lastSyncedUserId.current === user.id) return;

    const performInitialSync = async () => {
      setIsSyncing(true);
      console.log('Starting cloud sync for user:', user.id);

      try {
        const cloudData = await loadFromCloud();

        if (cloudData) {
          // Merge local + cloud data (local takes precedence for conflicts)
          const merged = await mergeSelectionsFromCloud(selections, cloudData);
          setSelections(merged);
          // Push merged result back to cloud
          await syncToCloud(merged);
          console.log('Cloud sync complete: merged local + cloud data');
        } else {
          // No cloud data exists, push local data to cloud
          await syncToCloud(selections);
          console.log('Cloud sync complete: pushed local data to cloud');
        }

        // Mark this user as synced
        lastSyncedUserId.current = user.id;
        initialSyncComplete.current = true;
      } catch (error) {
        console.error('Cloud sync failed:', error);
      } finally {
        setIsSyncing(false);
      }
    };

    performInitialSync();
    // Note: we intentionally exclude `selections` from deps to only run on user change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, isLoaded]);

  // Debounced sync to cloud when selections change (after initial sync)
  useEffect(() => {
    // Only sync if user is logged in, data is loaded, and initial sync is done
    if (!user || !isLoaded || !initialSyncComplete.current) return;

    const debounceSync = setTimeout(() => {
      syncToCloud(selections).catch(err =>
        console.error('Failed to sync changes to cloud:', err)
      );
    }, 2000); // 2 second debounce

    return () => clearTimeout(debounceSync);
  }, [selections, user, isLoaded]);

  const handleToggle = useCallback((id: string, currentStatus: Status) => {
    setSelections(prev => toggleSelection(prev, activeCategory, id, currentStatus));
  }, [activeCategory]);

  const handleSetStatus = useCallback((id: string, status: Status | null) => {
    setSelections(prev => setSelectionStatus(prev, activeCategory, id, status));
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

  // Get items for the active category (refactored to categoryUtils)
  const currentItems = useMemo(() => getCategoryItems(activeCategory), [activeCategory]);

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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <Header
        onSignIn={() => setShowAuthModal(true)}
        onSignOut={signOut}
        isSignedIn={!!user}
        userEmail={user?.email}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Cloud Sync Indicator */}
      {isSyncing && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Syncing your data...
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Hero Section */}
        <div className="text-center py-4 sm:py-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Free Travel Map & Tracker
            <span className="block text-lg sm:text-xl font-normal text-gray-600 dark:text-gray-300 mt-2">
              Where have you been? Track Countries, States, and National Parks.
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto mt-3">
            Build your bucket list and share beautiful maps with friends.
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

        {/* Floating Share Button */}
        <button
          onClick={() => setShowShareCard(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all z-30"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
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
              Made with ❤️ for travelers everywhere
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
              <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                Privacy
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
        />
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}
