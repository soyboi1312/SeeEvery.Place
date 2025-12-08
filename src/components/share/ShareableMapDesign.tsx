/**
 * ShareableMapDesign Component
 * Pure presentational component for the shareable card design
 */
'use client';

import { forwardRef } from 'react';
import { Category, categoryLabels, categoryIcons, UserSelections } from '@/lib/types';
import StaticWorldMap from './StaticWorldMap';
import StaticUSMap from './StaticUSMap';
import StaticMarkerMap from './StaticMarkerMap';
import type { MarkerSize } from '@/components/MapMarkers';

export const gradients = [
  // Vibrant themes
  'from-blue-600 to-purple-700',
  'from-green-500 to-teal-600',
  'from-orange-500 to-red-600',
  'from-pink-500 to-purple-600',
  'from-indigo-600 to-blue-700',
  // Premium: Midnight Collection
  'from-gray-900 via-slate-800 to-black',          // Obsidian
  'from-slate-900 via-indigo-950 to-slate-900',    // Deep Space
  'from-indigo-950 via-purple-950 to-fuchsia-950', // Royal Velvet
  // Premium: Metallic Collection
  'from-yellow-600 via-amber-500 to-yellow-700',   // Gold
  'from-slate-500 via-gray-400 to-slate-600',      // Platinum
  'from-rose-400 via-orange-300 to-rose-500',      // Rose Gold
  // Premium: Nature Collection
  'from-emerald-900 via-green-800 to-teal-900',    // Forest
  'from-cyan-900 via-blue-900 to-indigo-900',      // Oceanic
];

// Check if category uses colored regions (countries/states) vs markers (other categories)
export const usesRegionMap = (category: Category): boolean => {
  return category === 'countries' || category === 'states';
};

interface ShareableMapDesignProps {
  selections: UserSelections;
  category: Category;
  subcategory?: string;
  stats: {
    visited: number;
    bucketList: number;
    total: number;
    percentage: number;
  };
  visitedItems: (string | null | undefined)[];
  selectedGradient: number;
  includeMap: boolean;
  iconSize: MarkerSize;
}

const ShareableMapDesign = forwardRef<HTMLDivElement, ShareableMapDesignProps>(
  function ShareableMapDesign(
    { selections, category, subcategory, stats, visitedItems, selectedGradient, includeMap, iconSize },
    ref
  ) {
    return (
      <div
        ref={ref}
        className={`bg-gradient-to-br ${gradients[selectedGradient]} p-4 sm:p-6 rounded-2xl text-white ${includeMap ? 'min-h-[280px]' : 'aspect-square'} flex flex-col border border-white/20 shadow-2xl relative overflow-hidden`}
      >
        <div className="relative z-10 flex flex-col h-full">
            {/* Icon & Title */}
            <div className={`text-center ${includeMap ? 'mb-2' : 'mb-6'}`}>
            <span className={`flex items-center justify-center drop-shadow-md ${includeMap ? 'text-3xl' : 'text-5xl sm:text-6xl'}`}>
                {categoryIcons[category]}
            </span>
            <h2 className={`font-bold mt-1 drop-shadow-md ${includeMap ? 'text-xl' : 'text-2xl sm:text-3xl mt-3'}`}>
                {categoryLabels[category]}
            </h2>
            </div>

            {/* Big Number - compact when map is shown */}
            {includeMap ? (
            <div className="text-center mb-2">
                <span className="text-4xl font-black drop-shadow-md">{stats.visited}</span>
                <span className="text-xl font-medium opacity-100 ml-2 drop-shadow-sm">of {stats.total}</span>
                <span className="block text-sm font-medium opacity-90">{stats.percentage}% Complete</span>
            </div>
            ) : (
            <>
                <div className="flex-1 flex items-center justify-center py-4">
                <div className="text-center">
                    <div className="text-7xl sm:text-9xl font-black drop-shadow-lg tracking-tight leading-none">
                    {stats.visited}
                    </div>
                    <div className="text-xl sm:text-2xl font-bold mt-2 opacity-100 drop-shadow-md">
                    of {stats.total} Visited
                    </div>
                    <div className="text-lg font-medium opacity-90 mt-1">
                    {stats.percentage}% Complete
                    </div>
                </div>
                </div>

                {/* Sample locations - only when map is not shown */}
                {visitedItems.length > 0 && (
                <div className="mt-4 text-center bg-black/20 rounded-lg p-3 backdrop-blur-sm">
                    <p className="text-xs uppercase tracking-wider font-bold opacity-80 mb-1">Recently visited</p>
                    <p className="text-base font-semibold truncate leading-tight">
                    {visitedItems.slice(0, 3).join(' \u2022 ')}
                    {visitedItems.length > 3 && ` +${visitedItems.length - 3} more`}
                    </p>
                </div>
                )}
            </>
            )}

            {/* Bucket list preview */}
            {stats.bucketList > 0 && !includeMap && (
            <div className="mt-3 text-center text-sm font-medium bg-amber-400/20 text-amber-100 py-1 px-3 rounded-full mx-auto w-fit backdrop-blur-sm border border-amber-400/30">
                ★ {stats.bucketList} on bucket list
            </div>
            )}

            {/* Map Snapshot */}
            {includeMap && (
            <div className="mt-4 bg-black/10 rounded-xl overflow-hidden border border-white/10 shadow-inner">
                <div className="relative p-2 flex items-center justify-center">
                {usesRegionMap(category) ? (
                    category === 'countries' ? (
                    <StaticWorldMap selections={selections} />
                    ) : (
                    <StaticUSMap selections={selections} />
                    )
                ) : (
                    <StaticMarkerMap category={category} selections={selections} subcategory={subcategory} iconSize={iconSize} />
                )}
                </div>
                {/* Map Legend */}
                <div className="flex justify-center gap-4 py-2 text-xs font-medium bg-black/20 backdrop-blur-sm">
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm ring-1 ring-white/20"></span>
                    <span className="opacity-100">Visited</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm ring-1 ring-white/20"></span>
                    <span className="opacity-100">Bucket List</span>
                </div>
                </div>
            </div>
            )}

            {/* Branding - Fixed CamelCase (Removed uppercase class) */}
            <div className="mt-5 text-center flex items-center justify-center gap-0.5">
                <span className="text-base font-bold drop-shadow-md">
                    SeeEvery
                </span>
                <span className="text-blue-300 font-black text-lg leading-none drop-shadow-md pb-0.5">.</span>
                <span className="text-base font-bold drop-shadow-md">
                    Place
                </span>
            </div>
        </div>
      </div>
    );
  }
);

export default ShareableMapDesign;
