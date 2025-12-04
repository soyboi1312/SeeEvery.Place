'use client';

import { Category, categoryLabels, categoryIcons, UserSelections } from '@/lib/types';
import { get5000mPeaks, getUS14ers } from '@/data/mountains';
import { stadiums } from '@/data/stadiums';

interface CategoryTabsProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
  stats: Record<Category, { visited: number; total: number }>;
  activeSubcategory: string;
  onSubcategoryChange: (subcategory: string) => void;
  selections: UserSelections;
}

// Top-level categories for the main tab bar
const topLevelCategories: Category[] = ['countries', 'states', 'nationalParks', 'stateParks', 'unesco', 'mountains', 'museums', 'stadiums', 'marathons'];

// Subcategories for peaks
const peakSubcategories = [
  { id: '5000m+', label: '5000m+', icon: '🏔️' },
  { id: 'US 14ers', label: 'US 14ers', icon: '🇺🇸' },
];

// Subcategories for stadiums
const stadiumSubcategories = [
  { id: 'Baseball', label: 'Baseball', icon: '⚾' },
  { id: 'American Football', label: 'Football', icon: '🏈' },
  { id: 'Basketball', label: 'Basketball', icon: '🏀' },
  { id: 'Hockey', label: 'Hockey', icon: '🏒' },
  { id: 'Football', label: 'Soccer', icon: '⚽' },
];

export default function CategoryTabs({ activeCategory, onCategoryChange, stats, activeSubcategory, onSubcategoryChange, selections }: CategoryTabsProps) {
  // Calculate peak subcategory stats
  const peaks5000m = get5000mPeaks();
  const us14ers = getUS14ers();
  const peaks5000mVisited = selections.mountains.filter(
    sel => sel.status === 'visited' && peaks5000m.some(m => m.id === sel.id)
  ).length;
  const us14ersVisited = selections.mountains.filter(
    sel => sel.status === 'visited' && us14ers.some(m => m.id === sel.id)
  ).length;

  const peakStats: Record<string, { visited: number; total: number }> = {
    '5000m+': { visited: peaks5000mVisited, total: peaks5000m.length },
    'US 14ers': { visited: us14ersVisited, total: us14ers.length },
  };

  // Calculate stadium subcategory stats
  const getStadiumStats = (sport: string) => {
    const sportStadiums = stadiums.filter(s => s.sport === sport);
    const visited = selections.stadiums.filter(
      sel => sel.status === 'visited' && sportStadiums.some(s => s.id === sel.id)
    ).length;
    return { visited, total: sportStadiums.length };
  };

  const stadiumStats: Record<string, { visited: number; total: number }> = {
    'Baseball': getStadiumStats('Baseball'),
    'American Football': getStadiumStats('American Football'),
    'Basketball': getStadiumStats('Basketball'),
    'Hockey': getStadiumStats('Hockey'),
    'Football': getStadiumStats('Football'),
  };

  return (
    <div className="space-y-3">
      <div className="w-full overflow-x-auto pb-2">
        <div className="flex gap-2 min-w-max px-1">
          {topLevelCategories.map((category) => {
            const isActive = category === activeCategory;
            const stat = stats[category];

            return (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`
                  flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-600 hover:shadow-md border border-gray-200 dark:border-gray-600'
                  }
                `}
              >
                <span className="text-lg flex items-center justify-center">{categoryIcons[category]}</span>
                <span className="hidden sm:inline">{categoryLabels[category]}</span>
                {stat.visited > 0 && (
                  <span className={`
                    px-2 py-0.5 rounded-full text-xs font-bold
                    ${isActive ? 'bg-white/20' : 'bg-green-100 text-green-700'}
                  `}>
                    {stat.visited}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Peak subcategory tabs */}
      {activeCategory === 'mountains' && (
        <div className="flex gap-2 px-1 flex-wrap">
          {peakSubcategories.map((sub) => {
            const isSubActive = activeSubcategory === sub.id;
            const subStat = peakStats[sub.id];

            return (
              <button
                key={sub.id}
                onClick={() => onSubcategoryChange(sub.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                  ${isSubActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                  }
                `}
              >
                <span>{sub.icon}</span>
                <span>{sub.label}</span>
                <span className={`
                  px-2 py-0.5 rounded-full text-xs font-bold
                  ${isSubActive ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300'}
                `}>
                  {subStat.visited}/{subStat.total}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Stadium subcategory tabs */}
      {activeCategory === 'stadiums' && (
        <div className="flex gap-2 px-1 flex-wrap">
          {stadiumSubcategories.map((sub) => {
            const isSubActive = activeSubcategory === sub.id;
            const subStat = stadiumStats[sub.id];

            return (
              <button
                key={sub.id}
                onClick={() => onSubcategoryChange(sub.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                  ${isSubActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                  }
                `}
              >
                <span>{sub.icon}</span>
                <span>{sub.label}</span>
                <span className={`
                  px-2 py-0.5 rounded-full text-xs font-bold
                  ${isSubActive ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300'}
                `}>
                  {subStat.visited}/{subStat.total}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
