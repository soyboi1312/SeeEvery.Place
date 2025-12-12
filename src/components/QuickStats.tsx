'use client';

import { useState, useEffect } from 'react';
import { Category, UserSelections, categoryGroups } from '@/lib/types';
import { getStats } from '@/lib/storage';
import { categoryTotals } from '@/lib/categoryUtils';

// Continent icons and colors
const continentConfig: Record<string, { icon: string; color: string; bgColor: string }> = {
  'Africa': { icon: '🌍', color: 'bg-amber-500', bgColor: 'bg-amber-50 dark:bg-amber-900/20' },
  'Asia': { icon: '🌏', color: 'bg-red-500', bgColor: 'bg-red-50 dark:bg-red-900/20' },
  'Europe': { icon: '🏰', color: 'bg-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
  'North America': { icon: '🗽', color: 'bg-green-500', bgColor: 'bg-green-50 dark:bg-green-900/20' },
  'South America': { icon: '🌴', color: 'bg-emerald-500', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20' },
  'Oceania': { icon: '🏝️', color: 'bg-cyan-500', bgColor: 'bg-cyan-50 dark:bg-cyan-900/20' },
};

interface QuickStatsProps {
  selections: UserSelections;
  onCategoryClick: (category: Category) => void;
}

// Derive "Points of Interest" categories dynamically from categoryGroups
// (everything except countries and states)
const markerCategories: Category[] = Object.values(categoryGroups)
  .flatMap(group => group.categories)
  .filter(cat => cat !== 'countries' && cat !== 'states');

interface ContinentStat {
  continent: string;
  visited: number;
  total: number;
  percentage: number;
}

export default function QuickStats({ selections, onCategoryClick }: QuickStatsProps) {
  const [showContinents, setShowContinents] = useState(false);
  const [continentStats, setContinentStats] = useState<ContinentStat[]>([]);
  const [isLoadingContinents, setIsLoadingContinents] = useState(false);

  // Helper to get stats for a specific category
  // Uses the categoryTotals proxy from categoryUtils which returns fallback numbers instantly
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

  // Lazy load continent data only when requested
  useEffect(() => {
    if (showContinents && continentStats.length === 0 && !isLoadingContinents) {
      setIsLoadingContinents(true);
      import('@/data/countries').then(({ continents, getCountriesByContinent }) => {
        const stats = continents.map(continent => {
          const continentCountries = getCountriesByContinent(continent);
          const countrySelections = selections.countries || [];
          const visitedInContinent = continentCountries.filter(c =>
            countrySelections.some(sel => sel.id === c.code && sel.status === 'visited')
          ).length;
          const total = continentCountries.length;
          const percentage = Math.round((visitedInContinent / total) * 100) || 0;
          return { continent, visited: visitedInContinent, total, percentage };
        });
        setContinentStats(stats);
        setIsLoadingContinents(false);
      });
    }
  }, [showContinents, continentStats.length, isLoadingContinents, selections.countries]);

  // Render only the "Big 3" Cards
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

      {/* Card 1: Countries with Continent Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-full">
        <button
          onClick={() => onCategoryClick('countries')}
          className="w-full p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all"
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

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setShowContinents(!showContinents)}
          className="w-full px-5 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700 flex items-center justify-center gap-1 transition-colors mt-auto"
        >
          {showContinents ? 'Hide' : 'Show'} by Continent
          <svg
            className={`w-4 h-4 transition-transform ${showContinents ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Continent Breakdown */}
        {showContinents && (
          <div className="px-4 pb-4 pt-2 border-t border-gray-100 dark:border-gray-700 space-y-2 bg-gray-50/50 dark:bg-gray-800/50">
            {isLoadingContinents ? (
              <div className="py-2 text-center text-xs text-gray-500">Loading data...</div>
            ) : (
              continentStats.map(({ continent, visited, total, percentage }) => {
                const config = continentConfig[continent];
                return (
                  <div key={continent} className="flex items-center gap-2">
                    <span className="text-sm w-5">{config?.icon || '🌐'}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="text-gray-600 dark:text-gray-400">{continent}</span>
                        <span className="text-gray-500 dark:text-gray-500 font-medium">{visited}/{total}</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${config?.color || 'bg-gray-400'}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Card 2: US States */}
      <button
        onClick={() => onCategoryClick('states')}
        className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all text-left group flex flex-col justify-start h-full"
      >
        <div className="w-full flex justify-between items-start mb-2">
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
      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-left flex flex-col justify-start h-full">
        <div className="w-full flex justify-between items-start mb-2">
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
