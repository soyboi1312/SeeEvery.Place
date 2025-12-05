'use client';

import { Category, categoryLabels, categoryIcons } from '@/lib/types';

interface CategoryTabsProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
  stats: Record<Category, { visited: number; total: number }>;
}

// Top-level categories for the main tab bar
const topLevelCategories: Category[] = ['countries', 'states', 'nationalParks', 'stateParks', 'unesco', 'fiveKPeaks', 'fourteeners', 'museums', 'mlbStadiums', 'nflStadiums', 'nbaStadiums', 'nhlStadiums', 'soccerStadiums', 'f1Tracks', 'marathons'];

export default function CategoryTabs({ activeCategory, onCategoryChange, stats }: CategoryTabsProps) {
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
    </div>
  );
}
