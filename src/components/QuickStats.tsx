'use client';

import { Category, UserSelections } from '@/lib/types';
import { getStats } from '@/lib/storage';
// Data imports for totals
import { countries } from '@/data/countries';
import { usStates } from '@/data/usStates';
import { nationalParks } from '@/data/nationalParks';
import { stateParks } from '@/data/stateParks';
import { unescoSites } from '@/data/unescoSites';
import { get5000mPeaks, getUS14ers } from '@/data/mountains';
import { museums } from '@/data/museums';
import { getMlbStadiums, getNflStadiums, getNbaStadiums, getNhlStadiums, getSoccerStadiums } from '@/data/stadiums';
import { f1Tracks } from '@/data/f1Tracks';
import { marathons } from '@/data/marathons';

interface QuickStatsProps {
  selections: UserSelections;
  onCategoryClick: (category: Category) => void;
}

// Categories that are "Points of Interest" (everything except countries and states)
const markerCategories: Category[] = [
  'nationalParks', 'stateParks', 'unesco', 'fiveKPeaks',
  'fourteeners', 'museums', 'mlbStadiums', 'nflStadiums',
  'nbaStadiums', 'nhlStadiums', 'soccerStadiums', 'f1Tracks', 'marathons'
];

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

export default function QuickStats({ selections, onCategoryClick }: QuickStatsProps) {

  // Helper to get stats for a specific category
  const getCatStats = (cat: Category) => getStats(selections, cat, categoryTotals[cat]);

  // Calculate Aggregates
  const countryStats = getCatStats('countries');
  const stateStats = getCatStats('states');

  const markersStats = markerCategories.reduce((acc, cat) => {
    const stat = getCatStats(cat);
    return {
      visited: acc.visited + stat.visited,
      total: acc.total + stat.total,
    };
  }, { visited: 0, total: 0 });

  const markersPercentage = Math.round((markersStats.visited / markersStats.total) * 100) || 0;

  // Render only the "Big 3" Cards
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

      {/* Card 1: Countries */}
      <button
        onClick={() => onCategoryClick('countries')}
        className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all text-left group"
      >
        <div className="flex justify-between items-start mb-2">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-2xl">🌍</div>
          <span className="text-xs font-bold px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500">
            {countryStats.percentage}%
          </span>
        </div>
        <h3 className="text-gray-500 dark:text-gray-400 font-medium text-sm">Countries Visited</h3>
        <div className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
          {countryStats.visited}
          <span className="text-lg text-gray-300 dark:text-gray-600 font-normal">/{countryStats.total}</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full mt-3 overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${countryStats.percentage}%` }} />
        </div>
      </button>

      {/* Card 2: US States */}
      <button
        onClick={() => onCategoryClick('states')}
        className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all text-left group"
      >
        <div className="flex justify-between items-start mb-2">
          <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-2xl">🇺🇸</div>
          <span className="text-xs font-bold px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500">
            {stateStats.percentage}%
          </span>
        </div>
        <h3 className="text-gray-500 dark:text-gray-400 font-medium text-sm">States Visited</h3>
        <div className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
          {stateStats.visited}
          <span className="text-lg text-gray-300 dark:text-gray-600 font-normal">/{stateStats.total}</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full mt-3 overflow-hidden">
          <div className="h-full bg-purple-500 rounded-full" style={{ width: `${stateStats.percentage}%` }} />
        </div>
      </button>

      {/* Card 3: Points of Interest (Aggregate) */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-left">
        <div className="flex justify-between items-start mb-2">
          <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-2xl">📍</div>
          <span className="text-xs font-bold px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500">
            {markersPercentage}%
          </span>
        </div>
        <h3 className="text-gray-500 dark:text-gray-400 font-medium text-sm">Points of Interest</h3>
        <div className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
          {markersStats.visited}
          <span className="text-lg text-gray-300 dark:text-gray-600 font-normal">/{markersStats.total}</span>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Parks, Stadiums, Landmarks & more
        </p>
      </div>

    </div>
  );
}
