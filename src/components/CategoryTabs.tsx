'use client';

import { useState, useEffect } from 'react';
import { Category, categoryLabels, categoryIcons, categoryGroups, getGroupForCategory, CategoryGroup } from '@/lib/types';

interface CategoryTabsProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
  stats: Record<Category, { visited: number; total: number }>;
}

export default function CategoryTabs({ activeCategory, onCategoryChange, stats }: CategoryTabsProps) {
  // Initialize with the group of the currently active category
  const [activeGroup, setActiveGroup] = useState<CategoryGroup>(() => getGroupForCategory(activeCategory));

  // Sync group if activeCategory changes externally (e.g. from URL)
  useEffect(() => {
    setActiveGroup(getGroupForCategory(activeCategory));
  }, [activeCategory]);

  return (
    <div className="space-y-4">
      {/* Level 1: Meta-Groups (The Vibe) */}
      <div className="flex justify-center">
        <div className="inline-flex bg-white dark:bg-gray-800 p-1.5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          {(Object.keys(categoryGroups) as CategoryGroup[]).map((group) => {
            const isActive = group === activeGroup;
            const config = categoryGroups[group];

            return (
              <button
                key={group}
                onClick={() => {
                  setActiveGroup(group);
                  // Select first category in group immediately
                  onCategoryChange(config.categories[0]);
                }}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200
                  ${isActive
                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-md'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }
                `}
              >
                <span>{config.icon}</span>
                <span className="hidden sm:inline">{config.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Level 2: Specific Categories (The Pills) */}
      <div className="w-full overflow-x-auto no-scrollbar py-2">
        <div className="flex justify-start sm:justify-center gap-3 min-w-max px-4">
          {categoryGroups[activeGroup].categories.map((category) => {
            const isActive = category === activeCategory;
            const stat = stats[category];
            const percentage = stat.total > 0 ? (stat.visited / stat.total) * 100 : 0;

            return (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`
                  relative flex flex-col items-center gap-1 px-5 py-3 rounded-2xl transition-all duration-200 border min-w-[100px]
                  ${isActive
                    ? 'border-blue-500/30 bg-blue-50/50 dark:bg-blue-900/20 dark:border-blue-500/50 shadow-sm transform scale-105'
                    : 'border-transparent bg-white dark:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-sm'
                  }
                `}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{categoryIcons[category]}</span>
                </div>
                <span className={`text-sm font-medium ${isActive ? 'text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  {categoryLabels[category]}
                </span>

                {/* Mini Progress Bar */}
                <div className="w-full flex items-center gap-2 mt-auto pt-1">
                  <div className="h-1.5 flex-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isActive ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                      style={{ width: `${Math.max(5, percentage)}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-gray-400 tabular-nums">
                    {stat.visited}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
