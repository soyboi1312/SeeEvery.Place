/**
 * ShareableMapDesign Component
 * Pure presentational component for the shareable card design
 * Optimized for Instagram sharing with 1:1 square aspect ratio (1080x1080)
 */
'use client';

import { forwardRef } from 'react';
import { Category, categoryLabels, categoryIcons, UserSelections } from '@/lib/types';
import StaticWorldMap from './StaticWorldMap';
import StaticUSMap from './StaticUSMap';
import StaticMarkerMap from './StaticMarkerMap';
import type { MarkerSize } from '@/components/MapMarkers';

export const gradients = [
  // Blues & Indigos
  'from-blue-600 to-purple-700',
  'from-cyan-900 via-blue-900 to-indigo-900',      // Oceanic
  'from-slate-900 via-indigo-950 to-slate-900',    // Deep Space
  
  // Purples & Pinks
  'from-pink-500 to-purple-600',
  'from-indigo-950 via-purple-950 to-fuchsia-950', // Royal Velvet
  
  // Greens & Teals
  'from-green-500 to-teal-600',
  'from-emerald-900 via-green-800 to-teal-900',    // Forest
  
  // Warm & Gold
  'from-orange-500 to-red-600',
  'from-orange-500 via-rose-500 to-violet-600',    // Sunset
  'from-rose-400 via-orange-300 to-rose-500',      // Rose Gold
  'from-yellow-600 via-amber-500 to-yellow-700',   // Gold
  
  // Monochrome
  'from-gray-900 via-slate-800 to-black',          // Obsidian
  'from-slate-500 via-gray-400 to-slate-600',      // Platinum
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
        className={`bg-gradient-to-br ${gradients[selectedGradient]} p-4 sm:p-6 text-white min-h-[280px] flex flex-col border border-white/20 shadow-2xl relative`}
      >
        <div className="relative z-10 flex flex-col h-full">
            {/* Icon & Title - consistent sizing */}
            <div className="text-center mb-2">
            <span className="flex items-center justify-center drop-shadow-md text-3xl">
                {categoryIcons[category]}
            </span>
            <h2 className="font-bold mt-1 drop-shadow-md text-xl">
                {categoryLabels[category]}
            </h2>
            </div>

            {/* Big Number - consistent compact layout */}
            <div className="text-center mb-2">
                <span className="text-4xl font-black drop-shadow-md">{stats.visited}</span>
                <span className="text-xl font-medium opacity-100 ml-2 drop-shadow-sm">of {stats.total}</span>
                <span className="block text-sm font-medium opacity-90">{stats.percentage}% Complete</span>
            </div>

            {/* Map Snapshot or Placeholder - maintains consistent dimensions */}
            <div className="mt-4 bg-black/10 rounded-xl overflow-hidden border border-white/10 shadow-inner">
                <div className="relative flex items-center justify-center">
                {includeMap ? (
                  usesRegionMap(category) ? (
                    category === 'countries' ? (
                      <StaticWorldMap selections={selections} />
                    ) : (
                      <StaticUSMap selections={selections} />
                    )
                  ) : (
                    <StaticMarkerMap category={category} selections={selections} subcategory={subcategory} iconSize={iconSize} />
                  )
                ) : (
                  /* Placeholder with same aspect ratio as maps (800x400 = 2:1) */
                  <div className="w-full" style={{ aspectRatio: '2/1' }}>
                    <div className="h-full flex flex-col items-center justify-center text-white/60 p-4">
                      {visitedItems.length > 0 && (
                        <div className="text-center">
                          <p className="text-xs uppercase tracking-wider font-bold opacity-80 mb-2">Recently visited</p>
                          <p className="text-base font-semibold leading-relaxed">
                            {visitedItems.slice(0, 5).join(' • ')}
                            {visitedItems.length > 5 && ` +${visitedItems.length - 5} more`}
                          </p>
                        </div>
                      )}
                      {stats.bucketList > 0 && (
                        <div className="mt-3 text-sm font-medium bg-amber-400/20 text-amber-100 py-1 px-3 rounded-full backdrop-blur-sm border border-amber-400/30">
                          ★ {stats.bucketList} on bucket list
                        </div>
                      )}
                    </div>
                  </div>
                )}
                </div>
                {/* Map Legend - only show when map is included */}
                {includeMap && (
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
                )}
            </div>

            {/* Enhanced Branding - Prominent URL for social sharing */}
            <div className="mt-auto pt-4">
              <div className="bg-black/30 backdrop-blur-sm rounded-lg py-2.5 px-4 border border-white/20">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-lg font-bold drop-shadow-md tracking-tight">
                    SeeEvery
                  </span>
                  <span className="text-yellow-300 font-black text-xl leading-none drop-shadow-md">.</span>
                  <span className="text-lg font-bold drop-shadow-md tracking-tight">
                    Place
                  </span>
                </div>
                <p className="text-center text-[10px] text-white/70 mt-0.5 font-medium">
                  Track your travel adventures
                </p>
              </div>
            </div>
        </div>
      </div>
    );
  }
);

export default ShareableMapDesign;
