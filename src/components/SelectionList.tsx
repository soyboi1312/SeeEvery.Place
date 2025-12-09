'use client';

import { useState, useMemo } from 'react';
import { Status, Category } from '@/lib/types';

interface Item {
  id: string;
  name: string;
  group?: string;
  code?: string;
  aliases?: string[];
}

interface SelectionListProps {
  items: Item[];
  getStatus: (id: string) => Status;
  onToggle: (id: string, currentStatus: Status) => void;
  onSetStatus: (id: string, status: Status | null) => void;
  onClearAll?: () => void;
  groupBy?: 'group' | 'none';
  showSearch?: boolean;
  title: string;
  stats: { visited: number; bucketList: number; total: number; percentage: number };
  category?: Category;
}

// Empty state content by category
const emptyStateContent: Record<Category, { icon: string; title: string; subtitle: string }> = {
  countries: {
    icon: '🌍',
    title: 'Your World Map Awaits',
    subtitle: 'Tap any country on the map to mark it as visited and watch your journey unfold!',
  },
  states: {
    icon: '🇺🇸',
    title: 'Start Your American Adventure',
    subtitle: 'Click a state to mark it visited. Road trip across all 50 states!',
  },
  territories: {
    icon: '🏝️',
    title: 'Explore US Territories',
    subtitle: 'From Puerto Rico to Guam - discover America beyond the 50 states!',
  },
  usCities: {
    icon: '🏙️',
    title: 'Explore American Cities',
    subtitle: 'From New York to Los Angeles - track the major cities you\'ve visited!',
  },
  worldCities: {
    icon: '🌆',
    title: 'Discover World Cities',
    subtitle: 'From Tokyo to Paris - build your global city bucket list!',
  },
  nationalParks: {
    icon: '🏞️',
    title: 'Explore Nature\'s Wonders',
    subtitle: 'From Yellowstone to Yosemite - mark the parks you\'ve explored!',
  },
  nationalMonuments: {
    icon: '🗽',
    title: 'Monument Explorer',
    subtitle: 'From Devils Tower to the Statue of Liberty - discover America\'s protected landmarks!',
  },
  stateParks: {
    icon: '🌲',
    title: 'Discover Hidden Gems',
    subtitle: 'State parks offer incredible beauty. Start tracking your visits!',
  },
  fiveKPeaks: {
    icon: '🏔️',
    title: 'Conquer the Giants',
    subtitle: 'Track the world\'s highest peaks including the mighty 8000ers!',
  },
  fourteeners: {
    icon: '⛰️',
    title: 'Summit the 14ers',
    subtitle: 'Colorado\'s iconic peaks await. How many have you conquered?',
  },
  museums: {
    icon: '🎨',
    title: 'Culture Awaits',
    subtitle: 'From the Louvre to the Met - track your museum adventures!',
  },
  mlbStadiums: {
    icon: '⚾',
    title: 'Play Ball!',
    subtitle: 'Visit every MLB ballpark. Fenway to Dodger Stadium awaits!',
  },
  nflStadiums: {
    icon: '🏈',
    title: 'Gridiron Glory',
    subtitle: 'Experience the roar of NFL stadiums across America!',
  },
  nbaStadiums: {
    icon: '🏀',
    title: 'Nothing But Net',
    subtitle: 'From MSG to Crypto.com Arena - every court has a story!',
  },
  nhlStadiums: {
    icon: '🏒',
    title: 'Hit the Ice',
    subtitle: 'Track your visits to NHL arenas across North America!',
  },
  soccerStadiums: {
    icon: '⚽',
    title: 'The Beautiful Game',
    subtitle: 'Camp Nou, Old Trafford, Maracanã - legendary pitches await!',
  },
  f1Tracks: {
    icon: '🏎️',
    title: 'Start Your Engines',
    subtitle: 'Monaco, Silverstone, Monza - experience F1 circuits worldwide!',
  },
  marathons: {
    icon: '🏃',
    title: 'Chase the Majors',
    subtitle: 'Track the World Marathon Majors. 42.195km of glory awaits!',
  },
  airports: {
    icon: '✈️',
    title: 'Jet Set Journey',
    subtitle: 'From JFK to Changi - track the world\'s greatest airports!',
  },
  skiResorts: {
    icon: '⛷️',
    title: 'Powder Paradise',
    subtitle: 'Whistler, Zermatt, Niseko - chase the perfect run worldwide!',
  },
  themeParks: {
    icon: '🎢',
    title: 'Thrill Seeker',
    subtitle: 'Disney, Universal, Europa-Park - where dreams come true!',
  },
  surfingReserves: {
    icon: '🌊',
    title: 'Ride the Wave',
    subtitle: 'Pipeline, Malibu, Teahupo\'o - legendary breaks await!',
  },
  weirdAmericana: {
    icon: '🗿',
    title: 'Discover Weird America',
    subtitle: 'Giant twine balls, mystery spots, UFO museums - embrace the quirky!',
  },
};

export default function SelectionList({
  items,
  getStatus,
  onToggle,
  onSetStatus,
  onClearAll,
  groupBy = 'group',
  showSearch = true,
  title,
  stats,
  category,
}: SelectionListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'visited' | 'bucketList' | 'unvisited'>('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const hasSelections = stats.visited > 0 || stats.bucketList > 0;

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const query = searchQuery.toLowerCase().trim();
      const matchesName = item.name.toLowerCase().includes(query);
      const matchesCode = item.code?.toLowerCase() === query;
      const matchesAlias = item.aliases?.some(alias => alias.toLowerCase() === query);
      const matchesSearch = matchesName || matchesCode || matchesAlias;
      const status = getStatus(item.id);
      const matchesFilter = filterMode === 'all' || status === filterMode;
      return matchesSearch && matchesFilter;
    });
  }, [items, searchQuery, filterMode, getStatus]);

  const groupedItems = useMemo(() => {
    if (groupBy === 'none') {
      return { 'All': filteredItems };
    }

    const groups: Record<string, Item[]> = {};
    filteredItems.forEach(item => {
      const group = item.group || 'Other';
      if (!groups[group]) groups[group] = [];
      groups[group].push(item);
    });
    return groups;
  }, [filteredItems, groupBy]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <h2 className="text-xl sm:text-2xl font-bold mb-2">{title}</h2>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span>{stats.visited} visited ({stats.percentage}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <span>{stats.bucketList} bucket list</span>
          </div>
          <div className="text-white/70">
            {stats.total} total
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 space-y-3">
        {showSearch && (
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or abbreviation (e.g., UK, CA)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            />
            <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        )}

        <div className="flex gap-2 flex-wrap items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {(['all', 'visited', 'bucketList', 'unvisited'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilterMode(mode)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  filterMode === mode
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {mode === 'all' && 'All'}
                {mode === 'visited' && '✓ Visited'}
                {mode === 'bucketList' && '★ Bucket List'}
                {mode === 'unvisited' && '○ Not Yet'}
              </button>
            ))}
          </div>
          {onClearAll && hasSelections && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-3 py-1.5 rounded-full text-sm font-medium transition-all bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/50"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="max-h-[60vh] overflow-y-auto p-4 bg-white dark:bg-gray-800">
        {Object.entries(groupedItems).map(([group, groupItems]) => (
          <div key={group} className="mb-6 last:mb-0">
            {groupBy !== 'none' && (
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 sticky top-0 bg-white dark:bg-gray-800 py-1">
                {group} ({groupItems.length})
              </h3>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {groupItems.map(item => {
                const status = getStatus(item.id);
                return (
                  <ItemCard
                    key={item.id}
                    item={item}
                    status={status}
                    onToggle={() => onToggle(item.id, status)}
                    onSetStatus={(newStatus) => onSetStatus(item.id, newStatus)}
                  />
                );
              })}
            </div>
          </div>
        ))}

        {/* Empty state when no items match search */}
        {filteredItems.length === 0 && searchQuery && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No items found matching &quot;{searchQuery}&quot;
          </div>
        )}

        {/* Compelling empty state when no selections at all */}
        {filteredItems.length === 0 && !searchQuery && filterMode !== 'all' && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">
              {filterMode === 'visited' ? '✓' : filterMode === 'bucketList' ? '★' : '○'}
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              {filterMode === 'visited' && 'No visited items yet. Start exploring!'}
              {filterMode === 'bucketList' && 'No bucket list items yet. Dream big!'}
              {filterMode === 'unvisited' && 'All items have been visited or added!'}
            </p>
          </div>
        )}

        {/* Welcome empty state when user has no selections */}
        {stats.visited === 0 && stats.bucketList === 0 && filterMode === 'all' && !searchQuery && category && (
          <div className="text-center py-12 px-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 mb-4">
              <span className="text-4xl">{emptyStateContent[category].icon}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              {emptyStateContent[category].title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
              {emptyStateContent[category].subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
                <span className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">✓</span>
                <span>Tap to mark visited</span>
              </div>
              <div className="hidden sm:block text-gray-300 dark:text-gray-600">|</div>
              <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">★</span>
                <span>Long-press for bucket list</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowClearConfirm(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-sm w-full p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Clear All Selections?</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                This will remove all {stats.visited} visited and {stats.bucketList} bucket list items from {title}. This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onClearAll?.();
                    setShowClearConfirm(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface ItemCardProps {
  item: Item;
  status: Status;
  onToggle: () => void;
  onSetStatus: (status: Status | null) => void;
}

function ItemCard({ item, status, onToggle, onSetStatus }: ItemCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const statusStyles = {
    visited: 'bg-green-100 dark:bg-green-900/40 border-green-400 dark:border-green-600 text-green-800 dark:text-green-200',
    bucketList: 'bg-amber-50 dark:bg-amber-900/40 border-amber-400 dark:border-amber-600 text-amber-800 dark:text-amber-200',
    unvisited: 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600',
  };

  const statusIcons = {
    visited: '✓',
    bucketList: '★',
    unvisited: '',
  };

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        onContextMenu={(e) => {
          e.preventDefault();
          setShowMenu(true);
        }}
        className={`
          w-full text-left px-3 py-2.5 rounded-lg border-2 transition-all duration-200
          flex items-center gap-2 group
          ${statusStyles[status]}
        `}
        aria-label={`${item.name}: ${status === 'visited' ? 'Visited' : status === 'bucketList' ? 'On bucket list' : 'Not visited'}. Click to change status.`}
      >
        <span className={`
          w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0
          ${status === 'visited' ? 'bg-green-500 text-white' : ''}
          ${status === 'bucketList' ? 'bg-amber-500 text-white' : ''}
          ${status === 'unvisited' ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-400 group-hover:bg-gray-300 dark:group-hover:bg-gray-500' : ''}
        `}>
          {statusIcons[status]}
        </span>
        <span className="truncate font-medium">{item.name}</span>
      </button>

      {/* Context Menu */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 py-1 min-w-[140px]">
            <button
              onClick={() => { onSetStatus('visited'); setShowMenu(false); }}
              className="w-full px-4 py-2 text-left hover:bg-green-50 dark:hover:bg-green-900/30 flex items-center gap-2 text-gray-700 dark:text-gray-200"
              aria-label={`Mark ${item.name} as visited`}
            >
              <span className="text-green-600 dark:text-green-400">✓</span> Visited
            </button>
            <button
              onClick={() => { onSetStatus('bucketList'); setShowMenu(false); }}
              className="w-full px-4 py-2 text-left hover:bg-amber-50 dark:hover:bg-amber-900/30 flex items-center gap-2 text-gray-700 dark:text-gray-200"
              aria-label={`Add ${item.name} to bucket list`}
            >
              <span className="text-amber-500 dark:text-amber-400">★</span> Bucket List
            </button>
            <button
              onClick={() => { onSetStatus(null); setShowMenu(false); }}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-500 dark:text-gray-400"
              aria-label={`Clear status for ${item.name}`}
            >
              <span>○</span> Clear
            </button>
          </div>
        </>
      )}
    </div>
  );
}
