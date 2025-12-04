'use client';

import { useState, useRef, useEffect } from 'react';
import { Category, categoryLabels, categoryIcons, usParksSubcategories, subcategoryLabels } from '@/lib/types';

interface CategoryTabsProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
  stats: Record<Category, { visited: number; total: number }>;
}

// Top-level categories (without stateParks, using usParks as parent for park categories)
const topLevelCategories: (Category | 'usParks')[] = ['countries', 'states', 'usParks', 'unesco', 'mountains', 'museums', 'stadiums', 'marathons'];

export default function CategoryTabs({ activeCategory, onCategoryChange, stats }: CategoryTabsProps) {
  const [showUsParksDropdown, setShowUsParksDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check if active category is a US Parks subcategory
  const isUsParksActive = usParksSubcategories.includes(activeCategory);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUsParksDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate combined US Parks stats
  const usParksStats = {
    visited: stats.nationalParks.visited + stats.stateParks.visited,
    total: stats.nationalParks.total + stats.stateParks.total,
  };

  return (
    <div className="space-y-3">
      {/* Main category tabs */}
      <div className="w-full overflow-x-auto pb-2">
        <div className="flex gap-2 min-w-max px-1">
          {topLevelCategories.map((category) => {
            // Special handling for US Parks parent category
            if (category === 'usParks') {
              const isActive = isUsParksActive;

              return (
                <div key="usParks" className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowUsParksDropdown(!showUsParksDropdown)}
                    className={`
                      flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200
                      ${isActive
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                        : 'bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-600 hover:shadow-md border border-gray-200 dark:border-gray-600'
                      }
                    `}
                  >
                    <span className="text-lg flex items-center justify-center">🏞️</span>
                    <span className="hidden sm:inline">US Parks</span>
                    {usParksStats.visited > 0 && (
                      <span className={`
                        px-2 py-0.5 rounded-full text-xs font-bold
                        ${isActive ? 'bg-white/20' : 'bg-green-100 text-green-700'}
                      `}>
                        {usParksStats.visited}
                      </span>
                    )}
                    <svg
                      className={`w-4 h-4 transition-transform ${showUsParksDropdown ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown for subcategories */}
                  {showUsParksDropdown && (
                    <div className="absolute bottom-full left-0 mb-2 sm:bottom-auto sm:top-full sm:mb-0 sm:mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50 min-w-[180px]">
                      {usParksSubcategories.map((subcat) => {
                        const subStat = stats[subcat];
                        const isSubActive = activeCategory === subcat;

                        return (
                          <button
                            key={subcat}
                            onClick={() => {
                              onCategoryChange(subcat);
                              setShowUsParksDropdown(false);
                            }}
                            className={`
                              w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                              ${isSubActive
                                ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                              }
                            `}
                          >
                            <span className="text-lg">{categoryIcons[subcat]}</span>
                            <span className="flex-1">{subcategoryLabels[subcat]}</span>
                            {subStat.visited > 0 && (
                              <span className={`
                                px-2 py-0.5 rounded-full text-xs font-bold
                                ${isSubActive ? 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200' : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'}
                              `}>
                                {subStat.visited}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // Regular category handling
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

      {/* Subcategory tabs - shown when US Parks is active */}
      {isUsParksActive && (
        <div className="flex gap-2 px-1">
          {usParksSubcategories.map((subcat) => {
            const isSubActive = activeCategory === subcat;
            const subStat = stats[subcat];

            return (
              <button
                key={subcat}
                onClick={() => onCategoryChange(subcat)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                  ${isSubActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }
                `}
              >
                <span>{categoryIcons[subcat]}</span>
                <span>{subcategoryLabels[subcat]}</span>
                <span className={`
                  px-2 py-0.5 rounded-full text-xs font-bold
                  ${isSubActive ? 'bg-white/20' : 'bg-gray-100 text-gray-600'}
                `}>
                  {subStat.total}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
