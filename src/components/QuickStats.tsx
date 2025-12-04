'use client';

import { Category, categoryLabels, categoryIcons, UserSelections, usParksSubcategories, subcategoryLabels } from '@/lib/types';
import { getStats } from '@/lib/storage';
import { countries } from '@/data/countries';
import { usStates } from '@/data/usStates';
import { nationalParks } from '@/data/nationalParks';
import { stateParks } from '@/data/stateParks';
import { unescoSites } from '@/data/unescoSites';
import { mountains, get5000mPeaks, getUS14ers } from '@/data/mountains';
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

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {displayCategories.map((displayCategory) => {
          // Special handling for US Parks (combined category)
          if (displayCategory === 'usParks') {
            const nationalStats = getStats(selections, 'nationalParks', categoryTotals.nationalParks);
            const stateStats = getStats(selections, 'stateParks', categoryTotals.stateParks);
            const combinedVisited = nationalStats.visited + stateStats.visited;
            const combinedTotal = nationalStats.total + stateStats.total;
            const combinedBucketList = nationalStats.bucketList + stateStats.bucketList;
            const combinedPercentage = combinedTotal > 0 ? Math.round((combinedVisited / combinedTotal) * 100) : 0;
            const progressWidth = `${combinedPercentage}%`;

            return (
              <button
                key="usParks"
                onClick={() => onCategoryClick('nationalParks')}
                className="text-left p-3 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl flex items-center justify-center">🏞️</span>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate">
                    US Parks
                  </span>
                </div>

                <div className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                  {combinedVisited}
                  <span className="text-sm font-normal text-gray-400 dark:text-gray-500">/{combinedTotal}</span>
                </div>

                <div className="h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-500"
                    style={{ width: progressWidth }}
                  />
                </div>

                {combinedBucketList > 0 && (
                  <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    ★ {combinedBucketList} planned
                  </div>
                )}

                {/* Subcategory breakdown */}
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>{subcategoryLabels.nationalParks}</span>
                    <span>{nationalStats.visited}/{nationalStats.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{subcategoryLabels.stateParks}</span>
                    <span>{stateStats.visited}/{stateStats.total}</span>
                  </div>
                </div>
              </button>
            );
          }

          // Special handling for Stadiums (show sport breakdown)
          if (displayCategory === 'stadiums') {
            const stats = getStats(selections, 'stadiums', categoryTotals.stadiums);
            const progressWidth = `${stats.percentage}%`;

            // Calculate stats for each sport
            const sportBreakdown = [
              { name: 'Baseball', sport: 'Baseball' },
              { name: 'Football', sport: 'American Football' },
              { name: 'Basketball', sport: 'Basketball' },
              { name: 'Hockey', sport: 'Hockey' },
              { name: 'Soccer', sport: 'Football' },
            ].map(({ name, sport }) => {
              const sportStadiums = stadiums.filter(s => s.sport === sport);
              const sportTotal = sportStadiums.length;
              const sportVisited = selections.stadiums.filter(
                sel => sel.status === 'visited' && sportStadiums.some(s => s.id === sel.id)
              ).length;
              return { name, visited: sportVisited, total: sportTotal };
            });

            return (
              <button
                key="stadiums"
                onClick={() => onCategoryClick('stadiums')}
                className="text-left p-3 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl flex items-center justify-center">{categoryIcons.stadiums}</span>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate">
                    {categoryLabels.stadiums}
                  </span>
                </div>

                <div className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                  {stats.visited}
                  <span className="text-sm font-normal text-gray-400 dark:text-gray-500">/{stats.total}</span>
                </div>

                <div className="h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-500"
                    style={{ width: progressWidth }}
                  />
                </div>

                {stats.bucketList > 0 && (
                  <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    ★ {stats.bucketList} planned
                  </div>
                )}

                {/* Sport breakdown */}
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600 text-xs text-gray-500 dark:text-gray-400">
                  {sportBreakdown.map(({ name, visited, total }) => (
                    <div key={name} className="flex justify-between">
                      <span>{name}</span>
                      <span>{visited}/{total}</span>
                    </div>
                  ))}
                </div>
              </button>
            );
          }

          // Special handling for Peaks (show subcategory breakdown)
          if (displayCategory === 'mountains') {
            const stats = getStats(selections, 'mountains', categoryTotals.mountains);
            const progressWidth = `${stats.percentage}%`;

            // Calculate stats for each peak subcategory
            const peaks5000m = get5000mPeaks();
            const us14ers = getUS14ers();

            const peaks5000mVisited = selections.mountains.filter(
              sel => sel.status === 'visited' && peaks5000m.some(m => m.id === sel.id)
            ).length;

            const us14ersVisited = selections.mountains.filter(
              sel => sel.status === 'visited' && us14ers.some(m => m.id === sel.id)
            ).length;

            return (
              <button
                key="mountains"
                onClick={() => onCategoryClick('mountains')}
                className="text-left p-3 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl flex items-center justify-center">{categoryIcons.mountains}</span>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate">
                    {categoryLabels.mountains}
                  </span>
                </div>

                <div className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                  {stats.visited}
                  <span className="text-sm font-normal text-gray-400 dark:text-gray-500">/{stats.total}</span>
                </div>

                <div className="h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-500"
                    style={{ width: progressWidth }}
                  />
                </div>

                {stats.bucketList > 0 && (
                  <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    ★ {stats.bucketList} planned
                  </div>
                )}

                {/* Peak subcategory breakdown */}
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>5000m+</span>
                    <span>{peaks5000mVisited}/{peaks5000m.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>US 14ers</span>
                    <span>{us14ersVisited}/{us14ers.length}</span>
                  </div>
                </div>
              </button>
            );
          }

          // Regular category handling
          const category = displayCategory as Category;
          const stats = getStats(selections, category, categoryTotals[category]);
          const progressWidth = `${stats.percentage}%`;

          return (
            <button
              key={category}
              onClick={() => onCategoryClick(category)}
              className="text-left p-3 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all group"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl flex items-center justify-center">{categoryIcons[category]}</span>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate">
                  {categoryLabels[category]}
                </span>
              </div>

              <div className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                {stats.visited}
                <span className="text-sm font-normal text-gray-400 dark:text-gray-500">/{stats.total}</span>
              </div>

              <div className="h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-500"
                  style={{ width: progressWidth }}
                />
              </div>

              {stats.bucketList > 0 && (
                <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  ★ {stats.bucketList} planned
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
