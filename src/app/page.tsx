'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
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

import { Category, UserSelections, emptySelections, Status } from '@/lib/types';
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

// Data Imports
import { countries } from '@/data/countries';
import { usStates } from '@/data/usStates';
import { nationalParks } from '@/data/nationalParks';
import { stateParks } from '@/data/stateParks';
import { unescoSites } from '@/data/unescoSites';
import { get5000mPeaks, getUS14ers } from '@/data/mountains';
import { museums } from '@/data/museums';
// Import specific getters for stadiums
import { getMlbStadiums, getNflStadiums, getNbaStadiums, getNhlStadiums, getSoccerStadiums } from '@/data/stadiums';
import { f1Tracks } from '@/data/f1Tracks';
import { marathons } from '@/data/marathons';

// Common country abbreviation aliases that differ from ISO codes
const countryAliases: Record<string, string[]> = {
  'GB': ['UK', 'Britain', 'England'],
  'US': ['USA', 'America'],
  'AE': ['UAE'],
  'KR': ['ROK'],
  'KP': ['DPRK'],
  'RU': ['Russia'],
  'CZ': ['Czech'],
  'CD': ['DRC'],
  'CF': ['CAR'],
  'BA': ['Bosnia'],
  'NZ': ['Kiwi'],
  'ZA': ['RSA'],
  'SA': ['KSA'],
  'PH': ['PHL'],
  'VN': ['Nam'],
};

// Common US state abbreviation aliases (for states where nickname differs from postal code)
const stateAliases: Record<string, string[]> = {
  'DC': ['Washington DC', 'District of Columbia'],
};

// Define totals for all distinct categories
const categoryTotals: Record<Category, number> = {
  countries: countries.length,
  states: usStates.length,
  nationalParks: nationalParks.length,
  stateParks: stateParks.length,
  unesco: unescoSites.length,
  fiveKPeaks: get5000mPeaks().length,
  fourteeners: getUS14ers().length,
  museums: museums.length,
  mlbStadiums: getMlbStadiums().length,
  nflStadiums: getNflStadiums().length,
  nbaStadiums: getNbaStadiums().length,
  nhlStadiums: getNhlStadiums().length,
  soccerStadiums: getSoccerStadiums().length,
  f1Tracks: f1Tracks.length,
  marathons: marathons.length,
};

export default function Home() {
  const [selections, setSelections] = useState<UserSelections>(emptySelections);
  const [activeCategory, setActiveCategory] = useState<Category>('countries');
  const [showShareCard, setShowShareCard] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user, signOut } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const handleCategoryChange = useCallback((category: Category) => {
    setActiveCategory(category);
  }, []);

  // Load selections from localStorage on mount
  useEffect(() => {
    const saved = loadSelections();
    setSelections(saved);
    setIsLoaded(true);
  }, []);

  // Save selections whenever they change
  useEffect(() => {
    if (isLoaded) {
      saveSelections(selections);
    }
  }, [selections, isLoaded]);

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

  // Mapping active category to actual data
  const currentItems = useMemo(() => {
    let items: { id: string; name: string; group: string; code?: string; aliases?: string[]; subcategory?: string }[] = [];

    switch (activeCategory) {
      case 'countries':
        items = countries.map(c => ({
          id: c.code,
          name: c.name,
          group: c.continent,
          code: c.code,
          aliases: countryAliases[c.code] || [],
        }));
        break;
      case 'states':
        items = usStates.map(s => ({
          id: s.code,
          name: s.name,
          group: s.region,
          code: s.code,
          aliases: stateAliases[s.code] || [],
        }));
        break;
      case 'nationalParks':
        items = nationalParks.map(p => ({
          id: p.id,
          name: p.name,
          group: p.region,
          subcategory: p.type,
        }));
        break;
      case 'stateParks':
        items = stateParks.map(p => ({
          id: p.id,
          name: `${p.name} - ${p.state}`,
          group: p.region,
        }));
        break;
      case 'unesco':
        items = unescoSites.map(u => ({
          id: u.id,
          name: u.name,
          group: u.country,
        }));
        break;
      case 'fiveKPeaks':
        items = get5000mPeaks().map(m => ({
          id: m.id,
          name: `${m.name} (${m.elevation.toLocaleString()}m)`,
          group: m.range,
        }));
        break;
      case 'fourteeners':
        items = getUS14ers().map(m => ({
          id: m.id,
          name: `${m.name} (${m.elevation.toLocaleString()}m)`,
          group: m.range,
        }));
        break;
      case 'museums':
        items = museums.map(m => ({
          id: m.id,
          name: `${m.name} - ${m.city}`,
          group: m.country,
        }));
        break;

      // Distinct Stadium Categories
      case 'mlbStadiums':
        items = getMlbStadiums().map(s => ({
          id: s.id,
          name: `${s.name} - ${s.city}`,
          group: s.team || s.city,
        }));
        break;
      case 'nflStadiums':
        items = getNflStadiums().map(s => ({
          id: s.id,
          name: `${s.name} - ${s.city}`,
          group: s.team || s.city,
        }));
        break;
      case 'nbaStadiums':
        items = getNbaStadiums().map(s => ({
          id: s.id,
          name: `${s.name} - ${s.city}`,
          group: s.team || s.city,
        }));
        break;
      case 'nhlStadiums':
        items = getNhlStadiums().map(s => ({
          id: s.id,
          name: `${s.name} - ${s.city}`,
          group: s.team || s.city,
        }));
        break;
      case 'soccerStadiums':
        items = getSoccerStadiums().map(s => ({
          id: s.id,
          name: `${s.name} - ${s.city}`,
          group: s.country,
        }));
        break;

      case 'f1Tracks':
        items = f1Tracks.map(t => ({
          id: t.id,
          name: `${t.name} - ${t.circuit}`,
          group: t.country,
        }));
        break;
      case 'marathons':
        items = marathons.map(m => ({
          id: m.id,
          name: `${m.name} (${m.month})`,
          group: m.country,
        }));
        break;
      default:
        items = [];
    }

    return items;
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

  const categoryTitles: Record<Category, string> = {
    countries: 'Countries of the World',
    states: 'US States & Territories',
    nationalParks: 'National Parks',
    stateParks: 'State Parks',
    unesco: 'UNESCO World Heritage Sites',
    fiveKPeaks: '5000m+ Mountain Peaks',
    fourteeners: 'US 14ers (14,000+ ft)',
    museums: 'Famous Museums',
    mlbStadiums: 'MLB Stadiums',
    nflStadiums: 'NFL Stadiums',
    nbaStadiums: 'NBA Arenas',
    nhlStadiums: 'NHL Arenas',
    soccerStadiums: 'Soccer Stadiums',
    f1Tracks: 'Formula 1 Race Tracks',
    marathons: 'World Marathon Majors',
  };

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
        <footer className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
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
          <p className="mt-3">
            <Link href="/about" className="text-blue-600 dark:text-blue-400 hover:underline">
              About See Every Place
            </Link>
          </p>
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
