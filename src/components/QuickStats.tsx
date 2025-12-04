'use client';

import { ReactNode } from 'react';
import { Category, categoryLabels, categoryIcons, UserSelections } from '@/lib/types';
import { getStats } from '@/lib/storage';
import { countries } from '@/data/countries';
import { usStates } from '@/data/usStates';
import { nationalParks } from '@/data/nationalParks';
import { stateParks } from '@/data/stateParks';
import { unescoSites } from '@/data/unescoSites';
import { mountains } from '@/data/mountains';
import { museums } from '@/data/museums';
import { stadiums } from '@/data/stadiums';
import { marathons } from '@/data/marathons';

interface QuickStatsProps {
  selections: UserSelections;
  onCategoryClick: (category: Category) => void;
}

const categoryTotals: Record<Category, number> = {
  countries: countries.length,
  states: usStates.length,
  nationalParks: nationalParks.length,
  stateParks: stateParks.length,
  unesco: unescoSites.length,
  mountains: mountains.length,
  museums: museums.length,
  stadiums: stadiums.length,
  marathons: marathons.length,
};

// Top-level display categories (US Parks combines nationalParks and stateParks)
type DisplayCategory = Category | 'usParks';
const displayCategories: DisplayCategory[] = ['countries', 'states', 'usParks', 'unesco', 'mountains', 'museums', 'stadiums', 'marathons'];

export default function QuickStats({ selections, onCategoryClick }: QuickStatsProps) {
  // All actual data categories for calculating total
  const allCategories: Category[] = ['countries', 'states', 'nationalParks', 'stateParks', 'unesco', 'mountains', 'museums', 'stadiums', 'marathons'];

  const totalVisited = allCategories.reduce((sum, cat) => {
    return sum + getStats(selections, cat, categoryTotals[cat]).visited;
  }, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">Your Travel Stats</h2>
        <div className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-full">
          <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {totalVisited} places visited
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {displayCategories.map((displayCategory) => {
          let stats: { visited: number; total: number; bucketList: number; percentage: number };
          let icon: ReactNode;
          let label: string;
          let clickCategory: Category;

          // Special handling for US Parks (combined category)
          if (displayCategory === 'usParks') {
            const nationalStats = getStats(selections, 'nationalParks', categoryTotals.nationalParks);
            const stateStats = getStats(selections, 'stateParks', categoryTotals.stateParks);
            const combinedVisited = nationalStats.visited + stateStats.visited;
            const combinedTotal = nationalStats.total + stateStats.total;
            const combinedBucketList = nationalStats.bucketList + stateStats.bucketList;
            const combinedPercentage = combinedTotal > 0 ? Math.round((combinedVisited / combinedTotal) * 100) : 0;
            stats = { visited: combinedVisited, total: combinedTotal, bucketList: combinedBucketList, percentage: combinedPercentage };
            icon = '🏞️';
            label = 'US Parks';
            clickCategory = 'nationalParks';
          } else {
            const category = displayCategory as Category;
            stats = getStats(selections, category, categoryTotals[category]);
            icon = categoryIcons[category];
            label = categoryLabels[category];
            clickCategory = category;
          }

          const progressWidth = `${stats.percentage}%`;

          return (
            <button
              key={displayCategory}
              onClick={() => onCategoryClick(clickCategory)}
              className="text-left p-4 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all group border border-transparent hover:border-gray-200 dark:hover:border-gray-500"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{icon}</span>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {label}
                </span>
              </div>

              <div className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                {stats.visited}
                <span className="text-base font-normal text-gray-400 dark:text-gray-500">/{stats.total}</span>
              </div>

              <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-500"
                  style={{ width: progressWidth }}
                />
              </div>

              {stats.bucketList > 0 && (
                <div className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                  ★ {stats.bucketList} on bucket list
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
