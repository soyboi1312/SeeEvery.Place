'use client';

import { useState, useMemo } from 'react';
import { Status } from '@/lib/types';

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
}

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

        {filteredItems.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No items found matching your search
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
            >
              <span className="text-green-600 dark:text-green-400">✓</span> Visited
            </button>
            <button
              onClick={() => { onSetStatus('bucketList'); setShowMenu(false); }}
              className="w-full px-4 py-2 text-left hover:bg-amber-50 dark:hover:bg-amber-900/30 flex items-center gap-2 text-gray-700 dark:text-gray-200"
            >
              <span className="text-amber-500 dark:text-amber-400">★</span> Bucket List
            </button>
            <button
              onClick={() => { onSetStatus(null); setShowMenu(false); }}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-500 dark:text-gray-400"
            >
              <span>○</span> Clear
            </button>
          </div>
        </>
      )}
    </div>
  );
}
