'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Tooltip } from 'react-tooltip';
import { useDarkMode } from '@/lib/hooks/useDarkMode';
import { categoryLabels, ALL_CATEGORIES, Category } from '@/lib/types';
import { AnalyticsUSMap, AnalyticsWorldMap, HeatmapLegend } from './AnalyticsMaps';
import { lookupPlace, PlaceDetails } from './placeLookup';

// CSV Export utility function
function exportToCSV(data: Record<string, unknown>[], filename: string) {
  if (!data || data.length === 0) return;

  // Get headers from first object
  const headers = Object.keys(data[0]);

  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        // Handle strings with commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? '';
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

interface CategoryStat {
  category: string;
  usersTracking: number;
  avgVisited: number;
  avgBucketList: number;
  maxVisited: number;
  totalVisited: number;
}

interface PopularItem {
  id: string;
  timesVisited: number;
  timesBucketListed: number;
}

interface AnalyticsData {
  overview: {
    totalUsers: number;
    usersWithSelections: number;
    usersTrackingStates: number;
    usersTrackingCountries: number;
  };
  categoryStats: CategoryStat[];
  popularStates: PopularItem[];
  popularCountries: PopularItem[];
  popularItems: Record<string, PopularItem[]>;
  timeframe: string;
  timeframeLabel: string;
}

type ViewMode = 'top' | 'bottom' | 'zero';
type Timeframe = 'allTime' | 'last7Days' | 'last30Days' | 'previousMonth';

// US state abbreviation to full name mapping
const stateNames: Record<string, string> = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
  'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
  'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
  'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
  'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
  'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
  'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
  'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
  'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
  'DC': 'Washington D.C.'
};

export default function AnalyticsDashboard() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>('nationalParks');
  const [viewMode, setViewMode] = useState<ViewMode>('top');
  const [timeframe, setTimeframe] = useState<Timeframe>('allTime');
  const [selectedPlace, setSelectedPlace] = useState<PlaceDetails | null>(null);

  // Handle place click to show details
  const handlePlaceClick = useCallback((category: Category, id: string) => {
    const details = lookupPlace(category, id);
    setSelectedPlace(details);
  }, []);

  // Get items based on view mode
  const getFilteredItems = (items: PopularItem[]): PopularItem[] => {
    if (viewMode === 'top') {
      return items.slice(0, 10);
    } else if (viewMode === 'bottom') {
      // Get items with at least 1 visit, sorted ascending
      return items.filter(i => i.timesVisited > 0).sort((a, b) => a.timesVisited - b.timesVisited).slice(0, 10);
    } else {
      // Zero visits - items only on bucket lists (visited = 0)
      return items.filter(i => i.timesVisited === 0 && i.timesBucketListed > 0).slice(0, 20);
    }
  };

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      try {
        const response = await fetch(`/api/admin/analytics?timeframe=${timeframe}`);
        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }
        const analyticsData = await response.json();
        setData(analyticsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [timeframe]);

  const getCategoryLabel = (category: string): string => {
    return categoryLabels[category as keyof typeof categoryLabels] || category;
  };

  const getStateName = (abbr: string): string => {
    return stateNames[abbr] || abbr;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-black/5 dark:border-white/10 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 transition-transform group-hover:scale-110 duration-200">
              <Image src="/logo.svg" alt="See Every Place Logo" fill className="object-contain" priority />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-primary-900 dark:text-white leading-none">
                SeeEvery<span className="text-accent-500">.</span>Place<span className="text-[10px] align-super text-primary-400">TM</span>
              </h1>
              <span className="text-[10px] text-primary-500 dark:text-primary-400 font-medium tracking-wider uppercase">
                Admin Analytics
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-primary-50 dark:bg-slate-800 text-primary-600 dark:text-primary-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <Link
              href="/admin/suggestions"
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-sm"
            >
              Suggestions
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary-900 dark:text-white mb-2">User Analytics</h1>
            <p className="text-primary-600 dark:text-primary-300">
              Insights into how users are tracking their travels.
            </p>
          </div>
          {/* Timeframe Selector and Export */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-primary-600 dark:text-primary-300">Timeframe:</label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as Timeframe)}
              className="px-3 py-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm font-medium text-primary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="allTime">All Time</option>
              <option value="last7Days">Last 7 Days</option>
              <option value="last30Days">Last 30 Days</option>
              <option value="previousMonth">Previous Month</option>
            </select>
            {data && (
              <button
                onClick={() => {
                  // Export category stats
                  const categoryData = data.categoryStats.map(stat => ({
                    Category: getCategoryLabel(stat.category),
                    'Users Tracking': stat.usersTracking,
                    'Avg Visited': stat.avgVisited.toFixed(1),
                    'Avg Bucket List': stat.avgBucketList.toFixed(1),
                    'Max Visited': stat.maxVisited,
                    'Total Visits': stat.totalVisited,
                  }));
                  exportToCSV(categoryData, `analytics_categories_${timeframe}`);
                }}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
                title="Export analytics to CSV"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
            {error}
          </div>
        )}

        {data && (
          <div className="space-y-8">
            {/* Overview Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Users"
                value={data.overview.totalUsers}
                icon="👥"
              />
              <StatCard
                title="Active Users"
                value={data.overview.usersWithSelections}
                subtitle={`${data.overview.totalUsers > 0 ? Math.round((data.overview.usersWithSelections / data.overview.totalUsers) * 100) : 0}% of total`}
                icon="📊"
              />
              <StatCard
                title="Tracking States"
                value={data.overview.usersTrackingStates}
                icon="🇺🇸"
              />
              <StatCard
                title="Tracking Countries"
                value={data.overview.usersTrackingCountries}
                icon="🌍"
              />
            </div>

            {/* Category Stats Table */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-premium border border-black/5 dark:border-white/10 overflow-hidden">
              <div className="p-5 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-bold text-primary-900 dark:text-white">Category Statistics</h2>
                <p className="text-sm text-primary-600 dark:text-primary-300 mt-1">
                  Breakdown by category for users who have tracked at least one item
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-slate-700/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Users</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Avg Visited</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Avg Bucket List</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Max Visited</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Visits</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {data.categoryStats.map((stat) => (
                      <tr key={stat.category} className="hover:bg-gray-50 dark:hover:bg-slate-700/30">
                        <td className="px-4 py-3 text-sm font-medium text-primary-900 dark:text-white">
                          {getCategoryLabel(stat.category)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-600 dark:text-gray-300">
                          {stat.usersTracking}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-green-600 dark:text-green-400 font-medium">
                          {stat.avgVisited.toFixed(1)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-amber-600 dark:text-amber-400">
                          {stat.avgBucketList.toFixed(1)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-600 dark:text-gray-300">
                          {stat.maxVisited}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-600 dark:text-gray-300">
                          {stat.totalVisited}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {data.categoryStats.length === 0 && (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  No category data available yet.
                </div>
              )}
            </div>

            {/* Heatmaps Section */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* US Heatmap */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-premium border border-black/5 dark:border-white/10 overflow-hidden">
                <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-primary-900 dark:text-white flex items-center gap-2">
                    <span>🇺🇸</span> US Visitor Heatmap
                  </h2>
                  <HeatmapLegend
                    maxValue={Math.max(...data.popularStates.map(s => s.timesVisited), 1)}
                    isDarkMode={isDarkMode}
                  />
                </div>
                <div className="h-[280px] w-full p-2">
                  {data.popularStates.length > 0 ? (
                    <AnalyticsUSMap data={data.popularStates} isDarkMode={isDarkMode} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">No data</div>
                  )}
                </div>
              </div>

              {/* World Heatmap */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-premium border border-black/5 dark:border-white/10 overflow-hidden">
                <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-primary-900 dark:text-white flex items-center gap-2">
                    <span>🌍</span> Global Visitor Heatmap
                  </h2>
                  <HeatmapLegend
                    maxValue={Math.max(...data.popularCountries.map(c => c.timesVisited), 1)}
                    isDarkMode={isDarkMode}
                  />
                </div>
                <div className="h-[280px] w-full p-2">
                  {data.popularCountries.length > 0 ? (
                    <AnalyticsWorldMap data={data.popularCountries} isDarkMode={isDarkMode} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">No data</div>
                  )}
                </div>
              </div>
            </div>

            {/* Tooltip for heatmaps */}
            <Tooltip id="analytics-tooltip" />

            {/* Category Explorer - All Categories */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-premium border border-black/5 dark:border-white/10 overflow-hidden">
              <div className="p-5 border-b border-gray-100 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-xl font-bold text-primary-900 dark:text-white">Category Explorer</h2>
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Category Selector */}
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value as Category)}
                      className="px-3 py-2 bg-gray-100 dark:bg-slate-700 rounded-lg text-sm font-medium text-primary-900 dark:text-white border-0 focus:ring-2 focus:ring-primary-500"
                    >
                      {ALL_CATEGORIES.filter(cat => cat !== 'states' && cat !== 'countries').map(cat => (
                        <option key={cat} value={cat}>{getCategoryLabel(cat)}</option>
                      ))}
                    </select>
                    {/* View Mode Tabs */}
                    <div className="flex bg-gray-100 dark:bg-slate-700 rounded-lg p-1">
                      <button
                        onClick={() => setViewMode('top')}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                          viewMode === 'top'
                            ? 'bg-white dark:bg-slate-600 text-primary-900 dark:text-white shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-primary-900 dark:hover:text-white'
                        }`}
                      >
                        Top 10
                      </button>
                      <button
                        onClick={() => setViewMode('bottom')}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                          viewMode === 'bottom'
                            ? 'bg-white dark:bg-slate-600 text-primary-900 dark:text-white shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-primary-900 dark:hover:text-white'
                        }`}
                      >
                        Hidden Gems
                      </button>
                      <button
                        onClick={() => setViewMode('zero')}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                          viewMode === 'zero'
                            ? 'bg-white dark:bg-slate-600 text-primary-900 dark:text-white shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-primary-900 dark:hover:text-white'
                        }`}
                      >
                        Unvisited
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-primary-600 dark:text-primary-300 mt-2">
                  {viewMode === 'top' && 'Most visited places in this category'}
                  {viewMode === 'bottom' && 'Least visited places (hidden gems for newsletter challenges)'}
                  {viewMode === 'zero' && 'Places on bucket lists but never visited yet'}
                </p>
              </div>
              <div className="p-4">
                {data.popularItems && data.popularItems[selectedCategory] ? (
                  (() => {
                    const filteredItems = getFilteredItems(data.popularItems[selectedCategory]);
                    return filteredItems.length > 0 ? (
                      <div className="space-y-3">
                        {filteredItems.map((item, index) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                              viewMode === 'top' && index < 3
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                : viewMode === 'bottom'
                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                            }`}>
                              {index + 1}
                            </span>
                            <button
                              onClick={() => handlePlaceClick(selectedCategory, item.id)}
                              className="flex-1 text-sm font-medium text-primary-900 dark:text-white truncate text-left hover:text-primary-600 dark:hover:text-primary-400 hover:underline cursor-pointer"
                              title={`Click for details: ${item.id}`}
                            >
                              {item.id}
                            </button>
                            <span className="text-sm text-green-600 dark:text-green-400">
                              {item.timesVisited} visits
                            </span>
                            {item.timesBucketListed > 0 && (
                              <span className="text-xs text-amber-600 dark:text-amber-400">
                                +{item.timesBucketListed} bucket
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                        {viewMode === 'zero' ? 'No unvisited bucket list items in this category.' : 'No data available for this category yet.'}
                      </p>
                    );
                  })()
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No data available for this category yet.
                  </p>
                )}
              </div>
            </div>

            {/* Popular Items */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Popular States */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-premium border border-black/5 dark:border-white/10 overflow-hidden">
                <div className="p-5 border-b border-gray-100 dark:border-gray-700">
                  <h2 className="text-lg font-bold text-primary-900 dark:text-white flex items-center gap-2">
                    <span>🇺🇸</span> Top 10 States
                  </h2>
                </div>
                <div className="p-4">
                  {data.popularStates.length > 0 ? (
                    <div className="space-y-3">
                      {data.popularStates.slice(0, 10).map((item, index) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                            index < 3 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                          }`}>
                            {index + 1}
                          </span>
                          <span className="flex-1 text-sm font-medium text-primary-900 dark:text-white">
                            {getStateName(item.id)}
                          </span>
                          <span className="text-sm text-green-600 dark:text-green-400">
                            {item.timesVisited} visits
                          </span>
                          {item.timesBucketListed > 0 && (
                            <span className="text-xs text-amber-600 dark:text-amber-400">
                              +{item.timesBucketListed} bucket
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                      No state data available yet.
                    </p>
                  )}
                </div>
              </div>

              {/* Popular Countries */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-premium border border-black/5 dark:border-white/10 overflow-hidden">
                <div className="p-5 border-b border-gray-100 dark:border-gray-700">
                  <h2 className="text-lg font-bold text-primary-900 dark:text-white flex items-center gap-2">
                    <span>🌍</span> Top 10 Countries
                  </h2>
                </div>
                <div className="p-4">
                  {data.popularCountries.length > 0 ? (
                    <div className="space-y-3">
                      {data.popularCountries.slice(0, 10).map((item, index) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                            index < 3 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                          }`}>
                            {index + 1}
                          </span>
                          <span className="flex-1 text-sm font-medium text-primary-900 dark:text-white">
                            {item.id}
                          </span>
                          <span className="text-sm text-green-600 dark:text-green-400">
                            {item.timesVisited} visits
                          </span>
                          {item.timesBucketListed > 0 && (
                            <span className="text-xs text-amber-600 dark:text-amber-400">
                              +{item.timesBucketListed} bucket
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                      No country data available yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Place Details Modal */}
      {selectedPlace && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedPlace(null)}>
          <div
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-bold text-primary-900 dark:text-white">Place Details</h3>
              <button
                onClick={() => setSelectedPlace(null)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</p>
                <p className="text-lg font-bold text-primary-900 dark:text-white mt-1">{selectedPlace.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</p>
                <p className="text-sm font-mono text-primary-700 dark:text-primary-300 mt-1 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">
                  {selectedPlace.id}
                </p>
              </div>
              {selectedPlace.location && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</p>
                  <p className="text-sm text-primary-700 dark:text-primary-300 mt-1">{selectedPlace.location}</p>
                </div>
              )}
              {selectedPlace.type && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</p>
                  <p className="text-sm text-primary-700 dark:text-primary-300 mt-1">{selectedPlace.type}</p>
                </div>
              )}
              {selectedPlace.coordinates && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Coordinates</p>
                  <p className="text-sm font-mono text-primary-700 dark:text-primary-300 mt-1">
                    {selectedPlace.coordinates.lat.toFixed(4)}, {selectedPlace.coordinates.lng.toFixed(4)}
                  </p>
                </div>
              )}
            </div>
            <div className="p-5 border-t border-gray-100 dark:border-gray-700 flex gap-3">
              {selectedPlace.googleMapsUrl && (
                <a
                  href={selectedPlace.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium text-sm text-center hover:bg-primary-700 transition-colors"
                >
                  Open in Google Maps
                </a>
              )}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedPlace.name);
                }}
                className="px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-sm hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
              >
                Copy Name
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-black/5 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-primary-500 dark:text-primary-400">
          <p>Admin Panel - See Every Place</p>
        </div>
      </footer>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon: string;
}

function StatCard({ title, value, subtitle, icon }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-premium border border-black/5 dark:border-white/10">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-primary-600 dark:text-primary-300">{title}</p>
          <p className="text-3xl font-bold text-primary-900 dark:text-white mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  );
}
